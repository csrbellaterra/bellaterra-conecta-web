#!/usr/bin/env bash
# Prueba comparativa de mejora de resolución (ver ../PRUEBA_UPSCALE.md).
#
# Uso (Git Bash):  bash comparar_upscale.sh
# Lee los clips originales de ../02-clips-runway (solo lectura) y, si existen, sus
# versiones escaladas por Runway en ../02-clips-runway/upscale/ (mismo nombre con
# sufijo _4k.mp4). Escribe todo en ./prueba-upscale/. No toca el montaje aprobado.
#
# Variantes, todas a la resolución final y desde el mismo tramo del clip original:
#   A  Navegador: el 720p ampliado con bilineal (lo que hace el navegador con un vídeo de 720p)
#   B  Lanczos: el escalado actual del montaje
#   C  Lanczos + CAS: Lanczos más un realce de nitidez suave y adaptativo (no IA)
#   D  Runway 4K: el clip escalado por Runway, reducido con Lanczos (solo si existe)
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
CLIPS="$HERE/../02-clips-runway"
UPS="$CLIPS/upscale"
OUT="$HERE/prueba-upscale"
FONT="C\\:/Windows/Fonts/arial.ttf"
CAS="${CAS:-0.5}"
mkdir -p "$OUT"

# Fragmentos: clave, clip, entrada, duración, foco móvil, y dos zonas de detalle 640×360 en 1920×1080 (x:y)
FRAGS=(
  "01|01_entrada-camino_v1.mp4.mp4|0.8|2.5|0.70|1160:330|40:120"
  "07|07_porche-comedor_v1.mp4|1.0|2.5|0.50|600:380|60:560"
)

label() { echo "drawtext=fontfile='$FONT':text='$1':fontcolor=white:fontsize=34:box=1:boxcolor=black@0.6:boxborderw=10:x=20:y=20"; }

# variant <letra> <fuente> <filtro de escala> → <salida.mp4>  (casi sin pérdida, para mirar)
encode() {
  local src=$1 tin=$2 dur=$3 vf=$4 out=$5
  ffmpeg -y -v error -ss "$tin" -t "$dur" -i "$src" -vf "$vf,format=yuv420p" -an -r 24 \
    -c:v libx264 -preset slow -crf 8 -g 24 "$out"
}

for f in "${FRAGS[@]}"; do
  IFS='|' read -r key clip tin dur fx z1 z2 <<< "$f"
  src="$CLIPS/$clip"; [[ -f "$src" ]] || { echo "Falta $src"; exit 1; }
  up="$UPS/${clip%%.mp4*}_4k.mp4"
  echo "Fragmento $key ($clip, $tin s + $dur s)"
  L="flags=lanczos+accurate_rnd+full_chroma_int"
  MCROP="crop=w=trunc(ih*9/16/2)*2:h=ih:x=trunc(max(0\,min(iw-ih*9/16\,iw*$fx-ih*9/32))/2)*2:y=0"
  # Desktop 1920×1080 y móvil 1080×1920
  for mode in desk movil; do
    if [[ $mode == desk ]]; then S=1920:1080; C=""; else S=1080:1920; C="$MCROP,"; fi
    encode "$src" "$tin" "$dur" "${C}scale=$S:flags=bilinear" "$OUT/${key}_${mode}_A_navegador.mp4"
    encode "$src" "$tin" "$dur" "${C}scale=$S:$L" "$OUT/${key}_${mode}_B_lanczos.mp4"
    encode "$src" "$tin" "$dur" "${C}scale=$S:$L,cas=strength=$CAS" "$OUT/${key}_${mode}_C_lanczos-cas.mp4"
    if [[ -f "$up" ]]; then
      encode "$up" "$tin" "$dur" "${C}scale=$S:$L" "$OUT/${key}_${mode}_D_runway4k.mp4"
    fi
  done

  # Vídeo comparativo desktop: la misma zona de detalle a 1:1 de cada variante, en cuadrícula 2×2.
  V=("A_navegador" "B_lanczos" "C_lanczos-cas"); [[ -f "$up" ]] && V+=("D_runway4k")
  for z in "$z1" "$z2"; do
    zx=${z%:*}; zy=${z#*:}; zn=$([[ $z == "$z1" ]] && echo 1 || echo 2)
    ins=(); fl=""; i=0
    for v in "${V[@]}"; do
      ins+=(-i "$OUT/${key}_desk_${v}.mp4")
      fl+="[$i:v]crop=960:540:min(max(0\,$zx-160)\,iw-960):min(max(0\,$zy-90)\,ih-540),$(label "$v")[v$i];"; i=$((i + 1))
    done
    if (( i == 4 )); then fl+="[v0][v1][v2][v3]xstack=inputs=4:layout=0_0|w0_0|0_h0|w0_h0[o]"
    else fl+="color=c=black:s=960x540:d=$dur[k];[v0][v1][v2][k]xstack=inputs=4:layout=0_0|w0_0|0_h0|w0_h0:shortest=1[o]"; fi
    ffmpeg -y -v error "${ins[@]}" -filter_complex "$fl" -map "[o]" -an -c:v libx264 -preset slow -crf 8 \
      "$OUT/comparativa_${key}_zona${zn}_1a1.mp4"
    # Fotograma fijo a mitad del tramo, recortado a 1:1 (640×360 por variante, en fila)
    ins=(); fl=""; i=0
    for v in "${V[@]}"; do
      ins+=(-ss 1.2 -i "$OUT/${key}_desk_${v}.mp4")
      fl+="[$i:v]crop=640:360:$zx:$zy,$(label "$v")[s$i];"; i=$((i + 1))
    done
    fl+="$(printf '[s%d]' $(seq 0 $((i - 1))))hstack=inputs=$i[o]"
    ffmpeg -y -v error "${ins[@]}" -filter_complex "$fl" -map "[o]" -frames:v 1 -q:v 2 \
      "$OUT/detalle_${key}_zona${zn}_1a1.jpg"
  done
  # Móvil: fotograma completo de cada variante, reducido a la mitad, en fila
  ins=(); fl=""; i=0
  for v in "${V[@]}"; do
    ins+=(-ss 1.2 -i "$OUT/${key}_movil_${v}.mp4")
    fl+="[$i:v]crop=540:960:270:480,$(label "$v")[m$i];"; i=$((i + 1))
  done
  fl+="$(printf '[m%d]' $(seq 0 $((i - 1))))hstack=inputs=$i[o]"
  ffmpeg -y -v error "${ins[@]}" -filter_complex "$fl" -map "[o]" -frames:v 1 -q:v 2 \
    "$OUT/detalle_${key}_movil_centro_1a1.jpg"
done
ls -1 "$OUT"
