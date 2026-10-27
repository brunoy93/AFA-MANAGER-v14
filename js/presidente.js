// ============================================
// PRESIDENTE: estado, recursos y memoria de gestión
// ============================================

const presidente = {
    nombre: "Presidente",
    anioMandato: 1,
    anioMaximo: 4,
    apoyoClubes: 50,
    prestigioInternacional: 50,
    dineroEnCaja: 11000,
    seleccionador: null,
    varActivo: false,
    historialDecisiones: [],
    promesas: [],
    historial: [],
    cambios: [],
    desgasteApoyo: 0,
    desgastePrestigio: 0,
    escenario: "postmessi",
    modificadores: [],
    relacionPrensaBase: 50,
    origen: "asamblea"
};

// Sueldos anuales de cada DT (en millones)
const SUELDOS_DT = {
    "Pablo Aimar": 300,
    "Walter Samuel": 250,
    "Diego Simeone": 800,
    "Marcelo Gallardo": 500,
    "Javier Mascherano": 400,
    "Antonio Mohamed": 200,
    "José Pekerman": 400
};

const FUERZA_DT_PRESIDENTE = {
    "Pablo Aimar": 82,
    "Walter Samuel": 80,
    "Diego Simeone": 86,
    "Marcelo Gallardo": 84,
    "Javier Mascherano": 78,
    "Antonio Mohamed": 80,
    "José Pekerman": 83
};

function sueldoDTActual() {
    if (!presidente.seleccionador) return 0;
    return SUELDOS_DT[presidente.seleccionador] || 0;
}

function fuerzaDTActual() {
    if (!presidente.seleccionador) return 76;
    if (typeof FUERZA_DT !== "undefined") return FUERZA_DT[presidente.seleccionador] || 78;
    return FUERZA_DT_PRESIDENTE[presidente.seleccionador] || 78;
}

// --- Registro de cambios (para poder explicar cada número) ---

function registrarCambio(tipo, delta, motivo) {
    if (!delta) return;
    presidente.cambios.push({
        anio: presidente.anioMandato,
        fecha: (typeof estadoLigas !== "undefined" ? estadoLigas.fechaActual : 0),
        tipo: tipo,
        delta: delta,
        motivo: motivo || "Gestión"
    });
    if (presidente.cambios.length > 80) presidente.cambios.shift();
}

function ultimosCambios(tipo, cantidad) {
    const lista = presidente.cambios.filter(function(c) { return c.tipo === tipo; });
    return lista.slice(-(cantidad || 5)).reverse();
}

// --- Ajustes de recursos ---

function ajustarApoyo(cantidad, motivo) {
    if (!cantidad) return;
    const antes = presidente.apoyoClubes;
    presidente.apoyoClubes = limitar(Math.round(presidente.apoyoClubes + cantidad), 0, 100);
    registrarCambio("apoyo", presidente.apoyoClubes - antes, motivo);
    if (typeof toastApoyo === "function") toastApoyo(presidente.apoyoClubes - antes);
}

function ajustarPrestigio(cantidad, motivo) {
    if (!cantidad) return;
    const antes = presidente.prestigioInternacional;
    presidente.prestigioInternacional = limitar(Math.round(presidente.prestigioInternacional + cantidad), 0, 100);
    registrarCambio("prestigio", presidente.prestigioInternacional - antes, motivo);
    if (typeof toastPrestigio === "function") toastPrestigio(presidente.prestigioInternacional - antes);
}

function ajustarDinero(cantidad, motivo) {
    if (!cantidad) return;
    const antes = presidente.dineroEnCaja;
    presidente.dineroEnCaja = Math.round(presidente.dineroEnCaja + cantidad);
    registrarCambio("dinero", presidente.dineroEnCaja - antes, motivo);
    if (typeof FinanzasLibro !== "undefined" && FinanzasLibro.activo && motivo) {
        FinanzasLibro.asentar(cantidad, motivo, "gestión");
    }
    if (typeof toastDinero === "function") toastDinero(presidente.dineroEnCaja - antes);
}

// --- Desgaste natural: los clubes y la prensa siempre piden más ---
// Se acumula en fracciones para no mostrar un toast por cada fecha.
function desgasteNatural() {
    const factorApoyo = (typeof erosionApoyoBase === "function") ? erosionApoyoBase() : 1;
    const factorPrestigio = (typeof erosionPrestigioBase === "function") ? erosionPrestigioBase() : 1;
    const factorEscenario = (typeof escenarioActual === "function" && escenarioActual().erosion) ? escenarioActual().erosion : 1;

    // El apoyo se desgasta de a poco (~7 por año) y el castigo por sostenerlo
    // alto tiene techo: ya no es una cuenta imposible de mantener.
    const erosionApoyo = (0.18 + Math.min(0.35, Math.max(0, presidente.apoyoClubes - 55) * 0.03)) * factorApoyo * factorEscenario;
    const erosionPrestigio = (0.28 + Math.min(0.5, Math.max(0, presidente.prestigioInternacional - 60) * 0.06)) * factorPrestigio * factorEscenario;

    presidente.desgasteApoyo += erosionApoyo;
    while (presidente.desgasteApoyo >= 1) {
        presidente.desgasteApoyo -= 1;
        if (presidente.apoyoClubes > 0) {
            presidente.apoyoClubes -= 1;
            registrarCambio("apoyo", -1, "Desgaste natural");
        }
    }

    presidente.desgastePrestigio += erosionPrestigio;
    while (presidente.desgastePrestigio >= 1) {
        presidente.desgastePrestigio -= 1;
        if (presidente.prestigioInternacional > 0) {
            presidente.prestigioInternacional -= 1;
            registrarCambio("prestigio", -1, "Desgaste natural");
        }
    }
}

// --- Snapshot por fecha (para gráficos y comparativas) ---

function guardarSnapshot() {
    const fecha = (typeof estadoLigas !== "undefined" ? estadoLigas.fechaActual : 0);
    const confianza = (typeof ConfianzaConsejo === "function") ? ConfianzaConsejo() : 50;
    presidente.historial.push({
        anio: presidente.anioMandato,
        fecha: fecha,
        apoyo: presidente.apoyoClubes,
        prestigio: presidente.prestigioInternacional,
        dinero: presidente.dineroEnCaja,
        consejo: confianza
    });
    if (presidente.historial.length > 160) presidente.historial.shift();
}

function serieHistorial(clave, cantidad) {
    const datos = presidente.historial.map(function(h) { return h[clave]; });
    return cantidad ? datos.slice(-cantidad) : datos;
}

// --- Decisiones ---

function registrarDecision(decision, opcion) {
    presidente.historialDecisiones.push({
        anio: presidente.anioMandato,
        fecha: (typeof estadoLigas !== "undefined" ? estadoLigas.fechaActual : 0),
        id: decision.id,
        decision: decision.titulo,
        eleccion: opcion.texto,
        categoria: decision.categoria || "institucional",
        resumen: opcion.resumen || ""
    });
    if (presidente.historialDecisiones.length > 120) presidente.historialDecisiones.shift();
}

function decisionesRecientes(cantidad) {
    return presidente.historialDecisiones.slice(-(cantidad || 6)).reverse();
}
