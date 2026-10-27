# AFA Manager · Presidencia 2026

Simulador de gestión del fútbol argentino. Agarrás la AFA después del retiro de
Messi y de la salida de Scaloni, con cuatro años por delante, 103 clubes
mirándote y una asamblea que votá tu continuidad cada diciembre.

**Jugar:** abrí `index.html` o entrá a la versión publicada en GitHub Pages.
No necesita instalación, build ni servidor: es HTML, CSS y JavaScript clásico.

---

## Qué se juega

- **Escenarios**: elegís tu punto de partida (la era post-Messi, la AFA quebrada,
  después de la gloria o el escándalo) y hasta dos modificadores que cambian las
  reglas (prensa en guerra, clubes impacientes, mercado caliente, semillero,
  viento de cola, tecnología prohibida, mano dura).
- **Fecha a fecha**: se simulan las tres divisiones (Liga Profesional, Primera
  Nacional y Federal A), la Copa Argentina y la Selección. Cada fecha mueve la
  caja y el ánimo de los clubes.
- **Decisiones cada 6 fechas**: SAD, VAR, TV, descensos, cupos de extranjeros,
  reparto federal, derechos de formación, público visitante, apuestas, clásico
  en Miami y más. Cada opción toca al menos dos ejes.
- **Arbitraje con peso**: cada polémica queda registrada con su árbitro, el club
  favorecido, el perjudicado y **el resultado antes y después** de la jugada.
  Podés sancionar (5 fechas), mandar al Federal (8 fechas) o sentarte en la
  **mesa de designaciones** y cambiar el árbitro de un partido: si hay
  escándalo, la prensa lo encuentra y te cuesta caro.
- **Streaming**: Azz, Picado TV, Davoxneize y La Cobra opinan después de cada
  fecha según lo que pasó (polémicas, ventas, tabla, crisis). Mueven el ánimo de
  la gente y el apoyo, y tenés decisiones para responderles, darles exclusividad
  o prohibirles la cancha.
- **Deportivo**: tabla de goleadores con nombres reales de tu partida, detalle de
  cada partido con goleadores y árbitro, y pestañas en Clubes (Posiciones,
  Resultados, Goleadores, Polémicas).
- **Mercado de pases**: dos ventanas por temporada. Los clubes europeos vienen
  por las figuras del torneo y vos aprobás la venta (la AFA cobra 8% de
  solidaridad), renegociás el precio o retenés al jugador.
- **Convocatoria**: un universo de 30 jugadores y una lista de 23 con mínimos
  por posición. La fuerza de la Selección depende de a quiénes convoques.
- **Tanda de penales**: minijuego con apuestas. Elegís dónde patear y dónde
  atajar, con definición por muerte súbita.
- **Oposición**: un rival con nombre, perfil y promesa que crece cuando estás
  flojo. Cuatro fechas antes del cierre hay **debate cara a cara**: tres
  preguntas, respuestas que sintonizan (o no) con el humor del público y un
  marcador que define la elección.
- **Dirigentes**: cinco presidentes de club con lealtad propia. Cada uno te hace
  pedidos (un refuerzo, plata para inferiores, la final en su cancha) y su
  lealtad pesa en la asamblea.
- **Expedientes**: algunas decisiones dejan un expediente abierto que vuelve
  unas fechas después con el resultado (la obra del estadio, la auditoría, el
  reparto de la TV, el paro arbitral).
- **Ritmo**: botón "hasta la próxima decisión" para avanzar sin fricción y un
  asistente ("el secretario dice") que te marca qué conviene hacer.
- **Consejo Directivo**: cinco consejeros con confianza propia. Si cae por
  debajo de 32, te pueden pedir una asamblea anticipada.
- **Asamblea**: 103 clubes que pesan según su historia (3, 2 o 1 voto). En el
  cierre de cada año se vota tu continuidad y podés hacer campaña (cuatro
  acciones por año).
- **Objetivos anuales**: tres por año (económico, institucional y deportivo) con
  progreso, premio y castigo.
- **Finanzas 2.0**: libro diario por fecha, TV con renegociación cada dos años,
  sponsors con contrato, préstamos con interés y clubes al borde de la quiebra
  que podés rescatar.
- **Selección**: DT, ranking FIFA, amistosos, plantel y convocatoria.
- **Copas**: Copa Argentina (103 clubes), Libertadores, Sudamericana y Copa
  América.
- **Legado**: 24 logros, puntaje de legado y una pantalla final con tu historia.

## Reglas básicas

| Recurso | Qué mide | Cómo se mueve |
| --- | --- | --- |
| Apoyo | Los clubes te bancan | Decisiones, rescates, campaña. Se desgasta solo: cuanto más alto, más cuesta sostenerlo. |
| Prestigio | Tu imagen internacional | Amistosos, copas, prensa y decisiones. |
| Caja | La plata de la AFA | TV, sponsors y taquilla por un lado; estructura, DT, VAR, préstamos y rescates por el otro. |
| Consejo | Tu mesa chica | Cada decisión mueve al consejero del área. Si cae, hay moción de censura. |
| Asamblea | Tu continuidad | Proyección en vivo. Necesitás la mitad de los votos (o el umbral de la dificultad). |

## Dificultad

- **Gestión tranquila**: más caja, ingresos altos, asamblea benévola.
- **Presidencia real**: el equilibrio justo.
- **Modo crisis**: caja corta, clubes impacientes y umbral más alto.

Se elige en *Ajustes* y se puede cambiar en cualquier momento.

## Guardado

- Autoguardado en cada fecha (y cada 45 segundos).
- Tres ranuras manuales, exportar/importar partida en JSON.

## Estructura del proyecto

```
index.html            shell de la app
css/estilos.css       sistema de diseño completo
js/core.js            utilidades, formato, iconos
js/charts.js          gráficos SVG (sparkline, gauge, hemiciclo, barras)
js/vistas.js          render de escritorio, consejo y clubes
js/vistas2.js         render de copas, selección, árbitros, finanzas, prensa y legado
js/app.js             shell, navegación, modales y acciones
js/juego.js           motor del mandato (fechas, cierres, elecciones)
js/escenarios.js      escenarios y modificadores de inicio
js/consejo.js         consejo directivo
js/asamblea.js        103 clubes, votos y campaña
js/objetivos.js       objetivos anuales
js/logros.js          logros y puntaje de legado
js/finanzas.js        libro diario, TV, sponsors y préstamos
js/mercado.js         mercado de pases y solidaridad
js/oposicion.js       rival electoral y debate
js/dirigentes.js      los cinco dirigentes y sus pedidos
js/expedientes.js     consecuencias diferidas
js/plantel.js         universo de jugadores, convocatoria y tanda
js/tanda.js           minijuego de penales
js/liga.js / ligas.js simulación de las tres divisiones
js/partido.js         simulación de partidos (Poisson)
js/arbitros.js        cuerpo arbitral, VAR, designaciones y polémicas
js/goleadores.js      tabla de goleadores
js/streaming.js       streamers, clips y opinión
js/copa_argentina.js  copa nacional
js/copa_america.js    copa de selecciones
js/continentales.js   Libertadores y Sudamericana
js/seleccion*.js      DT, amistosos y ranking FIFA
js/decisiones.js      contenido de decisiones escritas a mano
js/decisiones_procedurales.js  plantillas y generador procedural
js/inferiores.js      cantera, juveniles y promociones
js/eliminatorias.js   eliminatorias sudamericanas y Mundial 2030
js/historial.js       temporadas, promedios y supercopas
js/fecha_vivo.js      la fecha en vivo y la tapa
js/premios.js         gala de fin de año y discurso
js/secanuca.js        coeficiente de poder y prensa
js/operativo.js       operativo reservado sobre un partido
js/clubes_vida.js     técnicos, clásicos y asistencia
js/tapa.js            el diario del día después
js/consejo_extra.js   reglamento y mesa chica
js/eventos.js         contenido de eventos
js/noticias.js        prensa y noticias
js/prensa.js          conferencias y relación con los medios
js/guardado.js        persistencia
```

## Cambios de la versión 14

Correcciones de jugabilidad reportadas por los primeros jugadores.

- **Goleadores calibrados**: cinco posibles goleadores por club con reparto más parejo (antes el 50% de los goles iba al mismo). El máximo pasó de 17 goles en 12 fechas a 9.
- **Fuerzas más parejas**: rango comprimido y goles esperados más bajos. Promedio de 2,18 goles por partido.
- **Goleadores por división**: la tabla filtra según la liga seleccionada.
- **Modales que no se escapan**: el fondo solo cierra si el modal es cerrable y Escape respeta los obligatorios.
- **Copa Argentina completa**: se ven todos los partidos de cada ronda.
- **Promedios en vivo**: la tabla suma la temporada en curso.
- **Árbitros repartidos**: designa al que menos dirigió (15/15/15/11 contra 26/8 antes).
- **Copa de la Liga por fecha**: resultados de cada ronda de zonas.
- **Copa América completa**: grupos, cuartos, semis y final.
- **Supercopa sin Boca vs Boca**: si el mismo club gana liga y copa, juega contra el subcampeón.
- **Mundial de Clubes ordenado**: cuartos, semis y final con resultados.
- **Fin de mandato claro**: pantalla con puntos, documental y botón de nueva partida.
- **Legado justo**: penalización por salir antes del año 4.

## Cambios de la versión 13

Pulido de cierre: **sin tocar la jugabilidad**, todo lo que hacía ruido queda
ordenado.

1. **Captura global de errores**: si algo falla, la partida sigue y ves un aviso
   amable en vez de una pantalla rota.
2. **Ajustes completos**: sonido, fecha en vivo, reducir movimiento, dificultad,
   guardado, ranuras, exportar/importar y zona de riesgo en un solo lugar.
3. **Guía rápida** de cinco pasos, accesible desde Ajustes y desde la ayuda.
4. **Novedades**: un resumen de la versión, dentro de Ajustes.
5. **Teclado y foco**: Escape cierra los modales y todos los controles muestran
   foco visible.
6. **Movimiento reducido**: se respeta `prefers-reduced-motion` y hay un toggle
   manual que apaga animaciones.
7. **Guardado más liviano**: se muestra el peso real (KB) y hay un botón
   "Optimizar" que recorta historiales viejos sin perder la partida.
8. **Versión visible** en la barra lateral y en Ajustes.
9. **Robustez**: inversión en inferiores protegida, documental ya cuenta bien las
   decisiones y el cierre de año no se traba.
10. **Documentación** al día: README y DESIGN con todo lo agregado.

## Cambios de la versión 12

Balance político, transparencia y ajustes salidos de una prueba de 55 partidas
automáticas con siete estrategias y los siete directores técnicos.

- **Apoyo más sostenible**: el desgaste natural bajó de 0,30 a 0,18 por fecha y
  el castigo por apoyo alto tiene techo. Sostener 60 ya no es una condena.
- **Rescatar suma**: salvar un club ahora da +3 de apoyo (antes restaba 3). A la
  tercera vez vuelve la sanción política.
- **Objetivos que rinden**: cada objetivo cumplido al cierre del año suma +3 de
  apoyo, además de su recompensa.
- **Fondo solidario exprés**: nueva acción de campaña ($1.500M) que reparte
  apoyo entre clubes chicos, del Interior, medios y grandes. La plata ahora
  sirve para comprar política.
- **Asamblea más justa y visible**: el umbral baja a 47% (42% fácil, 52%
  difícil) y el Consejo muestra **cómo se forma la proyección** punto por punto
  (base, apoyo, prestigio, consejo, oposición, dirigentes, debate y campaña).
- **¿Por qué cambió el apoyo?**: panel con los últimos ocho movimientos y su
  motivo, para que cada número se pueda explicar.
- **Alertas tempranas**: el secretario avisa cuando el apoyo cae de 45 y cuando
  entra en zona roja (menos de 30), y hay recordatorio de campaña en la fecha 25.
- **La caja cuesta**: gastos anuales de estructura y fondo solidario que escalan
  con la caja (8% y un extra del 10% arriba de $10.000M).
- **Legado reponderado**: ahora pesan los años, el apoyo final, los logros y las
  asambleas ganadas; la caja pesa mucho menos. El desglose completo se muestra
  en el cierre y en el documental.
- **Robustez**: la inversión en inferiores quedó protegida con try/catch y el
  documental ya cuenta bien las decisiones tomadas.

## Cambios de la versión 11

- **Cuerpo arbitral 2.0**: legajo con partidos dirigidos, penales, amarillas por
  partido, favorito y perjudicado, últimos partidos y últimas polémicas. Nuevas
  acciones: **capacitar** ($400M, sube nivel), **ascender**, **sancionar**,
  **mandar al Federal** y **veedor** (baja a la mitad la chance de error en un
  partido). Nuevos paneles de historial y sanciones en la sección.
- **Documental final**: al terminar el mandato se arma un documental con
  capítulos por año, el balance de gestión (decisiones, rescates, operativos,
  escándalos, títulos), el índice SECANUCA final y el veredicto de legado.
- **Estadísticas de partido**: posesión, remates, al arco, córners y tarjetas,
  coherentes con el resultado, en el detalle de cada partido.
- **Sala de datos**: goles por fecha, mejores ataques y defensas, goleadas del
  torneo y tarjetas.
- **Cuotas**: los favoritos de las casas de apuestas para la próxima fecha,
  calculados desde la fuerza de los equipos. No se apuesta: se lee el mercado.
- **Coeficiente de clubes**: ranking por puntos actuales más los históricos.
- **Historial entre sí**: el cara a cara de los dos equipos en el detalle del
  partido.

## Cambios de la versión 10

- **Portada nueva**: el escritorio ahora es una transmisión. Resultado de la
  fecha con los escudos, podio del torneo, goleador y los cuatro números del
  mandato, todo con el color del club puntero de fondo.
- **Identidad de color**: cada club tiene su color; las tablas, la portada, las
  tarjetas y la Copa de la Liga lo usan en barras y acentos.
- **Transiciones**: las pantallas entran con un fundido suave y la portada tiene
  luz de estudio y punto de "al aire".
- **Copa de la Liga**: torneo nuevo con dos zonas de quince, siete fechas y
  playoffs entre los cuatro mejores de cada zona. Campeón, historial y lugar
  internacional.
- **Mundial de Clubes**: al cerrar el año, el campeón de la liga y el de la Copa
  Argentina juegan un cuadro de ocho contra los gigantes de Europa, con premios
  y prestigio.

## Cambios de la versión 9

1. **Operativo reservado**: incidir directamente en un partido de la próxima
   fecha. Elegís el partido, el club beneficiado y la intensidad (suave, medio o
   fuerte); el sesgo cambia los goles esperados y la plata y el prestigio salen
   de tu bolsillo. Cuanto más fuerte, más chances de que se filtre: ahí perdés
   prestigio, apoyo y queda el escándalo.
2. **SECANUCA**: la Secretaría de Control y Análisis de Niveles y Coeficientes
   AFA. Calcula un **coeficiente de poder** (0–100) por club con los fallos
   arbitrales, la plata que pusiste, el mercado y los escándalos. La prensa lo
   usa para decir a quién ayudaron: los titulares, los clips y la tapa lo citan.
3. **La Tapa**: el diario del día después, con volanta, titular y bajada
   generados desde el resultado más fuerte, la polémica de la fecha y el
   SECANUCA.
4. **Descenso por promedios**: el reglamento ahora permite bajar por tabla o por
   promedios de las últimas tres temporadas, con 2 o 3 descensos por año.
5. **Clasificación a las copas**: al cerrar el año se definen los cuatro de
   Libertadores y los cuatro de Sudamericana según la tabla anual, con su bloque
   en el cierre.
6. **Mercado de técnicos**: cada club tiene DT, los malos resultados lo ponen en
   la cuerda floja y la prensa cubre los ceses.
7. **Asistencia**: cada partido muestra la gente que fue a la cancha, calculada
   con el peso del club, su posición y el resultado.
8. **Clásicos**: historial de los ocho clásicos (River-Boca, Avellaneda,
   rosarino, platense, cordobés…) con ganadores, empates y goles.
9. **Mesa chica**: reunión con tres dirigentes; podés quedar bien con uno y
   ganarte el enojo de los otros dos.
10. **Boletín oficial**: una reunión por año para cambiar descensos, método y
    VAR obligatorio, con costo político y económico.

## Cambios de la versión 8

- **Fecha en vivo**: al avanzar la fecha, una pantalla de transmisión revela los
  resultados de la Liga uno por uno, con las polémicas marcadas, y cierra con
  "La Tapa" (resultado destacado, puntero y goleador). Se puede saltar y se
  apaga desde Ajustes.
- **Torneo**: sección nueva con tabla anual (zonas de Libertadores, Sudamericana
  y descenso), tabla de promedios de las últimas tres temporadas y los
  resultados de la última fecha con detalle de cada partido.
- **Premios**: gala de fin de año con equipo del año, goleador, árbitro y
  revelación de la cantera, más el discurso del presidente (humilde, ambicioso o
  polémico) que mueve apoyo y prestigio.
- **Hemeroteca**: archivo de campeones, supercopas y récords de todas tus
  temporadas, dentro de Legado.
- **Supercopa Argentina**: al empezar cada año se juega el campeón de la liga
  contra el campeón de la Copa Argentina, con su historial en Copas.
- **Noción de resultados siempre**: además de la fecha en vivo, el escritorio
  muestra los últimos resultados y el detalle de cada partido está a un clic.

## Cambios de la versión 7

- **Decisiones infinitas**: un generador procedural combina 31 plantillas con
  sujetos aleatorios (club, jugador, provincia, árbitro, streamer, dirigente).
  Se mezcla con las decisiones escritas a mano, evita repetir plantilla en la
  partida y recuerda cuántas veces usó cada una en todas tus partidas para
  priorizar las que nunca viste.
- **Inferiores**: sección nueva con nivel de cantera, inversión, camada anual de
  juveniles con potencial y acciones para promoverlos al primer equipo (entran al
  mercado), becarlos o venderlos.
- **Eliminatorias al Mundial 2030**: tabla sudamericana de 10 selecciones con 18
  fechas repartidas en tres años, seis partidos por año que se juegan junto a
  las fechas de liga, y un Mundial 2030 al final del mandato según la posición.
- **Realismo**: las decisiones nuevas toman debates reales del fútbol argentino
  (promedios vs. tabla, reparto de TV, SAD, derechos de formación, fútbol
  femenino, seguridad en los estadios).

## Cambios de la versión 6

- **Arbitraje 2.0**: legajo completo por árbitro (partidos, polémicas, club más
  favorecido y más perjudicado, sospecha), polémicas con impacto en el resultado,
  acciones de sanción y "mandar al Federal", y mesa de designaciones para
  cambiar el árbitro de un partido (con riesgo de escándalo).
- **Streaming**: cuatro streamers con opinión propia, clips generados según el
  contexto y decisiones para interactuar con ellos.
- **Deportivo**: goleadores con plantillas estables por club, detalle de partido
  con goles y árbitro, y pestañas dentro de Clubes.
- **Balance**: menos polémicas en las categorías de ascenso y tope de 600
  incidencias guardadas.

## Cambios de la versión 5

- **Capa política**: rival electoral con fuerza propia, debate de tres rondas
  como minijuego, cinco dirigentes con lealtad y pedidos, y expedientes de
  consecuencias diferidas.
- **Ritmo y usabilidad**: "hasta la próxima decisión" para avanzar rápido y el
  asistente del secretario con la próxima jugada recomendada.
- **Contenido**: cuatro decisiones que abren expedientes (estadio, inferiores,
  auditoría, reparto de TV) y pedidos de dirigentes con tres respuestas cada uno.

## Cambios de la versión 4

- **Escenarios**: cuatro puntos de partida (post-Messi, AFA quebrada, después de
  la gloria, el escándalo) con números y reglas propias.
- **Modificadores**: siete reglas extra, hasta dos por partida.
- **Mercado de pases**: figuras por club, dos ventanas por año, ofertas europeas
  y tres decisiones por operación (vender, renegociar, retener) con impacto en
  caja, apoyo, prestigio y fuerza de los clubes.
- **Convocatoria**: 30 jugadores, lista de 23 con mínimos por posición, promedio
  que incide en la fuerza de la Selección.
- **Tanda de penales**: minijuego completo con animación, muerte súbita y
  apuestas; se dispara desde la Selección y desde eventos.
- **Contenido nuevo**: decisiones de mercado, apuestas, clásico en Miami,
  juveniles y final del Federal; eventos de tanda y oferta récord.
- **Balance**: desgaste de apoyo más justo, censura a partir de la fecha 15,
  campaña de cuatro acciones y rescates menos castigados.

## Cambios de la versión 3

- Rediseño visual completo, con navegación lateral en escritorio y barra
  inferior en mobile.
- Consejo Directivo, asamblea con elecciones, campaña y proyección de voto.
- Objetivos anuales, logros y legado.
- Finanzas con libro diario: se terminó el Año 1 sin ingresos.
- Se puede perder, pero ahora se sabe por qué: el umbral se ve todo el año.
- Tres dificultades, tres ranuras de guardado, exportar/importar.
- Selección con plantel, copas con más contexto, prensa con relación con los medios.
- Correcciones: overlay de "Simulando", formato de plata, tablas en mobile,
  escudos generados para los 73 clubes sin imagen, banderas sin emoji,
  clubes que ya no se multiplican temporada tras temporada.
- `simeone.png` pasó de 2,4 MB a una versión optimizada.

## Créditos

Idea y desarrollo: Bruno Y. Simulación y contenido: este repositorio.
Hecho para jugar en el celular, en el colectivo, camino a la cancha.
