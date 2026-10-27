// ============================================
// PARTIDO: simulación de un partido individual
// ============================================
// Usa distribución de Poisson para generar goles realistas.
// El árbitro se aplica DESPUÉS, desde liga.js, para mantener
// este módulo puro (solo simula el resultado base).

function simularPartido(equipoLocal, equipoVisitante, opciones) {
    const dif = equipoLocal.fuerza - equipoVisitante.fuerza;
    const op = opciones || {};

    // Goles esperados según diferencia de fuerzas (más parejo que antes)
    let espLocal = Math.max(0.2, 1.18 + dif / 40);
    let espVisitante = Math.max(0.2, 1.02 - dif / 40);

    // Operativo: empujón a un lado del partido
    if (op.sesgo) {
        if (op.sesgo.lado === "local") espLocal += op.sesgo.goles;
        else espVisitante += op.sesgo.goles;
    }

    const golesLocal = poisson(espLocal);
    const golesVisitante = poisson(espVisitante);

    // Estadísticas del partido: siempre coherentes con el resultado
    const azar = function(min, max) { return Math.floor(min + Math.random() * (max - min + 1)); };
    const posesionLocal = limitar(Math.round(50 + dif / 6 + azar(-7, 7)), 32, 68);
    const rematesLocal = Math.max(golesLocal, Math.round(6 + golesLocal * 1.8 + azar(0, 6) + (posesionLocal - 50) / 8));
    const rematesVisitante = Math.max(golesVisitante, Math.round(6 + golesVisitante * 1.8 + azar(0, 6) + (50 - posesionLocal) / 8));
    const alArcoLocal = Math.min(rematesLocal, golesLocal + azar(1, 4));
    const alArcoVisitante = Math.min(rematesVisitante, golesVisitante + azar(1, 4));

    const stats = {
        posesionLocal: posesionLocal,
        posesionVisitante: 100 - posesionLocal,
        rematesLocal: rematesLocal,
        rematesVisitante: rematesVisitante,
        alArcoLocal: alArcoLocal,
        alArcoVisitante: alArcoVisitante,
        cornersLocal: azar(1, 9),
        cornersVisitante: azar(1, 9),
        amarillasLocal: azar(0, 4),
        amarillasVisitante: azar(0, 4),
        rojasLocal: Math.random() < 0.05 ? 1 : 0,
        rojasVisitante: Math.random() < 0.05 ? 1 : 0
    };

    return {
        local: equipoLocal.nombre,
        visitante: equipoVisitante.nombre,
        localId: equipoLocal.id,
        visitanteId: equipoVisitante.id,
        golesLocal: golesLocal,
        golesVisitante: golesVisitante,
        stats: stats,
        incidencia: null
    };
}

// Distribución de Poisson (para goles realistas)
function poisson(lambda) {
    if (lambda <= 0) return 0;
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
        k++;
        p *= Math.random();
    } while (p > L);
    return k - 1;
}