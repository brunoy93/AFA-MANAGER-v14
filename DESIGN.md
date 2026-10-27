# AFA MANAGER 3.0 — Rediseño y expansión

Documento de diseño. Resume qué se cambió respecto de la v2.0 y por qué.

## 1. Diagnóstico de la v2.0

Lo que funcionaba: el escenario (post-Messi), el volumen de contenido (103 clubes,
decisiones, eventos, copas), la simulación de partidos y el guardado.

Lo que no:

- **Economía rota**: el Año 1 no cobraba ingresos (`cobrarIngresosAnuales()` sólo
  se llamaba al iniciar la temporada siguiente). Balance garantizado de −$7.250M.
- **Fin de partida invisible**: se seguía sólo con apoyo ≥ 55, y el jugador nunca
  veía ese umbral. Año 1, seis decisiones, game over.
- **Sin feedback**: elegías una decisión y lo único que veías era un toast. Los
  números subían y bajaban sin contexto.
- **UI de una sola columna**: 10.000 px de scroll en Clubes, tablas clipeadas en
  mobile, pestañas cortadas, banderas rotas en Windows.
- **Peso**: 5.5 MB / 250 requests, con un PNG de 2.4 MB para un avatar de 90 px.
- **Texto suelto**: `#overlay-simulando` sin CSS quedaba visible al pie de página.

## 2. Principios del rediseño

1. **Todo número tiene que poder explicarse.** Apoyo, prestigio, caja, confianza
   del consejo y proyección de voto se muestran con su tendencia y sus causas.
2. **Nunca perder sin saber por qué.** El umbral de continuidad es explícito y se
   ve durante todo el año (proyección de asamblea).
3. **Densidad con jerarquía.** Escritorio tipo *dashboard*; en mobile, una cosa
   por pantalla.
4. **Cada decisión deja huella.** Las decisiones mueven al menos dos ejes
   (apoyo, prestigio, caja, consejo, bloques de clubes) y muchas encadenan
   consecuencias a futuro.
5. **Cero dependencias, cero build.** Sigue siendo HTML + CSS + JS clásico para
   subir directo a GitHub Pages.

## 3. Sistemas nuevos

### 3.0j Árbitros, datos y documental (v11)
- **Simulación con estadísticas**: `simularPartido` devuelve `stats` (posesión,
  remates, al arco, córners, tarjetas) coherentes con los goles. El árbitro
  conserva esas stats al aplicar su efecto.
- **Legajo arbitral**: `partidosDirigidosPor` y `estadisticasArbitro` reconstruyen
  el historial desde `designacionesPorFecha` y `estadoLigas.resultados`; el
  perfil muestra PJ, penales, tarjetas, favorito, perjudicado y últimos partidos.
- **Herramientas**: capacitar, ascender, sancionar, mandar al Federal y veedor
  (`estadoVeedores`, factor 0,45 en la probabilidad de error).
- **Datos**: `estadisticasTorneo`, `cuotasDePartido` (1X2 desde la fuerza),
  `coeficienteClubes` y `h2h` alimentan la sección Datos y el detalle de partido.
- **Documental**: capítulos por temporada desde `estadoHistorial.temporadas`,
  balance desde decisiones, rescates, operativos y escándalos, y veredicto con
  `puntajeLegado`/`rangoLegado`.

### 3.0i Identidad visual y torneos nuevos (v10)
- **Colores de club**: `COLORES_CLUBES` con los 30 de Primera y un color estable
  por hash para el resto. `estiloClub` inyecta `--club` y `--club-suave` en
  filas, tarjetas y portada.
- **Portada**: reemplaza el hero por una tarjeta de transmisión con resultado
  destacado (clásico con prioridad), podio, goleador y KPIs, con el color del
  puntero en el degradado.
- **Copa de la Liga**: dos zonas de 15 con round-robin de 7 fechas y descanso,
  playoffs 1-4 cruzados, campeón con premio de prestigio e historial.
- **Mundial de Clubes**: cuadro de ocho con el campeón de liga y el de la Copa
  Argentina más seis gigantes; premios y prestigio al campeón argentino.

### 3.0h Poder, operativos y vida de los clubes (v9)
- **SECANUCA**: `estadoSecanuca.puntos` acumula por club cuatro ejes (arbitral,
  institucional, mercado, escándalo). `indiceSecanuca` mapea el total a 0–100 con
  base 50. Cada incidencia registra +4 al favorecido y −2 al perjudicado; los
  rescates, becas, estadios y promociones suman institucional. La prensa lo cita
  en titulares, clips y en La Tapa.
- **Operativo**: `estadoOperativo.porPartido[clave]` guarda el sesgo; la
  simulación acepta `opciones.sesgo` y suma goles esperados al lado elegido. La
  filtración se sortea después de la fecha con probabilidad según intensidad,
  VAR y el propio índice SECANUCA del club.
- **Reglamento**: `presidente.reglamento` define cantidad de descensos, método
  (tabla o promedios) y VAR obligatorio; `aplicarAscensosYDescensos` usa esos
  valores.
- **Vida de clubes**: técnicos con ciclo y cese, clásicos con historial y
  asistencia estimada por partido.
- **Mesa chica y gala**: reuniones políticas y premios ya documentados arriba.

### 3.0g Resultados, torneo y memoria (v8)
- **Fecha en vivo**: overlay fijo que revela los resultados de Primera con una
  animación de 90 ms por partido, marca las polémicas y cierra con una tapa
  (resultado destacado, puntero, goleador). Se autodestruye a los 2,2 s y se
  puede saltear; se desactiva con `presidente.fechaVivoModo`.
- **Torneo**: tres vistas (anual, promedios, última fecha) con zonas de
  clasificación y descenso. La tabla de promedios se calcula con los puntos y
  partidos de las últimas tres temporadas guardados en `estadoHistorial.puntos`.
- **Premios**: gala que calcula equipo del año, goleador de Primera, árbitro y
  revelación; el discurso aplica apoyo/prestigio y encadena el cierre de año.
- **Hemeroteca**: `estadoHistorial.temporadas` guarda campeón, copa, goleador,
  apoyo, prestigio y caja de cada año, más récords de goles y puntos.
- **Supercopa**: campeón de liga vs campeón de Copa Argentina al inicio de cada
  temporada, con historial y premio de prestigio.

**Filosofía**: el jugador es presidente, no DT. Nunca toma decisiones tácticas;
su trabajo es leer resultados, administrar la política y decidir sobre el
entorno del fútbol.

### 3.0f Decisiones procedurales, inferiores y eliminatorias (v7)
- **Generador de decisiones**: 31 plantillas con `requiere()` y `construir()`.
  Cada una elige sujetos al azar y arma una decisión única. El motor mezcla 55%
  procedural / 45% escrita a mano, lleva registro de plantillas usadas en la
  partida y de usos históricos en `localStorage` para priorizar lo no visto.
- **Inferiores**: nivel de cantera 0-100 (sube con inversión), camada anual de
  tres juveniles con potencial, y acciones de promover (los convierte en figura
  del mercado del club), becar (+potencial) o vender (plata inmediata).
- **Eliminatorias**: round-robin de 10 selecciones (18 fechas, ida y vuelta),
  seis rondas por año en fechas fijas (5, 10, 15, 20, 25 y 30), tabla con
  puntos y diferencia de gol, y Mundial 2030 al cierre del cuarto año con
  premios según la instancia alcanzada.

### 3.0e Deporte, árbitros y streaming (v6)
- **Arbitraje**: cada incidencia guarda tipo, descripción, club favorecido y
  perjudicado, y los goles antes/después del fallo. El legajo del árbitro se
  calcula de esos datos (nunca queda en "indefinido"): partidos dirigidos,
  polémicas, club más favorecido y más perjudicado, sospecha y confiabilidad.
- **Poder de decisión**: sancionar 5 fechas o mandar al Federal (8 fechas, baja
  de nivel). La **mesa de designaciones** permite cambiar el árbitro de un
  partido de la próxima fecha, una vez cada cuatro fechas, con costo de
  prestigio y riesgo de escándalo si después hay una polémica en ese partido.
- **Streaming**: cuatro streamers con estilo (irónico, picante, analítico,
  ácido), seguidores y opinión. Cada fecha uno publica un clip generado desde el
  contexto; el tono depende de su estilo y el efecto mueve apoyo, prestigio y su
  propia opinión. Hay decisiones para responderlos, dar exclusividad o prohibir.
- **Goleadores**: cada club tiene tres goleadores estables (su figura del mercado
  y dos nombres generados). Los goles se asignan por partido con minuto y
  condición, y la tabla queda en estado plano para el guardado.

### 3.0d Capa política (v5)
- **Rival**: nombre, perfil y promesa propios. Su fuerza crece con tu apoyo bajo
  y tus escándalos, y resta puntos porcentuales a la proyección de la asamblea.
- **Debate**: tres preguntas con tres respuestas cada una. El "humor del público"
  (económico, popular, institucional, emocional) premia la respuesta que
  sintoniza; el rival responde según su perfil. Gana quien suma más puntos.
- **Dirigentes**: cinco clubes con un presidente con lealtad 0–100. Cada 12
  fechas uno hace un pedido con tres respuestas posibles (cumplir, a medias,
  rechazar) que mueven lealtad, caja, apoyo y prestigio. La lealtad media suma o
  resta a la asamblea.
- **Expedientes**: una decisión puede abrir un expediente con fecha de disparo.
  Cuando vence, vuelve como modal con el resultado y sus efectos ya aplicados.
  Store plano (sin funciones) para que sobreviva al guardado.
- **Ritmo**: `avanzarHastaEvento()` encadena fechas hasta el próximo modal, y
  `mensajeAsistente()` resume la próxima jugada recomendada.

### 3.0 Escenarios y modificadores (v4)
Cuatro puntos de partida con números y reglas propias (post-Messi, AFA quebrada,
después de la gloria, el escándalo) y siete modificadores opcionales, hasta dos
por partida. Los efectos se resuelven por funciones (`efectoModificador`) para
no ensuciar la lógica de simulación: erosión, ingresos, prensa, mercado, VAR y
sanciones leen de ahí.

### 3.0b Mercado de pases (v4)
Cada club de Primera tiene una figura con posición, edad, nivel y valor. Dos
ventanas por temporada (fechas 8 y 24). Por cada oferta el jugador decide:
aprobar (la AFA cobra 8% de solidaridad, el club pierde fuerza y apoyo),
renegociar (55% de +25%) o retener (+apoyo, −prestigio). El club que vende puede
salir de la crisis: la plata también ordena las cuentas.

### 3.0c Convocatoria y tanda (v4)
El plantel pasó de 23 fijos a un universo de 30 con mínimos por posición para
armar la lista de 23. La fuerza de la Selección mezcla la del DT (65%) con la de
los convocados (35%). La tanda de penales es un minijuego real: cinco tiros y
muerte súbita, con animación y apuestas de prestigio, apoyo y caja.

### 3.1 Consejo Directivo (confianza)
Cinco consejeros con área e intereses: Institucional, Económico, Deportivo,
Federal y Mediático. Cada uno tiene confianza 0–100 y pondera distinto.

- Las decisiones ajustan a los consejeros de su categoría (y salpican al resto).
- La confianza deriva con los resultados: la caja mueve al Tesorero, la campaña
  del Interior mueve al Federal, los resultados de la Selección al Deportivo.
- Confianza global < 30 → riesgo de **moción de censura** (elección anticipada).
- Confianza global ≥ 70 → bono en la asamblea y crédito más barato.

### 3.2 Asamblea y elecciones
Los 103 clubes votan con peso según su historia (grandes 3 votos, medios 2,
chicos 1). Cada club tiene inclinación según apoyo, rescates, decisiones y
campaña. En año electoral (todos) la asamblea se reúne al cierre:

- **Hemiciclo** con oficialistas / indecisos / opositores y proyección en vivo.
- **Campaña** (3 acciones por año): gira federal, cena con los grandes, promesa
  de TV (queda como promesa a cumplir).
- Ganar ≥ 50% + 1 de los votos → nuevo mandato. Perder → final de partida con
  balance y legado.

### 3.3 Objetivos anuales
Tres objetivos por año (económico, deportivo, institucional/federal) con
progreso medible, recompensa y castigo. Se eligen según el contexto (si perdiste
la final, el objetivo es volver; si estás fundido, sanear).

### 3.4 Finanzas 2.0
- **Libro diario**: cada fecha registra TV, sponsors, sueldos, VAR y eventos.
- **P&L** del año + presupuesto vs. real + historial con gráfico.
- **Préstamos** (hasta 2): plata ahora, cuota fija por fecha, interés.
- **TV**: contrato que se renegocia cada dos años (decisión con riesgo).
- **Sponsors** con contrato de 2 años y bonus por objetivo.

### 3.5 Legado y logros
24 logros (deportivos, económicos, institucionales) y un **puntaje de legado**
que combina títulos, apoyo, prestigio y caja. Pantalla final con la historia del
mandato fecha por fecha.

### 3.6 Dificultad
Tres niveles que ajustan ingresos, agresividad de eventos y umbral de asamblea.

### 3.7 Calidad de vida
- Guardado en **3 slots** + autoguardado + exportar/importar JSON.
- Bandeja de entrada unificada (decisiones, ofertas, prensa, resultados).
- Onboarding de 4 pasos la primera vez.
- Sonido, movimiento reducido y contraste respetados.

## 4. Referencias

- *Football Manager*: confianza del consejo por área, objetivos de temporada,
  bandeja de entrada, "visión del club".
- *Democracy 4*: grupos de interés con demandas contradictorias y efectos
  diferidos de las políticas.
- *Club Chairman / Football Chairman*: la asamblea de socios y la campaña.
- *Reigns*: decisiones de dos filos con consecuencias encadenadas.
- *Game Dev Tycoon*: revisión de fin de año con puntaje y desglose.

## 5. Arquitectura

```
js/core.js        utilidades, formato, iconos
js/charts.js      gráficos SVG (sparkline, gauge, hemiciclo, barras)
js/imagenes.js    escudos (PNG o SVG procedural), banderas, fotos
js/vistas.js      render de cada pantalla
js/app.js         shell, router, modales, eventos de UI
js/consejo.js     consejo directivo
js/asamblea.js    clubes, votos, elecciones, campaña
js/objetivos.js   objetivos anuales
js/logros.js      logros y legado
js/finanzas.js    libro diario, préstamos, TV, sponsors
js/juego.js       orquestador del loop
```

Los módulos de simulación existentes (liga, partido, arbitrajes, copas,
selección) se conservan con cambios menores.
