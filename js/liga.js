// ============================================
// LIGA: simulación de las 3 divisiones (una sola vuelta)
// ============================================

const estadoLigas = {
    fechaActual: 0,
    totalFechas: 0,
    calendarios: {},
    resultados: {},
    tablas: {}
};

// -----------------------------
// INICIALIZAR TABLAS
// -----------------------------
function inicializarTablas() {
    Object.keys(LIGAS).forEach(function(ligaId) {
        estadoLigas.tablas[ligaId] = {};
        estadoLigas.resultados[ligaId] = [];
        estadoLigas.calendarios[ligaId] = [];

        LIGAS[ligaId].equipos.forEach(function(idEquipo) {
            const eq = EQUIPOS[idEquipo];
            estadoLigas.tablas[ligaId][idEquipo] = {
                id: idEquipo,
                nombre: eq.nombre,
                PJ: 0, G: 0, E: 0, P: 0, GF: 0, GC: 0, DG: 0, Pts: 0
            };
        });
    });
}

// -----------------------------
// GENERAR CALENDARIO (una sola vuelta)
// -----------------------------
function generarCalendarioLiga(ligaId) {
    const equiposIds = LIGAS[ligaId].equipos.slice();
    const n = equiposIds.length;

    const tieneFantasma = n % 2 !== 0;
    if (tieneFantasma) equiposIds.push(-1);

    const totalEquipos = equiposIds.length;
    const fechas = totalEquipos - 1;
    const partidosPorFecha = totalEquipos / 2;

    let equipos = equiposIds.slice();
    const calendario = [];

    for (let f = 0; f < fechas; f++) {
        const fecha = [];
        for (let p = 0; p < partidosPorFecha; p++) {
            const local = equipos[p];
            const visitante = equipos[totalEquipos - 1 - p];

            if (local !== -1 && visitante !== -1) {
                fecha.push({ local: local, visitante: visitante });
            }
        }
        if (fecha.length > 0) calendario.push(fecha);

        const fijo = equipos[0];
        const resto = equipos.slice(1);
        resto.unshift(resto.pop());
        equipos = [fijo].concat(resto);
    }

    return calendario;
}

function generarTodosLosCalendarios() {
    let maxFechas = 0;
    Object.keys(LIGAS).forEach(function(ligaId) {
        const cal = generarCalendarioLiga(ligaId);
        estadoLigas.calendarios[ligaId] = cal;
        if (cal.length > maxFechas) maxFechas = cal.length;
    });
    estadoLigas.totalFechas = maxFechas;
}

// -----------------------------
// JUGAR UNA FECHA (todas las ligas)
// -----------------------------
function jugarFechaTodasLasLigas() {
    if (estadoLigas.fechaActual >= estadoLigas.totalFechas) return false;

    Object.keys(LIGAS).forEach(function(ligaId) {
        const calendario = estadoLigas.calendarios[ligaId];
        if (estadoLigas.fechaActual >= calendario.length) return;

        designarArbitrosDeFecha(ligaId, estadoLigas.fechaActual);

        const fecha = calendario[estadoLigas.fechaActual];
        const resultadosDeLaFecha = [];

        fecha.forEach(function(partido, indice) {
            const eqLocal = EQUIPOS[partido.local];
            const eqVisitante = EQUIPOS[partido.visitante];

            const operativo = (typeof operativoDelPartido === "function")
                ? operativoDelPartido(ligaId, estadoLigas.fechaActual, indice)
                : null;
            const sesgo = operativo ? { lado: operativo.lado, goles: operativo.goles } : null;

            let resultado = simularPartido(eqLocal, eqVisitante, sesgo ? { sesgo: sesgo } : undefined);
            if (operativo) resultado.operativo = operativo;

            const arbitro = obtenerArbitroDePartido(ligaId, estadoLigas.fechaActual, indice);
            if (arbitro) {
                resultado = aplicarEfectoArbitro(resultado, arbitro, { ligaId: ligaId, fecha: estadoLigas.fechaActual, idx: indice });

                if (resultado.incidencia) {
                    resultado.incidencia.manual = esDesignacionManual(ligaId, estadoLigas.fechaActual, indice);
                    registrarIncidencia(
                        { local: resultado.local, visitante: resultado.visitante },
                        resultado.incidencia,
                        ligaId
                    );
                }
            }

            resultado.goles = asignarGoleadoresDelPartido(partido.local, partido.visitante, resultado);

            // Clásicos: historial y noticia
            if (typeof registrarClasico === "function" && ligaId === "primera") {
                const clasico = registrarClasico(partido.local, partido.visitante, resultado.golesLocal, resultado.golesVisitante);
                if (clasico && probabilidad(0.7)) {
                    resultado.clasico = clasico.nombre;
                }
            }

            resultadosDeLaFecha.push(resultado);
            actualizarTablaConResultado(ligaId, partido.local, partido.visitante, resultado);
        });

        estadoLigas.resultados[ligaId].push(resultadosDeLaFecha);
    });

    // ====== COPA ARGENTINA (en paralelo) ======
    // Se juega una ronda cada 5 fechas, empezando en la fecha 5.
    if (estadoLigas.fechaActual > 0 && estadoLigas.fechaActual % 5 === 0) {
        if (!estadoCopaArgentina.activa && estadoCopaArgentina.rondaActual === 0) {
            iniciarCopaArgentina();
        }
        if (estadoCopaArgentina.activa && estadoCopaArgentina.equiposVivos.length > 1) {
            simularRondaCopaArgentina();
        }
    }

    estadoLigas.fechaActual++;
    return true;
}

// -----------------------------
// ACTUALIZAR TABLA
// -----------------------------
function actualizarTablaConResultado(ligaId, idLocal, idVisitante, resultado) {
    const local = estadoLigas.tablas[ligaId][idLocal];
    const visitante = estadoLigas.tablas[ligaId][idVisitante];

    local.PJ++;
    visitante.PJ++;
    local.GF += resultado.golesLocal;
    local.GC += resultado.golesVisitante;
    visitante.GF += resultado.golesVisitante;
    visitante.GC += resultado.golesLocal;

    if (resultado.golesLocal > resultado.golesVisitante) {
        local.G++; local.Pts += 3; visitante.P++;
    } else if (resultado.golesLocal < resultado.golesVisitante) {
        visitante.G++; visitante.Pts += 3; local.P++;
    } else {
        local.E++; visitante.E++;
        local.Pts++; visitante.Pts++;
    }

    local.DG = local.GF - local.GC;
    visitante.DG = visitante.GF - visitante.GC;
}

// -----------------------------
// OBTENER TABLA ORDENADA
// -----------------------------
function obtenerTablaOrdenada(ligaId) {
    const equipos = Object.values(estadoLigas.tablas[ligaId]);
    equipos.sort(function(a, b) {
        if (b.Pts !== a.Pts) return b.Pts - a.Pts;
        if (b.DG !== a.DG) return b.DG - a.DG;
        return b.GF - a.GF;
    });
    return equipos;
}