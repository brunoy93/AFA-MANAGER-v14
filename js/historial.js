// ============================================
// HISTORIAL: temporadas, campeones y promedios
// ============================================

const estadoHistorial = {
    temporadas: [],
    puntos: {},
    supercopas: [],
    records: {}
};

function reiniciarHistorial() {
    estadoHistorial.temporadas = [];
    estadoHistorial.puntos = {};
    estadoHistorial.supercopas = [];
    estadoHistorial.records = {};
}

function campeonPrimeraActual() {
    const tabla = obtenerTablaOrdenada("primera");
    return tabla.length ? tabla[0] : null;
}

function registrarTemporada() {
    if (!estadoLigas.tablas.primera) return null;
    const tabla = obtenerTablaOrdenada("primera");
    const campeon = tabla[0] || null;
    const copaArg = (estadoCopaArgentina.historial && estadoCopaArgentina.historial.length)
        ? estadoCopaArgentina.historial[estadoCopaArgentina.historial.length - 1]
        : null;
    const goleador = (typeof tablaGoleadores === "function") ? tablaGoleadores(1)[0] : null;

    const registro = {
        anio: presidente.anioMandato,
        campeon: campeon ? campeon.nombre : "—",
        campeonId: campeon ? campeon.id : null,
        subcampeon: tabla[1] ? tabla[1].nombre : "—",
        copaArgentina: copaArg ? copaArg.campeon : "—",
        goleador: goleador ? goleador.nombre : "—",
        goleadorGoles: goleador ? goleador.goles : 0,
        apoyo: presidente.apoyoClubes,
        prestigio: presidente.prestigioInternacional,
        caja: presidente.dineroEnCaja,
        tabla: tabla.slice(0, 6).map(function(t) { return { nombre: t.nombre, pts: t.pts }; })
    };

    // Clasificación a las copas del año siguiente según la tabla anual
    registro.clasificados = {
        libertadores: tabla.slice(0, 4).map(function(t) { return t.nombre; }),
        sudamericana: tabla.slice(4, 8).map(function(t) { return t.nombre; })
    };

    estadoHistorial.temporadas.push(registro);
    if (estadoHistorial.temporadas.length > 12) estadoHistorial.temporadas.shift();

    // Puntos para promedios: guardamos por club los últimos 3 años
    tabla.forEach(function(t) {
        if (!estadoHistorial.puntos[t.id]) estadoHistorial.puntos[t.id] = [];
        const lista = estadoHistorial.puntos[t.id];
        lista.push({ anio: presidente.anioMandato, pts: t.Pts, pj: t.PJ });
        if (lista.length > 3) lista.shift();
    });

    // Récords
    if (goleador && (!estadoHistorial.records.goles || goleador.goles > estadoHistorial.records.goles.cantidad)) {
        estadoHistorial.records.goles = { nombre: goleador.nombre, cantidad: goleador.goles, anio: presidente.anioMandato };
    }
    if (campeon && (!estadoHistorial.records.puntos || campeon.Pts > estadoHistorial.records.puntos.cantidad)) {
        estadoHistorial.records.puntos = { nombre: campeon.nombre, cantidad: campeon.Pts, anio: presidente.anioMandato };
    }

    return registro;
}

function tablaPromedios() {
    const clubes = LIGAS.primera.equipos.slice();
    const tablaActual = (estadoLigas.tablas && estadoLigas.tablas.primera) ? estadoLigas.tablas.primera : {};
    return clubes.map(function(id) {
        const historial = estadoHistorial.puntos[id] || [];
        let pts = 0;
        let pj = 0;
        historial.forEach(function(h) { pts += h.pts; pj += h.pj; });
        const yaRegistrada = historial.some(function(h) { return h.anio === presidente.anioMandato; });
        const actual = tablaActual[id];
        if (actual && !yaRegistrada) {
            pts += actual.Pts || 0;
            pj += actual.PJ || 0;
        }
        const promedio = pj > 0 ? pts / pj : 0;
        return {
            id: id,
            nombre: EQUIPOS[id] ? EQUIPOS[id].nombre : "—",
            pts: pts,
            pj: pj,
            temporadas: historial.length + ((actual && !yaRegistrada) ? 1 : 0),
            promedio: promedio
        };
    }).sort(function(a, b) {
        if (b.promedio !== a.promedio) return b.promedio - a.promedio;
        return b.pts - a.pts;
    });
}

function promediosDe(idClub) {
    const historial = estadoHistorial.puntos[idClub] || [];
    let pts = 0;
    let pj = 0;
    historial.forEach(function(h) { pts += h.pts; pj += h.pj; });
    return pj > 0 ? pts / pj : null;
}

function campeonesHistoricos() {
    return estadoHistorial.temporadas.map(function(t) {
        return { anio: t.anio, campeon: t.campeon, copa: t.copaArgentina, goleador: t.goleador };
    });
}

// -----------------------------
// SUPERCOPA ARGENTINA
// -----------------------------

function supercopaPendiente() {
    const temporadas = estadoHistorial.temporadas;
    if (!temporadas.length) return null;
    const ultima = temporadas[temporadas.length - 1];
    if (!ultima.campeonId || !ultima.copaArgentina || ultima.copaArgentina === "—") return null;
    if (estadoHistorial.supercopas.some(function(s) { return s.anio === ultima.anio; })) return null;
    return ultima;
}

function jugarSupercopa() {
    const base = supercopaPendiente();
    if (!base) return null;

    const campeonLiga = EQUIPOS[base.campeonId];
    const campeonCopa = Object.keys(EQUIPOS).map(function(k) { return EQUIPOS[k]; })
        .filter(function(e) { return e.nombre === base.copaArgentina; })[0];

    if (!campeonLiga) return null;

    // Si el mismo club ganó liga y copa, juega contra el subcampeón de la liga.
    let rival = campeonCopa;
    let esBicampeon = false;
    if (!rival || rival.id === campeonLiga.id) {
        const tabla = obtenerTablaOrdenada("primera");
        const sub = tabla.filter(function(t) { return t.id !== campeonLiga.id; })[0];
        rival = sub ? EQUIPOS[sub.id] : null;
        esBicampeon = true;
    }
    if (!rival) return null;

    const fuerzaLiga = campeonLiga.fuerza;
    const fuerzaCopa = rival.fuerza;
    const gl = poisson(Math.max(0.2, 1.2 + (fuerzaLiga - fuerzaCopa) / 30));
    const gv = poisson(Math.max(0.2, 1.2 - (fuerzaLiga - fuerzaCopa) / 30));
    const ganador = gl > gv ? campeonLiga.nombre : gv > gl ? rival.nombre : (probabilidad(0.5) ? campeonLiga.nombre : rival.nombre);

    const registro = {
        anio: base.anio,
        liga: campeonLiga.nombre,
        copa: rival.nombre,
        golesLiga: gl,
        golesCopa: gv,
        ganador: ganador,
        bicampeon: esBicampeon
    };
    estadoHistorial.supercopas.push(registro);

    if (ganador === campeonLiga.nombre) campeonLiga.fuerza = Math.min(100, campeonLiga.fuerza + 1);
    ajustarPrestigio(1, "Supercopa Argentina");
    agregarNoticia("TyC Sports", "Supercopa Argentina: " + ganador + " se quedó con el trofeo",
        campeonLiga.nombre + " " + gl + " - " + gv + " " + rival.nombre + "." +
        (esBicampeon ? " El campeón de liga y copa jugó contra el subcampeón." : ""), "elogio");

    return registro;
}
