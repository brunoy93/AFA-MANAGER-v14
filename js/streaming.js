// ============================================
// STREAMING: los que opinan y mueven la aguja
// ============================================

const STREAMERS = [
    { id: "azz", nombre: "Azz", perfil: "El irónico", seguidores: 820, opinion: 50, color: "#3ddc84", estilo: "ironico" },
    { id: "picado", nombre: "Picado TV", perfil: "El picante", seguidores: 640, opinion: 50, color: "#ff8fb1", estilo: "picante" },
    { id: "davox", nombre: "Davoxneize", perfil: "El analítico", seguidores: 410, opinion: 55, color: "#6aa9ff", estilo: "analitico" },
    { id: "cobra", nombre: "La Cobra", perfil: "El ácido", seguidores: 950, opinion: 45, color: "#ff6f5e", estilo: "acido" }
];

const estadoStreaming = {
    clips: [],
    ultimoStreamer: null
};

function streamerPorId(id) {
    return STREAMERS.filter(function(s) { return s.id === id; })[0];
}

function ajustarOpinionStreamer(id, delta) {
    const s = streamerPorId(id);
    if (!s) return;
    s.opinion = limitar(s.opinion + delta, 0, 100);
}

function reiniciarStreaming() {
    STREAMERS.forEach(function(s) { s.opinion = 48 + entre(0, 8); });
    estadoStreaming.clips = [];
    estadoStreaming.ultimoStreamer = null;
}

function opinionStreamingMedia() {
    let total = 0;
    let peso = 0;
    STREAMERS.forEach(function(s) {
        total += s.opinion * s.seguidores;
        peso += s.seguidores;
    });
    return Math.round(total / (peso || 1));
}

function ultimaIncidenciaReciente() {
    if (typeof incidenciasHistoricas === "undefined" || !incidenciasHistoricas.length) return null;
    const inc = incidenciasHistoricas[incidenciasHistoricas.length - 1];
    if (inc.fecha !== estadoLigas.fechaActual - 1) return null;
    return inc;
}

function contextoStreaming() {
    const temas = [];
    const inc = ultimaIncidenciaReciente();
    if (inc) temas.push("arbitro");
    if (estadoMercado.historial.length && estadoMercado.historial[estadoMercado.historial.length - 1].anio === presidente.anioMandato) temas.push("mercado");
    if (presidente.apoyoClubes < 45) temas.push("crisis");
    if (presidente.prestigioInternacional >= 65) temas.push("prestigio");
    if (estadoLigas.fechaActual > 5) temas.push("tabla");
    temas.push("gestion");
    return elegir(temas);
}

function clipDe(tema) {
    const inc = ultimaIncidenciaReciente();
    const lider = typeof obtenerTablaOrdenada === "function" ? obtenerTablaOrdenada("primera")[0] : null;
    const ultimo = estadoStreaming.clips[estadoStreaming.clips.length - 1];

    let variantes = [];

    if (tema === "arbitro" && inc) {
        variantes = [
            { titulo: "LA POLEMICA DEL FIN DE SEMANA", texto: inc.descripcion + " " + (inc.clubFavorecidoId && EQUIPOS[inc.clubFavorecidoId] ? "Se benefició " + EQUIPOS[inc.clubFavorecidoId].nombre + "." : ""), tono: "negativo" },
            { titulo: "OTRA VEZ LOS ARBITROS", texto: "Otra fecha, otra polémica: " + inc.descripcion, tono: "negativo" },
            { titulo: "EL VAR NO ALCANZA", texto: "Con este nivel de errores, ni el VAR te salva. " + inc.descripcion, tono: "negativo" }
        ];
    } else if (tema === "mercado") {
        const op = estadoMercado.historial[estadoMercado.historial.length - 1];
        const figura = op ? op.figura : "la joya";
        const comprador = op ? op.comprador : "Europa";
        variantes = [
            { titulo: "SE LLEVARON A " + figura.toUpperCase(), texto: "La venta de " + figura + " a " + comprador + " deja a los clubes sin su mejor carta.", tono: "negativo" },
            { titulo: "MERCADO ABIERTO: " + comprador.toUpperCase() + " COMPRA ARGENTINO", texto: "Otra figura del torneo local se va al exterior. Los hinchas, hartos.", tono: "negativo" },
            { titulo: "PLATA POR JOYAS", texto: "La AFA cobra la solidaridad, pero el club pierde a " + figura + ". ¿Quién gana?", tono: "neutral" }
        ];
    } else if (tema === "crisis") {
        variantes = [
            { titulo: "LA GESTION NO DA MAS", texto: "Con " + presidente.apoyoClubes + " puntos de apoyo, los clubes ya hablan de moción.", tono: "negativo" },
            { titulo: "SE LE ACABA EL TIEMPO AL PRESIDENTE", texto: "Los pasillos de la AFA piden una salida. El apoyo está en " + presidente.apoyoClubes + ".", tono: "negativo" },
            { titulo: "¿HASTA CUANDO?", texto: "La asamblea mira de reojo. " + presidente.apoyoClubes + " de apoyo es poco para tanto ruido.", tono: "negativo" }
        ];
    } else if (tema === "prestigio") {
        variantes = [
            { titulo: "EL FUTBOL ARGENTINO VUELVE A MANDAR", texto: "Con prestigio " + presidente.prestigioInternacional + ", la AFA recuperó respeto internacional.", tono: "positivo" },
            { titulo: "AFUERA NOS RESPETAN", texto: "Europa habla bien del fútbol argentino. Prestigio " + presidente.prestigioInternacional + " y subiendo.", tono: "positivo" },
            { titulo: "EL SELLO DEL PRESIDENTE", texto: "La gestión empieza a dejar marca: prestigio " + presidente.prestigioInternacional + ".", tono: "positivo" }
        ];
    } else if (tema === "tabla" && lider) {
        variantes = [
            { titulo: lider.nombre.toUpperCase() + " ES EL NUEVO CANDIDATO", texto: "El equipo de " + lider.nombre + " lidera con " + lider.Pts + " puntos y la gente sueña.", tono: "neutral" },
            { titulo: "LA PUNTA ES DE " + lider.nombre.toUpperCase(), texto: "Con " + lider.Pts + " puntos, " + lider.nombre + " manda en el torneo. El resto, a la caza.", tono: "neutral" },
            { titulo: "ASI ESTA EL TORNEO", texto: lider.nombre + " lidera con " + lider.Pts + ". Atrás, todos se pisan.", tono: "neutral" }
        ];
    } else {
        variantes = [
            { titulo: "LA GESTION, EN LA GRILLA", texto: "Se habla de todo: de la caja, de los árbitros y de la Selección.", tono: "neutral" },
            { titulo: "RADIOGRAFIA DE LA AFA", texto: "Apoyo " + presidente.apoyoClubes + ", prestigio " + presidente.prestigioInternacional + " y una caja de " + fmt.plata(presidente.dineroEnCaja) + ".", tono: "neutral" },
            { titulo: "TODO SIGUE IGUAL", texto: "Sin sobresaltos en la AFA. Los clubes esperan definiciones.", tono: "neutral" }
        ];
    }

    // Evitar repetir el título del clip anterior
    let disponibles = variantes.filter(function(v) { return !ultimo || v.titulo !== ultimo.titulo; });
    if (!disponibles.length) disponibles = variantes;
    return elegir(disponibles);
}

function generarClipStreaming() {
    const tema = contextoStreaming();
    const streamer = elegir(STREAMERS);
    const base = clipDe(tema);

    // El estilo del streamer define el tono final
    let tono = base.tono;
    if (streamer.estilo === "acido") tono = probabilidad(0.75) ? "negativo" : tono;
    if (streamer.estilo === "ironico" && tono === "neutral") tono = probabilidad(0.5) ? "negativo" : "positivo";
    if (streamer.estilo === "analitico") tono = probabilidad(0.6) ? "neutral" : tono;

    const clip = {
        streamerId: streamer.id,
        streamer: streamer.nombre,
        perfil: streamer.perfil,
        color: streamer.color,
        titulo: base.titulo,
        texto: base.texto,
        tono: tono,
        anio: presidente.anioMandato,
        fecha: estadoLigas.fechaActual,
        alcance: streamer.seguidores + entre(0, 200)
    };

    // Efectos: el alcance modula el golpe
    const fuerza = clip.alcance > 900 ? 2 : 1;
    if (tono === "negativo") {
        ajustarOpinionStreamer(streamer.id, -4);
        if (probabilidad(0.6)) ajustarApoyo(-fuerza, "Streaming: " + streamer.nombre);
        if (probabilidad(0.35)) ajustarPrestigio(-1, "Streaming: " + streamer.nombre);
        clip.efecto = "-" + fuerza + " apoyo";
    } else if (tono === "positivo") {
        ajustarOpinionStreamer(streamer.id, 4);
        if (probabilidad(0.55)) ajustarApoyo(fuerza, "Streaming: " + streamer.nombre);
        if (probabilidad(0.3)) ajustarPrestigio(1, "Streaming: " + streamer.nombre);
        clip.efecto = "+" + fuerza + " apoyo";
    } else {
        clip.efecto = "sin cambio";
    }

    estadoStreaming.clips.push(clip);
    if (estadoStreaming.clips.length > 30) estadoStreaming.clips.shift();
    estadoStreaming.ultimoStreamer = streamer.id;

    return clip;
}

function clipSobreArbitro(incidencia) {
    const streamer = elegir(STREAMERS.filter(function(s) { return s.estilo === "acido" || s.estilo === "picante"; }));
    const frase = (typeof fraseSecanuca === "function" && incidencia.clubFavorecidoId)
        ? " " + fraseSecanuca(incidencia.clubFavorecidoId)
        : "";
    const clip = {
        streamerId: streamer.id,
        streamer: streamer.nombre,
        perfil: streamer.perfil,
        color: streamer.color,
        titulo: "LA COBRA Vs. EL ARBITRO",
        texto: incidencia.descripcion + frase,
        tono: "negativo",
        anio: presidente.anioMandato,
        fecha: estadoLigas.fechaActual,
        alcance: streamer.seguidores + 300,
        efecto: "-1 apoyo"
    };
    ajustarOpinionStreamer(streamer.id, -5);
    estadoStreaming.clips.push(clip);
    if (estadoStreaming.clips.length > 30) estadoStreaming.clips.shift();
    return clip;
}

function clipsStreaming(cantidad) {
    return estadoStreaming.clips.slice(-(cantidad || 6)).reverse();
}
