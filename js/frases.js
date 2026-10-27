// ============================================
// FRASES: toques argentinos sutiles
// ============================================

const FRASES = {
    exito: [
        "¡Vamooo!",
        "¡Qué grande!",
        "¡De no creer!",
        "¡Dale que va!",
        "¡Tremendo!",
        "¡Increíble!",
        "¡Una locura!",
        "¡No lo puedo creer!"
    ],
    fracaso: [
        "Uh, la p...",
        "No da...",
        "Qué papelón...",
        "Se pinchó...",
        "No puede ser...",
        "Qué desastre...",
        "Se nos escapó...",
        "Duele, che..."
    ],
    alerta: [
        "Ojo al piojo...",
        "Atenti...",
        "Mucho cuidado...",
        "Se viene la mano...",
        "Acá hay algo raro...",
        "No me gusta nada esto..."
    ],
    neutro: [
        "Seguimos...",
        "A laburar...",
        "Dale que va...",
        "Vamos por más...",
        "Paso a paso...",
        "Todo tranquilo..."
    ],
    copa: [
        "¡La Copa es nuestra!",
        "¡Dale campeón!",
        "¡Olé, olé, olé!",
        "¡Vamos Argentina!",
        "¡Qué lindo, che!"
    ],
    ranking: [
        "Estamos en la cima del mundo.",
        "Hay que remontar. A laburar.",
        "El ranking no miente.",
        "Cada puesto cuenta."
    ],
    rescate: [
        "Otra vez sopa...",
        "Esto se va a saber...",
        "La prensa no perdona.",
        "Los clubes toman nota."
    ]
};

function fraseAlAzar(tipo) {
    const lista = FRASES[tipo] || FRASES.neutro;
    return lista[Math.floor(Math.random() * lista.length)];
}

// -----------------------------
// FRASES CONTEXTUALES
// -----------------------------

function fraseCopaCampeon() { return fraseAlAzar("copa"); }
function fraseCopaSubcampeon() { return "Cerca, pero no alcanzó. La próxima."; }
function fraseCopaEliminado() { return "Uh, la p... Qué dolor."; }
function fraseRankingTop() { return "Estamos en la cima del mundo."; }
function fraseRankingBajo() { return "Hay que remontar. A laburar."; }
function fraseApoyoBajo() { return "Los clubes están que trinan..."; }
function fraseApoyoAlto() { return "Todo tranquilo por suerte."; }
function fraseRescate() { return fraseAlAzar("rescate"); }
function fraseExito() { return fraseAlAzar("exito"); }
function fraseFracaso() { return fraseAlAzar("fracaso"); }
function fraseAlerta() { return fraseAlAzar("alerta"); }
function fraseNeutro() { return fraseAlAzar("neutro"); }