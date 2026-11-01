#!/usr/bin/env bash
# Monta el vídeo de fondo de la Home a partir de una lista de cortes (ver PLAN_MONTAJE.md).
#
# Uso (Git Bash):  ./montar_home.sh [carpeta_clips] [carpeta_salida]
#   carpeta_clips   por defecto ../02-clips-runway (solo se leen; nunca se modifican)
#   carpeta_salida  por defecto ./salida-AAAAMMDD-HHMM (cada ejecución es una versión nueva)
# Variables opcionales:
#   CORTES=otra_lista.txt   lista de cortes alternativa (por defecto cortes.txt)
#   SALIDA=1920x1080        resolución del máster y de la web desktop
#   MOVIL=1080x1920         resolución de la web móvil (recorte 9:16 propio por plano)
#   CRF=20                  H.264 desktop        CRF_AV1=24        AV1 desktop
#   CRF_MOVIL=22            H.264 móvil          CRF_AV1_MOVIL=28  AV1 móvil
#   SIN_AV1=1               no exporta las versiones AV1
#   SOLO_MOVIL=1            solo exporta las salidas móviles (no toca el máster ni la web desktop)
#   MOVIL_MODO=recorte      móvil a pantalla completa: recorte 9:16 de cada plano (encuadre v1)
#   MOVIL_MODO=ventana      móvil editorial: el plano, con toda su altura y recortado solo a VENTANA
#                           (proporción ancho/alto; 4/3 = 75 % del ancho del plano), dentro de un lienzo
#                           vertical con bandas lisas de color FONDO arriba y abajo. Sin desenfoques
#                           ni rellenos sacados del vídeo. Exporta además un máster ProRes vertical.
#     VENTANA=4/3  VENTANA_Y=0.45 (centro de la ventana, fracción de la altura)  FONDO=0x14130F (tinta de la marca)
#   POSTER=1                exporta también un póster del primer fotograma
#                           (por defecto no: el póster de la Home es la foto actual de la fachada)
#
# Lista de cortes: n archivo entrada dur trans focoX [fuente] [realce]
#   fuente  "-" = el clip original de Runway; si no, ruta dentro de carpeta_clips de una
#           versión escalada del MISMO clip (p. ej. upscale/07_porche-comedor_v1_4k.mp4),
#           alineada fotograma a fotograma con el original
#   realce  fuerza del realce de nitidez CAS tras el escalado (0 = sin realce)
#
# Criterio de calidad (CALIDAD_VIDEO.md y PRUEBA_UPSCALE.md):
#   - Cada salida se genera en UNA sola pasada desde los clips (originales o escalados por
#     Runway): no hay intermedios comprimidos ni recompresiones encadenadas.
#   - Cada plano se escala directamente a la resolución de cada salida con Lanczos, así un
#     clip 4K aporta todo su detalle y un clip 720p se amplía una sola vez.
#   - El máster es ProRes 422 HQ 10 bits a la resolución de SALIDA.
#   - Se conservan los 24 fps; solo se convierte si algún clip llegara a otra cadencia.
#   - Sin audio en ninguna salida (-an: sin pista, no solo silenciada).
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
CLIPS="${1:-$HERE/../02-clips-runway}"
OUT="${2:-$HERE/salida-$(date +%Y%m%d-%H%M)}"
CORTES="${CORTES:-$HERE/cortes.txt}"
[[ "$CORTES" == /* ]] || CORTES="$HERE/$CORTES"
SALIDA="${SALIDA:-1920x1080}"; SW=${SALIDA%x*}; SH=${SALIDA#*x}
MOVIL="${MOVIL:-1080x1920}"; MW=${MOVIL%x*}; MH=${MOVIL#*x}
CRF="${CRF:-20}"; CRF_MOVIL="${CRF_MOVIL:-22}"
CRF_AV1="${CRF_AV1:-24}"; CRF_AV1_MOVIL="${CRF_AV1_MOVIL:-28}"
FPS=24
FRAME=0.042   # un corte seco se monta como un fundido de 1 fotograma (invisible)
COLOR=(-colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv)
SCALE="flags=lanczos+accurate_rnd+full_chroma_int"

mkdir -p "$OUT"
num() { awk "BEGIN{printf \"%.3f\", $1}"; }
lt() { awk "BEGIN{exit !($1 < $2)}"; }
# probe <archivo> <campo>: un dato del primer stream de vídeo (sin retornos de carro de Windows).
probe() {
  ffprobe -v error -select_streams v:0 -show_entries "stream=$2" -of default=nw=1:nk=1 "$1" | tr -d '\r' | head -1
}
# fprobe <archivo> <campo>: un dato del contenedor (duración, bitrate total, tamaño).
fprobe() {
  ffprobe -v error -show_entries "format=$2" -of default=nw=1:nk=1 "$1" | tr -d '\r' | head -1
}

# --- 1. Leer la lista de cortes y comprobar los clips -------------------------
N=0; FILES=(); INS=(); DURS=(); TRS=(); FXS=(); CASS=(); NEEDFPS=()
while read -r n file tin dur tr fx fuente realce _; do
  [[ -z "${n:-}" || "$n" == \#* ]] && continue
  [[ -f "$CLIPS/$file" ]] || { echo "ERROR: falta el clip original $CLIPS/$file"; exit 1; }
  src="$CLIPS/$file"
  if [[ -n "${fuente:-}" && "$fuente" != "-" ]]; then
    src="$CLIPS/$fuente"
    [[ -f "$src" ]] || { echo "ERROR: falta la versión escalada $src"; exit 1; }
  fi
  rate=$(probe "$src" r_frame_rate); clipdur=$(fprobe "$src" duration)
  need=$(num "$tin + $dur + $tr")
  if awk "BEGIN{exit !($need > $clipdur + 0.01)}"; then
    echo "ERROR: plano $n necesita ${need}s y el clip dura ${clipdur}s"; exit 1
  fi
  if [[ "$rate" == "$FPS/1" ]]; then NEEDFPS+=(0)
  else echo "AVISO: plano $n va a $rate fps; se convertirá a $FPS fps"; NEEDFPS+=(1); fi
  echo "  $n  $(basename "$src")  $(probe "$src" width)x$(probe "$src" height)  realce ${realce:-0}"
  FILES+=("$src"); INS+=("$tin"); DURS+=("$dur"); TRS+=("$tr"); FXS+=("$fx"); CASS+=("${realce:-0}")
  N=$((N + 1))
done < "$CORTES"
echo "Planos: $N @ ${FPS} fps"

# --- 2. Grafo de filtros: escalado de cada tramo + fundidos + cierre del bucle ---
# Cada tramo dura dur + trans y se solapa "trans" con el siguiente. El último "trans"
# es el fundido del bucle: el final funde con el propio inicio, así que el último
# fotograma enlaza con el primero y la duración final = suma de dur.
# El procesado interno es en 4:4:4 de 16 bits para que fundidos y escalados no añadan banding.
# $1 = encuadre: "full" (16:9) o "movil" (9:16 centrado en focoX); $2 $3 = ancho y alto de salida
build_graph() {
  local mode=$1 w=$2 h=$3 g="" prev T offset tr cur i fx LF f
  for ((i = 0; i < N; i++)); do
    f="setpts=PTS-STARTPTS"
    [[ ${NEEDFPS[$i]} == 1 ]] && f+=",fps=$FPS"
    fx=${FXS[$i]}
    if [[ $mode == ventana ]]; then
      # Ventana: el plano, recortado a VENTANA y escalado al ancho del lienzo, sobre bandas lisas.
      f+=",crop=w=trunc(ih*$VENTANA/2)*2:h=ih:x=trunc(max(0\,min(iw-ih*$VENTANA\,iw*$fx-ih*$VENTANA/2))/2)*2:y=0"
      f+=",scale=$w:$VH:$SCALE"
      lt 0 "${CASS[$i]}" && f+=",cas=strength=${CASS[$i]}"
      g+="[$i:v]$f,format=yuv444p16le,pad=$w:$h:0:$VY:color=$FONDO,setsar=1[p$i];"
      continue
    fi
    if [[ $mode == movil ]]; then
      f+=",crop=w=trunc(ih*9/16/2)*2:h=ih:x=trunc(max(0\,min(iw-ih*9/16\,iw*$fx-ih*9/32))/2)*2:y=0"
    fi
    f+=",scale=$w:$h:$SCALE"
    lt 0 "${CASS[$i]}" && f+=",cas=strength=${CASS[$i]}"
    g+="[$i:v]$f,setsar=1,format=yuv444p16le[p$i];"
  done
  prev="[p0]"
  tr=${TRS[0]}; lt "$tr" $FRAME && tr=$FRAME
  T=$(num "${DURS[0]} + $tr")
  for ((i = 1; i < N; i++)); do
    tr=${TRS[$((i - 1))]}; lt "$tr" $FRAME && tr=$FRAME
    offset=$(num "$T - $tr")
    g+="$prev[p$i]xfade=transition=fade:duration=$tr:offset=$offset[x$i];"
    prev="[x$i]"
    cur=${TRS[$i]}; lt "$cur" $FRAME && cur=$FRAME
    T=$(num "$offset + ${DURS[$i]} + $cur")
  done
  LF=${TRS[$((N - 1))]}; lt "$LF" $FRAME && LF=$FRAME
  g+="${prev}split[s1][s2];"
  g+="[s1]trim=0:$LF,setpts=PTS-STARTPTS[A];"
  g+="[s2]trim=$LF:$T,setpts=PTS-STARTPTS[B];"
  g+="[B][A]xfade=transition=fade:duration=$LF:offset=$(num "$T - 2 * $LF")[v]"
  printf '%s' "$g"
}

# Entradas: cada clip, solo su tramo (entrada .. entrada + dur + trans).
INPUTS=()
for ((i = 0; i < N; i++)); do
  tr=${TRS[$i]}; lt "$tr" $FRAME && tr=$FRAME
  INPUTS+=(-ss "${INS[$i]}" -t "$(num "${DURS[$i]} + $tr")" -i "${FILES[$i]}")
done

# Modo ventana: tamaño y posición de la ventana dentro del lienzo vertical.
MOVIL_MODO="${MOVIL_MODO:-recorte}"
if [[ $MOVIL_MODO == ventana ]]; then
  VENTANA="${VENTANA:-4/3}"; FONDO="${FONDO:-0x14130F}"
  VH=$(awk "BEGIN{printf \"%d\", int($MW / ($VENTANA) / 2) * 2}")
  VY=$(awk "BEGIN{printf \"%d\", int(($MH * ${VENTANA_Y:-0.45} - $VH / 2) / 2) * 2}")
  echo "Móvil en ventana: ${MW}x${VH} (proporción $VENTANA) a y=$VY, bandas $FONDO"
fi

# render <encuadre> <ancho> <alto> <formato de píxel> <salida> <opciones de códec…>
render() {
  local mode=$1 w=$2 h=$3 pix=$4 out=$5; shift 5
  ffmpeg -y -v error "${INPUTS[@]}" \
    -filter_complex "$(build_graph "$mode" "$w" "$h");[v]format=$pix[o]" -map "[o]" -an -r $FPS \
    "$@" "${COLOR[@]}" "$out"
  echo "  $(basename "$out")"
}

# --- 3. Salidas, todas directamente desde los clips ---------------------------
echo "Renderizando (una pasada por salida)…"
H264=(-c:v libx264 -preset slow -profile:v high -level:v 4.2 -g 48 -movflags +faststart)
AV1=(-c:v libsvtav1 -preset 4 -g 48 -svtav1-params tune=0 -movflags +faststart)
if [[ "${SOLO_MOVIL:-0}" != 1 ]]; then
  # Máster: ProRes 422 HQ 10 bits, para reediciones futuras.
  render full "$SW" "$SH" yuv422p10le "$OUT/home_master_prores_${SALIDA}.mov" -c:v prores_ks -profile:v 3 -vendor apl0
  # Web desktop: AV1 10 bits (principal) y H.264 (respaldo).
  render full "$SW" "$SH" yuv420p "$OUT/home_web_${SALIDA}_h264.mp4" "${H264[@]}" -crf "$CRF"
  if [[ "${SIN_AV1:-0}" != 1 ]]; then
    render full "$SW" "$SH" yuv420p10le "$OUT/home_web_${SALIDA}_av1.mp4" "${AV1[@]}" -crf "$CRF_AV1"
  fi
fi
# Web móvil: recorte vertical 9:16 por plano (recorte) o ventana editorial (ventana).
MM=movil; [[ $MOVIL_MODO == ventana ]] && MM=ventana
if [[ $MM == ventana ]]; then
  render ventana "$MW" "$MH" yuv422p10le "$OUT/home_master_movil_prores_${MOVIL}.mov" -c:v prores_ks -profile:v 3 -vendor apl0
fi
render $MM "$MW" "$MH" yuv420p "$OUT/home_web_movil_${MOVIL}_h264.mp4" "${H264[@]}" -crf "$CRF_MOVIL"
if [[ "${SIN_AV1:-0}" != 1 ]]; then
  render $MM "$MW" "$MH" yuv420p10le "$OUT/home_web_movil_${MOVIL}_av1.mp4" "${AV1[@]}" -crf "$CRF_AV1_MOVIL"
fi
if [[ "${POSTER:-0}" == 1 ]]; then
  ffmpeg -y -v error -i "$OUT/home_master_prores_${SALIDA}.mov" -frames:v 1 -q:v 2 "$OUT/home_poster_${SALIDA}.jpg"
fi

# --- 4. Ficha técnica real de cada archivo -------------------------------------
{
  echo "archivo;resolucion;fps;codec;perfil;pix_fmt;fotogramas;bitrate_kbps;tamano_MB;duracion_s;audio"
  for f in "$OUT"/*.mov "$OUT"/*.mp4; do
    [[ -f "$f" ]] || continue
    w=$(probe "$f" width); h=$(probe "$f" height); rate=$(probe "$f" r_frame_rate)
    codec=$(probe "$f" codec_name); prof=$(probe "$f" profile); pix=$(probe "$f" pix_fmt)
    frames=$(ffprobe -v error -count_packets -select_streams v:0 -show_entries stream=nb_read_packets -of csv=p=0 "$f" | tr -d '\r')
    audio=$(ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$f" | tr -d '\r')
    br=$(fprobe "$f" bit_rate); size=$(fprobe "$f" size); dur=$(fprobe "$f" duration)
    echo "$(basename "$f");${w}x${h};${rate%/1};$codec;$prof;$pix;$frames;$((br / 1000));$(num "$size / 1048576");$(num "$dur");${audio:-no}"
  done
} > "$OUT/ficha_tecnica.csv"
column -s';' -t "$OUT/ficha_tecnica.csv" 2>/dev/null || cat "$OUT/ficha_tecnica.csv"
echo "Listo en $OUT"
