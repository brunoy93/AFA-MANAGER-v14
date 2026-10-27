// ============================================
// DIFICULTAD: tres formas de agarrar la AFA
// ============================================

const DIFICULTADES = {
    tranquila: {
        id: "tranquila",
        nombre: "Gestión tranquila",
        desc: "Más caja inicial, ingresos altos y una asamblea benévola. Para aprender el oficio.",
        cajaInicial: 13500,
        ingresos: 1.15,
        egresos: 0.92,
        agresividad: 0.75,
        umbralAsamblea: 0.42,
        censura: 0.04
    },
    real: {
        id: "real",
        nombre: "Presidencia real",
        desc: "El equilibrio justo: la AFA como está, con sus cuentas y sus dirigentes.",
        cajaInicial: 11000,
        ingresos: 1,
        egresos: 1,
        agresividad: 1,
        umbralAsamblea: 0.47,
        censura: 0.08
    },
    crisis: {
        id: "crisis",
        nombre: "Modo crisis",
        desc: "Caja justa, clubes impacientes y una asamblea que no perdona. Para los que ya saben.",
        cajaInicial: 8500,
        ingresos: 0.9,
        egresos: 1.08,
        agresividad: 1.3,
        umbralAsamblea: 0.52,
        censura: 0.12
    }
};

let dificultadActual = "real";

function Dificultad() {
    return DIFICULTADES[dificultadActual] || DIFICULTADES.real;
}

function cambiarDificultad(id) {
    if (!DIFICULTADES[id]) return;
    dificultadActual = id;
    if (typeof guardarPartida === "function") guardarPartida();
}
