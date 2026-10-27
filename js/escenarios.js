// ============================================
// ESCENARIOS Y MODIFICADORES DE PARTIDA
// ============================================

const ESCENARIOS = {
    postmessi: {
        id: "postmessi",
        nombre: "La era post-Messi",
        subtitulo: "El escenario original",
        icono: "bandera",
        desc: "La Selección perdió la final del Mundial, Messi se retiró y Scaloni no sigue. La AFA está en crisis y los clubes desconfían. Cuatro años para reconstruir.",
        caja: 11000,
        apoyo: 50,
        prestigio: 50,
        confianza: 0,
        prensa: 50,
        dificultadExtra: "",
        reglas: ["Sin reglas especiales"]
    },
    quebrada: {
        id: "quebrada",
        nombre: "La AFA quebrada",
        subtitulo: "Modo supervivencia",
        icono: "alerta",
        desc: "Encontrás las cuentas en rojo, un préstamo bancario firmado y los clubes al borde del default. La primera tarea es no fundirte antes de diciembre.",
        caja: 4200,
        apoyo: 42,
        prestigio: 42,
        confianza: -6,
        prensa: 38,
        prestamoForzoso: 2000,
        reglas: [
            "Arrancás con $4.200M y un préstamo forzoso de $2.000M",
            "Los clubes ya están enojados: apoyo 42"
        ]
    },
    gloria: {
        id: "gloria",
        nombre: "Después de la gloria",
        subtitulo: "Modo presión",
        icono: "trofeo",
        desc: "La Selección acaba de ganar el Mundial. Te llueven sponsors y el prestigio está por las nubes, pero todos esperan que repitas. Y nadie te va a perdonar una mala temporada.",
        caja: 15000,
        apoyo: 68,
        prestigio: 86,
        confianza: 8,
        prensa: 68,
        erosion: 1.55,
        umbralExtra: 0.04,
        reglas: [
            "El apoyo se desgasta 55% más rápido",
            "La asamblea te pide 4 puntos más para reelegirte"
        ]
    },
    escandalo: {
        id: "escandalo",
        nombre: "El escándalo",
        subtitulo: "Modo reconstrucción",
        icono: "diario",
        desc: "Un caso de corrupción estalló en la AFA y la justicia te allanó la sede. Tenés plata y clubes que te apoyan, pero la prensa te declaró la guerra antes de empezar.",
        caja: 18000,
        apoyo: 52,
        prestigio: 30,
        confianza: -18,
        prensa: 18,
        reglas: [
            "Relación con la prensa por el piso",
            "El consejo arranca desconfiado"
        ]
    }
};

const MODIFICADORES = [
    {
        id: "prensa",
        nombre: "Prensa en guerra",
        icono: "diario",
        desc: "Los medios te apuntan: la relación con la prensa nace 20 puntos abajo y el prestigio se desgasta 50% más rápido.",
        efectos: { prensa: -20, erosionPrestigio: 1.5 }
    },
    {
        id: "impacientes",
        nombre: "Clubes impacientes",
        icono: "consejo",
        desc: "Cada fecha que pasa, los clubes se enojan más rápido. El apoyo se desgasta 40% más.",
        efectos: { erosionApoyo: 1.4 }
    },
    {
        id: "mercadocaliente",
        nombre: "Mercado caliente",
        icono: "maletin",
        desc: "Los europeos vienen con la billetera abierta: una oferta más por ventana y jugadores 30% más caros.",
        efectos: { ofertasExtra: 1, valorMercado: 1.3 }
    },
    {
        id: "cantera",
        nombre: "Semillero",
        icono: "rayo",
        desc: "La AFA apuesta a las inferiores: +2 de prestigio por año y los juveniles rinden más en la Selección.",
        efectos: { cantera: true }
    },
    {
        id: "viento",
        nombre: "Viento de cola",
        icono: "dinero",
        desc: "Un acuerdo de derechos audiovisuales deja la caja arriba: los ingresos por fecha suben 12%.",
        efectos: { ingresos: 1.12 }
    },
    {
        id: "sinvar",
        nombre: "Tecnología prohibida",
        icono: "balanza",
        desc: "No podés activar el VAR en todo el mandato. Ahorrás el mantenimiento, pero los errores arbitrales duelen el doble.",
        efectos: { sinVAR: true }
    },
    {
        id: "manodura",
        nombre: "Mano dura",
        icono: "escudo",
        desc: "Sancionar a los árbitros suma el doble de apoyo, pero cada sanción te cuesta 3 de prestigio con la FIFA.",
        efectos: { manoDura: true }
    }
];

function escenarioActual() {
    return ESCENARIOS[presidente.escenario] || ESCENARIOS.postmessi;
}

function modificadoresActivos() {
    return (presidente.modificadores || []).map(function(id) {
        return MODIFICADORES.filter(function(m) { return m.id === id; })[0];
    }).filter(Boolean);
}

function tieneModificador(id) {
    return (presidente.modificadores || []).indexOf(id) !== -1;
}

function efectoModificador(clave, defecto) {
    let valor = defecto;
    modificadoresActivos().forEach(function(m) {
        if (m.efectos && m.efectos[clave] != null) {
            if (typeof m.efectos[clave] === "number" && clave.indexOf("erosion") === 0) valor *= m.efectos[clave];
            else if (typeof m.efectos[clave] === "number" && clave === "ingresos") valor *= m.efectos[clave];
            else valor = m.efectos[clave];
        }
    });
    return valor;
}

// Aplica el escenario elegido sobre el estado ya reiniciado.
function aplicarEscenario(id) {
    const esc = ESCENARIOS[id] || ESCENARIOS.postmessi;
    presidente.escenario = esc.id;

    presidente.dineroEnCaja = esc.caja;
    presidente.apoyoClubes = esc.apoyo;
    presidente.prestigioInternacional = esc.prestigio;
    presidente.relacionPrensaBase = esc.prensa;

    if (esc.confianza) {
        miembrosConsejo.forEach(function(m) {
            m.confianza = limitar(m.confianza + esc.confianza, 5, 95);
        });
    }

    if (esc.prestamoForzoso) {
        estadoFinanzas.prestamos.push({
            id: unicoId("pr"),
            monto: esc.prestamoForzoso,
            tasa: 0.07,
            cuotasRestantes: 12,
            cuota: Math.round(esc.prestamoForzoso * 1.07 / 12),
            total: Math.round(esc.prestamoForzoso * 1.07),
            desdeAnio: 1,
            forzoso: true
        });
        estadoFinanzas.ingresosDelAnio += 0;
    }
}

function aplicarModificadores(ids) {
    presidente.modificadores = (ids || []).slice(0, 2);
    if (tieneModificador("prensa")) {
        presidente.relacionPrensaBase = (presidente.relacionPrensaBase || 50) - 20;
    }
    if (tieneModificador("sinvar")) {
        presidente.varActivo = false;
    }
}

function erosionApoyoBase() {
    return efectoModificador("erosionApoyo", 1);
}

function erosionPrestigioBase() {
    return efectoModificador("erosionPrestigio", 1);
}

function ingresosBaseFactor() {
    return efectoModificador("ingresos", 1);
}

function umbralAsambleaExtra() {
    return escenarioActual().umbralExtra || 0;
}
