// ============================================
// GUARDADO 3.0: autoguardado, 3 ranuras y export
// ============================================

const CLAVE_AUTO = "afa_manager_auto_v3";
const CLAVE_SLOT = "afa_manager_slot_v3_";
const VERSION_PARTIDA = 3;

const SLOTS = [1, 2, 3];

// -----------------------------
// SERIALIZACIÓN
// -----------------------------

function serializarPartida() {
    return {
        version: VERSION_PARTIDA,
        fechaGuardado: ahora(),
        dificultad: dificultadActual,
        presidente: {
            nombre: presidente.nombre,
            anioMandato: presidente.anioMandato,
            anioMaximo: presidente.anioMaximo,
            apoyoClubes: presidente.apoyoClubes,
            prestigioInternacional: presidente.prestigioInternacional,
            dineroEnCaja: presidente.dineroEnCaja,
            seleccionador: presidente.seleccionador,
            varActivo: presidente.varActivo,
            historialDecisiones: presidente.historialDecisiones,
            promesas: presidente.promesas,
            historial: presidente.historial,
            cambios: presidente.cambios,
            desgasteApoyo: presidente.desgasteApoyo,
            desgastePrestigio: presidente.desgastePrestigio,
            escenario: presidente.escenario,
            modificadores: presidente.modificadores,
            relacionPrensaBase: presidente.relacionPrensaBase,
            tandaAnio: presidente.tandaAnio,
            ultimaDesignacionLibre: presidente.ultimaDesignacionLibre,
            escandalosDesignacion: presidente.escandalosDesignacion,
            plantillasUsadas: presidente.plantillasUsadas || [],
            fechaVivoModo: presidente.fechaVivoModo || "siempre",
            reunionReglamento: presidente.reunionReglamento || 0,
            ultimaMesaChica: presidente.ultimaMesaChica != null ? presidente.ultimaMesaChica : -6
        },
        estadoLigas: {
            fechaActual: estadoLigas.fechaActual,
            totalFechas: estadoLigas.totalFechas,
            calendarios: estadoLigas.calendarios,
            resultados: estadoLigas.resultados,
            tablas: estadoLigas.tablas
        },
        equipos: EQUIPOS,
        proximoIdEquipo: typeof proximoIdEquipo !== "undefined" ? proximoIdEquipo : 104,
        ligasEstructura: {
            primera: LIGAS.primera.equipos.slice(),
            nacional: LIGAS.nacional.equipos.slice(),
            federalA: LIGAS.federalA.equipos.slice()
        },
        estadoFinanzas: estadoFinanzas,
        consejo: miembrosConsejo,
        asamblea: estadoAsamblea,
        objetivos: estadoObjetivos,
        logros: logrosDesbloqueados,
        copaActual: copaActual,
        historialCopas: historialCopas,
        historialContinentales: historialContinentales,
        ranking: ESTADO_RANKING,
        noticias: noticiasHistoricas,
        encuestas: encuestasHistoricas,
        eventos: eventosHistoricos,
        incidencias: incidenciasHistoricas,
        designaciones: designacionesPorFecha,
        arbitros: ARBITROS_PRIMERA,
        copaArgentina: estadoCopaArgentina,
        historialAmistosos: typeof historialAmistosos !== "undefined" ? historialAmistosos : [],
        seleccion: estadoSeleccion,
        mercado: estadoMercado,
        oposicion: estadoOposicion,
        dirigentes: estadoDirigentes,
        expedientes: estadoExpedientes,
        goleadores: estadoGoleadores,
        inferiores: estadoInferiores,
        eliminatorias: estadoEliminatorias,
        historial: estadoHistorial,
        secanuca: estadoSecanuca,
        operativos: estadoOperativo,
        tecnicos: estadoTecnicos,
        clasicos: estadoClasicos,
        reglamento: reglamentoActual(),
        copaLiga: estadoCopaLiga,
        mundialClubes: estadoMundialClubes,
        veedores: estadoVeedores,
        streaming: { clips: estadoStreaming.clips, opiniones: STREAMERS.map(function(s) { return { id: s.id, opinion: s.opinion }; }) },
        sonido: typeof sonidoActivo !== "undefined" ? sonidoActivo : true
    };
}

function aplicarPartida(datos) {
    if (!datos || !datos.presidente) return false;

    dificultadActual = datos.dificultad || "real";

    Object.assign(presidente, datos.presidente);
    presidente.historialDecisiones = datos.presidente.historialDecisiones || [];
    presidente.promesas = datos.presidente.promesas || [];
    presidente.historial = datos.presidente.historial || [];
    presidente.cambios = datos.presidente.cambios || [];

    // Equipos
    Object.keys(EQUIPOS).forEach(function(id) { delete EQUIPOS[id]; });
    Object.keys(datos.equipos || {}).forEach(function(id) { EQUIPOS[id] = datos.equipos[id]; });
    if (typeof proximoIdEquipo !== "undefined" && datos.proximoIdEquipo) proximoIdEquipo = datos.proximoIdEquipo;

    if (datos.ligasEstructura) {
        ["primera", "nacional", "federalA"].forEach(function(k) {
            if (datos.ligasEstructura[k]) {
                LIGAS[k].equipos.length = 0;
                datos.ligasEstructura[k].forEach(function(id) { LIGAS[k].equipos.push(id); });
            }
        });
    }

    Object.assign(estadoLigas, datos.estadoLigas || {});

    Object.assign(estadoFinanzas, datos.estadoFinanzas || {});
    estadoFinanzas.libro = (datos.estadoFinanzas && datos.estadoFinanzas.libro) || [];
    estadoFinanzas.prestamos = (datos.estadoFinanzas && datos.estadoFinanzas.prestamos) || [];

    miembrosConsejo = datos.consejo || [];
    if (!miembrosConsejo.length) reiniciarConsejo();

    Object.assign(estadoAsamblea, datos.asamblea || {});
    Object.assign(estadoObjetivos, datos.objetivos || {});
    logrosDesbloqueados = datos.logros || {};

    copaActual = datos.copaActual || null;
    historialCopas.length = 0;
    (datos.historialCopas || []).forEach(function(c) { historialCopas.push(c); });
    historialContinentales.length = 0;
    (datos.historialContinentales || []).forEach(function(c) { historialContinentales.push(c); });

    Object.assign(ESTADO_RANKING, datos.ranking || { puesto: 1, historial: [] });

    noticiasHistoricas.length = 0;
    (datos.noticias || []).forEach(function(n) { noticiasHistoricas.push(n); });
    encuestasHistoricas.length = 0;
    (datos.encuestas || []).forEach(function(n) { encuestasHistoricas.push(n); });
    eventosHistoricos.length = 0;
    (datos.eventos || []).forEach(function(n) { eventosHistoricos.push(n); });
    incidenciasHistoricas.length = 0;
    (datos.incidencias || []).forEach(function(n) { incidenciasHistoricas.push(n); });

    Object.keys(designacionesPorFecha).forEach(function(k) { delete designacionesPorFecha[k]; });
    Object.keys(datos.designaciones || {}).forEach(function(k) { designacionesPorFecha[k] = datos.designaciones[k]; });

    if (datos.arbitros && datos.arbitros.length) {
        ARBITROS_PRIMERA.length = 0;
        datos.arbitros.forEach(function(a) { ARBITROS_PRIMERA.push(a); });
    }

    Object.assign(estadoCopaArgentina, datos.copaArgentina || {});

    if (typeof historialAmistosos !== "undefined") {
        historialAmistosos.length = 0;
        (datos.historialAmistosos || []).forEach(function(h) { historialAmistosos.push(h); });
    }

    if (datos.seleccion && datos.seleccion.plantel && datos.seleccion.plantel.length) {
        estadoSeleccion.plantel = datos.seleccion.plantel;
        estadoSeleccion.convocados = datos.seleccion.convocados || [];
        estadoSeleccion.generado = true;
        estadoSeleccion.anioGenerado = datos.seleccion.anioGenerado || 1;
    }

    if (datos.mercado) {
        estadoMercado.figuras = datos.mercado.figuras || [];
        estadoMercado.ofertas = datos.mercado.ofertas || [];
        estadoMercado.historial = datos.mercado.historial || [];
        estadoMercado.ultimaVentana = datos.mercado.ultimaVentana != null ? datos.mercado.ultimaVentana : -1;
        estadoMercado.ventanas = datos.mercado.ventanas || 0;
        estadoMercado.totalVendido = datos.mercado.totalVendido || 0;
    }

    if (datos.oposicion) {
        estadoOposicion.lider = datos.oposicion.lider || null;
        estadoOposicion.ultimoDebate = datos.oposicion.ultimoDebate || null;
        estadoOposicion.historial = datos.oposicion.historial || [];
        estadoOposicion.debate = null;
    }

    if (datos.dirigentes) {
        estadoDirigentes.lista = datos.dirigentes.lista || [];
        estadoDirigentes.pedido = datos.dirigentes.pedido || null;
        estadoDirigentes.historial = datos.dirigentes.historial || [];
    }

    if (datos.expedientes) {
        estadoExpedientes.abiertos = datos.expedientes.abiertos || [];
        estadoExpedientes.resueltos = datos.expedientes.resueltos || [];
    }

    if (datos.goleadores) {
        estadoGoleadores.tabla = datos.goleadores.tabla || {};
    }

    if (datos.inferiores) {
        estadoInferiores.nivel = datos.inferiores.nivel != null ? datos.inferiores.nivel : 50;
        estadoInferiores.juveniles = datos.inferiores.juveniles || [];
        estadoInferiores.invertido = datos.inferiores.invertido || 0;
        estadoInferiores.camadas = datos.inferiores.camadas || 0;
    }

    if (datos.eliminatorias) {
        estadoEliminatorias.rondas = datos.eliminatorias.rondas || [];
        estadoEliminatorias.ronda = datos.eliminatorias.ronda || 0;
        estadoEliminatorias.tabla = datos.eliminatorias.tabla || {};
        estadoEliminatorias.resultados = datos.eliminatorias.resultados || [];
        estadoEliminatorias.estadoFinal = datos.eliminatorias.estadoFinal || null;
        estadoEliminatorias.mundial = datos.eliminatorias.mundial || null;
    }

    if (datos.historial) {
        estadoHistorial.temporadas = datos.historial.temporadas || [];
        estadoHistorial.puntos = datos.historial.puntos || {};
        estadoHistorial.supercopas = datos.historial.supercopas || [];
        estadoHistorial.records = datos.historial.records || {};
    }

    if (datos.secanuca) {
        estadoSecanuca.puntos = datos.secanuca.puntos || {};
        estadoSecanuca.eventos = datos.secanuca.eventos || [];
    }

    if (datos.operativos) {
        estadoOperativo.habilitadoEn = datos.operativos.habilitadoEn || 0;
        estadoOperativo.porPartido = datos.operativos.porPartido || {};
        estadoOperativo.historial = datos.operativos.historial || [];
    }

    if (datos.tecnicos) {
        estadoTecnicos.porClub = datos.tecnicos.porClub || {};
        estadoTecnicos.cesantes = datos.tecnicos.cesantes || [];
    }

    if (datos.clasicos) {
        estadoClasicos.historial = datos.clasicos.historial || {};
    }

    if (datos.reglamento) {
        presidente.reglamento = datos.reglamento;
    }

    if (datos.copaLiga) {
        estadoCopaLiga.activa = !!datos.copaLiga.activa;
        estadoCopaLiga.anio = datos.copaLiga.anio || 0;
        estadoCopaLiga.zonas = datos.copaLiga.zonas || { A: [], B: [] };
        estadoCopaLiga.tablas = datos.copaLiga.tablas || { A: {}, B: {} };
        estadoCopaLiga.rondas = datos.copaLiga.rondas || { A: [], B: [] };
        estadoCopaLiga.ronda = datos.copaLiga.ronda || 0;
        estadoCopaLiga.playoffs = datos.copaLiga.playoffs || null;
        estadoCopaLiga.campeon = datos.copaLiga.campeon || null;
        estadoCopaLiga.historial = datos.copaLiga.historial || [];
    }

    if (datos.mundialClubes) {
        estadoMundialClubes.anio = datos.mundialClubes.anio || 0;
        estadoMundialClubes.participantes = datos.mundialClubes.participantes || [];
        estadoMundialClubes.campeon = datos.mundialClubes.campeon || null;
        estadoMundialClubes.historial = datos.mundialClubes.historial || [];
    }

    if (datos.veedores && typeof estadoVeedores !== "undefined") {
        estadoVeedores.porPartido = datos.veedores.porPartido || {};
    }

    if (datos.streaming) {
        estadoStreaming.clips = datos.streaming.clips || [];
        (datos.streaming.opiniones || []).forEach(function(o) {
            const s = streamerPorId(o.id);
            if (s) s.opinion = o.opinion;
        });
    }
    return true;
}

// -----------------------------
// GUARDAR / CARGAR
// -----------------------------

function guardarPartida() {
    try {
        const datos = serializarPartida();
        localStorage.setItem(CLAVE_AUTO, JSON.stringify(datos));
        return true;
    } catch (e) {
        console.warn("No se pudo guardar", e);
        return false;
    }
}

function hayPartidaGuardada() {
    return !!Almacen.leer(CLAVE_AUTO);
}

function infoPartidaGuardada() {
    const datos = Almacen.leer(CLAVE_AUTO);
    if (!datos) return null;
    return {
        anio: datos.presidente.anioMandato,
        fecha: datos.estadoLigas.fechaActual,
        dt: datos.presidente.seleccionador,
        fechaGuardado: datos.fechaGuardado,
        dificultad: datos.dificultad
    };
}

function cargarPartida() {
    const datos = Almacen.leer(CLAVE_AUTO);
    if (!datos) return false;
    return aplicarPartida(datos);
}

function borrarPartida() {
    Almacen.borrar(CLAVE_AUTO);
    SLOTS.forEach(function(s) { Almacen.borrar(CLAVE_SLOT + s); });
}

// -----------------------------
// RANURAS
// -----------------------------

function listarSlots() {
    return SLOTS.map(function(slot) {
        const datos = Almacen.leer(CLAVE_SLOT + slot);
        return {
            slot: slot,
            datos: datos ? {
                anio: datos.presidente.anioMandato,
                fecha: datos.estadoLigas.fechaActual,
                fechaGuardado: datos.fechaGuardado,
                dt: datos.presidente.seleccionador
            } : null
        };
    });
}

function guardarPartidaSlot(slot) {
    if (SLOTS.indexOf(Number(slot)) === -1) return false;
    Almacen.escribir(CLAVE_SLOT + slot, serializarPartida());
    return true;
}

function cargarPartidaSlot(slot) {
    const datos = Almacen.leer(CLAVE_SLOT + slot);
    if (!datos) return false;
    return aplicarPartida(datos);
}

function borrarPartidaSlot(slot) {
    Almacen.borrar(CLAVE_SLOT + slot);
}

// Autoguardado de seguridad
setInterval(function() {
    if (typeof partidaIniciada !== "undefined" && partidaIniciada) guardarPartida();
}, 45000);
