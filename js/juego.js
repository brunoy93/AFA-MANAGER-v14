// ============================================
// JUEGO: el motor del mandato
// ============================================

let partidaIniciada = false;
let colaModales = [];

// -----------------------------
// RESET
// -----------------------------

function reiniciarEstadoCompleto() {
    presidente.nombre = "Presidente";
    presidente.anioMandato = 1;
    presidente.anioMaximo = 4;
    presidente.apoyoClubes = 50;
    presidente.prestigioInternacional = 50;
    presidente.dineroEnCaja = Dificultad().cajaInicial;
    presidente.seleccionador = null;
    presidente.varActivo = false;
    presidente.historialDecisiones.length = 0;
    presidente.promesas.length = 0;
    presidente.historial.length = 0;
    presidente.cambios.length = 0;
    presidente.escenario = "postmessi";
    presidente.modificadores = [];
    presidente.relacionPrensaBase = 50;
    presidente.tandaAnio = 0;
    presidente.desgasteApoyo = 0;
    presidente.desgastePrestigio = 0;

    estadoLigas.fechaActual = 0;
    estadoLigas.totalFechas = 0;
    estadoLigas.calendarios = {};
    estadoLigas.resultados = {};
    estadoLigas.tablas = {};

    estadoFinanzas.sponsorActual = null;
    estadoFinanzas.ingresosDelAnio = 0;
    estadoFinanzas.egresosDelAnio = 0;
    estadoFinanzas.historial.length = 0;
    estadoFinanzas.eventosDelAnio.length = 0;
    estadoFinanzas.rescates = {};
    estadoFinanzas.rescatesDelAnio = 0;
    estadoFinanzas.nivelDeuda = {};
    estadoFinanzas.libro.length = 0;
    estadoFinanzas.tv = { montoAnual: 5200, venceAnio: 2 };
    estadoFinanzas.prestamos.length = 0;
    estadoFinanzas.presupuesto = { ingresos: 0, egresos: 0 };

    estadoCopaArgentina.anio = 1;
    estadoCopaArgentina.activa = false;
    estadoCopaArgentina.rondaActual = 0;
    estadoCopaArgentina.equiposVivos = [];
    estadoCopaArgentina.bracket = [];

    estadoAsamblea.campana = { usadas: [], efectos: {}, anio: 0 };
    estadoAsamblea.ultima = null;
    estadoAsamblea.historial.length = 0;

    estadoObjetivos.anio = 0;
    estadoObjetivos.lista = [];
    estadoObjetivos.historial.length = 0;

    estadoSeleccion.plantel = [];
    estadoSeleccion.convocados = [];
    estadoSeleccion.generado = false;
    estadoSeleccion.anioGenerado = 0;

    estadoMercado.figuras = [];
    estadoMercado.ofertas = [];
    estadoMercado.historial = [];
    estadoMercado.ultimaVentana = -1;
    estadoMercado.ventanas = 0;
    estadoMercado.totalVendido = 0;

    estadoOposicion.lider = null;
    estadoOposicion.ultimoDebate = null;
    estadoOposicion.historial = [];
    estadoOposicion.debate = null;

    estadoDirigentes.lista = [];
    estadoDirigentes.pedido = null;
    estadoDirigentes.historial = [];

    estadoExpedientes.abiertos = [];
    estadoExpedientes.resueltos = [];

    reiniciarGoleadores();
    reiniciarStreaming();
    reiniciarInferiores();
    reiniciarEliminatorias();
    reiniciarHistorial();
    presidente.mandatoTerminado = false;
    reiniciarSecanuca();
    reiniciarOperativos();
    reiniciarVidaClubes();
    if (typeof reiniciarVeedores === "function") reiniciarVeedores();
    estadoCopaLiga.activa = false;
    estadoCopaLiga.ronda = 0;
    estadoCopaLiga.playoffs = null;
    estadoCopaLiga.campeon = null;
    estadoCopaLiga.historial = [];
    estadoMundialClubes.anio = 0;
    estadoMundialClubes.campeon = null;
    estadoMundialClubes.historial = [];
    Object.keys(designacionesManuales).forEach(function(k) { delete designacionesManuales[k]; });
    presidente.ultimaDesignacionLibre = -10;
    presidente.escandalosDesignacion = 0;

    logrosDesbloqueados = {};

    noticiasHistoricas.length = 0;
    encuestasHistoricas.length = 0;
    eventosHistoricos.length = 0;
    colaEventos.length = 0;
    Object.keys(marcasEventos).forEach(function(k) { delete marcasEventos[k]; });
    incidenciasHistoricas.length = 0;
    historialCopas.length = 0;
    historialContinentales.length = 0;
    ESTADO_RANKING.puesto = 1;
    ESTADO_RANKING.historial.length = 0;
    copaActual = null;

    if (typeof historialAmistosos !== "undefined") historialAmistosos.length = 0;

    Object.keys(designacionesPorFecha).forEach(function(k) { delete designacionesPorFecha[k]; });
    ARBITROS_PRIMERA.forEach(function(a) {
        a.incidencias = 0;
        a.sancionado = false;
        a.fechasSancion = 0;
    });

    colaModales = [];
}

// -----------------------------
// NUEVA PARTIDA
// -----------------------------

function iniciarPartidaNueva(idDificultad, escenarioId, modificadores) {
    dificultadActual = idDificultad || dificultadActual || "real";
    reiniciarEstadoCompleto();
    reiniciarEstructuraLigas();

    inicializarEquipos();
    inicializarTablas();
    generarTodosLosCalendarios();
    asignarDeudasIniciales();
    reiniciarConsejo();
    reiniciarCampana();
    generarObjetivosAnio();
    generarFiguras();
    generarPlantelSeleccion();
    generarOposicion();
    reiniciarDirigentes();
    generarCamadaJuveniles();
    inicializarHistorialArbitros();
    try { iniciarCopaLiga(); } catch (e) { console.error("Copa de la Liga", e); }

    if (escenarioId) {
        aplicarEscenario(escenarioId);
        aplicarModificadores(modificadores);
        generarPlantelSeleccion();
        forzarDecisionInicialEscenario(escenarioId);
    }

    partidaIniciada = true;
    if (typeof reiniciarPlantillasPartida === "function") reiniciarPlantillasPartida();
    guardarSnapshot();
    guardarPartida();
    refrescar();
    mostrarIntro();
}

function forzarDecisionInicialEscenario(id) {
    if (id === "escandalo") {
        // La primera decisión del escándalo llega rápido
        colaModales.push({ tipo: "decision", datos: { id: "escandalo_judicial", titulo: "La justicia te cita a declarar", descripcion: "Un juez quiere saber cómo se manejaron los fondos del último Mundial. La prensa acampa en la puerta.", categoria: "institucional", opciones: [
            { texto: "Declarar y colaborar con la justicia", resumen: "+4 prestigio, -2 apoyo, -$300M", efecto: function() { ajustarPrestigio(4, "Colaboración judicial"); ajustarApoyo(-2, "Colaboración judicial"); ajustarDinero(-300, "Honorarios"); } },
            { texto: "Presentar un escrito y no declarar", resumen: "-4 prestigio, +$0M", efecto: function() { ajustarPrestigio(-4, "Silencio judicial"); } },
            { texto: "Dar una conferencia de prensa total", resumen: "+6 apoyo, +2 prestigio, -$500M", efecto: function() { ajustarApoyo(6, "Conferencia total"); ajustarPrestigio(2, "Conferencia total"); ajustarDinero(-500, "Conferencia total"); } }
        ] } });
    }
}

function mostrarIntro() {
    UI.modal({
        id: "intro",
        eyebrow: "Buenos Aires · julio de 2026",
        titulo: "Te toca a vos",
        sub: "La AFA busca rumbo después de Messi.",
        ancho: "ancho",
        cerrable: false,
        cuerpo:
            "<div class='intro-escena'>" +
            "<p><em>Estados Unidos, julio de 2026.</em> La Selección cayó 1-0 en la final del Mundial. Dos días después, " +
            "<strong>Lionel Messi anunció su retiro</strong>: <em>«Me vacié, ya no tengo más para dar»</em>.</p>" +
            "<p><strong>Scaloni</strong> comunicó que no renueva. El ciclo más exitoso de la historia reciente se cierra y la AFA " +
            "entra en crisis: los clubes desconfían, la prensa especula y la caja no sobra.</p>" +
            "<p>Asumís como presidente con un mandato de cuatro años, una asamblea que te mira de reojo y una decisión " +
            "que va a definir tu era.</p>" +
            "<label class='campo'><span>¿Cómo te llamás, presidente?</span>" +
            "<input id='input-nombre' type='text' maxlength='22' placeholder='Tu nombre' autocomplete='off'></label>" +
            "</div>",
        pie: [{ texto: "Ver candidatos", accion: "intro-continuar", tipo: "primario" }]
    });
    setTimeout(function() {
        const input = document.getElementById("input-nombre");
        if (input) input.focus();
    }, 140);
}

function continuarIntro() {
    const input = document.getElementById("input-nombre");
    if (input && input.value.trim()) presidente.nombre = input.value.trim();
    UI.cerrar("intro");
    if (typeof sonidoClick === "function") sonidoClick();
    mostrarEscenarios();
}

// -----------------------------
// ELECCIÓN DE ESCENARIO Y MODIFICADORES
// -----------------------------

function mostrarEscenarios() {
    const cards = Object.keys(ESCENARIOS).map(function(id) {
        const e = ESCENARIOS[id];
        return "<button class='escenario-card " + (presidente.escenario === id ? "activo" : "") + "' data-accion='elegir-escenario' data-id='" + id + "'>" +
            "<span class='escenario-icono'>" + icono(e.icono, "", 22) + "</span>" +
            "<span class='escenario-cuerpo'>" +
            "<span class='escenario-sub'>" + escapar(e.subtitulo) + "</span>" +
            "<strong class='escenario-nombre'>" + escapar(e.nombre) + "</strong>" +
            "<span class='escenario-desc'>" + escapar(e.desc) + "</span>" +
            "<span class='escenario-datos'>" +
            "<span>" + icono("dinero", "", 12) + fmt.plata(e.caja) + "</span>" +
            "<span>" + icono("consejo", "", 12) + e.apoyo + " apoyo</span>" +
            "<span>" + icono("estrella", "", 12) + e.prestigio + " prestigio</span>" +
            "</span>" +
            "<span class='escenario-reglas'>" + e.reglas.map(function(r) { return "· " + escapar(r); }).join("<br>") + "</span>" +
            "</span></button>";
    }).join("");

    UI.modal({
        id: "escenarios",
        eyebrow: "Paso 1 de 3",
        titulo: "Elegí tu punto de partida",
        sub: "Cuatro formas de agarrar la AFA. Cambia la plata, el ánimo de los clubes y las reglas.",
        ancho: "ancho",
        cerrable: false,
        cuerpo: "<div class='escenarios'>" + cards + "</div>"
    });
}

function elegirEscenario(id) {
    const esc = ESCENARIOS[id];
    if (!esc) return;
    UI.cerrar("escenarios");
    aplicarEscenario(id);
    aplicarModificadores([]);
    generarPlantelSeleccion();
    guardarPartida();
    refrescar();
    mostrarModificadores();
}

function mostrarModificadores() {
    const activos = presidente.modificadores || [];
    const cards = MODIFICADORES.map(function(m) {
        const activo = activos.indexOf(m.id) !== -1;
        return "<button class='mod-card " + (activo ? "activo" : "") + "' data-accion='toggle-modificador' data-id='" + m.id + "'>" +
            "<span class='mod-check'>" + (activo ? icono("check", "", 14) : "") + "</span>" +
            "<span class='mod-cuerpo'><strong>" + escapar(m.nombre) + "</strong>" +
            "<span class='mod-desc'>" + escapar(m.desc) + "</span></span></button>";
    }).join("");

    UI.modal({
        id: "modificadores",
        eyebrow: "Paso 2 de 3",
        titulo: "Modificadores",
        sub: "Elegí hasta dos reglas extra para la partida. Podés jugar sin ninguna.",
        ancho: "ancho",
        cerrable: false,
        cuerpo: "<div class='mods'>" + cards + "</div>" +
            "<div class='mini tenue' style='margin-top:10px'>Elegidos: <strong>" + activos.length + " / 2</strong></div>",
        pie: [
            { texto: "Seguir sin modificadores", accion: "modificadores-listo", tipo: "fantasma" },
            { texto: "Continuar", accion: "modificadores-listo", tipo: "primario" }
        ]
    });
}

function alternarModificador(id) {
    const activos = presidente.modificadores || (presidente.modificadores = []);
    const idx = activos.indexOf(id);
    if (idx !== -1) activos.splice(idx, 1);
    else if (activos.length < 2) activos.push(id);
    else { toastAlerta("Máximo dos modificadores por partida."); return; }
    mostrarModificadores();
}

function confirmarModificadores() {
    UI.cerrar("modificadores");
    aplicarModificadores(presidente.modificadores || []);
    generarPlantelSeleccion();
    guardarPartida();
    refrescar();
    mostrarEleccionDT();
}

// -----------------------------
// ELECCIÓN DE DT
// -----------------------------

function mostrarEleccionDT() {
    const candidatos = CANDIDATOS_DT.map(function(c) {
        return "<button class='candidato' data-accion='elegir-dt' data-id='" + c.id + "'>" +
            "<span class='candidato-foto'>" + htmlFotoDT(c.id, c.nombre, 64) + "</span>" +
            "<span class='candidato-cuerpo'>" +
            "<span class='candidato-perfil'>" + escapar(c.perfil) + "</span>" +
            "<strong class='candidato-nombre'>" + escapar(c.nombre) + "</strong>" +
            "<span class='candidato-desc'>" + escapar(c.descripcion) + "</span>" +
            "<span class='candidato-pie'>" + escapar(c.resumen) + "</span>" +
            "</span></button>";
    }).join("");

    UI.modal({
        id: "dt",
        eyebrow: "Decisión fundacional",
        titulo: "Elegí al DT de la Selección",
        sub: "No se puede deshacer. Cada perfil cambia el prestigio, el apoyo y la fuerza de la Selección.",
        ancho: "ancho",
        cerrable: false,
        cuerpo: "<div class='candidatos'>" + candidatos + "</div>"
    });
}

function elegirDTDeLista(id) {
    const c = CANDIDATOS_DT.filter(function(x) { return x.id === id; })[0];
    if (!c) return;

    if (presidente.dineroEnCaja < c.costo) {
        toastError("No hay caja para pagar ese contrato.");
        return;
    }

    elegirDT(c);
    if (typeof noticiaDeEleccionDT === "function") noticiaDeEleccionDT(c);

    UI.cerrar("dt");
    if (typeof sonidoLogro === "function") sonidoLogro();
    toastExito("<strong>" + escapar(c.nombre) + "</strong> es el nuevo DT", "usuario");
    guardarPartida();
    refrescar();

    setTimeout(mostrarDecisionVAR, 320);
}

function mostrarDecisionVAR() {
    UI.modal({
        id: "var",
        eyebrow: "Primera medida",
        titulo: "¿Activás el VAR?",
        sub: "Reduce a la mitad los errores arbitrales, pero cuesta caro.",
        cuerpo:
            "<p class='modal-parrafo'>Los clubes grandes lo piden. Los chicos temen que el gasto salga de su parte.</p>" +
            "<div class='cifras'>" +
            "<div class='cifra'><span>Activación</span><strong class='neg'>-$2.000M</strong></div>" +
            "<div class='cifra'><span>Mantenimiento</span><strong class='neg'>-$500M / año</strong></div>" +
            "<div class='cifra'><span>Efecto</span><strong class='pos'>−50% errores</strong></div>" +
            "</div>",
        pie: [
            { texto: "Sin VAR por ahora", accion: "var-no", tipo: "fantasma" },
            { texto: "Activar el VAR", accion: "var-si", tipo: "primario" }
        ]
    });
}

function decidirVAR(activar) {
    if (activar) {
        if (!activarVAR()) {
            toastError("No hay caja suficiente para activar el VAR.");
            return;
        }
        noticiaDeVAR(true);
    } else {
        noticiaDeVAR(false);
    }
    UI.cerrar("var");
    guardarPartida();
    refrescar();
    setTimeout(mostrarEleccionSponsor, 300);
}

// -----------------------------
// SPONSOR
// -----------------------------

function mostrarEleccionSponsor() {
    const ofertas = generarOfertasSponsors();
    const cards = ofertas.map(function(s, i) {
        return "<button class='sponsor-card' data-accion='elegir-sponsor' data-idx='" + i + "'>" +
            "<span class='sponsor-logo'>" + htmlLogoSponsor(s.id, s.nombre, 60) + "</span>" +
            "<strong>" + escapar(s.nombre) + "</strong>" +
            "<span class='sponsor-rubro'>" + escapar(s.rubro) + " · " + escapar(s.popularidad) + "</span>" +
            "<span class='sponsor-monto'>" + fmt.plata(s.montoBase) + " por año</span>" +
            "<span class='sponsor-bonus'>+" + fmt.plata(s.bonusPrestigio) + " si el prestigio llega a 60</span>" +
            "</button>";
    }).join("");

    window._ofertasSponsor = ofertas;

    UI.modal({
        id: "sponsors",
        eyebrow: "Año " + presidente.anioMandato,
        titulo: "Sponsor principal",
        sub: "Contrato por dos años. El bonus se cobra por fecha si el prestigio acompaña.",
        ancho: "ancho",
        cerrable: false,
        cuerpo: "<div class='sponsors'>" + cards + "</div>"
    });
}

function elegirSponsor(idx) {
    const ofertas = window._ofertasSponsor || [];
    const s = ofertas[idx];
    if (!s) return;
    firmarSponsor(s);
    UI.cerrar("sponsors");
    window._ofertasSponsor = null;
    guardarPartida();
    refrescar();
    setTimeout(drenarModales, 260);
}

// -----------------------------
// AVANZAR FECHA
// -----------------------------

function avanzarFecha() {
    if (!partidaIniciada) return;
    if (UI.hayModal()) return;
    if (estadoLigas.fechaActual >= estadoLigas.totalFechas) return;

    const clasico = buscarClasicoSinArbitro();
    if (clasico) {
        mostrarModalDesignacion(clasico);
        return;
    }
    ejecutarFecha();
}

function buscarClasicoSinArbitro() {
    const ligaId = "primera";
    const numeroFecha = estadoLigas.fechaActual;
    const calendario = estadoLigas.calendarios[ligaId];
    if (!calendario || numeroFecha >= calendario.length) return null;
    const fecha = calendario[numeroFecha];
    for (let i = 0; i < fecha.length; i++) {
        const partido = fecha[i];
        if (esClasico(partido.local, partido.visitante)) {
            const clave = clavePartido(ligaId, numeroFecha, i);
            if (!designacionesPorFecha[clave]) {
                return {
                    ligaId: ligaId,
                    numeroFecha: numeroFecha,
                    indicePartido: i,
                    local: EQUIPOS[partido.local],
                    visitante: EQUIPOS[partido.visitante]
                };
            }
        }
    }
    return null;
}

function ejecutarFecha() {
    if (typeof sonidoAvanzar === "function") sonidoAvanzar();

    let incidencia = null;
    try {
        jugarFechaTodasLasLigas();
        procesarFechaFinanciera();
        incidencia = detectarIncidencia();
    } catch (e) {
        console.error("Error simulando la fecha", e);
    }

    actualizarConsejoFecha();
    if (typeof actualizarTecnicos === "function") actualizarTecnicos();
    desgasteNatural();
    guardarSnapshot();
    revisarLogros();

    const total = estadoLigas.totalFechas;
    const fechasAmistoso = [Math.round(total * 0.2), Math.round(total * 0.4), Math.round(total * 0.6), Math.round(total * 0.8)];
    if (fechasAmistoso.indexOf(estadoLigas.fechaActual) !== -1 && presidente.seleccionador) {
        try { simularAmistoso(); } catch (e) { console.error(e); }
        actualizarConsejoFecha();
    }

    // Eliminatorias al Mundial 2030: seis fechas por año
    const fechasElim = [5, 10, 15, 20, 25, 30];
    if (fechasElim.indexOf(estadoLigas.fechaActual) !== -1 && estadoEliminatorias.ronda < totalRondasElim()) {
        const rondaElim = jugarRondaEliminatorias();
        if (rondaElim && rondaElim.propio) {
            const p = rondaElim.propio;
            toastInfo("<strong>Eliminatorias</strong> " + p.local + " " + p.golesLocal + " - " + p.golesVisitante + " " + p.visitante, "globo");
            if (typeof agregarNoticia === "function") {
                agregarNoticia("TyC Sports", "Eliminatorias: " + p.local + " " + p.golesLocal + " - " + p.golesVisitante + " " + p.visitante,
                    "La Selección sigue su camino al Mundial 2030.", "rumor");
            }
        }
        if (estadoEliminatorias.ronda >= totalRondasElim()) cerrarEliminatorias();
    }

    if (estadoLigas.fechaActual > 0 && estadoLigas.fechaActual % 12 === 0) {
        generarEncuesta();
        toastInfo("Nueva encuesta de opinión publicada", "grafico");
    }

    if (estadoLigas.fechaActual > 0 && estadoLigas.fechaActual % 18 === 0) {
        colaModales.push({ tipo: "conferencia", datos: generarConferencia() });
    }

    if (estadoLigas.fechaActual > 0 && estadoLigas.fechaActual % 10 === 0 && probabilidad(0.8 * Dificultad().agresividad)) {
        colaModales.push({ tipo: "evento", datos: generarEvento() });
    }

    if (estadoLigas.fechaActual > 0 && estadoLigas.fechaActual % 6 === 0) {
        const decision = proximaDecision();
        if (decision) colaModales.push({ tipo: "decision", datos: decision });
    }

    // Copa de la Liga: 7 fechas de zonas y tres rondas de playoffs
    const f = estadoLigas.fechaActual;
    if (f >= 7 && f <= 13) {
        try { jugarRondaCopaLiga(); } catch (e) { console.error("Copa de la Liga", e); }
    } else if (f >= 14 && f <= 16) {
        try {
            const r = jugarCopaDeLaLiga();
            if (r && r.fase === "final" && r.campeon && EQUIPOS[r.campeon]) {
                toastExito("Copa de la Liga: " + EQUIPOS[r.campeon].nombre + " campeón", "trofeo");
            }
        } catch (e) { console.error("Copa de la Liga", e); }
    }

    // Ventana de pases
    if (ventanaAbierta()) {
        const ofertas = abrirVentanaMercado();
        if (ofertas.length) colaModales.push({ tipo: "mercado", datos: ofertas });
    }

    // Pedido de un dirigente
    if (estadoLigas.fechaActual > 0 && estadoLigas.fechaActual % 12 === 6) {
        const pedido = generarPedidoDirigente();
        if (pedido) colaModales.push({ tipo: "pedido", datos: pedido });
    }

    // Debate electoral: cuatro fechas antes del cierre
    if (estadoLigas.fechaActual === total - 4 && !debateDelAnio()) {
        colaModales.push({ tipo: "debate", datos: null });
    }

    // Expedientes que vencen
    const expediente = procesarExpedientes();
    if (expediente) colaModales.push({ tipo: "expediente", datos: expediente });

    // Streaming: alguien opinó de vos
    if (probabilidad(0.5)) {
        const clip = generarClipStreaming();
        if (clip.tono === "negativo") {
            toastNoticia("<strong>" + escapar(clip.streamer) + "</strong>: " + escapar(clip.titulo), "mensaje");
        }
    }
    if (incidencia) clipSobreArbitro(incidencia.incidencia);

    // La prensa cruza el fallo con el SECANUCA
    if (incidencia && incidencia.incidencia && incidencia.incidencia.clubFavorecidoId &&
        typeof noticiaSecanuca === "function" && probabilidad(0.4)) {
        noticiaSecanuca(incidencia.incidencia.clubFavorecidoId,
            "Después del fallo en " + incidencia.incidencia.local + " vs " + incidencia.incidencia.visitante + ".");
    }

    // ¿Se descubrió una designación hecha a mano?
    if (incidencia && incidencia.incidencia && incidencia.incidencia.manual && probabilidad(0.55)) {
        colaModales.push({ tipo: "escandalo_designacion", datos: incidencia.incidencia });
    }

    if (incidencia) colaModales.unshift({ tipo: "incidencia", datos: incidencia });

    // ¿Se filtró algún operativo de la fecha?
    if (typeof procesarOperativosDeLaFecha === "function") {
        const escandaloOperativo = procesarOperativosDeLaFecha();
        if (escandaloOperativo) colaModales.push({ tipo: "escandalo_operativo", datos: escandaloOperativo });
    }

    // Recordatorio de campaña antes de la asamblea
    if (estadoLigas.fechaActual === 25 && typeof accionesCampanaRestantes === "function" && accionesCampanaRestantes() > 0) {
        toastAlerta("Quedan " + accionesCampanaRestantes() + " acciones de campaña. La asamblea se acerca.", "bandera");
    }

    if (puedeCensura()) colaModales.push({ tipo: "censura", datos: null });

    guardarPartida();
    refrescar();

    if (estadoLigas.fechaActual >= estadoLigas.totalFechas) {
        setTimeout(finDeAnio, 420);
        return;
    }

    // Fecha en vivo: mostramos los resultados si no hay nada urgente que resolver
    if (typeof mostrarFechaEnVivo === "function" && !colaModales.length && !UI.hayModal()) {
        setTimeout(mostrarFechaEnVivo, 260);
    }

    setTimeout(drenarModales, 300);
}

function detectarIncidencia() {
    const resultados = estadoLigas.resultados.primera;
    if (!resultados || !resultados.length) return null;
    const ultima = resultados[resultados.length - 1];
    const calendario = estadoLigas.calendarios.primera;
    const numero = estadoLigas.fechaActual - 1;
    const fecha = calendario[numero];
    if (!fecha) return null;
    for (let i = 0; i < ultima.length; i++) {
        const r = ultima[i];
        if (!r.incidencia) continue;
        const partido = fecha[i];
        if (partido && esClasico(partido.local, partido.visitante)) {
            return { incidencia: r.incidencia, partido: { local: r.local, visitante: r.visitante } };
        }
    }
    return null;
}

// -----------------------------
// COLA DE MODALES
// -----------------------------

function drenarModales() {
    if (!colaModales.length) return;
    if (UI.hayModal()) return;
    const item = colaModales.shift();
    if (item.tipo === "decision") mostrarDecision(item.datos);
    else if (item.tipo === "evento") mostrarEvento(item.datos);
    else if (item.tipo === "conferencia") mostrarConferenciaPrensa(item.datos);
    else if (item.tipo === "incidencia") mostrarIncidencia(item.datos);
    else if (item.tipo === "censura") mostrarCensura();
    else if (item.tipo === "mercado") mostrarVentanaMercado();
    else if (item.tipo === "pedido") mostrarPedidoDirigente(item.datos);
    else if (item.tipo === "debate") abrirDebate();
    else if (item.tipo === "expediente") mostrarExpediente(item.datos);
    else if (item.tipo === "escandalo_designacion") mostrarEscandaloDesignacion(item.datos);
    else if (item.tipo === "escandalo_operativo") mostrarEscandaloOperativo(item.datos);
}

function mostrarEscandaloOperativo(op) {
    UI.modal({
        id: "escandalo-operativo",
        eyebrow: "Escándalo",
        titulo: "Se filtró el operativo",
        sub: "Un audio, un veedor arrepentido, un periodista con fuente.",
        cerrable: false,
        cuerpo: "<p class='modal-parrafo'>Salió a la luz que la AFA operó el partido donde se benefició a <strong>" +
            escapar(EQUIPOS[op.clubId] ? EQUIPOS[op.clubId].nombre : "un club") + "</strong>. " +
            "El operativo era de intensidad <strong>" + escapar(op.intensidad) + "</strong>.</p>" +
            "<div class='aviso rojo'>" + icono("alerta", "", 18) +
            "<div><div class='aviso-titulo'>La oposición pide juicio político</div>" +
            "<div class='aviso-texto'>-8 de prestigio y -6 de apoyo. El SECANUCA sube el índice del club implicado.</div></div></div>",
        pie: [{ texto: "Bancar el cachetazo", accion: "cerrar-escandalo-operativo", tipo: "primario" }]
    });
}

function cerrarEscandaloOperativo() {
    UI.cerrar("escandalo-operativo");
    guardarPartida();
    refrescar();
    setTimeout(drenarModales, 240);
}

// -----------------------------
// ESCÁNDALO DE DESIGNACIÓN
// -----------------------------

function mostrarEscandaloDesignacion(inc) {
    if (!inc || inc._aplicado) return;
    inc._aplicado = true;

    ajustarPrestigio(-6, "Escándalo de designación");
    ajustarApoyo(-5, "Escándalo de designación");
    presidente.escandalosDesignacion = (presidente.escandalosDesignacion || 0) + 1;

    const arbitro = ARBITROS_PRIMERA.filter(function(a) { return a.id === inc.arbitroId; })[0];
    if (arbitro) arbitro.sospechoso = true;

    UI.modal({
        id: "escandalo-designacion",
        eyebrow: "Escándalo",
        titulo: "Se descubrió la mano",
        sub: "Un periodista cruzó las planillas y encontró tu designación.",
        cerrable: false,
        cuerpo:
            "<p class='modal-parrafo'>La designación de <strong>" + escapar(inc.arbitro) + "</strong> para " +
            escapar(inc.local) + " vs " + escapar(inc.visitante) + " quedó bajo sospecha: el árbitro cobró una jugada " +
            "polémica que cambió el resultado.</p>" +
            "<div class='aviso rojo'>" + icono("alerta", "", 18) +
            "<div><div class='aviso-titulo'>La oposición pide una auditoría</div>" +
            "<div class='aviso-texto'>Perdés prestigio y apoyo. La prensa habla de \"mano negra\" en la AFA.</div></div></div>",
        pie: [{ texto: "Aguantar el temporal", accion: "cerrar-escandalo", tipo: "primario" }]
    });
}

function cerrarEscandalo() {
    UI.cerrar("escandalo-designacion");
    guardarPartida();
    refrescar();
    setTimeout(drenarModales, 240);
}

// -----------------------------
// PEDIDO DE UN DIRIGENTE
// -----------------------------

function mostrarPedidoDirigente(pedido) {
    const dirigente = dirigentePorId(pedido.dirigenteId);
    const club = dirigente ?EQUIPOS[dirigente.clubId] : null;

    const opciones = pedido.opciones.map(function(op, i) {
        return "<button class='opcion' data-accion='resolver-pedido' data-idx='" + i + "'>" +
            "<span class='opcion-marca'>" + String.fromCharCode(65 + i) + "</span>" +
            "<span class='opcion-cuerpo'><span class='opcion-titulo'>" + escapar(op.texto) + "</span>" +
            "<span class='opcion-resumen'>" + parsearResumen(op.resumen) + "</span></span></button>";
    }).join("");

    window._pedidoActivo = pedido;

    UI.modal({
        id: "pedido",
        eyebrow: "Pedido de un dirigente",
        titulo: pedido.titulo,
        sub: pedido.texto,
        ancho: "ancho",
        cerrable: false,
        cuerpo:
            "<div class='dirigente-ficha'>" +
            (club ? htmlEscudo(club.id, club.nombre, 44) : "") +
            "<div><strong>" + escapar(dirigente ? dirigente.nombre : "") + "</strong>" +
            "<div class='mini tenue'>" + escapar(dirigente ? dirigente.rol : "") + " · lealtad " + (dirigente ? Math.round(dirigente.lealtad) : "?") + "</div></div>" +
            "</div>" +
            "<div class='opciones'>" + opciones + "</div>"
    });
}

function decidirPedido(idx) {
    const pedido = window._pedidoActivo;
    if (!pedido) return;
    const op = resolverPedidoDirigente(idx);
    if (!op) return;
    window._pedidoActivo = null;
    UI.cerrar("pedido");
    toastInfo("Respondiste el pedido de " + escapar((dirigentePorId(pedido.dirigenteId) || {}).nombre || "un dirigente"), "consejo");
    guardarPartida();
    refrescar();
    setTimeout(drenarModales, 240);
}

// -----------------------------
// EXPEDIENTES
// -----------------------------

function mostrarExpediente(exp) {
    const efecto = exp.efecto || {};
    const ajustes = [];
    if (efecto.dinero) ajustes.push("<span class='tag " + (efecto.dinero > 0 ? "verde" : "rojo") + "'>" + fmt.plata(efecto.dinero) + "</span>");
    if (efecto.apoyo) ajustes.push("<span class='tag " + (efecto.apoyo > 0 ? "verde" : "rojo") + "'>" + fmt.delta(efecto.apoyo) + " apoyo</span>");
    if (efecto.prestigio) ajustes.push("<span class='tag " + (efecto.prestigio > 0 ? "verde" : "rojo") + "'>" + fmt.delta(efecto.prestigio) + " prestigio</span>");

    window._expedienteActivo = exp;

    UI.modal({
        id: "expediente",
        eyebrow: "Expediente",
        titulo: exp.titulo,
        sub: exp.descripcion,
        cerrable: false,
        cuerpo:
            "<div class='aviso " + (exp.tono || "azul") + "'>" + icono("lista", "", 18) +
            "<div><div class='aviso-titulo'>Se resolvió el expediente</div>" +
            "<div class='aviso-texto'>" + escapar(exp.resultado) + "</div></div></div>" +
            (ajustes.length ? "<div class='fila wrap' style='gap:6px;margin-top:12px'>" + ajustes.join("") + "</div>" : ""),
        pie: [{ texto: "Tomar nota", accion: "cerrar-expediente", tipo: "primario" }]
    });
}

function cerrarExpediente() {
    const exp = window._expedienteActivo;
    if (exp) resolverExpediente(exp.id);
    window._expedienteActivo = null;
    UI.cerrar("expediente");
    guardarPartida();
    refrescar();
    setTimeout(drenarModales, 240);
}

// -----------------------------
// VENTANA DE MERCADO DE PASES
// -----------------------------

function mostrarVentanaMercado() {
    if (!ofertasPendientes().length) { setTimeout(drenarModales, 200); return; }
    UI.modal({
        id: "mercado",
        eyebrow: "Ventana de pases",
        titulo: "Los europeos llaman",
        sub: "Tenés ofertas por las figuras del torneo. La AFA cobra el 8% de solidaridad; el club decide si vende.",
        ancho: "ancho",
        cerrable: false,
        cuerpo: "<div id='mercado-cuerpo'>" + htmlVentanaMercado() + "</div>"
    });
}

function htmlVentanaMercado() {
    const pendientes = ofertasPendientes();
    if (!pendientes.length) {
        return "<div class='vacio'>" + icono("check", "", 26) + "<strong>Ventana cerrada</strong>" +
            "<p>Todas las ofertas quedaron resueltas.</p>" +
            "<button class='btn-primario' data-accion='cerrar-mercado'>Continuar</button></div>";
    }

    return pendientes.map(function(oferta) {
        const figura = estadoMercado.figuras.filter(function(f) { return f.id === oferta.figuraId; })[0];
        const club = EQUIPOS[oferta.clubId];
        if (!figura) return "";
        const posClass = "pos-" + figura.posicion.toLowerCase();
        return "<div class='oferta-mercado'>" +
            "<div class='oferta-cab'>" +
            "<span class='pos-badge " + posClass + "'>" + figura.posicion + "</span>" +
            "<div class='crecer'><strong>" + escapar(figura.nombre) + "</strong>" +
            "<div class='mini tenue'>" + escapar(club ? club.nombre : "") + " · " + figura.edad + " años · nivel " + figura.nivel + "</div></div>" +
            "<div class='oferta-monto'>" + fmt.plata(oferta.monto) + "<span class='mini tenue'>de " + escapar(oferta.comprador) + "</span></div>" +
            "</div>" +
            "<div class='oferta-acciones'>" +
            "<button class='btn' data-accion='mercado-decidir' data-id='" + oferta.id + "' data-decision='vender'>Aprobar venta <span class='mini pos'>+" + fmt.plata(comisionAFA(oferta.monto)) + "</span></button>" +
            "<button class='btn' data-accion='mercado-decidir' data-id='" + oferta.id + "' data-decision='renegociar'>Renegociar <span class='mini tenue'>+25% o nada</span></button>" +
            "<button class='btn-suave' data-accion='mercado-decidir' data-id='" + oferta.id + "' data-decision='retener'>Retener <span class='mini tenue'>+4 apoyo</span></button>" +
            "</div></div>";
    }).join("");
}

function decidirMercado(idOferta, decision) {
    const resultado = resolverOferta(idOferta, decision);
    if (!resultado) { toastError("Esa oferta ya se resolvió."); return; }
    toastInfo(resultado.mensaje, "maletin");
    guardarPartida();
    refrescar();
    const cuerpo = document.getElementById("mercado-cuerpo");
    if (cuerpo) cuerpo.innerHTML = htmlVentanaMercado();
}

function cerrarMercado() {
    UI.cerrar("mercado");
    guardarPartida();
    refrescar();
    setTimeout(drenarModales, 240);
}

// -----------------------------
// DECISIONES
// -----------------------------

function proximaDecision() {
    const usadas = presidente.historialDecisiones.map(function(d) { return d.id; });
    return obtenerDecisionDisponible(usadas);
}

function mostrarDecision(decision) {
    const opciones = decision.opciones.map(function(op, i) {
        return "<button class='opcion' data-accion='decidir' data-idx='" + i + "'>" +
            "<span class='opcion-marca'>" + String.fromCharCode(65 + i) + "</span>" +
            "<span class='opcion-cuerpo'>" +
            "<span class='opcion-titulo'>" + escapar(op.texto) + "</span>" +
            (op.resumen ? "<span class='opcion-resumen'>" + parsearResumen(op.resumen) + "</span>" : "") +
            "</span></button>";
    }).join("");

    window._decisionActiva = decision;

    UI.modal({
        id: "decision",
        eyebrow: categoriaLegible(decision.categoria),
        titulo: decision.titulo,
        sub: decision.descripcion,
        cuerpo: "<div class='opciones'>" + opciones + "</div>",
        cerrable: false
    });
}

function parsearResumen(resumen) {
    const seguro = escapar(resumen);
    return seguro
        .replace(/\+\$?(\d[\d.]*)\s?M/g, "<span class='tag verde'>+$$1M</span>")
        .replace(/-\$?(\d[\d.]*)\s?M/g, "<span class='tag rojo'>−$$1M</span>")
        .replace(/\+(\d+)\s*(apoyo|prestigio)/gi, "<span class='tag verde'>+$1 $2</span>")
        .replace(/(^|\s)-(\d+)\s*(apoyo|prestigio)/gi, "$1<span class='tag rojo'>−$2 $3</span>");
}

function categoriaLegible(cat) {
    const mapa = {
        institucional: "Decisión institucional",
        deportiva: "Decisión deportiva",
        deportivo: "Decisión deportiva",
        economica: "Decisión económica",
        economico: "Decisión económica",
        federal: "Decisión federal",
        mediatica: "Decisión mediática",
        seleccion: "Selección"
    };
    return mapa[cat] || "Decisión de gestión";
}

function decidirOpcion(idx) {
    const decision = window._decisionActiva;
    if (!decision) return;
    const op = decision.opciones[idx];
    if (!op) return;

    const antes = {
        apoyo: presidente.apoyoClubes,
        prestigio: presidente.prestigioInternacional,
        dinero: presidente.dineroEnCaja
    };

    try { op.efecto(); } catch (e) { console.error("Error aplicando decisión", e); }

    const deltas = {
        apoyo: presidente.apoyoClubes - antes.apoyo,
        prestigio: presidente.prestigioInternacional - antes.prestigio,
        dinero: presidente.dineroEnCaja - antes.dinero,
        categoria: decision.categoria === "institucional" ? 3 : 1
    };

    registrarDecision(decision, op);
    reaccionConsejo(decision, deltas);
    if (typeof noticiaDeDecision === "function") noticiaDeDecision(decision.titulo, op.texto);

    UI.cerrar("decision");
    window._decisionActiva = null;
    if (typeof sonidoDecision === "function") sonidoDecision();

    revisarLogros();
    guardarPartida();
    refrescar();
    setTimeout(drenarModales, 260);
}

// -----------------------------
// EVENTOS
// -----------------------------

function mostrarEvento(evento) {
    window._eventoActivo = evento;

    if (evento.tanda) {
        UI.modal({
            id: "evento",
            eyebrow: "Se define por penales",
            titulo: evento.titulo,
            sub: evento.descripcion || "",
            cerrable: false,
            cuerpo: "<div class='aviso oro'>" + icono("objetivo", "", 18) +
                "<div><div class='aviso-titulo'>Cinco penales, una historia</div>" +
                "<div class='aviso-texto'>Elegí dónde patear y dónde atajar. Podés ganar prestigio, apoyo y plata.</div></div></div>",
            pie: [{ texto: "Jugar la tanda", accion: "evento-tanda", tipo: "primario" }]
        });
        return;
    }

    if (evento.automatico) {
        try { evento.efecto(); } catch (e) {}
        registrarEvento(evento, "Automático");
        UI.modal({
            id: "evento",
            eyebrow: "Noticia de último momento",
            titulo: evento.titulo,
            sub: evento.descripcion || "",
            cuerpo: evento.resultado ? "<p class='modal-parrafo'>" + escapar(evento.resultado) + "</p>" : "",
            pie: [{ texto: "Continuar", accion: "cerrar-evento", tipo: "primario" }]
        });
        return;
    }

    const opciones = (evento.opciones || []).map(function(op, i) {
        return "<button class='opcion' data-accion='resolver-evento' data-idx='" + i + "'>" +
            "<span class='opcion-marca'>" + String.fromCharCode(65 + i) + "</span>" +
            "<span class='opcion-cuerpo'>" +
            "<span class='opcion-titulo'>" + escapar(op.texto) + "</span>" +
            (op.resumen ? "<span class='opcion-resumen'>" + parsearResumen(op.resumen) + "</span>" : "") +
            "</span></button>";
    }).join("");

    UI.modal({
        id: "evento",
        eyebrow: "Te toca decidir",
        titulo: evento.titulo,
        sub: evento.descripcion || "",
        cuerpo: "<div class='opciones'>" + opciones + "</div>",
        cerrable: false
    });
}

function resolverEvento(idx) {
    const evento = window._eventoActivo;
    if (!evento) return;
    const op = evento.opciones[idx];
    if (!op) return;
    try { op.efecto(); } catch (e) { console.error(e); }
    registrarEvento(evento, op.texto);
    
    window._eventoActivo = null;
    UI.cerrar("evento");
    guardarPartida();
    refrescar();
    revisarLogros();
    setTimeout(drenarModales, 240);
}

function cerrarEvento() {
    window._eventoActivo = null;
    UI.cerrar("evento");
    refrescar();
    setTimeout(drenarModales, 200);
}

// -----------------------------
// INCIDENCIA ARBITRAL
// -----------------------------

function mostrarIncidencia(datos) {
    const inc = datos.incidencia;
    window._incidenciaActiva = datos;
    const opciones = [
        { texto: "Sancionar al árbitro", resumen: "+3 apoyo, +2 prestigio, -$200M" },
        { texto: "Defenderlo públicamente", resumen: "-4 apoyo, -3 prestigio" },
        { texto: "Pedir disculpas institucionales", resumen: "+2 prestigio, -1 apoyo" }
    ].map(function(op, i) {
        return "<button class='opcion' data-accion='resolver-incidencia' data-idx='" + i + "'>" +
            "<span class='opcion-marca'>" + String.fromCharCode(65 + i) + "</span>" +
            "<span class='opcion-cuerpo'><span class='opcion-titulo'>" + op.texto + "</span>" +
            "<span class='opcion-resumen'>" + parsearResumen(op.resumen) + "</span></span></button>";
    }).join("");

    UI.modal({
        id: "incidencia",
        eyebrow: "Escándalo arbitral",
        titulo: "Polémica en el clásico",
        sub: (inc.titulo || "El árbitro quedó en el ojo de la tormenta.") + " · " + datos.partido.local + " vs " + datos.partido.visitante,
        cuerpo: "<div class='opciones'>" + opciones + "</div>",
        cerrable: false
    });
}

function resolverIncidencia(idx) {
    const datos = window._incidenciaActiva;
    if (!datos) return;
    if (idx === 0) {
        ajustarApoyo(3, "Sanción al árbitro");
        ajustarPrestigio(2, "Sanción al árbitro");
        ajustarDinero(-200, "Investigación arbitral");
    } else if (idx === 1) {
        ajustarApoyo(-4, "Defender al árbitro");
        ajustarPrestigio(-3, "Defender al árbitro");
    } else {
        ajustarPrestigio(2, "Disculpas institucionales");
        ajustarApoyo(-1, "Disculpas institucionales");
    }
    window._incidenciaActiva = null;
    UI.cerrar("incidencia");
    refrescar();
    setTimeout(drenarModales, 240);
}

// -----------------------------
// CENSURA
// -----------------------------

function mostrarCensura() {
    UI.modal({
        id: "censura",
        eyebrow: "Moción de censura",
        titulo: "El consejo pide una asamblea anticipada",
        sub: "La confianza cayó demasiado. Se vota tu continuidad ahora mismo.",
        cerrable: false,
        cuerpo: "<p class='modal-parrafo'>Si perdés la votación, tu mandato termina hoy. Si ganás, el consejo te da una " +
            "segunda oportunidad y recuperás algo de confianza.</p>",
        pie: [{ texto: "Enfrentar la asamblea", accion: "censura-votar", tipo: "primario" }]
    });
}

function resolverCensura() {
    UI.cerrar("censura");
    const resultado = resolverEleccion();
    if (resultado.gana) {
        ajustarConfianzaTodos(14, "Sobreviviste a la censura");
        toastExito("Ganaste la moción con " + Math.round(resultado.pct * 100) + "% de los votos", "consejo");
        guardarPartida();
        refrescar();
    } else {
        terminarMandato(resultado, "censura");
    }
}

// -----------------------------
// FIN DE AÑO
// -----------------------------

function finDeAnio() {
    if (presidente.anioMandato === 1 || presidente.anioMandato === 3) {
        try { simularCopa(); } catch (e) { console.error(e); }
        if (copaActual && copaActual.posicionArgentina === "campeon" && typeof sonidoLogro === "function") sonidoLogro();
    }
    try { simularContinentales(); } catch (e) { console.error(e); }

    empeorarDeudasAlCierre();
    cobrarIngresosAnuales();
    cobrarEgresosAnuales();
    cerrarAnioFinanciero();

    actualizarOposicion();
    const resultadosObjetivos = evaluarObjetivos();

    // Mundial 2030 al cierre del último año
    let mundial = null;
    if (presidente.anioMandato >= presidente.anioMaximo) {
        try { mundial = jugarMundial(); } catch (e) { console.error(e); }
    }

    const eleccion = resolverEleccion();

    revisarLogros();

    // Registramos la temporada en la hemeroteca y damos los premios
    try { registrarTemporada(); } catch (e) { console.error(e); }

    let mundialClubes = null;
    try { mundialClubes = jugarMundialDeClubes(); } catch (e) { console.error("Mundial de Clubes", e); }

    guardarPartida();
    refrescar();

    if (typeof mostrarGalaPremios === "function") {
        const premios = calcularPremios();
        mostrarGalaPremios(premios, function() {
            mostrarCierreDeAnio(resultadosObjetivos, eleccion, mundial, mundialClubes);
        });
    } else {
        mostrarCierreDeAnio(resultadosObjetivos, eleccion, mundial);
    }
}

function mostrarCierreDeAnio(objetivos, eleccion, mundial, mundialClubes) {
    const balance = estadoFinanzas.historial[estadoFinanzas.historial.length - 1] || { ingresos: 0, egresos: 0, balance: 0 };
    const conf = ConfianzaConsejo();
    const gana = eleccion.gana;
    const ultimoAnio = presidente.anioMandato >= presidente.anioMaximo;

    const objetivosHTML = objetivos.map(function(r) {
        return "<div class='objetivo-fila " + (r.cumplido ? "ok" : "fallo") + "'>" +
            "<span class='objetivo-marca'>" + (r.cumplido ? icono("check", "", 14) : icono("cruz", "", 14)) + "</span>" +
            "<span class='crecer'>" + escapar(r.obj.titulo) + "</span>" +
            "<span class='mini tenue'>" + Math.round(r.progreso * 100) + "%</span></div>";
    }).join("");

    const cuerpo =
        "<div class='cierre-grid'>" +
        "<div class='cierre-bloque'>" +
        "<h4>Balance del año</h4>" +
        "<div class='metrica-fila'><span>Ingresos</span><strong class='pos'>" + fmt.plata(balance.ingresos) + "</strong></div>" +
        "<div class='metrica-fila'><span>Egresos</span><strong class='neg'>" + fmt.plata(-balance.egresos) + "</strong></div>" +
        "<div class='metrica-fila'><span>Resultado</span><strong class='" + (balance.balance >= 0 ? "pos" : "neg") + "'>" + fmt.plata(balance.balance) + "</strong></div>" +
        "<div class='metrica-fila'><span>Caja final</span><strong>" + fmt.plata(presidente.dineroEnCaja) + "</strong></div>" +
        "</div>" +
        "<div class='cierre-bloque'>" +
        "<h4>Objetivos del consejo</h4>" + objetivosHTML +
        "<div class='metrica-fila'><span>Confianza del consejo</span><strong>" + conf + " / 100</strong></div>" +
        "</div>" +
        "</div>" +
        "<div class='asamblea-resultado " + (gana ? "gana" : "pierde") + "'>" +
        "<div class='asamblea-resultado-num'>" + Math.round(eleccion.pct * 100) + "%</div>" +
        "<div class='crecer'>" +
        "<strong>" + (gana ? "La asamblea te ratifica" : "La asamblea te dio la espalda") + "</strong>" +
        "<div class='mini tenue'>" + eleccion.si + " votos a favor · " + eleccion.no + " en contra · " + eleccion.abstencion + " abstenciones</div>" +
        "</div></div>" +
        (mundial ? "<div class='aviso " + (mundial.posicion === "campeón" ? "verde" : mundial.posicion === "no clasificado" ? "rojo" : "oro") + "' style='margin-top:14px'>" +
            icono("trofeo", "", 18) +
            "<div><div class='aviso-titulo'>Mundial 2030 · " + escapar(textoMundial(mundial.posicion)) + "</div>" +
            "<div class='aviso-texto'>" + (mundial.premio ? "Premio: " + fmt.plata(mundial.premio) + " · +" + (mundial.prestigio || 0) + " de prestigio." : "Sin premio.") + "</div></div></div>" : "") +
        (mundialClubes ? "<div class='aviso azul' style='margin-top:14px'>" + icono("trofeo", "", 18) +
            "<div><div class='aviso-titulo'>Mundial de Clubes</div>" +
            "<div class='aviso-texto'>Campeón: <strong>" + escapar(mundialClubes) + "</strong>.</div></div></div>" : "") +
        (function() {
            const h = estadoHistorial.temporadas.length ? estadoHistorial.temporadas[estadoHistorial.temporadas.length - 1] : null;
            if (!h || !h.clasificados) return "";
            return "<div class='aviso azul' style='margin-top:14px'>" + icono("globo", "", 18) +
                "<div><div class='aviso-titulo'>Clasificados a las copas</div>" +
                "<div class='aviso-texto'>Libertadores: " + h.clasificados.libertadores.join(", ") + ".<br>" +
                "Sudamericana: " + h.clasificados.sudamericana.join(", ") + ".</div></div></div>";
        })();

    UI.modal({
        id: "cierre",
        eyebrow: "Fin del año " + presidente.anioMandato,
        titulo: gana ? (ultimoAnio ? "Mandato completo" : "Reelegido") : "Mandato terminado",
        sub: gana
            ? (ultimoAnio ? "Terminaste los " + presidente.anioMaximo + " años de gestión. Es hora del balance final." : "El consejo y los clubes te dan otro año.")
            : "Los clubes perdieron la confianza en tu gestión.",
        ancho: "ancho",
        cerrable: false,
        cuerpo: cuerpo,
        pie: gana
            ? (ultimoAnio
                ? [{ texto: "Ver mi legado", accion: "terminar-mandato", tipo: "primario" }]
                : [{ texto: "Comenzar el año " + (presidente.anioMandato + 1), accion: "nueva-temporada", tipo: "primario" }])
            : [{ texto: "Ver mi legado", accion: "terminar-mandato", tipo: "primario" }]
    });
}

function nuevaTemporada() {
    UI.cerrar("cierre");
    aplicarAscensosYDescensos();

    estadoLigas.fechaActual = 0;
    estadoLigas.resultados = {};
    estadoLigas.calendarios = {};
    estadoLigas.tablas = {};
    estadoCopaArgentina.anio = presidente.anioMandato + 1;
    estadoCopaArgentina.activa = false;
    estadoCopaArgentina.rondaActual = 0;
    estadoCopaArgentina.equiposVivos = [];
    estadoCopaArgentina.bracket = [];
    if (typeof historialAmistosos !== "undefined") historialAmistosos.length = 0;

    resetearLigasParaNuevaTemporada();
    inicializarTablas();
    generarTodosLosCalendarios();

    presidente.anioMandato++;
    reiniciarCampana();
    generarObjetivosAnio();
    generarCamadaJuveniles();
    estadoFinanzas.rescatesDelAnio = 0;

    // Copa de la Liga de la temporada nueva
    try { iniciarCopaLiga(); } catch (e) { console.error("Copa de la Liga", e); }

    // Supercopa Argentina: campeón de liga vs campeón de la Copa
    try {
        const supercopa = jugarSupercopa();
        if (supercopa) {
            toastExito("Supercopa: " + supercopa.ganador + " levantó el trofeo", "trofeo");
        }
    } catch (e) { console.error("Supercopa", e); }

    guardarSnapshot();
    guardarPartida();
    refrescar();

    toastExito("Año " + presidente.anioMandato + " en marcha", "calendario");

    if (sponsorVencido()) setTimeout(mostrarEleccionSponsor, 600);
    else if (tvVencida()) setTimeout(mostrarRenovacionTV, 600);
}

function mostrarRenovacionTV() {
    UI.modal({
        id: "tv",
        eyebrow: "Contrato de televisión",
        titulo: "Se vence el contrato de TV",
        sub: "Actual: " + fmt.plata(estadoFinanzas.tv.montoAnual) + " por año. Elegí cómo renegociar.",
        cuerpo:
            "<p class='modal-parrafo'>La TV es el 60% de los ingresos de la AFA. Una mala decisión te condiciona dos años.</p>" +
            "<div class='opciones'>" +
            "<button class='opcion' data-accion='renovar-tv' data-op='seguro'><span class='opcion-marca'>A</span><span class='opcion-cuerpo'>" +
            "<span class='opcion-titulo'>Renovar con la misma empresa</span><span class='opcion-resumen'>+6% asegurado. Sin riesgo, sin gloria.</span></span></button>" +
            "<button class='opcion' data-accion='renovar-tv' data-op='abierto'><span class='opcion-marca'>B</span><span class='opcion-cuerpo'>" +
            "<span class='opcion-titulo'>Licitación abierta</span><span class='opcion-resumen'>55% de chances de +32%; si sale mal, −12%.</span></span></button>" +
            "<button class='opcion' data-accion='renovar-tv' data-op='plataforma'><span class='opcion-marca'>C</span><span class='opcion-cuerpo'>" +
            "<span class='opcion-titulo'>Plataforma de streaming</span><span class='opcion-resumen'>+18% y modernidad, pero −4 de apoyo.</span></span></button>" +
            "</div>",
        cerrable: false
    });
}

function elegirRenovacionTV(opcion) {
    const mensaje = renovarTV(opcion);
    UI.cerrar("tv");
    toastInfo(mensaje, "dinero");
    guardarPartida();
    refrescar();
}

function terminarMandato(eleccion, motivo) {
    const puntos = puntajeLegado();
    const rango = rangoLegado(puntos);
    UI.cerrarTodo();

    UI.modal({
        id: "legado",
        eyebrow: "Fin de la partida",
        titulo: "Tu mandato terminó",
        sub: motivo === "censura" ? "Una moción de censura puso fin a tu gestión." :
            motivo === "completo" ? "Cumpliste los " + presidente.anioMaximo + " años de mandato." :
            "La asamblea no te renovó el mandato.",
        ancho: "ancho",
        cerrable: false,
        cuerpo:
            "<div class='legado-final'>" +
            "<div class='legado-puntos'><span>" + puntos + "</span><small>puntos de legado</small></div>" +
            "<div class='legado-rango' style='color:" + rango.color + "'>" + rango.nombre + "</div>" +
            "<p class='tenue centro'>" + rango.desc + "</p>" +
            "<div class='legado-datos'>" +
            "<div><span>Años</span><strong>" + presidente.anioMandato + "</strong></div>" +
            "<div><span>Apoyo final</span><strong>" + presidente.apoyoClubes + "</strong></div>" +
            "<div><span>Prestigio</span><strong>" + presidente.prestigioInternacional + "</strong></div>" +
            "<div><span>Logros</span><strong>" + cantidadLogros() + " / " + LOGROS.length + "</strong></div>" +
            "</div>" +
            (typeof desgloseLegado === "function" ? "<div style='margin-top:14px'>" +
                desgloseLegado().map(function(d) {
                    return "<div class='metrica-fila'><span>" + escapar(d.nombre) + "</span><strong class='" + (d.valor >= 0 ? "pos" : "neg") + "'>" + d.valor + "</strong></div>";
                }).join("") + "</div>" : "") +
            "</div>",
        pie: [
            { texto: "Ver documental", accion: "ver-documental", tipo: "fantasma" },
            { texto: "Ver logros", accion: "ir-legado", tipo: "fantasma" },
            { texto: "Nueva partida", accion: "reiniciar-partida", tipo: "primario" }
        ]
    });
    partidaIniciada = false;
    presidente.mandatoTerminado = true;
    // El mandato terminó: que recargar no reviva la partida en el cierre.
    if (typeof CLAVE_AUTO !== "undefined") Almacen.borrar(CLAVE_AUTO);
}

// -----------------------------
// ACCIONES DEL JUGADOR
// -----------------------------

function accionRescatar(id) {
    if (UI.hayModal()) return;
    const r = rescatarClub(id);
    if (!r.exito) { toastError(r.motivo); return; }
    toastExito(r.mensajePolitico, "escudo");
    refrescar();
    guardarPartida();
}

function accionPedirPrestamo(monto) {
    const r = pedirPrestamo(monto);
    if (!r.ok) { toastError(r.motivo); return; }
    toastExito("Préstamo acreditado: " + fmt.plata(monto), "dinero");
    refrescar();
    guardarPartida();
}

function accionCampana(id) {
    const r = aplicarAccionCampana(id);
    if (!r.ok) { toastError(r.motivo); return; }
    toastExito("Campaña: <strong>" + escapar(r.accion.nombre) + "</strong>", "consejo");
    refrescar();
    guardarPartida();
}

function accionRenunciar() {
    UI.modal({
        id: "renuncia",
        eyebrow: "Confirmación",
        titulo: "¿Renunciar al mandato?",
        sub: "Se termina la partida y se calcula tu legado.",
        cuerpo: "<p class='modal-parrafo'>No se puede deshacer.</p>",
        pie: [
            { texto: "Seguir jugando", accion: "cerrar-modal", tipo: "fantasma" },
            { texto: "Renunciar", accion: "confirmar-renuncia", tipo: "peligro" }
        ]
    });
}

function confirmarRenuncia() {
    UI.cerrar("renuncia");
    terminarMandato({ pct: 0, si: 0, no: 0, abstencion: 0 }, "censura");
}

// -----------------------------
// ARRANQUE
// -----------------------------

function arrancarJuego() {
    if (hayPartidaGuardada()) {
        mostrarBienvenida(infoPartidaGuardada());
    } else {
        iniciarPartidaNueva();
    }
}

