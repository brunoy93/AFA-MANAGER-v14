// ============================================
// OPERATIVO RESERVADO
// Incidir en el desarrollo de un partido: el árbitro va a hacer los deberes.
// ============================================

const estadoOperativo = {
    habilitadoEn: 0,
    porPartido: {},
    historial: [],
    pendientes: []
};

const INTENSIDADES_OPERATIVO = {
    suave: { nombre: "Suave", costo: 300, prestigio: 2, goles: 0.35, riesgo: 0.12 },
    medio: { nombre: "Medio", costo: 600, prestigio: 4, goles: 0.7, riesgo: 0.26 },
    fuerte: { nombre: "Fuerte", costo: 1000, prestigio: 6, goles: 1.2, riesgo: 0.44 }
};

function reiniciarOperativos() {
    estadoOperativo.habilitadoEn = 0;
    estadoOperativo.porPartido = {};
    estadoOperativo.historial = [];
    estadoOperativo.pendientes = [];
}

function puedeOperar() {
    return estadoLigas.fechaActual >= (estadoOperativo.habilitadoEn || 0);
}

function operativoDelPartido(ligaId, fecha, idx) {
    return estadoOperativo.porPartido[clavePartido(ligaId, fecha, idx)] || null;
}

function abrirOperativo() {
    if (!puedeOperar()) {
        toastAlerta("Ya usaste el operativo. La próxima ventana es en " +
            Math.max(1, (estadoOperativo.habilitadoEn || 0) - estadoLigas.fechaActual) + " fechas.", "alerta");
        return;
    }

    const fecha = estadoLigas.fechaActual;
    const calendario = estadoLigas.calendarios.primera;
    const partidos = calendario ? calendario[fecha] : null;
    if (!partidos || !partidos.length) {
        toastInfo("No hay partidos para operar.");
        return;
    }

    const opciones = partidos.slice(0, 5).map(function(p, idx) {
        return "<button class='opcion' data-accion='operativo-partido' data-idx='" + idx + "'>" +
            "<span class='opcion-marca'>" + icono("balanza", "", 13) + "</span>" +
            "<span class='opcion-cuerpo'><span class='opcion-titulo'>" + escapar(EQUIPOS[p.local].nombre) + " vs " + escapar(EQUIPOS[p.visitante].nombre) + "</span>" +
            "<span class='opcion-resumen'>Elegir este partido para el operativo</span></span></button>";
    }).join("");

    UI.modal({
        id: "operativo",
        eyebrow: "Operativo reservado",
        titulo: "¿Qué partido querés tocar?",
        sub: "Un llamado, un veedor amigo, un árbitro que va a hacer los deberes. La plata y el prestigio salen de tu bolsillo.",
        ancho: "ancho",
        cerrable: true,
        cuerpo: "<div class='opciones'>" + opciones + "</div>"
    });
}

function elegirPartidoOperativo(idx) {
    const fecha = estadoLigas.fechaActual;
    const partidos = estadoLigas.calendarios.primera[fecha];
    const p = partidos[Number(idx)];
    if (!p) return;
    const local = EQUIPOS[p.local];
    const visitante = EQUIPOS[p.visitante];

    const botones = function(club, lado) {
        return Object.keys(INTENSIDADES_OPERATIVO).map(function(k) {
            const it = INTENSIDADES_OPERATIVO[k];
            return "<button class='btn-suave' data-accion='operar' data-idx='" + idx + "' data-lado='" + lado + "' data-int='" + k + "'>" +
                it.nombre + " · $" + it.costo + "M</button>";
        }).join("");
    };

    UI.modal({
        id: "operativo-2",
        eyebrow: "Operativo reservado",
        titulo: local.nombre + " vs " + visitante.nombre,
        sub: "Elegí a quién beneficiar y cuánta presión poner.",
        ancho: "ancho",
        cerrable: true,
        cuerpo:
            "<div class='operativo-bloque'><strong>" + escapar(local.nombre) + " (local)</strong>" +
            "<div class='fila wrap' style='gap:6px;margin-top:8px'>" + botones(local, "local") + "</div></div>" +
            "<div class='operativo-bloque'><strong>" + escapar(visitante.nombre) + " (visitante)</strong>" +
            "<div class='fila wrap' style='gap:6px;margin-top:8px'>" + botones(visitante, "visitante") + "</div></div>" +
            "<p class='mini tenue' style='margin-top:12px'>Cuanto más fuerte, más chances de que el resultado cambie… y más chances de que alguien hable.</p>"
    });
}

function aplicarOperativo(idx, lado, intensidad) {
    const it = INTENSIDADES_OPERATIVO[intensidad];
    if (!it) return;
    if (presidente.dineroEnCaja < it.costo) { toastError("No hay caja para el operativo."); return; }

    const fecha = estadoLigas.fechaActual;
    const partido = estadoLigas.calendarios.primera[fecha][Number(idx)];
    const clave = clavePartido("primera", fecha, Number(idx));
    const clubId = lado === "local" ? partido.local : partido.visitante;

    estadoOperativo.porPartido[clave] = {
        clubId: clubId,
        lado: lado,
        goles: it.goles,
        riesgo: it.riesgo,
        intensidad: intensidad,
        fecha: fecha,
        anio: presidente.anioMandato,
        aplicado: false
    };
    estadoOperativo.historial.push({ clubId: clubId, intensidad: intensidad, anio: presidente.anioMandato, fecha: fecha });
    estadoOperativo.habilitadoEn = fecha + 8;

    ajustarDinero(-it.costo, "Operativo reservado");
    ajustarPrestigio(-it.prestigio, "Operativo reservado");
    registrarFavor(clubId, "arbitral", 4 + it.goles * 3, "Operativo reservado en " + EQUIPOS[partido.local].nombre + " vs " + EQUIPOS[partido.visitante].nombre);

    UI.cerrar("operativo-2");
    UI.cerrar("operativo");
    toastAlerta("Operativo en marcha. Que nadie hable.", "balanza");
    guardarPartida();
    refrescar();
}

// Se llama después de jugar la fecha: ¿se filtró?
function procesarOperativosDeLaFecha() {
    const fechaJugada = estadoLigas.fechaActual - 1;
    const claves = Object.keys(estadoOperativo.porPartido);
    let escandalo = null;

    claves.forEach(function(clave) {
        const op = estadoOperativo.porPartido[clave];
        if (!op || op.aplicado || op.fecha !== fechaJugada) return;
        op.aplicado = true;

        const riesgo = op.riesgo + (presidente.varActivo ? -0.06 : 0) + (indiceSecanuca(op.clubId) - 50) / 400;
        if (probabilidad(riesgo)) {
            escandalo = op;
        }
    });

    if (escandalo) {
        ajustarPrestigio(-8, "Escándalo de operativo");
        ajustarApoyo(-6, "Escándalo de operativo");
        registrarFavor(escandalo.clubId, "escandalo", 10, "Se filtró el operativo");
        agregarNoticia("Olé", "Se filtró un audio: la AFA habría operado un partido",
            "Un periodista publicó una conversación que compromete al entorno del presidente. El SECANUCA ya registra el movimiento.", "escandalo");
        return escandalo;
    }
    return null;
}
