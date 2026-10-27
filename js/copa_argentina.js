// ============================================
// COPA ARGENTINA: torneo eliminatorio con sedes neutrales
// ============================================

const estadoCopaArgentina = {
    anio: 1,
    activa: false,
    rondaActual: 0,       // 0 = no iniciada, 1..7 = rondas
    equiposVivos: [],     // ids de clubes que siguen en carrera
    bracket: [],          // [{ ronda, partidos: [...], fecha: n }]
    historial: [],        // [{ anio, campeon, subcampeon, rondas }]
    sedeActual: null
};

// Nombres de las rondas según cantidad de equipos
const NOMBRES_RONDAS = {
    64: "Ronda Preliminar",
    32: "16avos de final",
    16: "Octavos de final",
    8:  "Cuartos de final",
    4:  "Semifinales",
    2:  "Final"
};

// Nombra la ronda aunque el cuadro no sea potencia de dos (103 clubes, etc.)
function nombreDeRonda(cantidad) {
    if (NOMBRES_RONDAS[cantidad]) return NOMBRES_RONDAS[cantidad];
    if (cantidad > 32) return "Ronda preliminar";
    if (cantidad > 16) return "16avos de final";
    if (cantidad > 8) return "Octavos de final";
    if (cantidad > 4) return "Cuartos de final";
    if (cantidad > 2) return "Semifinales";
    if (cantidad === 2) return "Final";
    return "Ronda de " + cantidad;
}

// -----------------------------
// INICIAR LA COPA
// -----------------------------

function iniciarCopaArgentina() {
    estadoCopaArgentina.anio = presidente.anioMandato;
    estadoCopaArgentina.activa = true;
    estadoCopaArgentina.rondaActual = 0;
    estadoCopaArgentina.equiposVivos = [];
    estadoCopaArgentina.bracket = [];

    // Todos los clubes participan
    Object.keys(EQUIPOS).forEach(function(id) {
        estadoCopaArgentina.equiposVivos.push(parseInt(id));
    });

    // Ordenar por peso histórico: los mejores de Primera no juegan la ronda preliminar
    estadoCopaArgentina.equiposVivos.sort(function(a, b) {
        return EQUIPOS[b].pesoHistorico - EQUIPOS[a].pesoHistorico;
    });
}

// -----------------------------
// SIMULAR UNA RONDA
// -----------------------------

function simularRondaCopaArgentina() {
    if (!estadoCopaArgentina.activa) return null;

    const vivos = estadoCopaArgentina.equiposVivos.slice();

    // Si quedan 2 o menos, es la final
    let equiposEnRonda = vivos.length;
    let nombreRonda = nombreDeRonda(equiposEnRonda);

    // ===== RONDA PRELIMINAR =====
    // Si hay 103 equipos, hacemos 51 partidos y dejamos 1 libre (el mejor de Primera).
    let partidos = [];
    let libres = [];

    if (equiposEnRonda === 103) {
        // El mejor de Primera (peso histórico más alto) pasa directo.
        libres.push(vivos[0]);
        const resto = vivos.slice(1); // 102 clubes

        // Emparejar: los peores contra los mejores de la parte baja
        // Mezclamos para que sea aleatorio pero con algo de criterio.
        for (let i = resto.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [resto[i], resto[j]] = [resto[j], resto[i]];
        }

        for (let i = 0; i < resto.length; i += 2) {
            partidos.push({ local: resto[i], visitante: resto[i + 1] });
        }
    } else {
        // En rondas normales, emparejamos a todos
        // Mezclar aleatoriamente
        for (let i = vivos.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [vivos[i], vivos[j]] = [vivos[j], vivos[i]];
        }

        for (let i = 0; i < vivos.length; i += 2) {
            if (i + 1 < vivos.length) {
                partidos.push({ local: vivos[i], visitante: vivos[i + 1] });
            } else {
                // Si sobra uno, pasa directo
                libres.push(vivos[i]);
            }
        }
    }

    // ===== SIMULAR CADA PARTIDO =====
    const resultadosRonda = [];

    partidos.forEach(function(partido) {
        const eqLocal = EQUIPOS[partido.local];
        const eqVisitante = EQUIPOS[partido.visitante];

        // Sorteo de sede neutral
        const sede = obtenerSedeAleatoria();

        // Bonus de localía provincial
        let fuerzaLocal = eqLocal.fuerza;
        let fuerzaVisitante = eqVisitante.fuerza;

        // Si el club es de la misma provincia que la sede, +3 de fuerza
        if (eqLocal.ligaId && eqLocal.provincia === sede.provincia) {
            fuerzaLocal += 3;
        }
        if (eqVisitante.ligaId && eqVisitante.provincia === sede.provincia) {
            fuerzaVisitante += 3;
        }

        // Simular partido con fuerzas ajustadas
        const resultado = simularPartido(
            { ...eqLocal, fuerza: fuerzaLocal },
            { ...eqVisitante, fuerza: fuerzaVisitante }
        );

        // Si hay empate, penales
        let penales = null;
        let ganadorId = null;

        if (resultado.golesLocal > resultado.golesVisitante) {
            ganadorId = partido.local;
        } else if (resultado.golesLocal < resultado.golesVisitante) {
            ganadorId = partido.visitante;
        } else {
            // Penales: 50/50 ajustado por fuerza
            const dif = fuerzaLocal - fuerzaVisitante;
            const probLocal = 0.5 + dif / 100;
            const ganaLocal = Math.random() < probLocal;
            penales = ganaLocal ? "4-3" : "3-4";
            ganadorId = ganaLocal ? partido.local : partido.visitante;
        }

        resultadosRonda.push({
            local: eqLocal.nombre,
            visitante: eqVisitante.nombre,
            localId: partido.local,
            visitanteId: partido.visitante,
            golesLocal: resultado.golesLocal,
            golesVisitante: resultado.golesVisitante,
            penales: penales,
            ganadorId: ganadorId,
            ganador: EQUIPOS[ganadorId].nombre,
            sede: sede,
            fuerzaLocal: fuerzaLocal,
            fuerzaVisitante: fuerzaVisitante
        });
    });

    // ===== ARMAR SIGUIENTE RONDA =====
    const ganadores = resultadosRonda.map(function(r) { return r.ganadorId; });
    const siguienteRonda = ganadores.concat(libres);

    // Guardar en el bracket
    estadoCopaArgentina.bracket.push({
        ronda: estadoCopaArgentina.rondaActual + 1,
        nombre: nombreRonda,
        partidos: resultadosRonda,
        libres: libres
    });

    estadoCopaArgentina.rondaActual++;
    estadoCopaArgentina.equiposVivos = siguienteRonda;

    // Noticias de la ronda
    generarNoticiasRondaCopa(nombreRonda, resultadosRonda);

    // Si queda 1 solo equipo, es el campeón
    if (siguienteRonda.length === 1) {
        coronarCampeonCopaArgentina(siguienteRonda[0]);
    }

    return resultadosRonda;
}

// -----------------------------
// CORONAR AL CAMPEÓN
// -----------------------------

function coronarCampeonCopaArgentina(campeonId) {
    const campeon = EQUIPOS[campeonId];

    // Bonus de fuerza para la próxima temporada (solo al club)
    campeon.fuerza = Math.min(100, campeon.fuerza + 5);

    // Guardar en el historial
    estadoCopaArgentina.historial.push({
        anio: presidente.anioMandato,
        campeon: campeon.nombre,
        campeonId: campeonId,
        subcampeon: estadoCopaArgentina.bracket[estadoCopaArgentina.bracket.length - 1].partidos
            .filter(function(p) { return p.ganadorId !== campeonId; })
            .map(function(p) { return p.ganador === campeon.nombre ? (p.localId === campeonId ? p.visitante : p.local) : p.ganador; })[0] || "?"
    });

    // Noticia
    agregarNoticia(
        "Olé",
        "¡" + campeon.nombre + " campeón de la Copa Argentina!",
        "El conjunto de " + (campeon.ligaId === "primera" ? "Primera División" : campeon.ligaId === "nacional" ? "Primera Nacional" : "Federal A") + " se consagró en el torneo federal. Fiesta total.",
        "elogio"
    );

    // Resetear la copa
    estadoCopaArgentina.activa = false;
    estadoCopaArgentina.rondaActual = 0;
    estadoCopaArgentina.equiposVivos = [];

    // Notificar al presidente
    ajustarPrestigio(3); // pequeño premio simbólico
}

// -----------------------------
// NOTICIAS DE LA RONDA
// -----------------------------

function generarNoticiasRondaCopa(nombreRonda, resultados) {
    // Buscar sorpresas: un club de categoría inferior que elimina a uno de Primera
    const sorpresas = resultados.filter(function(r) {
        const local = EQUIPOS[r.localId];
        const visitante = EQUIPOS[r.visitanteId];
        const ganador = EQUIPOS[r.ganadorId];

        const pesoLocal = local.pesoHistorico;
        const pesoVisitante = visitante.pesoHistorico;
        const pesoGanador = ganador.pesoHistorico;

        // Si el ganador tiene peso mucho menor que el perdedor, es sorpresa
        const perdedor = ganador.id === r.localId ? visitante : local;
        return pesoGanador < perdedor.pesoHistorico - 20;
    });

    if (sorpresas.length > 0) {
        const s = sorpresas[Math.floor(Math.random() * sorpresas.length)];
        agregarNoticia(
            medioAlAzar("escandalo"),
            "¡Batacazo en la Copa Argentina! " + s.ganador + " eliminó a " + (s.ganadorId === s.localId ? s.visitante : s.local),
            "El equipo dio el golpe en " + nombreRonda + " y sigue ilusionado. La Copa tiene magia.",
            "escandalo"
        );
    }

    // Noticia general de la ronda
    agregarNoticia(
        medioAlAzar("rumor"),
        nombreRonda + " de la Copa Argentina: todos los resultados",
        "Se disputó una nueva ronda del torneo federal. Los equipos avanzan y la Copa se pone cada vez más picante.",
        "rumor"
    );
}

// -----------------------------
// INFO PARA LA INTERFAZ
// -----------------------------

function obtenerEstadoCopaArgentina() {
    return estadoCopaArgentina;
}

function obtenerHistorialCopaArgentina() {
    return estadoCopaArgentina.historial;
}

function copaArgentinaActiva() {
    return estadoCopaArgentina.activa === true;
}