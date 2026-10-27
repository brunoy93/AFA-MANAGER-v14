// ============================================
// SONIDOS: efectos generados con Web Audio API
// ============================================
// No requiere archivos externos. Sonidos cortos y sutiles.

let audioContext = null;
let sonidoActivado = true;
let audioInicializado = false;

function initAudio() {
    if (audioInicializado) return;
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioInicializado = true;
    } catch (e) {
        sonidoActivado = false;
        audioInicializado = true;
    }
}

// Inicializa el audio al primer click del usuario
document.addEventListener("click", function() {
    if (!audioInicializado) initAudio();
}, { once: true });

// -----------------------------
// REPRODUCIR TONO
// -----------------------------

function reproducirTono(frecuencia, duracion, tipo, volumen) {
    if (!sonidoActivado) return;
    if (!audioInicializado) initAudio();
    if (!audioContext) return;

    try {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.type = tipo || "sine";
        osc.frequency.value = frecuencia;

        const vol = volumen || 0.05;
        gain.gain.setValueAtTime(vol, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duracion);

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.start();
        osc.stop(audioContext.currentTime + duracion);
    } catch (e) {
        // Silencioso
    }
}

// -----------------------------
// SONIDOS ESPECÍFICOS
// -----------------------------

function sonidoClick() {
    reproducirTono(600, 0.05, "sine", 0.03);
}

function sonidoPestania() {
    reproducirTono(500, 0.08, "sine", 0.04);
    setTimeout(function() { reproducirTono(700, 0.08, "sine", 0.03); }, 40);
}

function sonidoAvanzar() {
    reproducirTono(400, 0.1, "triangle", 0.05);
}

function sonidoDecision() {
    reproducirTono(700, 0.15, "sine", 0.05);
    setTimeout(function() { reproducirTono(900, 0.15, "sine", 0.04); }, 80);
}

function sonidoNoticia() {
    reproducirTono(800, 0.08, "sine", 0.03);
}

function sonidoExito() {
    reproducirTono(523, 0.15, "sine", 0.06);
    setTimeout(function() { reproducirTono(659, 0.15, "sine", 0.06); }, 100);
    setTimeout(function() { reproducirTono(784, 0.25, "sine", 0.06); }, 200);
}

function sonidoFracaso() {
    reproducirTono(400, 0.15, "sawtooth", 0.04);
    setTimeout(function() { reproducirTono(300, 0.25, "sawtooth", 0.04); }, 120);
}

function sonidoLogro() {
    reproducirTono(659, 0.12, "sine", 0.05);
    setTimeout(function() { reproducirTono(784, 0.12, "sine", 0.05); }, 100);
    setTimeout(function() { reproducirTono(1047, 0.3, "sine", 0.06); }, 200);
}

function sonidoEncuesta() {
    reproducirTono(440, 0.1, "sine", 0.04);
    setTimeout(function() { reproducirTono(550, 0.1, "sine", 0.04); }, 80);
}

function sonidoCopa() {
    reproducirTono(523, 0.12, "triangle", 0.06);
    setTimeout(function() { reproducirTono(659, 0.12, "triangle", 0.06); }, 90);
    setTimeout(function() { reproducirTono(784, 0.12, "triangle", 0.06); }, 180);
    setTimeout(function() { reproducirTono(1047, 0.3, "triangle", 0.07); }, 270);
}

function sonidoSponsor() {
    reproducirTono(880, 0.1, "sine", 0.05);
    setTimeout(function() { reproducirTono(1100, 0.15, "sine", 0.05); }, 90);
}

// -----------------------------
// CONTROL DE MUTE
// -----------------------------

function toggleMute() {
    sonidoActivado = !sonidoActivado;
    actualizarBotonMute();
    if (sonidoActivado) sonidoClick();
}

function actualizarBotonMute() {
    const boton = document.getElementById("btn-mute");
    if (!boton) return;
    boton.textContent = sonidoActivado ? "🔊" : "🔇";
    boton.title = sonidoActivado ? "Silenciar sonidos" : "Activar sonidos";
}