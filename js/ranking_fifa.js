// ============================================
// RANKING FIFA: puesto de la Selección Argentina
// ============================================
// Empieza en 1 (post-Mundial 2022). Se mueve según resultados.
// Rango válido: 1 a 15.

const ESTADO_RANKING = {
    puesto: 1,
    historial: []
};

function ajustarRanking(delta, motivo) {
    const puestoAnterior = ESTADO_RANKING.puesto;

    let nuevoPuesto = ESTADO_RANKING.puesto - delta;
    nuevoPuesto = Math.max(1, Math.min(15, Math.round(nuevoPuesto)));

    ESTADO_RANKING.puesto = nuevoPuesto;

    if (puestoAnterior !== nuevoPuesto) {
        ESTADO_RANKING.historial.push({
            anio: presidente.anioMandato,
            fecha: estadoLigas.fechaActual,
            puesto: nuevoPuesto,
            motivo: motivo,
            cambio: nuevoPuesto - puestoAnterior
        });
    }
}

function actualizarRankingPorAmistoso(resultado, fuerzaRival) {
    const gano = resultado.golesArg > resultado.golesRival;
    const empato = resultado.golesArg === resultado.golesRival;

    let categoriaRival = "medio";
    if (fuerzaRival >= 80) categoriaRival = "fuerte";
    else if (fuerzaRival <= 70) categoriaRival = "debil";

    let delta = 0;
    let motivo = "";

    if (gano) {
        if (categoriaRival === "fuerte") { delta = 1.5; motivo = "Victoria ante " + resultado.rival + " (rival fuerte)"; }
        else if (categoriaRival === "debil") { delta = 0.3; motivo = "Victoria ante " + resultado.rival + " (rival débil)"; }
        else { delta = 0.8; motivo = "Victoria ante " + resultado.rival; }
    } else if (empato) {
        if (categoriaRival === "fuerte") { delta = 0; motivo = "Empate ante " + resultado.rival; }
        else if (categoriaRival === "debil") { delta = -0.5; motivo = "Empate ante " + resultado.rival + " (rival débil)"; }
        else { delta = -0.2; motivo = "Empate ante " + resultado.rival; }
    } else {
        if (categoriaRival === "fuerte") { delta = -0.5; motivo = "Derrota ante " + resultado.rival + " (rival fuerte)"; }
        else if (categoriaRival === "debil") { delta = -2; motivo = "Derrota ante " + resultado.rival + " (rival débil)"; }
        else { delta = -1; motivo = "Derrota ante " + resultado.rival; }
    }

    ajustarRanking(delta, motivo);
}

function actualizarRankingPorCopa(posicion) {
    let delta = 0;
    let motivo = "";

    switch (posicion) {
        case "campeon": delta = 5; motivo = "Campeón de la Copa América"; break;
        case "subcampeon": delta = 2; motivo = "Subcampeón de la Copa América"; break;
        case "semifinales": delta = 0; motivo = "Semifinales de la Copa América"; break;
        case "cuartos": delta = -2; motivo = "Eliminado en cuartos de la Copa América"; break;
        case "grupos": delta = -5; motivo = "Eliminado en fase de grupos de la Copa América"; break;
    }

    ajustarRanking(delta, motivo);
}

function obtenerRanking() {
    return ESTADO_RANKING.puesto;
}

function obtenerHistorialRanking() {
    return ESTADO_RANKING.historial.slice(-5).reverse();
}