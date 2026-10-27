// ============================================
// FECHA EN VIVO: la pelota entra y sale de la pantalla
// ============================================

const estadoFechaVivo = {
    activo: false,
    timeout: null,
    intervalo: null
};

function fechaVivoHabilitada() {
    return (presidente.fechaVivoModo || "siempre") !== "nunca";
}

function cerrarFechaEnVivo() {
    const el = document.getElementById("fecha-vivo");
    if (el) el.remove();
    if (estadoFechaVivo.intervalo) clearInterval(estadoFechaVivo.intervalo);
    if (estadoFechaVivo.timeout) clearTimeout(estadoFechaVivo.timeout);
    estadoFechaVivo.activo = false;
    estadoFechaVivo.intervalo = null;
    estadoFechaVivo.timeout = null;
}

function mostrarFechaEnVivo() {
    if (!fechaVivoHabilitada()) return;
    if (typeof UI !== "undefined" && UI.hayModal()) return;
    if (typeof colaModales !== "undefined" && colaModales.length) return;

    const fecha = estadoLigas.fechaActual - 1;
    if (fecha < 0) return;
    const resultados = (estadoLigas.resultados.primera || [])[fecha];
    if (!resultados || !resultados.length) return;

    cerrarFechaEnVivo();
    estadoFechaVivo.activo = true;

    const overlay = document.createElement("div");
    overlay.id = "fecha-vivo";
    overlay.className = "fv";
    overlay.innerHTML =
        "<div class='fv-cab'>" +
        "<span class='fv-eyebrow'>Fecha " + (fecha + 1) + " · Liga Profesional</span>" +
        "<button class='fv-skip' id='fv-skip'>Saltar</button>" +
        "</div>" +
        "<div class='fv-lista' id='fv-lista'></div>" +
        "<div class='fv-tapa' id='fv-tapa'></div>";
    document.body.appendChild(overlay);

    const lista = document.getElementById("fv-lista");
    const ordenados = resultados.slice().sort(function(a, b) {
        const pa = Math.abs(a.golesLocal - a.golesVisitante);
        const pb = Math.abs(b.golesLocal - b.golesVisitante);
        if (pb !== pa) return pb - pa;
        return (b.golesLocal + b.golesVisitante) - (a.golesLocal + a.golesVisitante);
    });

    let i = 0;
    estadoFechaVivo.intervalo = setInterval(function() {
        if (i >= ordenados.length) {
            clearInterval(estadoFechaVivo.intervalo);
            estadoFechaVivo.intervalo = null;
            mostrarTapaFecha(fecha, resultados);
            estadoFechaVivo.timeout = setTimeout(cerrarFechaEnVivo, 2200);
            return;
        }
        const r = ordenados[i++];
        const fila = document.createElement("div");
        fila.className = "fv-fila";
        fila.innerHTML =
            "<span class='fv-local'>" + escapar(r.local) + "</span>" +
            "<span class='fv-marca " + (r.incidencia ? "polemica" : "") + "'>" + r.golesLocal + " - " + r.golesVisitante + "</span>" +
            "<span class='fv-visitante'>" + escapar(r.visitante) + "</span>";
        lista.appendChild(fila);
        requestAnimationFrame(function() { fila.classList.add("ver"); });
    }, 90);

    const skip = document.getElementById("fv-skip");
    if (skip) skip.addEventListener("click", cerrarFechaEnVivo);
    overlay.addEventListener("click", function(e) {
        if (e.target === overlay) cerrarFechaEnVivo();
    });
}

function mostrarTapaFecha(fecha, resultados) {
    const tapa = document.getElementById("fv-tapa");
    if (!tapa) return;

    const ordenados = resultados.slice().sort(function(a, b) {
        const pa = Math.abs(a.golesLocal - a.golesVisitante);
        const pb = Math.abs(b.golesLocal - b.golesVisitante);
        return pb - pa;
    });
    const destacado = ordenados[0];
    const goleada = (destacado.golesLocal + destacado.golesVisitante) >= 5;
    const tabla = obtenerTablaOrdenada("primera");
    const lider = tabla[0];
    const polemica = resultados.filter(function(r) { return r.incidencia; })[0];
    const goleador = (typeof tablaGoleadores === "function") ? tablaGoleadores(1)[0] : null;

    tapa.innerHTML =
        "<div class='fv-tapa-titulo'>" + (goleada ? "GOLEADA" : "LA TAPA") + "</div>" +
        "<div class='fv-tapa-principal'>" + escapar(destacado.local) + " " + destacado.golesLocal + " - " + destacado.golesVisitante + " " + escapar(destacado.visitante) + "</div>" +
        "<div class='fv-tapa-datos'>" +
        (lider ? "<span>Puntero: <strong>" + escapar(lider.nombre) + "</strong> (" + lider.Pts + " pts)</span>" : "") +
        (goleador ? "<span>Goleador: <strong>" + escapar(goleador.nombre) + "</strong> (" + goleador.goles + ")</span>" : "") +
        (polemica ? "<span class='neg'>Polémica: " + escapar(polemica.incidencia.descripcion) + "</span>" : "") +
        "</div>";
    tapa.classList.add("ver");
}
