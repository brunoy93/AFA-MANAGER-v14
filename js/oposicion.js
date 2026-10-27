// ============================================
// OPOSICIÓN: el rival que te quiere sacar el sillón
// ============================================

const NOMBRES_RIVAL = [
    "Ricardo Bragagnolo", "Néstor Ferreyra", "Marta Villalba", "Eduardo Sarmiento",
    "Graciela Montes", "Hugo Peralta", "Silvia Ocampo", "Carlos Britos",
    "Alicia Ferro", "Roberto Maidana"
];

const PERFILES_RIVAL = [
    {
        id: "empresario",
        nombre: "El empresario",
        desc: "Dueño de una cadena de supermercados. Promete inversión privada y clubes SAD.",
        estilo: "tecnico",
        promesa: "Traer capital privado a todos los clubes"
    },
    {
        id: "interior",
        nombre: "La dirigente del interior",
        desc: "Presidenta de un club del Federal A. Habla de federalismo y de la plata de la TV.",
        estilo: "popular",
        promesa: "Repartir la TV en partes iguales"
    },
    {
        id: "exfutbolista",
        nombre: "El exfutbolista",
        desc: "Ídolo de un club grande. No tiene gestión, pero llena canchas y programas.",
        estilo: "emocional",
        promesa: "Volver a la Selección del 86"
    },
    {
        id: "abogado",
        nombre: "El abogado de los clubes",
        desc: "Especialista en derecho deportivo. Promete transparencia y estatutos nuevos.",
        estilo: "institucional",
        promesa: "Auditar todas las cuentas de la AFA"
    }
];

const estadoOposicion = {
    lider: null,
    ultimoDebate: null,
    historial: [],
    debate: null
};

function generarOposicion() {
    const perfil = elegir(PERFILES_RIVAL);
    estadoOposicion.lider = {
        nombre: elegir(NOMBRES_RIVAL),
        perfil: perfil.nombre,
        perfilId: perfil.id,
        desc: perfil.desc,
        estilo: perfil.estilo,
        promesa: perfil.promesa,
        fuerza: 38 + entre(0, 12)
    };
    estadoOposicion.ultimoDebate = null;
    estadoOposicion.historial = [];
    estadoOposicion.debate = null;
}

function fuerzaOposicion() {
    if (!estadoOposicion.lider) return 40;
    return limitar(Math.round(estadoOposicion.lider.fuerza), 0, 100);
}

function debateDelAnio() {
    const d = estadoOposicion.ultimoDebate;
    return !!(d && d.anio === presidente.anioMandato);
}

function actualizarOposicion() {
    const l = estadoOposicion.lider;
    if (!l) return;

    // El rival crece cuando estás flojo y se desinfla cuando te va bien.
    let delta = (50 - presidente.apoyoClubes) * 0.25;
    delta += (50 - presidente.prestigioInternacional) * 0.08;
    delta += estadoAsamblea.historial.filter(function(e) { return !e.gana; }).length * 2;
    delta -= (ConfianzaConsejo() - 50) * 0.15;
    delta += estadoFinanzas.libro.filter(function(x) { return x.concepto && x.concepto.indexOf("Escándalo") !== -1; }).length * 2;
    delta += entre(-4, 4);
    l.fuerza = limitar(l.fuerza + delta, 5, 95);
}

// Penalización porcentual a la proyección por un rival fuerte.
function bonoOposicionAsamblea() {
    if (!estadoOposicion.lider) return 0;
    return -Math.max(0, (fuerzaOposicion() - 45) / 100 * 0.55);
}

function bonoDebate() {
    const d = estadoOposicion.ultimoDebate;
    if (!d || d.anio !== presidente.anioMandato) return 0;
    if (d.gana) return 0.035;
    if (d.empate) return 0;
    return -0.025;
}

// -----------------------------
// DEBATE
// -----------------------------

const PREGUNTAS_DEBATE = [
    {
        texto: "La caja de la AFA no alcanza. ¿Qué vas a hacer?",
        opciones: [
            { texto: "Mostrar los números y ajustar el gasto", estilo: "tecnico", efectos: { apoyo: 1, prestigio: 2 }, puntos: 2 },
            { texto: "Prometer una lluvia de obras para todos", estilo: "popular", efectos: { apoyo: 3, prestigio: -2 }, puntos: 3 },
            { texto: "Responsabilizar a la gestión anterior", estilo: "agresivo", efectos: { apoyo: -1 }, puntos: 1 }
        ]
    },
    {
        texto: "Los clubes del Interior dicen que la AFA los ignora. ¿Qué les decís?",
        opciones: [
            { texto: "Anunciar un fondo federal permanente", estilo: "popular", efectos: { apoyo: 4, dinero: -300 }, puntos: 3 },
            { texto: "Explicar el reparto con planilla en mano", estilo: "tecnico", efectos: { prestigio: 2 }, puntos: 2 },
            { texto: "Acusarlos de querer voltearte", estilo: "agresivo", efectos: { apoyo: -3 }, puntos: 1 }
        ]
    },
    {
        texto: "Hay denuncias de corrupción en la AFA. ¿Cómo respondés?",
        opciones: [
            { texto: "Pedir una auditoría externa ya mismo", estilo: "institucional", efectos: { prestigio: 3, dinero: -200 }, puntos: 3 },
            { texto: "Defender tu gestión y atacar a la prensa", estilo: "agresivo", efectos: { prestigio: -3, apoyo: 1 }, puntos: 1 },
            { texto: "Hablar con los clubes y mostrarte cerca", estilo: "emocional", efectos: { apoyo: 2 }, puntos: 2 }
        ]
    },
    {
        texto: "La Selección perdió y la prensa pide cabezas. ¿Qué hacés?",
        opciones: [
            { texto: "Bancar al DT en público", estilo: "emocional", efectos: { apoyo: 2, prestigio: -1 }, puntos: 2 },
            { texto: "Revisar el proyecto con datos", estilo: "tecnico", efectos: { prestigio: 2 }, puntos: 2 },
            { texto: "Echar al DT para calmar las aguas", estilo: "institucional", efectos: { apoyo: 3, prestigio: -2 }, puntos: 3 }
        ]
    },
    {
        texto: "Te preguntan por el VAR y los errores arbitrales. ¿Qué contestás?",
        opciones: [
            { texto: "Prometer VAR en todas las canchas", estilo: "popular", efectos: { apoyo: 3, dinero: -400 }, puntos: 3 },
            { texto: "Mostrar los datos de aciertos", estilo: "tecnico", efectos: { prestigio: 2 }, puntos: 2 },
            { texto: "Decir que los árbitros son intocables", estilo: "agresivo", efectos: { apoyo: -2 }, puntos: 0 }
        ]
    }
];

function humorDelPublico() {
    if (presidente.dineroEnCaja < 3500) return { id: "tecnico", texto: "La gente quiere gestión y plata.", color: "#f0c869" };
    if (presidente.apoyoClubes < 45) return { id: "popular", texto: "La gente quiere que los clubes te sientan cerca.", color: "#3ddc84" };
    if (presidente.prestigioInternacional < 45) return { id: "institucional", texto: "El ambiente pide transparencia.", color: "#6aa9ff" };
    return { id: "emocional", texto: "El público está eufórico: quiere épica.", color: "#b18cff" };
}

function iniciarDebate() {
    const preguntas = barajar(PREGUNTAS_DEBATE).slice(0, 3);
    estadoOposicion.debate = {
        ronda: 0,
        puntos: 0,
        puntosRival: 0,
        preguntas: preguntas,
        humor: humorDelPublico(),
        fase: "pregunta",
        historial: [],
        gano: null,
        empate: null
    };
    return estadoOposicion.debate;
}

function responderDebate(idx) {
    const d = estadoOposicion.debate;
    if (!d || d.fase !== "pregunta") return null;
    const pregunta = d.preguntas[d.ronda];
    const op = pregunta.opciones[idx];
    if (!op) return null;

    // El rival elige su respuesta según su estilo
    const estiloRival = estadoOposicion.lider.estilo;
    const preferidas = pregunta.opciones.filter(function(o) { return o.estilo === estiloRival; });
    const eleccionRival = preferidas.length ? preferidas[0] : elegir(pregunta.opciones);

    let puntosJugador = op.puntos;
    if (op.estilo === d.humor.id) puntosJugador += 2;

    let puntosRival = eleccionRival.puntos;
    if (eleccionRival.estilo === d.humor.id) puntosRival += 2;
    puntosRival += Math.round(fuerzaOposicion() / 45);

    d.puntos += puntosJugador;
    d.puntosRival += puntosRival;
    d.ronda++;
    d.historial.push({ jugador: op.texto, rival: eleccionRival.texto, puntos: puntosJugador, puntosRival: puntosRival });

    aplicarEfectosDebate(op.efectos);

    if (d.ronda >= d.preguntas.length) {
        terminarDebate();
    }
    return { opcion: op, rival: eleccionRival, puntosJugador: puntosJugador, puntosRival: puntosRival };
}

function aplicarEfectosDebate(efectos) {
    if (efectos.apoyo) ajustarApoyo(efectos.apoyo, "Debate electoral");
    if (efectos.prestigio) ajustarPrestigio(efectos.prestigio, "Debate electoral");
    if (efectos.dinero) ajustarDinero(efectos.dinero, "Debate electoral");
}

function terminarDebate() {
    const d = estadoOposicion.debate;
    if (!d) return;
    d.fase = "fin";
    if (d.puntos > d.puntosRival) { d.gano = true; d.empate = false; }
    else if (d.puntos === d.puntosRival) { d.gano = false; d.empate = true; }
    else { d.gano = false; d.empate = false; }

    if (d.gano) {
        ajustarApoyo(2, "Ganaste el debate");
        ajustarPrestigio(2, "Ganaste el debate");
    } else if (d.empate) {
        ajustarApoyo(0, "Debate empatado");
    } else {
        ajustarApoyo(-2, "Perdiste el debate");
        ajustarPrestigio(-1, "Perdiste el debate");
    }

    estadoOposicion.ultimoDebate = {
        anio: presidente.anioMandato,
        puntos: d.puntos,
        puntosRival: d.puntosRival,
        gana: d.gano,
        empate: d.empate
    };
    estadoOposicion.historial.push(estadoOposicion.ultimoDebate);

    if (typeof revisarLogros === "function") revisarLogros();
}
