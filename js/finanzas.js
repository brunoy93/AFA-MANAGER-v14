// ============================================
// FINANZAS 2.0: libro diario, TV, sponsors y crédito
// ============================================

const INGRESO_BASE_ANUAL = 2400;   // taquilla y derechos menores
const EGRESO_BASE_ANUAL = 6200;    // estructura de la AFA

const SPONSORS_DISPONIBLES = [
    { id: "ypf", nombre: "YPF", rubro: "Energía", montoBase: 1250, bonusPrestigio: 300, popularidad: "popular" },
    { id: "quilmes", nombre: "Quilmes", rubro: "Cerveza", montoBase: 950, bonusPrestigio: 200, popularidad: "popular" },
    { id: "banco_macro", nombre: "Banco Macro", rubro: "Banco", montoBase: 1150, bonusPrestigio: 250, popularidad: "neutral" },
    { id: "personal", nombre: "Personal", rubro: "Telecom", montoBase: 1050, bonusPrestigio: 200, popularidad: "neutral" },
    { id: "directv", nombre: "DirecTV", rubro: "TV", montoBase: 1350, bonusPrestigio: 350, popularidad: "neutral" },
    { id: "coca_cola", nombre: "Coca-Cola", rubro: "Bebida", montoBase: 1500, bonusPrestigio: 400, popularidad: "neutral" },
    { id: "mcdonalds", nombre: "McDonald's", rubro: "Comida", montoBase: 1400, bonusPrestigio: 300, popularidad: "polemico" },
    { id: "nike", nombre: "Nike", rubro: "Deportivo", montoBase: 1600, bonusPrestigio: 400, popularidad: "neutral" },
    { id: "adidas", nombre: "Adidas", rubro: "Deportivo", montoBase: 1600, bonusPrestigio: 400, popularidad: "neutral" },
    { id: "mastercard", nombre: "Mastercard", rubro: "Financiero", montoBase: 1300, bonusPrestigio: 250, popularidad: "polemico" },
    { id: "aerolineas", nombre: "Aerolíneas Argentinas", rubro: "Aerolínea", montoBase: 850, bonusPrestigio: 200, popularidad: "popular" }
];

const estadoFinanzas = {
    sponsorActual: null,
    ingresosDelAnio: 0,
    egresosDelAnio: 0,
    historial: [],
    eventosDelAnio: [],
    rescates: {},
    rescatesDelAnio: 0,
    nivelDeuda: {},
    libro: [],
    tv: { montoAnual: 5200, venceAnio: 2 },
    prestamos: [],
    presupuesto: { ingresos: 0, egresos: 0 }
};

// -----------------------------
// LIBRO DIARIO
// -----------------------------

const FinanzasLibro = {
    activo: true,

    asentar: function(monto, concepto, tipo) {
        const montoRedondeado = Math.round(monto);
        estadoFinanzas.libro.push({
            anio: presidente.anioMandato,
            fecha: estadoLigas.fechaActual,
            tipo: tipo || (montoRedondeado >= 0 ? "ingreso" : "egreso"),
            concepto: concepto,
            monto: montoRedondeado
        });
        if (estadoFinanzas.libro.length > 400) estadoFinanzas.libro.shift();
    },

    delAnio: function(anio) {
        const a = anio == null ? presidente.anioMandato : anio;
        return estadoFinanzas.libro.filter(function(l) { return l.anio === a; });
    },

    ultimos: function(cantidad) {
        return estadoFinanzas.libro.slice(-(cantidad || 12)).reverse();
    },

    totales: function(anio) {
        const filas = FinanzasLibro.delAnio(anio);
        let ingresos = 0;
        let egresos = 0;
        filas.forEach(function(f) {
            if (f.monto >= 0) ingresos += f.monto;
            else egresos += -f.monto;
        });
        return { ingresos: ingresos, egresos: egresos, balance: ingresos - egresos };
    }
};

function moverCaja(monto, concepto, tipo) {
    if (!monto) return;
    const redondeado = Math.round(monto);
    if (!redondeado) return;
    presidente.dineroEnCaja = Math.round(presidente.dineroEnCaja + redondeado);
    registrarCambio("dinero", redondeado, concepto);
    FinanzasLibro.asentar(redondeado, concepto, tipo);
}

// -----------------------------
// DEUDAS DE LOS CLUBES
// -----------------------------

function asignarDeudasIniciales() {
    const primeraIds = LIGAS.primera.equipos.slice();

    const ordenadosPorPeso = primeraIds.slice().sort(function(a, b) {
        return EQUIPOS[a].pesoHistorico - EQUIPOS[b].pesoHistorico;
    });

    ordenadosPorPeso.slice(0, 2).forEach(function(id) { estadoFinanzas.nivelDeuda[id] = "crisis"; });
    ordenadosPorPeso.slice(2, 5).forEach(function(id) { estadoFinanzas.nivelDeuda[id] = "ajustado"; });

    const nacionalIds = LIGAS.nacional.equipos.slice();
    const ordenadosNacional = nacionalIds.slice().sort(function(a, b) {
        return EQUIPOS[a].pesoHistorico - EQUIPOS[b].pesoHistorico;
    });

    estadoFinanzas.nivelDeuda[ordenadosNacional[0]] = "crisis";
    estadoFinanzas.nivelDeuda[ordenadosNacional[1]] = "ajustado";
    estadoFinanzas.nivelDeuda[ordenadosNacional[2]] = "ajustado";
}

function penalizacionPorDeuda(idEquipo) {
    const nivel = estadoFinanzas.nivelDeuda[idEquipo];
    if (nivel === "ajustado") return 2;
    if (nivel === "crisis") return 5;
    if (nivel === "fundido") return 10;
    return 0;
}

const COSTOS_RESCATE = { ajustado: 750, crisis: 1800, fundido: 4500 };

function rescatarClub(idEquipo) {
    const nivel = estadoFinanzas.nivelDeuda[idEquipo];
    if (!nivel || nivel === "sano") return { exito: false, motivo: "El club ya está sano." };

    const costo = COSTOS_RESCATE[nivel];
    if (presidente.dineroEnCaja < costo) return { exito: false, motivo: "No hay caja suficiente." };

    ajustarDinero(-costo, "Rescate de " + EQUIPOS[idEquipo].nombre);
    // Salvar un club suma en la asamblea: los chicos lo festejan.
    ajustarApoyo(3, "Rescate de " + EQUIPOS[idEquipo].nombre);

    if (!estadoFinanzas.rescates[idEquipo]) estadoFinanzas.rescates[idEquipo] = 0;
    estadoFinanzas.rescates[idEquipo]++;
    estadoFinanzas.rescatesDelAnio = (estadoFinanzas.rescatesDelAnio || 0) + 1;
    if (typeof registrarFavor === "function") registrarFavor(idEquipo, "institucional", 6, "Rescate económico de la AFA");

    const cantidad = estadoFinanzas.rescates[idEquipo];
    const equipo = EQUIPOS[idEquipo];
    let mensajePolitico = "";

    if (cantidad === 1) {
        mensajePolitico = "Los clubes celebran el rescate y toman nota del gesto.";
    } else if (cantidad === 2) {
        ajustarApoyo(-2, "Segundo rescate");
        mensajePolitico = "La prensa empieza a llamarte 'padrino' de " + equipo.nombre + ".";
    } else if (cantidad === 3) {
        ajustarApoyo(-6, "Tercer rescate");
        mensajePolitico = "Titular: 'El presidente que salvó a " + equipo.nombre + " tres veces'.";
    } else {
        ajustarApoyo(-10, "Rescates repetidos");
        ajustarPrestigio(-4, "Rescates repetidos");
        mensajePolitico = "Escándalo: rescataste a " + equipo.nombre + " " + cantidad + " veces.";
    }

    const nuevoNivel = subirNivelDeuda(nivel);
    estadoFinanzas.nivelDeuda[idEquipo] = nuevoNivel;
    ajustarConfianzaArea("federal", 3, "Rescate");

    estadoFinanzas.eventosDelAnio.push({
        tipo: "rescate",
        descripcion: "Rescataste a " + equipo.nombre + " (" + nivel + " → " + nuevoNivel + ")"
    });

    if (typeof noticiaDeRescate === "function") noticiaDeRescate(equipo.nombre, costo, cantidad);
    if (typeof revisarLogros === "function") revisarLogros();

    return { exito: true, costo: costo, mensajePolitico: mensajePolitico, nuevoNivel: nuevoNivel };
}

function subirNivelDeuda(nivel) {
    if (nivel === "fundido") return "crisis";
    if (nivel === "crisis") return "ajustado";
    return "sano";
}

function bajarNivelDeuda(nivel) {
    if (nivel === "ajustado") return "crisis";
    if (nivel === "crisis") return "fundido";
    return "fundido";
}

function empeorarDeudasAlCierre() {
    Object.keys(estadoFinanzas.nivelDeuda).forEach(function(id) {
        const nivel = estadoFinanzas.nivelDeuda[id];
        if (nivel === "sano") return;
        let prob = 0.35;
        if (nivel === "ajustado") prob = 0.28;
        if (nivel === "crisis") prob = 0.38;
        if (nivel === "fundido") prob = 0.15;
        if (probabilidad(prob * Dificultad().agresividad)) {
            const nuevo = bajarNivelDeuda(nivel);
            estadoFinanzas.nivelDeuda[id] = nuevo;
            estadoFinanzas.eventosDelAnio.push({
                tipo: "deuda",
                descripcion: EQUIPOS[id].nombre + " empeoró su situación (" + nivel + " → " + nuevo + ")"
            });
        }
    });
}

// -----------------------------
// SPONSORS
// -----------------------------

function generarOfertasSponsors() {
    const copia = barajar(SPONSORS_DISPONIBLES);
    return copia.slice(0, 3).map(function(s) {
        return Object.assign({}, s, {
            anios: 2,
            bonusObjetivo: Math.round(s.montoBase * 0.35),
            objetivo: elegir(["Top 5 de la Liga", "Semifinal de Libertadores", "Ranking FIFA top 3", "Finalista del interior en la Copa Argentina"])
        });
    });
}

function firmarSponsor(sponsor) {
    estadoFinanzas.sponsorActual = Object.assign({}, sponsor, {
        desdeAnio: presidente.anioMandato,
        venceAnio: presidente.anioMandato + (sponsor.anios || 2) - 1
    });

    if (sponsor.popularidad === "popular") ajustarApoyo(3, "Sponsor " + sponsor.nombre);
    else if (sponsor.popularidad === "polemico") ajustarApoyo(-3, "Sponsor " + sponsor.nombre);

    estadoFinanzas.eventosDelAnio.push({
        tipo: "sponsor",
        descripcion: "Firmaste con " + sponsor.nombre + " (" + sponsor.popularidad + ")"
    });

    if (typeof noticiaDeSponsor === "function") noticiaDeSponsor(sponsor);
}

function sponsorVencido() {
    if (!estadoFinanzas.sponsorActual) return true;
    return presidente.anioMandato > (estadoFinanzas.sponsorActual.venceAnio || 1);
}

// -----------------------------
// TELEVISACIÓN
// -----------------------------

function tvVencida() {
    return presidente.anioMandato > (estadoFinanzas.tv.venceAnio || 2);
}

function renovarTV(opcion) {
    const base = estadoFinanzas.tv.montoAnual;
    let nuevoMonto = base;
    let mensaje = "";

    if (opcion === "seguro") {
        nuevoMonto = Math.round(base * 1.06);
        mensaje = "Renovaste con la misma empresa: " + fmt.plata(nuevoMonto) + " por año.";
    } else if (opcion === "abierto") {
        const exito = probabilidad(0.55 + (presidente.prestigioInternacional - 50) / 200);
        nuevoMonto = Math.round(base * (exito ? 1.32 : 0.88));
        mensaje = exito
            ? "Licitación abierta y ganaste: " + fmt.plata(nuevoMonto) + " por año."
            : "La licitación salió mal: " + fmt.plata(nuevoMonto) + " por año.";
        if (!exito) ajustarPrestigio(-3, "Licitación de TV fallida");
    } else if (opcion === "plataforma") {
        nuevoMonto = Math.round(base * 1.18);
        mensaje = "Acuerdo con una plataforma de streaming: " + fmt.plata(nuevoMonto) + " por año.";
        ajustarApoyo(-4, "TV sólo por streaming");
    }

    estadoFinanzas.tv = {
        montoAnual: nuevoMonto,
        venceAnio: presidente.anioMandato + 2
    };
    estadoFinanzas.eventosDelAnio.push({ tipo: "tv", descripcion: mensaje });
    if (typeof noticiaDeTV === "function") noticiaDeTV(nuevoMonto);
    return mensaje;
}

// -----------------------------
// PRÉSTAMOS
// -----------------------------

function prestamosActivos() {
    return estadoFinanzas.prestamos.filter(function(p) { return p.cuotasRestantes > 0; });
}

function montoMaximoPrestamo() {
    return Math.round(1500 + presidente.apoyoClubes * 20 + ConfianzaConsejo() * 12);
}

function pedirPrestamo(monto) {
    if (prestamosActivos().length >= 2) return { ok: false, motivo: "Ya tenés dos préstamos activos." };
    if (monto > montoMaximoPrestamo()) return { ok: false, motivo: "El consejo no te habilita ese monto." };
    const tasa = tasaPrestamo();
    const cuotas = 12;
    const total = monto * (1 + tasa);
    const prestamo = {
        id: unicoId("pr"),
        monto: monto,
        tasa: tasa,
        cuotasRestantes: cuotas,
        cuota: Math.round(total / cuotas),
        total: Math.round(total),
        desdeAnio: presidente.anioMandato
    };
    estadoFinanzas.prestamos.push(prestamo);
    moverCaja(monto, "Préstamo bancario", "ingreso");
    ajustarConfianzaArea("economico", -3, "Préstamo");
    if (typeof noticiaDePrestamo === "function") noticiaDePrestamo(monto);
    return { ok: true, prestamo: prestamo };
}

function pagarCuotasPrestamos() {
    estadoFinanzas.prestamos.forEach(function(p) {
        if (p.cuotasRestantes <= 0) return;
        moverCaja(-p.cuota, "Cuota préstamo", "egreso");
        p.cuotasRestantes--;
        if (p.cuotasRestantes === 0 && typeof toastExito === "function") {
            toastExito("Terminaste de pagar un préstamo", "dinero");
        }
    });
}

// -----------------------------
// BONUS Y FLUJOS
// -----------------------------

function calcularBonusAudiencia() {
    let bonus = 0;
    const top5 = obtenerTablaOrdenada("primera").slice(0, 5);
    let grandes = 0;
    top5.forEach(function(eq) { if (EQUIPOS[eq.id].pesoHistorico >= 75) grandes++; });
    bonus += grandes * 120;

    let goles = 0;
    Object.values(estadoLigas.tablas.primera || {}).forEach(function(eq) { goles += eq.GF || 0; });
    if (goles > 900) bonus += 400;
    else if (goles > 750) bonus += 250;
    else if (goles > 600) bonus += 100;

    const campeon = top5[0];
    if (campeon && EQUIPOS[campeon.id].pesoHistorico >= 80) bonus += 350;
    return bonus;
}

function ingresoPorFecha() {
    const totalFechas = Math.max(1, estadoLigas.totalFechas);
    const dif = Dificultad();
    const factor = (typeof ingresosBaseFactor === "function") ? ingresosBaseFactor() : 1;
    const tv = (estadoFinanzas.tv.montoAnual * dif.ingresos * factor) / totalFechas;
    let sponsor = 0;
    if (estadoFinanzas.sponsorActual) {
        const s = estadoFinanzas.sponsorActual;
        let base = s.montoBase;
        if (presidente.prestigioInternacional >= 60) base += s.bonusPrestigio;
        sponsor = (base * dif.ingresos * factor) / totalFechas;
    }
    const taquilla = (INGRESO_BASE_ANUAL * dif.ingresos * factor) / totalFechas;
    return { tv: tv, sponsor: sponsor, taquilla: taquilla, total: tv + sponsor + taquilla };
}

function egresoPorFecha() {
    const totalFechas = Math.max(1, estadoLigas.totalFechas);
    const dif = Dificultad();
    const estructura = (EGRESO_BASE_ANUAL * dif.egresos) / totalFechas;
    const sueldo = (sueldoDTActual() * dif.egresos) / totalFechas;
    const varSost = presidente.varActivo ? 500 / totalFechas : 0;
    return { estructura: estructura, sueldo: sueldo, var: varSost, total: estructura + sueldo + varSost };
}

function procesarFechaFinanciera() {
    const ing = ingresoPorFecha();
    const egr = egresoPorFecha();

    moverCaja(ing.tv, "Derechos de TV", "ingreso");
    if (ing.sponsor) moverCaja(ing.sponsor, "Sponsor " + (estadoFinanzas.sponsorActual ? estadoFinanzas.sponsorActual.nombre : ""), "ingreso");
    moverCaja(ing.taquilla, "Taquilla y derechos", "ingreso");

    moverCaja(-egr.estructura, "Estructura AFA", "egreso");
    if (egr.sueldo) moverCaja(-egr.sueldo, "Sueldo del DT", "egreso");
    if (egr.var) moverCaja(-egr.var, "Mantenimiento VAR", "egreso");

    pagarCuotasPrestamos();
}

// -----------------------------
// CIERRE DE AÑO
// -----------------------------

function cobrarIngresosAnuales() {
    const totales = FinanzasLibro.totales();
    estadoFinanzas.ingresosDelAnio = totales.ingresos;
    estadoFinanzas.presupuesto.ingresos = Math.round(
        estadoFinanzas.tv.montoAnual +
        (estadoFinanzas.sponsorActual ? estadoFinanzas.sponsorActual.montoBase : 0) +
        INGRESO_BASE_ANUAL
    );
    return estadoFinanzas.presupuesto.ingresos;
}

function cobrarEgresosAnuales() {
    const totales = FinanzasLibro.totales();
    estadoFinanzas.egresosDelAnio = totales.egresos;

    // Estructura y solidaridad: la caja grande cuesta mantenerla.
    if (presidente.dineroEnCaja > 2000) {
        let estructura = Math.max(500, Math.round(presidente.dineroEnCaja * 0.08));
        if (presidente.dineroEnCaja > 10000) estructura += Math.round((presidente.dineroEnCaja - 10000) * 0.1);
        ajustarDinero(-estructura, "Gastos de estructura y solidaridad");
        estadoFinanzas.eventosDelAnio.push({
            tipo: "egreso",
            descripcion: "Estructura y fondo solidario: " + fmt.plata(estructura)
        });
    }

    estadoFinanzas.presupuesto.egresos = Math.round(EGRESO_BASE_ANUAL + sueldoDTActual() + (presidente.varActivo ? 500 : 0));
    return estadoFinanzas.presupuesto.egresos;
}

function cerrarAnioFinanciero() {
    const totales = FinanzasLibro.totales();
    estadoFinanzas.historial.push({
        anio: presidente.anioMandato,
        ingresos: totales.ingresos,
        egresos: totales.egresos,
        balance: totales.balance,
        cajaFinal: presidente.dineroEnCaja,
        eventos: estadoFinanzas.eventosDelAnio.slice()
    });
    estadoFinanzas.ingresosDelAnio = 0;
    estadoFinanzas.egresosDelAnio = 0;
    estadoFinanzas.eventosDelAnio = [];
}

// -----------------------------
// CONSULTAS PARA LA INTERFAZ
// -----------------------------

function obtenerResumenFinanciero() {
    const totales = FinanzasLibro.totales();
    return {
        sponsor: estadoFinanzas.sponsorActual,
        tv: estadoFinanzas.tv,
        ingresos: totales.ingresos,
        egresos: totales.egresos,
        balance: totales.balance,
        presupuesto: estadoFinanzas.presupuesto,
        historial: estadoFinanzas.historial,
        eventos: estadoFinanzas.eventosDelAnio,
        libro: FinanzasLibro.delAnio(),
        prestamos: prestamosActivos()
    };
}

function obtenerClubesConDeuda() {
    const lista = [];
    Object.keys(estadoFinanzas.nivelDeuda).forEach(function(id) {
        const nivel = estadoFinanzas.nivelDeuda[id];
        if (nivel === "sano") return;
        const eq = EQUIPOS[id];
        if (!eq) return;
        lista.push({
            id: parseInt(id, 10),
            nombre: eq.nombre,
            liga: LIGAS[eq.ligaId] ? LIGAS[eq.ligaId].nombre : "",
            nivel: nivel,
            rescates: estadoFinanzas.rescates[id] || 0,
            costoRescate: COSTOS_RESCATE[nivel]
        });
    });
    return lista.sort(function(a, b) {
        const orden = { fundido: 0, crisis: 1, ajustado: 2 };
        return (orden[a.nivel] || 9) - (orden[b.nivel] || 9);
    });
}

function deudaTotalClubes() {
    return obtenerClubesConDeuda().length;
}

