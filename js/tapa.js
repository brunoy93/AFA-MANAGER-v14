// ============================================
// LA TAPA: el diario del día después
// ============================================

function generarTapa() {
    const fecha = estadoLigas.fechaActual - 1;
    const resultados = (estadoLigas.resultados.primera || [])[fecha];
    if (!resultados || !resultados.length) return null;

    const tabla = obtenerTablaOrdenada("primera");
    const lider = tabla[0];
    const polemica = resultados.filter(function(r) { return r.incidencia; })[0];
    const goleada = resultados.slice().sort(function(a, b) {
        const da = Math.abs(a.golesLocal - a.golesVisitante);
        const db = Math.abs(b.golesLocal - b.golesVisitante);
        if (db !== da) return db - da;
        return (b.golesLocal + b.golesVisitante) - (a.golesLocal + a.golesVisitante);
    })[0];

    if (polemica) {
        const fav = polemica.incidencia.clubFavorecidoId ? EQUIPOS[polemica.incidencia.clubFavorecidoId] : null;
        const frase = (fav && typeof fraseSecanuca === "function") ? fraseSecanuca(fav.id) : "";
        return {
            volanta: "POLÉMICA EN LA FECHA " + (fecha + 1),
            titulo: fav ? ("OTRO FAVOR PARA " + fav.nombre.toUpperCase()) : "OTRA POLÉMICA ARBITRAL",
            bajada: polemica.incidencia.descripcion + " " + frase,
            color: "#ff6f5e",
            fecha: fecha
        };
    }

    if (goleada && (goleada.golesLocal + goleada.golesVisitante) >= 4) {
        return {
            volanta: "FECHA " + (fecha + 1),
            titulo: goleada.local.toUpperCase() + " " + goleada.golesLocal + " - " + goleada.golesVisitante + " " + goleada.visitante.toUpperCase(),
            bajada: (lider ? lider.nombre + " sigue al frente con " + lider.Pts + " puntos." : "") + " La fecha dejó " +
                resultados.reduce(function(a, r) { return a + r.golesLocal + r.golesVisitante; }, 0) + " goles.",
            color: "#3ddc84",
            fecha: fecha
        };
    }

    return {
        volanta: "FECHA " + (fecha + 1),
        titulo: "LA PUNTA ES DE " + (lider ? lider.nombre.toUpperCase() : "NADIE"),
        bajada: lider ? (lider.nombre + " manda con " + lider.Pts + " puntos y " + lider.DG + " de diferencia de gol.") : "El torneo recién empieza.",
        color: "#f0c869",
        fecha: fecha
    };
}

function panelTapa() {
    const tapa = generarTapa();
    if (!tapa) {
        return vPanel("La Tapa", "diario", vVacio("diario", "Sin edición", "Jugá una fecha para ver el diario del día después."));
    }
    return vPanel("La Tapa", "diario",
        "<div class='tapa' style='--tapa:" + tapa.color + "'>" +
        "<div class='tapa-volanta'>" + escapar(tapa.volanta) + "</div>" +
        "<div class='tapa-titulo'>" + escapar(tapa.titulo) + "</div>" +
        "<div class='tapa-bajada'>" + escapar(tapa.bajada) + "</div>" +
        "<div class='tapa-pie'>AFA MANAGER · Edición " + (tapa.fecha + 1) + "</div>" +
        "</div>");
}
