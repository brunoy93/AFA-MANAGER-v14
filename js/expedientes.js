// ============================================
// EXPEDIENTES: consecuencias que vuelven
// ============================================
// Algunas decisiones no terminan cuando las tomás: dejan un expediente
// abierto que vuelve unas fechas después con el resultado.

const estadoExpedientes = {
    abiertos: [],
    resueltos: []
};

function abrirExpediente(opciones) {
    const exp = {
        id: unicoId("exp"),
        titulo: opciones.titulo,
        descripcion: opciones.descripcion || "",
        anio: presidente.anioMandato,
        fechaApertura: estadoLigas.fechaActual,
        fechaDisparo: estadoLigas.fechaActual + (opciones.fechas != null ? opciones.fechas : 4),
        efecto: opciones.efecto || {},
        resultado: opciones.resultado || "",
        tono: opciones.tono || "azul"
    };
    estadoExpedientes.abiertos.push(exp);
    if (typeof toastInfo === "function") {
        toastInfo("Expediente abierto: <strong>" + escapar(exp.titulo) + "</strong>", "lista");
    }
    return exp;
}

function expedientesEnCurso() {
    return estadoExpedientes.abiertos.slice();
}

function procesarExpedientes() {
    const listos = estadoExpedientes.abiertos.filter(function(e) {
        return e.anio === presidente.anioMandato && estadoLigas.fechaActual >= e.fechaDisparo;
    });
    if (!listos.length) return null;
    return listos[0];
}

function resolverExpediente(id) {
    const idx = estadoExpedientes.abiertos.findIndex(function(e) { return e.id === id; });
    if (idx === -1) return null;
    const exp = estadoExpedientes.abiertos[idx];
    const ef = exp.efecto || {};

    if (ef.apoyo) ajustarApoyo(ef.apoyo, exp.titulo);
    if (ef.prestigio) ajustarPrestigio(ef.prestigio, exp.titulo);
    if (ef.dinero) ajustarDinero(ef.dinero, exp.titulo);
    if (ef.lealtad && typeof estadoDirigentes !== "undefined" && estadoDirigentes.lista.length) {
        const d = estadoDirigentes.lista[entre(0, estadoDirigentes.lista.length - 1)];
        ajustarLealtadDirigente(d.id, ef.lealtad, exp.titulo);
    }

    estadoExpedientes.abiertos.splice(idx, 1);
    estadoExpedientes.resueltos.push({
        anio: exp.anio,
        titulo: exp.titulo,
        fecha: estadoLigas.fechaActual,
        efecto: exp.efecto
    });
    if (estadoExpedientes.resueltos.length > 40) estadoExpedientes.resueltos.shift();

    if (typeof agregarNoticia === "function" && exp.resultado) {
        agregarNoticia("Olé", exp.titulo, exp.resultado, "rumor");
    }
    return exp;
}

// Catálogo de expedientes que abren las decisiones
const EXPEDIENTES_CATALOGO = {
    estadio: {
        titulo: "Las obras del estadio",
        descripcion: "Prometiste el estadio para la final. La constructora avanza, pero el pago llega en cuatro fechas.",
        fechas: 4,
        efecto: { dinero: -700, apoyo: 4, prestigio: 2 },
        resultado: "Las obras se terminaron. La final se juega en el estadio nuevo y los clubes lo celebran.",
        tono: "verde"
    },
    inferiores: {
        titulo: "La camada de juveniles",
        descripcion: "La inversión en inferiores empieza a rendir: tres pibes debutaron en Primera.",
        fechas: 6,
        efecto: { prestigio: 3, apoyo: 2 },
        resultado: "Tres juveniles debutaron y la prensa habla de la mejor camada en años.",
        tono: "verde"
    },
    auditoria: {
        titulo: "El resultado de la auditoría",
        descripcion: "La auditoría externa sobre las cuentas de la AFA va a conocerse en cinco fechas. La expectativa es total.",
        fechas: 5,
        efecto: { prestigio: 4, apoyo: -2 },
        resultado: "La auditoría no encontró desvíos. La prensa tuvo que reconocerlo.",
        tono: "verde"
    },
    promesaTV: {
        titulo: "La promesa de la TV",
        descripcion: "Prometiste repartir la TV con los clubes chicos. El dinero tiene que aparecer.",
        fechas: 4,
        efecto: { dinero: -900, apoyo: 6 },
        resultado: "El reparto llegó a los clubes chicos. El Interior lo celebró.",
        tono: "verde"
    },
    conflicto: {
        titulo: "El conflicto con los árbitros",
        descripcion: "El gremio arbitral anunció medidas de fuerza. La fecha está en riesgo.",
        fechas: 3,
        efecto: { apoyo: -4, prestigio: -2 },
        resultado: "Los árbitros pararon una fecha completa. El torneo quedó manchado.",
        tono: "rojo"
    }
};

function abrirExpedienteCatalogo(clave) {
    const exp = EXPEDIENTES_CATALOGO[clave];
    if (!exp) return null;
    return abrirExpediente(exp);
}
