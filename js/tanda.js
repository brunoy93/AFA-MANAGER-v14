// ============================================
// TANDA DE PENALES: el minijuego de la gloria
// ============================================

let estadoTanda = null;

const DIRECCIONES = [
    { id: "izq", nombre: "Izquierda", x: 20 },
    { id: "centro", nombre: "Centro", x: 50 },
    { id: "der", nombre: "Derecha", x: 80 }
];

function abrirTanda(opciones) {
    const opt = opciones || {};
    estadoTanda = {
        opciones: opt,
        ronda: 1,
        golJugador: 0,
        golRival: 0,
        tiros: [],
        fase: "patear",
        mensaje: "Elegí dónde patear."
    };

    UI.modal({
        id: "tanda",
        eyebrow: opt.eyebrow || "Tanda de penales",
        titulo: opt.titulo || "Argentina vs. el mundo",
        sub: opt.sub || "Cinco penales para entrar en la historia.",
        ancho: "ancho",
        cerrable: false,
        cuerpo: "<div id='tanda-cuerpo'>" + htmlTanda() + "</div>"
    });
}

function htmlTanda() {
    const st = estadoTanda;
    if (!st) return "";

    if (st.fase === "fin") {
        return "<div class='tanda-final'>" +
            "<div class='tanda-final-marca " + (st.resultado === "gana" ? "pos" : "neg") + "'>" +
            (st.resultado === "gana" ? "GANASTE" : "PERDISTE") + "</div>" +
            "<div class='tanda-marcador-final'>" + st.golJugador + " - " + st.golRival + "</div>" +
            "<p class='suave'>" + st.mensaje + "</p>" +
            "<button class='btn-primario' data-accion='tanda-cerrar'>Continuar</button>" +
            "</div>";
    }

    const esPatear = st.fase === "patear";
    const botones = DIRECCIONES.map(function(d) {
        return "<button class='tanda-boton' data-accion='tanda-jugar' data-dir='" + d.id + "'>" + d.nombre + "</button>";
    }).join("");

    return "<div class='tanda'>" +
        "<div class='tanda-marcador'>" +
        "<span>" + (st.opciones.equipo || "Argentina") + "</span>" +
        "<strong>" + st.golJugador + " - " + st.golRival + "</strong>" +
        "<span>" + (st.opciones.rival || "Rival") + "</span>" +
        "</div>" +
        "<div class='tanda-cancha'>" +
        "<div class='tanda-arco'>" +
        "<span class='tanda-red'></span>" +
        "<span class='tanda-arquero' id='tanda-arquero'></span>" +
        "</div>" +
        "<span class='tanda-pelota' id='tanda-pelota'></span>" +
        "<div class='tanda-punto'></div>" +
        "</div>" +
        "<div class='tanda-instruccion'>" + (esPatear ? "Pateás vos" : "Atajás vos") + " · Ronda " + st.ronda + "</div>" +
        "<div class='tanda-mensaje' id='tanda-mensaje'>" + st.mensaje + "</div>" +
        "<div class='tanda-botones'>" + botones + "</div>" +
        "</div>";
}

function actualizarTanda() {
    const cuerpo = document.getElementById("tanda-cuerpo");
    if (cuerpo) cuerpo.innerHTML = htmlTanda();
}

function animarTiro(dir, arqueroDir, resultado) {
    const pelota = document.getElementById("tanda-pelota");
    const arquero = document.getElementById("tanda-arquero");
    if (!pelota) return;

    const destinoX = { izq: 20, centro: 50, der: 80 }[dir];
    const arqueroX = { izq: 24, centro: 50, der: 76 }[arqueroDir];

    pelota.style.transform = "translate(" + (destinoX - 50) * 2.1 + "px, -86px) scale(.75)";
    pelota.style.opacity = "1";
    if (arquero) {
        arquero.style.transform = "translateX(" + (arqueroX - 50) * 1.9 + "px) rotate(" + (arqueroDir === "centro" ? 0 : arqueroDir === "izq" ? -14 : 14) + "deg)";
        arquero.style.background = resultado === "atajada" ? "rgba(61,220,132,.35)" : "rgba(255,255,255,.12)";
    }
}

function tandaJugar(dir) {
    const st = estadoTanda;
    if (!st || (st.fase !== "patear" && st.fase !== "atajar")) return;
    const mensaje = document.getElementById("tanda-mensaje");

    if (st.fase === "patear") {
        const arqueroDir = elegir(["izq", "centro", "der"]);
        const atajada = arqueroDir === dir ? probabilidad(0.62) : probabilidad(0.12);
        animarTiro(dir, arqueroDir, atajada ? "atajada" : "gol");
        st.fase = "esperando";
        setTimeout(function() {
            if (atajada) {
                st.mensaje = "¡Te atajó! El arquero adivinó.";
                st.tiros.push({ quien: "jugador", dir: dir, gol: false });
            } else {
                st.golJugador++;
                st.mensaje = "¡Gol! La clavaste contra la red.";
                st.tiros.push({ quien: "jugador", dir: dir, gol: true });
            }
            st.fase = "atajar";
            actualizarTanda();
            if (typeof sonidoCopa === "function") sonidoCopa();
        }, 820);
        return;
    }

    // Ataja el jugador
    const rivalDir = elegir(["izq", "centro", "der"]);
    const atajada = rivalDir === dir ? probabilidad(0.68) : probabilidad(0.2);
    animarTiro(rivalDir, dir, atajada ? "atajada" : "gol");
    st.fase = "esperando";
    setTimeout(function() {
        if (atajada) {
            st.mensaje = "¡La sacaste! Voló el palo.";
            st.tiros.push({ quien: "rival", dir: rivalDir, gol: false });
        } else {
            st.golRival++;
            st.mensaje = "Gol del rival. Te tiraste al otro lado.";
            st.tiros.push({ quien: "rival", dir: rivalDir, gol: true });
        }
        st.ronda++;
        st.fase = "patear";
        if (evaluarFinTanda()) return;
        actualizarTanda();
    }, 820);
}

function evaluarFinTanda() {
    const st = estadoTanda;
    if (!st) return true;

    const tirosJugador = st.tiros.filter(function(t) { return t.quien === "jugador"; }).length;
    const tirosRival = st.tiros.filter(function(t) { return t.quien === "rival"; }).length;

    if (tirosJugador >= 5 && tirosRival >= 5) {
        if (st.golJugador !== st.golRival) {
            st.fase = "fin";
            st.resultado = st.golJugador > st.golRival ? "gana" : "pierde";
            st.mensaje = st.resultado === "gana"
                ? "La pelota entró y el estadio explotó. Sos leyenda."
                : "El silencio se comió el estadio. Otra vez será.";
            aplicarPremioTanda(st.resultado);
            actualizarTanda();
            return true;
        }
        // Muerte súbita: sigue la ronda
        if (tirosJugador === tirosRival) {
            st.mensaje = "Muerte súbita: el que falla, pierde.";
        }
    }
    return false;
}

function aplicarPremioTanda(resultado) {
    const st = estadoTanda;
    const premio = st.opciones.premio || {};
    if (resultado === "gana") {
        if (premio.prestigio) ajustarPrestigio(premio.prestigio, "Tanda ganada");
        if (premio.apoyo) ajustarApoyo(premio.apoyo, "Tanda ganada");
        if (premio.dinero) ajustarDinero(premio.dinero, "Premio de la tanda");
        if (typeof toastLogro === "function") toastLogro("Ganaste la tanda", "trofeo");
    } else {
        if (premio.prestigio) ajustarPrestigio(-Math.max(1, Math.floor(premio.prestigio / 2)), "Tanda perdida");
        if (typeof toastAlerta === "function") toastAlerta("Perdiste la tanda", "balanza");
    }
    presidente.tandaAnio = presidente.anioMandato;
}

function cerrarTanda() {
    const st = estadoTanda;
    UI.cerrar("tanda");
    estadoTanda = null;
    if (st && typeof st.opciones.onFin === "function") st.opciones.onFin(st.resultado === "gana");
    if (typeof refrescar === "function") refrescar();
}

// -----------------------------
// TANDA AMISTOSA (una por año)
// -----------------------------

function puedeJugarTanda() {
    return presidente.tandaAnio !== presidente.anioMandato;
}

function abrirTandaAmistosa() {
    if (!puedeJugarTanda()) {
        toastInfo("Ya jugaste la tanda de este año. Volvé el año que viene.", "reloj");
        return;
    }
    abrirTanda({
        titulo: "Tanda de penales",
        sub: "Un rato de fútbol entre papeles. Si ganás, la AFA gana prestigio.",
        equipo: "Argentina",
        rival: elegir(["Brasil", "Francia", "Inglaterra", "Uruguay", "Italia"]),
        premio: { prestigio: 3, apoyo: 1, dinero: 200 }
    });
}
