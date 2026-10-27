// ============================================
// SECANUCA
// Secretaría de Control y Análisis de Niveles y Coeficientes AFA
// El índice de poder: quién se ve favorecido por las decisiones de la casa.
// ============================================

const estadoSecanuca = {
    puntos: {},
    eventos: []
};

const SECANUCA_TIPOS = {
    arbitral: { nombre: "Fallos arbitrales", color: "#ff6f5e" },
    institucional: { nombre: "Decisiones de la AFA", color: "#3ddc84" },
    mercado: { nombre: "Mercado y pases", color: "#6aa9ff" },
    escandalo: { nombre: "Escándalos", color: "#f0c869" }
};

function reiniciarSecanuca() {
    estadoSecanuca.puntos = {};
    estadoSecanuca.eventos = [];
}

function registroSecanuca(clubId) {
    const id = Number(clubId);
    if (!estadoSecanuca.puntos[id]) {
        estadoSecanuca.puntos[id] = { total: 0, arbitral: 0, institucional: 0, mercado: 0, escandalo: 0 };
    }
    return estadoSecanuca.puntos[id];
}

function registrarFavor(clubId, tipo, puntos, motivo) {
    if (!clubId || !EQUIPOS[clubId]) return;
    const r = registroSecanuca(clubId);
    if (r[tipo] == null) tipo = "institucional";
    r[tipo] += puntos;
    r.total += puntos;

    estadoSecanuca.eventos.push({
        clubId: Number(clubId),
        club: EQUIPOS[clubId].nombre,
        tipo: tipo,
        puntos: puntos,
        motivo: motivo || "",
        fecha: estadoLigas.fechaActual,
        anio: presidente.anioMandato
    });
    if (estadoSecanuca.eventos.length > 150) estadoSecanuca.eventos.shift();
}

function indiceSecanuca(clubId) {
    const r = estadoSecanuca.puntos[Number(clubId)];
    const total = r ? r.total : 0;
    return limitar(Math.round(50 + total * 1.1), 0, 100);
}

function rankingSecanuca(cantidad) {
    const ids = LIGAS.primera.equipos.slice();
    const lista = ids.map(function(id) {
        const r = registroSecanuca(id);
        return {
            id: Number(id),
            nombre: EQUIPOS[id].nombre,
            indice: indiceSecanuca(id),
            total: r.total,
            arbitral: r.arbitral,
            institucional: r.institucional,
            mercado: r.mercado,
            escandalo: r.escandalo
        };
    }).sort(function(a, b) { return b.indice - a.indice; });
    return cantidad ? lista.slice(0, cantidad) : lista;
}

function clubMasFavorecidoSecanuca() {
    return rankingSecanuca(1)[0] || null;
}

function clubMasFavorecidoDelAnio() {
    const delAnio = estadoSecanuca.eventos.filter(function(e) { return e.anio === presidente.anioMandato && e.tipo === "arbitral"; });
    if (!delAnio.length) return null;
    const conteo = {};
    delAnio.forEach(function(e) { conteo[e.clubId] = (conteo[e.clubId] || 0) + e.puntos; });
    const id = Object.keys(conteo).sort(function(a, b) { return conteo[b] - conteo[a]; })[0];
    return id ? { id: Number(id), nombre: EQUIPOS[id].nombre, puntos: conteo[id] } : null;
}

function eventosSecanuca(cantidad) {
    return estadoSecanuca.eventos.slice(-(cantidad || 8)).reverse();
}

function fraseSecanuca(clubId) {
    const idx = indiceSecanuca(clubId);
    const club = EQUIPOS[clubId] ? EQUIPOS[clubId].nombre : "el club";
    if (idx >= 75) return "Según el SECANUCA, " + club + " es el club más favorecido del torneo (índice " + idx + ").";
    if (idx >= 60) return "El SECANUCA ubica a " + club + " arriba en el índice de poder (" + idx + ").";
    if (idx >= 45) return "El SECANUCA mantiene a " + club + " en la media (" + idx + ").";
    return "El SECANUCA no registra favores relevantes para " + club + " (" + idx + ").";
}

function noticiaSecanuca(clubId, contexto) {
    const idx = indiceSecanuca(clubId);
    const club = EQUIPOS[clubId] ? EQUIPOS[clubId].nombre : "un club";
    const alto = idx >= 65;
    const titulo = alto
        ? "El SECANUCA no perdona: " + club + " manda en el índice de poder"
        : "El SECANUCA pone la lupa sobre " + club;
    const cuerpo = (contexto ? contexto + " " : "") + fraseSecanuca(clubId) +
        " El ranking mide fallos arbitrales, plata de la AFA, mercado y escándalos.";
    agregarNoticia(alto ? "Olé" : "Azz", titulo, cuerpo, alto ? "escandalo" : "critica");
    return { titulo: titulo, cuerpo: cuerpo };
}

function desgloseSecanuca(clubId) {
    const r = registroSecanuca(clubId);
    return [
        { tipo: "arbitral", nombre: SECANUCA_TIPOS.arbitral.nombre, valor: r.arbitral },
        { tipo: "institucional", nombre: SECANUCA_TIPOS.institucional.nombre, valor: r.institucional },
        { tipo: "mercado", nombre: SECANUCA_TIPOS.mercado.nombre, valor: r.mercado },
        { tipo: "escandalo", nombre: SECANUCA_TIPOS.escandalo.nombre, valor: r.escandalo }
    ];
}
