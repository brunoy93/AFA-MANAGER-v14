// ============================================
// PREMIOS: la gala de fin de año
// ============================================

function goleadorDePrimera() {
    if (typeof estadoGoleadores === "undefined") return null;
    const equiposPrimera = LIGAS.primera.equipos;
    const lista = Object.keys(estadoGoleadores.tabla)
        .map(function(k) { return estadoGoleadores.tabla[k]; })
        .filter(function(g) { return equiposPrimera.indexOf(Number(g.clubId)) !== -1; })
        .sort(function(a, b) { return b.goles - a.goles; });
    return lista[0] || null;
}

function calcularPremios() {
    const goleador = goleadorDePrimera() || ((typeof tablaGoleadores === "function") ? tablaGoleadores(1)[0] : null);
    const campeon = campeonPrimeraActual();
    const arbitros = (typeof obtenerRankingArbitros === "function") ? obtenerRankingArbitros("primera") : [];
    const arbitro = arbitros.slice().sort(function(a, b) {
        return (b.confiabilidad || 0) - (a.confiabilidad || 0);
    })[0];
    const juveniles = (typeof juvenilesDisponibles === "function") ? juvenilesDisponibles() : [];
    const revelacion = juveniles.slice().sort(function(a, b) { return b.potencial - a.potencial; })[0];

    return {
        campeon: campeon,
        goleador: goleador,
        arbitro: arbitro,
        revelacion: revelacion
    };
}

function mostrarGalaPremios(premios, alCerrar) {
    const filas = [];

    if (premios.campeon) {
        filas.push({
            titulo: "Equipo del año",
            nombre: premios.campeon.nombre,
            detalle: "Campeón de la Liga Profesional con " + premios.campeon.Pts + " puntos.",
            icono: "trofeo"
        });
    }
    if (premios.goleador) {
        filas.push({
            titulo: "Goleador del torneo",
            nombre: premios.goleador.nombre,
            detalle: premios.goleador.goles + " goles en " + premios.goleador.club + ".",
            icono: "objetivo"
        });
    }
    if (premios.arbitro) {
        filas.push({
            titulo: "Árbitro del año",
            nombre: premios.arbitro.nombre,
            detalle: "Confiabilidad " + Math.round(premios.arbitro.confiabilidad || premios.arbitro.nivel) + " y " + premios.arbitro.incidencias + " polémicas.",
            icono: "balanza"
        });
    }
    if (premios.revelacion) {
        filas.push({
            titulo: "Revelación de la cantera",
            nombre: premios.revelacion.nombre,
            detalle: "Potencial " + premios.revelacion.potencial + " · " + premios.revelacion.club + ".",
            icono: "rayo"
        });
    }

    const cuerpo = filas.map(function(f) {
        return "<div class='premio-fila'>" +
            "<span class='premio-ico'>" + icono(f.icono, "", 18) + "</span>" +
            "<div class='crecer'><div class='premio-cat'>" + f.titulo + "</div>" +
            "<strong>" + escapar(f.nombre) + "</strong>" +
            "<div class='mini tenue'>" + escapar(f.detalle) + "</div></div></div>";
    }).join("");

    UI.modal({
        id: "premios",
        eyebrow: "Gala de fin de año · " + presidente.anioMandato,
        titulo: "Los premios de la temporada",
        sub: "La AFA entrega los galardones. Después viene tu discurso.",
        ancho: "ancho",
        cerrable: false,
        cuerpo: "<div class='premios'>" + (cuerpo || "<p class='tenue'>Sin premiados.</p>") + "</div>" +
            "<h4 class='seccion-mini'>Tu discurso</h4>" +
            "<div class='opciones'>" +
            "<button class='opcion' data-accion='discurso' data-tono='humilde'><span class='opcion-marca'>A</span>" +
            "<span class='opcion-cuerpo'><span class='opcion-titulo'>Humilde: \"Esto es de los clubes\"</span><br>" +
            "<span class='opcion-resumen'>+2 apoyo · +1 prestigio</span></span></button>" +
            "<button class='opcion' data-accion='discurso' data-tono='ambicioso'><span class='opcion-marca'>B</span>" +
            "<span class='opcion-cuerpo'><span class='opcion-titulo'>Ambicioso: \"Vamos por más\"</span><br>" +
            "<span class='opcion-resumen'>+3 prestigio · -2 apoyo</span></span></button>" +
            "<button class='opcion' data-accion='discurso' data-tono='polemico'><span class='opcion-marca'>C</span>" +
            "<span class='opcion-cuerpo'><span class='opcion-titulo'>Polémico: \"Nos quieren voltear\"</span><br>" +
            "<span class='opcion-resumen'>+4 apoyo · -4 prestigio</span></span></button>" +
            "</div>"
    });
    window._premiosCierre = alCerrar;
}

function elegirDiscurso(tono) {
    if (tono === "humilde") { ajustarApoyo(2, "Discurso de la gala"); ajustarPrestigio(1, "Discurso de la gala"); }
    else if (tono === "ambicioso") { ajustarPrestigio(3, "Discurso de la gala"); ajustarApoyo(-2, "Discurso de la gala"); }
    else { ajustarApoyo(4, "Discurso de la gala"); ajustarPrestigio(-4, "Discurso de la gala"); }

    UI.cerrar("premios");
    const cierre = window._premiosCierre;
    window._premiosCierre = null;
    if (typeof cierre === "function") setTimeout(cierre, 220);
}
