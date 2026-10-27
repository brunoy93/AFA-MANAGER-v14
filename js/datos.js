// ============================================
// DATOS: estadísticas, cuotas, coeficientes y H2H
// ============================================

function partidosDeLaLiga(ligaId) {
    const lista = [];
    const resultados = (estadoLigas.resultados[ligaId] || []);
    resultados.forEach(function(fechaRes, fecha) {
        if (!fechaRes) return;
        fechaRes.forEach(function(r, idx) { lista.push({ fecha: fecha, idx: idx, r: r }); });
    });
    return lista;
}

function estadisticasTorneo(ligaId) {
    const partidos = partidosDeLaLiga(ligaId || "primera");
    let goles = 0, amarillas = 0, rojas = 0, corners = 0, remates = 0;
    const porFecha = {};

    partidos.forEach(function(p) {
        const r = p.r;
        const s = r.stats || {};
        const g = (r.golesLocal || 0) + (r.golesVisitante || 0);
        goles += g;
        porFecha[p.fecha] = (porFecha[p.fecha] || 0) + g;
        amarillas += (s.amarillasLocal || 0) + (s.amarillasVisitante || 0);
        rojas += (s.rojasLocal || 0) + (s.rojasVisitante || 0);
        corners += (s.cornersLocal || 0) + (s.cornersVisitante || 0);
        remates += (s.rematesLocal || 0) + (s.rematesVisitante || 0);
    });

    return {
        partidos: partidos.length,
        goles: goles,
        promedioGoles: partidos.length ? Math.round((goles / partidos.length) * 100) / 100 : 0,
        amarillas: amarillas,
        rojas: rojas,
        corners: corners,
        remates: remates,
        porFecha: porFecha
    };
}

function mejoresAtaquesDefensas(ligaId) {
    const tabla = obtenerTablaOrdenada(ligaId || "primera");
    const ataque = tabla.slice().sort(function(a, b) { return b.GF - a.GF; }).slice(0, 5);
    const defensa = tabla.slice().sort(function(a, b) { return a.GC - b.GC; }).slice(0, 5);
    const goleadas = partidosDeLaLiga(ligaId || "primera").slice().sort(function(a, b) {
        return (Math.abs(b.r.golesLocal - b.r.golesVisitante)) - (Math.abs(a.r.golesLocal - a.r.golesVisitante));
    }).slice(0, 3);
    return { ataque: ataque, defensa: defensa, goleadas: goleadas };
}

// -----------------------------
// CUOTAS (las casas de apuestas)
// -----------------------------

function cuotasDePartido(fuerzaLocal, fuerzaVisitante) {
    const dif = (fuerzaLocal - fuerzaVisitante) / 100;
    let pLocal = 0.42 + dif * 0.9;
    let pEmpate = 0.27;
    pLocal = limitar(pLocal, 0.12, 0.78);
    let pVisitante = limitar(1 - pLocal - pEmpate, 0.10, 0.70);
    const total = pLocal + pEmpate + pVisitante;
    pLocal /= total; pEmpate /= total; pVisitante /= total;
    const margen = 1.06;
    return {
        local: Math.round((1 / (pLocal * margen)) * 100) / 100,
        empate: Math.round((1 / (pEmpate * margen)) * 100) / 100,
        visitante: Math.round((1 / (pVisitante * margen)) * 100) / 100,
        favorito: pLocal >= pVisitante ? "local" : "visitante",
        probabilidadLocal: Math.round(pLocal * 100)
    };
}

function cuotasProximaFecha() {
    const fecha = estadoLigas.fechaActual;
    const partidos = estadoLigas.calendarios.primera ? estadoLigas.calendarios.primera[fecha] : null;
    if (!partidos) return [];
    return partidos.map(function(p) {
        const a = EQUIPOS[p.local], b = EQUIPOS[p.visitante];
        return { local: a.nombre, visitante: b.nombre, localId: a.id, visitanteId: b.id, cuotas: cuotasDePartido(a.fuerza, b.fuerza) };
    });
}

// -----------------------------
// COEFICIENTE DE CLUBES
// -----------------------------

function coeficienteClubes() {
    const tabla = obtenerTablaOrdenada("primera");
    return tabla.map(function(t) {
        const hist = (estadoHistorial.puntos && estadoHistorial.puntos[t.id]) || [];
        const ptsHist = hist.reduce(function(a, h) { return a + h.pts; }, 0);
        const pjHist = hist.reduce(function(a, h) { return a + h.pj; }, 0);
        const coeficiente = Math.round((ptsHist + t.Pts) * 10) / 10;
        return {
            id: t.id, nombre: t.nombre,
            actual: t.Pts, historico: ptsHist, pj: pjHist + t.PJ,
            coeficiente: coeficiente,
            promedio: (pjHist + t.PJ) ? Math.round(((ptsHist + t.Pts) / (pjHist + t.PJ)) * 1000) / 1000 : 0
        };
    }).sort(function(a, b) { return b.coeficiente - a.coeficiente; });
}

// -----------------------------
// HISTORIAL ENTRE DOS CLUBES (H2H)
// -----------------------------

function h2h(idA, idB) {
    const a = Number(idA), b = Number(idB);
    let pj = 0, ganaA = 0, ganaB = 0, empates = 0, golesA = 0, golesB = 0;
    const ultimos = [];
    ["primera", "nacional", "federalA"].forEach(function(ligaId) {
        partidosDeLaLiga(ligaId).forEach(function(p) {
            const r = p.r;
            const esA = r.localId === a && r.visitanteId === b;
            const esB = r.localId === b && r.visitanteId === a;
            if (!esA && !esB) return;
            pj++;
            const gl = esA ? r.golesLocal : r.golesVisitante;
            const gv = esA ? r.golesVisitante : r.golesLocal;
            golesA += gl; golesB += gv;
            if (gl > gv) ganaA++;
            else if (gl < gv) ganaB++;
            else empates++;
            ultimos.push({ fecha: p.fecha, liga: ligaId, local: r.local, visitante: r.visitante, gl: r.golesLocal, gv: r.golesVisitante });
        });
    });
    return { pj: pj, ganaA: ganaA, ganaB: ganaB, empates: empates, golesA: golesA, golesB: golesB, ultimos: ultimos.slice(-5).reverse() };
}

function nombreClub(id) {
    return EQUIPOS[id] ? EQUIPOS[id].nombre : "—";
}
