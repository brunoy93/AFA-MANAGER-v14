// ============================================
// CONSEJO DIRECTIVO: la mesa chica que te sostiene
// ============================================
// Cinco consejeros con área e intereses. Su confianza condiciona
// la asamblea, el crédito y el riesgo de moción de censura.

const AREAS_CONSEJO = {
    institucional: { id: "institucional", nombre: "Institucional", color: "#6aa9ff" },
    economico: { id: "economico", nombre: "Económico", color: "#f0c869" },
    deportivo: { id: "deportivo", nombre: "Deportivo", color: "#3ddc84" },
    federal: { id: "federal", nombre: "Federal", color: "#b18cff" },
    mediatico: { id: "mediatico", nombre: "Mediático", color: "#ff8fb1" }
};

let miembrosConsejo = [];

function reiniciarConsejo() {
    miembrosConsejo = [
        {
            id: "ines",
            nombre: "Inés Barreiro",
            rol: "Vicepresidenta",
            area: "institucional",
            peso: 1.2,
            confianza: 58,
            avatar: "IB",
            fraseAlta: "El estatuto se respeta. Así se gobierna.",
            fraseMedia: "Vamos a necesitar prolijidad, presidente.",
            fraseBaja: "Esto no lo firmo."
        },
        {
            id: "beto",
            nombre: "Alberto Kohan",
            rol: "Tesorero",
            area: "economico",
            peso: 1.3,
            confianza: 55,
            avatar: "AK",
            fraseAlta: "Las cuentas cierran. Eso es todo lo que pido.",
            fraseMedia: "La caja está justa. Cuidemos cada peso.",
            fraseBaja: "Con este ritmo no llegamos a diciembre."
        },
        {
            id: "ricardo",
            nombre: "Ricardo Salas",
            rol: "Secretario deportivo",
            area: "deportivo",
            peso: 1.1,
            confianza: 52,
            avatar: "RS",
            fraseAlta: "El fútbol se juega en la cancha y se gana.",
            fraseMedia: "Los resultados mandan, siempre.",
            fraseBaja: "Así no competimos en la Libertadores."
        },
        {
            id: "carmen",
            nombre: "Carmen Luna",
            rol: "Consejo Federal",
            area: "federal",
            peso: 1.2,
            confianza: 54,
            avatar: "CL",
            fraseAlta: "El interior también es Argentina.",
            fraseMedia: "Los clubes chicos necesitan respuestas.",
            fraseBaja: "Buenos Aires no es todo el país, presidente."
        },
        {
            id: "julio",
            nombre: "Julio Paredes",
            rol: "Prensa y comunicación",
            area: "mediatico",
            peso: 0.9,
            confianza: 50,
            avatar: "JP",
            fraseAlta: "Hoy los medios hablan bien de vos.",
            fraseMedia: "Cuidado con lo que decís en cámara.",
            fraseBaja: "Estamos en todos los titulares. Mal."
        }
    ];
}

function consejeroPorArea(area) {
    for (let i = 0; i < miembrosConsejo.length; i++) {
        if (miembrosConsejo[i].area === area) return miembrosConsejo[i];
    }
    return null;
}

function ConfianzaConsejo() {
    if (!miembrosConsejo.length) reiniciarConsejo();
    let total = 0;
    let pesos = 0;
    miembrosConsejo.forEach(function(m) {
        total += m.confianza * m.peso;
        pesos += m.peso;
    });
    return Math.round(total / (pesos || 1));
}

function confianzaArea(area) {
    const m = consejeroPorArea(area);
    return m ? Math.round(m.confianza) : 50;
}

function ajustarConfianzaArea(area, delta, motivo) {
    const m = consejeroPorArea(area);
    if (!m || !delta) return;
    m.confianza = limitar(m.confianza + delta, 0, 100);
    m.ultimoCambio = { delta: delta, motivo: motivo || "Gestión" };
}

function ajustarConfianzaTodos(delta, motivo) {
    miembrosConsejo.forEach(function(m) {
        m.confianza = limitar(m.confianza + delta, 0, 100);
        m.ultimoCambio = { delta: delta, motivo: motivo || "Gestión" };
    });
}

// -----------------------------
// REACCIÓN A UNA DECISIÓN
// -----------------------------

function reaccionConsejo(decision, deltas) {
    const apoyo = deltas.apoyo || 0;
    const prestigio = deltas.prestigio || 0;
    const dinero = deltas.dinero || 0;
    const categoria = decision.categoria || "institucional";

    ajustarConfianzaArea("institucional", Math.round(apoyo * 0.8), decision.titulo);
    ajustarConfianzaArea("federal", Math.round(apoyo * 0.5), decision.titulo);
    ajustarConfianzaArea("economico", Math.round(limitar(dinero / 300, -10, 10)), decision.titulo);
    ajustarConfianzaArea("mediatico", Math.round(prestigio * 0.7), decision.titulo);
    ajustarConfianzaArea("deportivo", Math.round(prestigio * 0.35), decision.titulo);

    // El área dueña de la decisión pesa más
    if (AREAS_CONSEJO[categoria]) {
        ajustarConfianzaArea(categoria, deltas.categoria || 2, decision.titulo);
    }
}

// -----------------------------
// DERIVA POR FECHA
// -----------------------------

function actualizarConsejoFecha() {
    if (!miembrosConsejo.length) reiniciarConsejo();

    const caja = presidente.dineroEnCaja;
    const apoyo = presidente.apoyoClubes;
    const prestigio = presidente.prestigioInternacional;
    const ranking = (typeof obtenerRanking === "function") ? obtenerRanking() : 6;
    const fundidos = (typeof obtenerClubesConDeuda === "function")
        ? obtenerClubesConDeuda().filter(function(c) { return c.nivel === "fundido" || c.nivel === "crisis"; }).length
        : 0;
    const rescates = (typeof estadoFinanzas !== "undefined")
        ? Object.keys(estadoFinanzas.rescates).length : 0;

    const objetivos = {
        economico: 50 + limitar((caja - 9000) / 260, -22, 22),
        deportivo: 46 + limitar((prestigio - 50) * 0.6, -18, 18) + (ranking <= 3 ? 6 : ranking >= 10 ? -8 : 0),
        federal: 46 + limitar((apoyo - 50) * 0.55, -20, 20) + rescates * 3 - fundidos * 5,
        institucional: 42 + limitar((apoyo - 50) * 0.7, -22, 22),
        mediatico: 46 + limitar((prestigio - 50) * 0.5, -18, 18) + (typeof relacionPrensaMedia === "function" ? (relacionPrensaMedia() - 50) * 0.35 : 0)
    };

    miembrosConsejo.forEach(function(m) {
        const objetivo = limitar(objetivos[m.area], 5, 95);
        const paso = (objetivo - m.confianza) * 0.16;
        m.confianza = limitar(m.confianza + paso, 0, 100);
    });
}

// -----------------------------
// ESTADO Y RIESGO
// -----------------------------

function estadoConfianza(valor) {
    const v = valor == null ? ConfianzaConsejo() : valor;
    if (v >= 75) return { nivel: "blindado", etiqueta: "Blindado", color: "#3ddc84", desc: "El consejo te banca de punta a punta." };
    if (v >= 60) return { nivel: "fuerte", etiqueta: "Fuerte", color: "#8ee6a8", desc: "Hay respaldo, pero no para dormirse." };
    if (v >= 45) return { nivel: "estable", etiqueta: "Estable", color: "#f0c869", desc: "Cada decisión puede inclinar la balanza." };
    if (v >= 30) return { nivel: "tenso", etiqueta: "Tenso", color: "#ffa06e", desc: "Los consejeros empezaron a hablar entre ellos." };
    return { nivel: "en llamas", etiqueta: "En llamas", color: "#ff6f5e", desc: "Te están midiendo para la moción de censura." };
}

function riesgoCensura() {
    const conf = ConfianzaConsejo();
    if (conf >= 32) return 0;
    const base = (32 - conf) / 100;
    return limitar(base * Dificultad().censura * 7, 0, 0.4);
}

function fraseDelConsejero(m) {
    if (m.confianza >= 65) return m.fraseAlta;
    if (m.confianza >= 40) return m.fraseMedia;
    return m.fraseBaja;
}

// -----------------------------
// EFECTOS DE CONFIANZA
// -----------------------------

function bonoConsejoAsamblea() {
    // puntos porcentuales extra de voto
    const conf = ConfianzaConsejo();
    if (conf >= 75) return 4;
    if (conf >= 65) return 2;
    if (conf < 35) return -3;
    return 0;
}

function tasaPrestamo() {
    const base = 0.055;
    const conf = ConfianzaConsejo();
    if (conf >= 70) return base - 0.012;
    if (conf < 40) return base + 0.018;
    return base;
}
