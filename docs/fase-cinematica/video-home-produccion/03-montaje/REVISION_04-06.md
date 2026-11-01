# Revisión de los clips 04–06 (v1) y montaje de prueba 01 → 06

Fecha: 31/10/2026 · Clips de Runway Gen-4 Turbo: 1280×720, 24 fps, 5,04 s (121 fotogramas) y sin pista de audio. El método es el mismo que en [`REVISION_01-03.md`](./REVISION_01-03.md): un fotograma cada 0,5 s, detalle a 1:1 al principio y al final del tramo, diferencia entre fotogramas y color medio.

**Archivos recibidos** (sin renombrar; Runway volvió a añadir doble extensión):

| Archivo | Bitrate | Tamaño |
|---|---|---|
| `04_piscina-barbacoa_v1.mp4.mp4` | 6,68 Mb/s | 4,2 MB |
| `05_piscina-ras-agua_v1.mp4.mp4` | 5,09 Mb/s | 3,2 MB |
| `05c_caseta-esquina-piscina_v1.mp4.mp4` | 5,32 Mb/s | 3,4 MB |
| `06_fachada-trasera_v1.mp4.mp4` | 7,24 Mb/s | 4,6 MB |

No hay ningún clip `05b`. Se generaron la **05 (piscina a ras de agua)**, que es la decisión vigente, y la **05c (caseta)**, que es de reserva.

Hojas de revisión (locales, fuera de git): `revision-clip-04-v1.jpg`, `revision-clip-05-v1.jpg`, `revision-clip-05c-v1.jpg` y `revision-clip-06-v1.jpg`.

## Veredicto

| Clip | Veredicto | Tramo para el montaje |
|---|---|---|
| **04** Piscina y barbacoa | ✅ **Aprobado** | 1,0–3,0 s |
| **05** Piscina a ras de agua | ✅ **Aprobado** (con la advertencia del color del vaso) | 1,0–2,5 s, más 0,4 s de fundido |
| **05c** Caseta y esquina de la piscina | ⚠️ **Reserva, no se usa** | Si se recuperase: 0,3–2,3 s como máximo |
| **06** Fachada trasera | ✅ **Aprobado** | 1,0–3,0 s, más el fundido siguiente |

### 04 · Aprobado

- **Movimiento:** acercamiento lento, elevado y estable, sin aceleraciones (diferencia entre fotogramas de 2,5–3,3, constante).
- **Estable:**
  - La pérgola mantiene sus postes rectos.
  - La barbacoa conserva sus huecos.
  - Las sombrillas, las mesas, las sillas y las tumbonas no cambian de número.
  - La escalera de la piscina y el gresite azul intenso se mantienen.
- **Luz:** el clip se oscurece ligeramente hacia el final, porque el encuadre gana pinos y agua. No es un cambio de exposición. En el tramo 1,0–3,0 s apenas se nota.

### 05 · Aprobado, con una advertencia

- **Movimiento:** plano casi fijo (diferencia de 1,0–1,4). Solo se mueven el agua y los reflejos, como pedía el prompt.
- **Estable:** a 1:1, la persiana, las rocas del muro, la escalera y el borde de la piscina no cambian.
- **Advertencia:** al ir **en corte seco tras la 04**, se nota que el vaso es **turquesa claro** (foto de 2024) y no el **azul intenso** de la 04. Es la misma diferencia descrita en `TANDA_04-06.md`. La confirmaste, así que se mantiene. Si al verlo en movimiento te molesta, hay dos opciones:
  - Poner un fundido de 0,4 s en 04 → 05, en vez del corte seco, para suavizar el salto.
  - Quitar la 05: la 04 funde directamente con la 06 y el vídeo dura 1,5 s menos.

### 05c · Reserva (no se usa)

- La caseta conserva sus cuatro huecos y la cornisa verde, y la escalera de la piscina está bien.
- **Problemas:**
  - A partir de ~3,3 s la cámara sube por encima de la roca: la roca se hunde y **aparecen matas de hierba y tallos que no están en la foto**.
  - Es el clip con más movimiento de la tanda (pico de diferencia de 4,7).
- Si algún día se usa, solo sirve hasta ~2,3 s.

### 06 · Aprobado

- **Movimiento:** acercamiento suave por el césped (diferencia de 2,3–3,3, sin saltos).
- **Estable:** a 1:1 entre 1 s y 3 s:
  - Las ventanas de la planta alta mantienen su número.
  - La antena y la chimenea siguen en su sitio.
  - Las columnas de piedra siguen rectas.
  - La buganvilla no crece.
  - Las sillas del porche y la mesa de ping-pong conservan su forma.
- **Luz:** cálida y constante.

## Tiempos

Ningún clip necesita recortes distintos de los previstos en `cortes.txt`. Todos usan el tramo central, a partir de 1,0 s, y ninguno llega a la zona final, que es donde la IA inventa más.

## Montaje de prueba 01 → 06

- **Lista:** [`cortes_01-06.txt`](./cortes_01-06.txt), con los nombres reales.
- **Fundido de bucle:** en esta prueba, la 06 cierra el bucle hacia la 01 con un fundido de 0,8 s, igual que hará la 13 en el montaje completo.
- **Comando:**

```bash
CORTES=cortes_01-06.txt bash montar_home.sh "" "$PWD/salida-prueba-01-06"
```

| Archivo (`salida-prueba-01-06/`) | Resolución | FPS | Códec | Bitrate | Tamaño | Duración |
|---|---|---|---|---|---|---|
| `home_master_prores_1280x720.mov` | 1280×720 | 24 | ProRes 422 HQ, yuv422p10le | 91,9 Mb/s | 132,0 MB | 12,04 s |
| `home_web_1920x1080.mp4` (CRF 20) | 1920×1080 | 24 | H.264 High, yuv420p | 9,8 Mb/s | 14,0 MB | 12,04 s |
| `home_web_movil_720x1280.mp4` (CRF 21) | 720×1280 | 24 | H.264 High, yuv420p | 3,4 Mb/s | 4,8 MB | 12,04 s |

- **Previsión para los 27 s:** unos 32 MB en desktop y unos 11 MB en móvil. Las piscinas y los cielos comprimen mejor que la vegetación de 01–03, y por eso el bitrate baja de 11,3 a 9,8 Mb/s.
- **Revisión:** `revision-montaje-01-06.jpg` (desktop) y `revision-movil-01-06.jpg` (móvil).
  - Los cortes 03 → 04 y 04 → 05 enlazan bien en movimiento. El fundido 05 → 06 marca el paso de la piscina a la casa.
  - El bucle 06 → 01 no tiene salto.
  - **Móvil:**
    - **04** (`focoX` 0,55): se ven la piscina y las mesas. La barbacoa queda cortada a la izquierda; si se quiere ver, se baja `focoX` a 0,45.
    - **05:** se ven la esquina de la casa, el muro y el reflejo. Correcto.
    - **06:** el porche y la buganvilla quedan centrados. Correcto.
