// ============================================
// ÁRBITROS: cuerpo arbitral + efecto en partidos + VAR + designación
// ============================================
// EVOLUCIÓN v2.1:
// - Historial de incidencias por árbitro
// - Contador de favores por club
// - Sistema de sospecha
// - Perfil detallado

// -----------------------------
// CUERPO ARBITRAL
// -----------------------------

const ARBITROS_PRIMERA = [
    { id: 1, nombre: "Darío Herrera", nivel: 88, estilo: "muy estricto", incidencias: 0, sancionado: false, fechasSancion: 0 },
    { id: 2, nombre: "Facundo Tello", nivel: 90, estilo: "medio", incidencias: 0, sancionado: false, fechasSancion: 0 },
    { id: 3, nombre: "Leandro Rey Hilfer", nivel: 85, estilo: "estricto", incidencias: 0, sancionado: false, fechasSancion: 0 },
    { id: 4, nombre: "Fernando Espinoza", nivel: 82, estilo: "muy estricto", incidencias: 0, sancionado: false, fechasSancion: 0 },
    { id: 5, nombre: "Yael Falcón Pérez", nivel: 84, estilo: "estricto", incidencias: 0, sancionado: false, fechasSancion: 0 },
    { id: 6, nombre: "Nazareno Arasa", nivel: 80, estilo: "medio", incidencias: 0, sancionado: false, fechasSancion: 0 },
    { id: 7, nombre: "Andrés Merlos", nivel: 81, estilo: "medio", incidencias: 0, sancionado: false, fechasSancion: 0 },
    { id: 8, nombre: "Pablo Echavarría", nivel: 79, estilo: "medio", incidencias: 0, sancionado: false, fechasSancion: 0 },
    { id: 9, nombre: "Hernán Mastrángelo", nivel: 78, estilo: "medio", incidencias: 0, sancionado: false, fechasSancion: 0 },
    { id: 10, nombre: "Fernando Echenique", nivel: 80, estilo: "medio", incidencias: 0, sancionado: false, fechasSancion: 0 },
    { id: 11, nombre: "Silvio Trucco", nivel: 77, estilo: "permisivo", incidencias: 0, sancionado: false, fechasSancion: 0 },
    { id: 12, nombre: "Nicolás Ramírez", nivel: 76, estilo: "medio", incidencias: 0, sancionado: false, fechasSancion: 0 },
    { id: 13, nombre: "Sebastián Zunino", nivel: 75, estilo: "permisivo", incidencias: 0, sancionado: false, fechasSancion: 0 },
    { id: 14, nombre: "Pablo Dóvalo", nivel: 72, estilo: "permisivo", incidencias: 0, sancionado: false, fechasSancion: 0 },
    { id: 15, nombre: "Jorge Baliño", nivel: 70, estilo: "muy permisivo", incidencias: 0, sancionado: false, fechasSancion: 0 }
];

function generarArbitrosFicticios(ligaId) {
    const nombres = [
        "Ariel Ríos", "Gustavo Peralta", "Martín Salcedo", "Rodrigo Bustos",
        "Ezequiel Ferrari", "Lucas Bermúdez", "Diego Villalba", "Matías Ferreyra",
        "Nicolás Aguirre", "Emiliano Correa", "Pablo Monasterio", "Juan Cruz Molina",
        "Sergio Roldán", "Federico Paz", "Alan Quiroga", "Héctor Barrios",
        "Tomás Cardozo", "Iván Sosa", "Rubén Alcaraz", "Leandro Oliva"
    ];
    const estilos = ["permisivo", "medio", "estricto", "muy estricto"];

    const arbitros = [];
    const usados = new Set();
    for (let i = 0; i < 15; i++) {
        let nombre;
        do {
            nombre = nombres[Math.floor(Math.random() * nombres.length)];
        } while (usados.has(nombre));
        usados.add(nombre);

        arbitros.push({
            id: (ligaId === "nacional" ? 100 : 200) + i,
            nombre: nombre,
            nivel: 50 + Math.floor(Math.random() * 30),
            estilo: estilos[Math.floor(Math.random() * estilos.length)],
            incidencias: 0,
            sancionado: false,
            fechasSancion: 0
        });
    }
    return arbitros;
}

const ARBITROS = {
    primera: ARBITROS_PRIMERA,
    nacional: generarArbitrosFicticios("nacional"),
    federalA: generarArbitrosFicticios("federalA")
};

// -----------------------------
// INICIALIZAR ESTRUCTURA DE HISTORIAL
// -----------------------------
// Se llama al inicio del juego para asegurar que cada árbitro tenga
// las propiedades historial y favores.

function inicializarHistorialArbitros() {
    Object.keys(ARBITROS).forEach(function(ligaId) {
        ARBITROS[ligaId].forEach(function(arb) {
            if (!arb.historial) arb.historial = [];
            if (!arb.favores) arb.favores = {};
        });
    });
}

// -----------------------------
// DESIGNACIÓN DE ÁRBITROS
// -----------------------------

const designacionesPorFecha = {};
const designacionesManuales = {};

function clavePartido(ligaId, numeroFecha, indicePartido) {
    return ligaId + "_" + numeroFecha + "_" + indicePartido;
}

function fechaTieneDesignacionesCompletas(ligaId, numeroFecha) {
    const calendario = estadoLigas.calendarios[ligaId];
    if (!calendario || numeroFecha >= calendario.length) return true;
    const fecha = calendario[numeroFecha];
    for (let i = 0; i < fecha.length; i++) {
        const clave = clavePartido(ligaId, numeroFecha, i);
        if (!designacionesPorFecha[clave]) return false;
    }
    return true;
}

function designarArbitrosDeFecha(ligaId, numeroFecha) {
    if (fechaTieneDesignacionesCompletas(ligaId, numeroFecha)) return;

    const arbitros = ARBITROS[ligaId].filter(function(a) { return !a.sancionado; });
    if (arbitros.length === 0) return;

    const calendario = estadoLigas.calendarios[ligaId];
    if (!calendario || numeroFecha >= calendario.length) return;

    const fecha = calendario[numeroFecha];

    // Repartimos por cantidad de partidos dirigidos: el que menos tiene, agarra.
    const usos = {};
    Object.keys(designacionesPorFecha).forEach(function(k) {
        const id = designacionesPorFecha[k];
        usos[id] = (usos[id] || 0) + 1;
    });

    fecha.forEach(function(partido, indice) {
        const clave = clavePartido(ligaId, numeroFecha, indice);
        if (designacionesPorFecha[clave]) return;

        const orden = arbitros.slice().sort(function(a, b) {
            return (usos[a.id] || 0) - (usos[b.id] || 0);
        });
        const minimo = usos[orden[0].id] || 0;
        const candidatos = orden.filter(function(a) { return (usos[a.id] || 0) <= minimo + 1; });
        const elegido = candidatos[Math.floor(Math.random() * candidatos.length)];
        designacionesPorFecha[clave] = elegido.id;
        usos[elegido.id] = (usos[elegido.id] || 0) + 1;
    });
}

function obtenerArbitroDePartido(ligaId, numeroFecha, indicePartido) {
    const clave = clavePartido(ligaId, numeroFecha, indicePartido);
    const idArbitro = designacionesPorFecha[clave];
    if (!idArbitro) return null;

    const arbitros = ARBITROS[ligaId];
    return arbitros.find(function(a) { return a.id === idArbitro; }) || null;
}

function designarArbitroManual(ligaId, numeroFecha, indicePartido, idArbitro, manual) {
    const clave = clavePartido(ligaId, numeroFecha, indicePartido);
    designacionesPorFecha[clave] = idArbitro;
    if (manual) {
        designacionesManuales[clave] = {
            arbitroId: idArbitro,
            fecha: numeroFecha,
            ligaId: ligaId,
            indicePartido: indicePartido,
            anio: presidente.anioMandato
        };
    }
}

function esDesignacionManual(ligaId, numeroFecha, indicePartido) {
    return !!designacionesManuales[clavePartido(ligaId, numeroFecha, indicePartido)];
}

function manualesDeLaFecha(numeroFecha) {
    return Object.keys(designacionesManuales).map(function(k) { return designacionesManuales[k]; })
        .filter(function(d) { return d.fecha === numeroFecha; });
}

// -----------------------------
// EFECTO DEL ÁRBITRO EN EL PARTIDO
// -----------------------------

function aplicarEfectoArbitro(resultado, arbitro, contexto) {
    if (!arbitro) return { ...resultado, incidencia: null };

    const varActivo = presidente.varActivo === true;
    const factorVar = varActivo ? 0.5 : 1.0;

    const probabilidadBase = 0.15 * factorVar;
    const factorNivel = Math.pow(1 - (arbitro.nivel - 50) / 100, 2);
    // En las categorías de ascenso hay menos cámaras y menos polémica.
    const factorLiga = contexto && contexto.ligaId === "nacional" ? 0.7 : (contexto && contexto.ligaId === "federalA" ? 0.5 : 1);
    const conVeedor = (typeof tieneVeedor === "function" && contexto && contexto.fecha != null && tieneVeedor(contexto.ligaId, contexto.fecha, contexto.idx)) ? 0.45 : 1;
    const probabilidadFinal = Math.max(0.02, Math.min(0.20, probabilidadBase * factorNivel * factorLiga * conVeedor));

    if (Math.random() > probabilidadFinal) {
        return { ...resultado, incidencia: null };
    }

    arbitro.incidencias++;

    const tipos = ["penal", "golAnulado", "rojaDudosa"];
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    const favoreceLocal = Math.random() < 0.5;

    let golesLocal = resultado.golesLocal;
    let golesVisitante = resultado.golesVisitante;
    let descripcion = "";
    let clubFavorecidoId = null;
    let clubPerjudicadoId = null;

    if (tipo === "penal") {
        if (favoreceLocal) {
            golesLocal++;
            clubFavorecidoId = resultado.localId;
            clubPerjudicadoId = resultado.visitanteId;
            descripcion = "El árbitro " + arbitro.nombre + " cobró un penal dudoso a favor de " + resultado.local + ". Gol.";
        } else {
            golesVisitante++;
            clubFavorecidoId = resultado.visitanteId;
            clubPerjudicadoId = resultado.localId;
            descripcion = "El árbitro " + arbitro.nombre + " cobró un penal dudoso a favor de " + resultado.visitante + ". Gol.";
        }
    } else if (tipo === "golAnulado") {
        if (favoreceLocal && golesVisitante > 0) {
            golesVisitante--;
            clubFavorecidoId = resultado.localId;
            clubPerjudicadoId = resultado.visitanteId;
            descripcion = "El árbitro " + arbitro.nombre + " anuló un gol legítimo de " + resultado.visitante + " por un offside inexistente.";
        } else if (!favoreceLocal && golesLocal > 0) {
            golesLocal--;
            clubFavorecidoId = resultado.visitanteId;
            clubPerjudicadoId = resultado.localId;
            descripcion = "El árbitro " + arbitro.nombre + " anuló un gol legítimo de " + resultado.local + " por un offside inexistente.";
        } else {
            return { ...resultado, incidencia: null };
        }
    } else if (tipo === "rojaDudosa") {
        if (favoreceLocal && golesVisitante > 0 && Math.random() < 0.5) {
            golesVisitante--;
            clubFavorecidoId = resultado.localId;
            clubPerjudicadoId = resultado.visitanteId;
            descripcion = "El árbitro " + arbitro.nombre + " expulsó injustamente a un jugador de " + resultado.visitante + ", que se desmoronó.";
        } else if (!favoreceLocal && golesLocal > 0 && Math.random() < 0.5) {
            golesLocal--;
            clubFavorecidoId = resultado.visitanteId;
            clubPerjudicadoId = resultado.localId;
            descripcion = "El árbitro " + arbitro.nombre + " expulsó injustamente a un jugador de " + resultado.local + ", que se desmoronó.";
        } else {
            return { ...resultado, incidencia: null };
        }
    }

    const incidencia = {
        arbitro: arbitro.nombre,
        arbitroId: arbitro.id,
        descripcion: descripcion,
        tipo: tipo,
        clubFavorecidoId: clubFavorecidoId,
        clubPerjudicadoId: clubPerjudicadoId,
        local: resultado.local,
        visitante: resultado.visitante,
        localId: resultado.localId,
        visitanteId: resultado.visitanteId,
        golesOriginales: { local: resultado.golesLocal, visitante: resultado.golesVisitante },
        golesFinales: { local: golesLocal, visitante: golesVisitante },
        anio: presidente.anioMandato,
        fecha: estadoLigas.fechaActual,
        liga: contexto && contexto.ligaId ? LIGAS[contexto.ligaId].nombre : ""
    };

    registrarIncidenciaEnArbitro(arbitro, incidencia);

    return {
        local: resultado.local,
        visitante: resultado.visitante,
        localId: resultado.localId,
        visitanteId: resultado.visitanteId,
        golesLocal: golesLocal,
        golesVisitante: golesVisitante,
        stats: resultado.stats,
        incidencia: incidencia
    };
}

// -----------------------------
// REGISTRAR INCIDENCIA EN EL ÁRBITRO
// -----------------------------

function registrarIncidenciaEnArbitro(arbitro, incidencia) {
    if (!arbitro.historial) arbitro.historial = [];
    if (!arbitro.favores) arbitro.favores = {};

    // Guardar en el historial personal
    arbitro.historial.push({
        anio: incidencia.anio,
        fecha: incidencia.fecha,
        liga: incidencia.liga,
        local: incidencia.local,
        visitante: incidencia.visitante,
        tipo: incidencia.tipo,
        descripcion: incidencia.descripcion,
        clubFavorecidoId: incidencia.clubFavorecidoId,
        clubPerjudicadoId: incidencia.clubPerjudicadoId
    });

    // Sumar al contador de favores
    if (incidencia.clubFavorecidoId) {
        const idFav = incidencia.clubFavorecidoId;
        arbitro.favores[idFav] = (arbitro.favores[idFav] || 0) + 1;
    }
}

// -----------------------------
// SISTEMA DE SOSPECHA
// -----------------------------
// Cuanto más favorece a un mismo club, más sospechoso es.

function calcularSospechaArbitro(arbitro) {
    if (!arbitro.favores) return 0;

    let maxFavores = 0;
    Object.values(arbitro.favores).forEach(function(cantidad) {
        if (cantidad > maxFavores) maxFavores = cantidad;
    });

    // Sospecha = 0 si nadie supera 2 favores.
    // Sube 5 puntos por cada favor extra al mismo club.
    if (maxFavores <= 2) return 0;
    return (maxFavores - 2) * 5;
}

function obtenerClubMasFavorecido(arbitro) {
    if (!arbitro.favores) return null;
    let maxId = null;
    let maxCant = 0;
    Object.keys(arbitro.favores).forEach(function(id) {
        if (arbitro.favores[id] > maxCant) {
            maxCant = arbitro.favores[id];
            maxId = id;
        }
    });
    if (maxId === null) return null;
    return { id: parseInt(maxId), cantidad: maxCant, nombre: EQUIPOS[maxId] ? EQUIPOS[maxId].nombre : "?" };
}

function obtenerClubMasPerjudicado(arbitro) {
    if (!arbitro.historial) return null;
    const perjuicios = {};
    arbitro.historial.forEach(function(inc) {
        if (inc.clubPerjudicadoId) {
            perjuicios[inc.clubPerjudicadoId] = (perjuicios[inc.clubPerjudicadoId] || 0) + 1;
        }
    });
    let maxId = null;
    let maxCant = 0;
    Object.keys(perjuicios).forEach(function(id) {
        if (perjuicios[id] > maxCant) {
            maxCant = perjuicios[id];
            maxId = id;
        }
    });
    if (maxId === null) return null;
    return { id: parseInt(maxId), cantidad: maxCant, nombre: EQUIPOS[maxId] ? EQUIPOS[maxId].nombre : "?" };
}

// -----------------------------
// SANCIONES Y RECUPERACIÓN
// -----------------------------

function sancionarArbitro(idArbitro) {
    Object.keys(ARBITROS).forEach(function(ligaId) {
        const arb = ARBITROS[ligaId].find(function(a) { return a.id === idArbitro; });
        if (arb) {
            arb.sancionado = true;
            arb.fechasSancion = 5;
            arb.nivel = Math.max(40, arb.nivel - 5);
        }
    });
}

function procesarFechasSancion() {
    Object.keys(ARBITROS).forEach(function(ligaId) {
        ARBITROS[ligaId].forEach(function(arb) {
            if (arb.sancionado) {
                arb.fechasSancion--;
                if (arb.fechasSancion <= 0) {
                    arb.sancionado = false;
                    arb.fechasSancion = 0;
                }
            } else {
                if (arb.incidencias > 0 && Math.random() < 0.15) {
                    arb.incidencias = Math.max(0, arb.incidencias - 1);
                }
            }
        });
    });
}

// -----------------------------
// RANKING DE ÁRBITROS
// -----------------------------

function obtenerRankingArbitros(ligaId) {
    const arbitros = ARBITROS[ligaId].slice();

    arbitros.forEach(function(a) {
        a.confiabilidad = Math.max(0, a.nivel - (a.incidencias * 2) - calcularSospechaArbitro(a));
    });

    arbitros.sort(function(a, b) {
        return b.confiabilidad - a.confiabilidad;
    });

    return arbitros;
}

function obtenerArbitrosParaClasico(ligaId) {
    const ranking = obtenerRankingArbitros(ligaId);
    return ranking.filter(function(a) { return !a.sancionado; }).slice(0, 3);
}

// -----------------------------
// ¿ES UN CLÁSICO?
// -----------------------------

const CLASICOS = [
    [1, 2],    // River - Boca
    [3, 4],    // Racing - Independiente
    [5, 14],   // San Lorenzo - Argentinos
    [8, 9],    // Central - Newell's
    [6, 12],   // Estudiantes - Gimnasia
    [13, 15]   // Lanús - Banfield
];

function esClasico(idA, idB) {
    return CLASICOS.some(function(par) {
        return (par[0] === idA && par[1] === idB) || (par[0] === idB && par[1] === idA);
    });
}

// -----------------------------
// HISTORIAL GLOBAL DE INCIDENCIAS
// -----------------------------

const incidenciasHistoricas = [];

function registrarIncidencia(partido, incidencia, ligaId) {
    incidenciasHistoricas.push({
        arbitro: incidencia.arbitro,
        arbitroId: incidencia.arbitroId,
        descripcion: incidencia.descripcion,
        tipo: incidencia.tipo,
        liga: LIGAS[ligaId].nombre,
        local: partido.local,
        visitante: partido.visitante,
        localId: incidencia.localId,
        visitanteId: incidencia.visitanteId,
        golesOriginales: incidencia.golesOriginales,
        golesFinales: incidencia.golesFinales,
        manual: !!incidencia.manual,
        anio: presidente.anioMandato,
        fecha: incidencia.fecha,
        clubFavorecidoId: incidencia.clubFavorecidoId,
        clubPerjudicadoId: incidencia.clubPerjudicadoId
    });
    // No dejamos crecer el archivo sin límite: guardamos las últimas 600.
    if (incidenciasHistoricas.length > 600) incidenciasHistoricas.shift();

    // El SECANUCA registra el favor del fallo
    if (typeof registrarFavor === "function") {
        if (incidencia.clubFavorecidoId) {
            registrarFavor(incidencia.clubFavorecidoId, "arbitral", 4, incidencia.descripcion);
        }
        if (incidencia.clubPerjudicadoId) {
            registrarFavor(incidencia.clubPerjudicadoId, "arbitral", -2, "Falló en contra: " + incidencia.descripcion);
        }
    }
}

// -----------------------------
// VAR: COSTOS Y EFECTOS
// -----------------------------

const COSTO_VAR_INICIAL = 2000;
const COSTO_VAR_ANUAL = 500;

function activarVAR() {
    if (typeof tieneModificador === "function" && tieneModificador("sinvar")) return false;
    if (presidente.dineroEnCaja < COSTO_VAR_INICIAL) return false;
    ajustarDinero(-COSTO_VAR_INICIAL);
    presidente.varActivo = true;
    return true;
}

function desactivarVAR() {
    presidente.varActivo = false;
}

function cobrarVARAnual() {
    if (presidente.varActivo) {
        ajustarDinero(-COSTO_VAR_ANUAL);
    }
}