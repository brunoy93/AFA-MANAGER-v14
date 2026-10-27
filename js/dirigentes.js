// ============================================
// DIRIGENTES: las cinco caras de la asamblea
// ============================================

const DIRIGENTES_BASE = [
    { id: "castro", nombre: "Alfredo Castro", clubId: 1, rol: "El poderoso", lealtad: 50 },
    { id: "sosa", nombre: "Mirta Sosa", clubId: 2, rol: "La política", lealtad: 50 },
    { id: "duarte", nombre: "Pablo Duarte", clubId: 28, rol: "El chico", lealtad: 50 },
    { id: "rios", nombre: "Carmen Ríos", clubId: 67, rol: "La del Interior", lealtad: 50 },
    { id: "luna", nombre: "Jorge Luna", clubId: 31, rol: "El ascendido", lealtad: 50 }
];

const PEDIDOS = [
    {
        id: "refuerzo",
        titulo: "Un refuerzo para el clásico",
        texto: "necesita que la AFA le habilite una excepción al tope salarial para traer un refuerzo antes del clásico.",
        opciones: [
            { texto: "Habilitar la excepción", efecto: { dinero: -400, lealtad: 14, apoyo: 2 }, resumen: "-$400M · +14 lealtad · +2 apoyo" },
            { texto: "Darle una ayuda menor", efecto: { dinero: -150, lealtad: 5 }, resumen: "-$150M · +5 lealtad" },
            { texto: "Rechazar el pedido", efecto: { lealtad: -12, apoyo: -1 }, resumen: "-12 lealtad · -1 apoyo" }
        ]
    },
    {
        id: "fondo",
        titulo: "Plata para las inferiores",
        texto: "pide un fondo especial para las inferiores del club. Dice que sin eso no hay futuro.",
        opciones: [
            { texto: "Crear el fondo", efecto: { dinero: -600, lealtad: 16, prestigio: 2 }, resumen: "-$600M · +16 lealtad · +2 prestigio" },
            { texto: "Prometer para el año que viene", efecto: { lealtad: 2, apoyo: -1 }, resumen: "+2 lealtad · -1 apoyo" },
            { texto: "Decir que no hay plata", efecto: { lealtad: -10 }, resumen: "-10 lealtad" }
        ]
    },
    {
        id: "sede",
        titulo: "La final en su cancha",
        texto: "quiere que la final de la Copa Argentina se juegue en su estadio. Asegura lleno total.",
        opciones: [
            { texto: "Darle la sede", efecto: { dinero: 500, lealtad: 15, prestigio: -2 }, resumen: "+$500M · +15 lealtad · -2 prestigio" },
            { texto: "Sorteo entre todos", efecto: { lealtad: -4, prestigio: 2 }, resumen: "-4 lealtad · +2 prestigio" },
            { texto: "Ni hablar", efecto: { lealtad: -14, apoyo: -2 }, resumen: "-14 lealtad · -2 apoyo" }
        ]
    },
    {
        id: "amistoso",
        titulo: "Un amistoso de la Selección",
        texto: "pide que la Selección juegue un amistoso en su provincia. Es su bandera política desde hace años.",
        opciones: [
            { texto: "Confirmar el amistoso", efecto: { dinero: -300, lealtad: 15, apoyo: 3 }, resumen: "-$300M · +15 lealtad · +3 apoyo" },
            { texto: "Mandar a la Sub-20", efecto: { dinero: -100, lealtad: 6 }, resumen: "-$100M · +6 lealtad" },
            { texto: "Decir que el calendario no da", efecto: { lealtad: -10, apoyo: -1 }, resumen: "-10 lealtad · -1 apoyo" }
        ]
    },
    {
        id: "tv",
        titulo: "Más plata de la TV",
        texto: "reclama una porción mayor del contrato de televisión. Amenaza con no firmar el acuerdo anual.",
        opciones: [
            { texto: "Darle un punto más de reparto", efecto: { dinero: -450, lealtad: 14, apoyo: 2 }, resumen: "-$450M · +14 lealtad · +2 apoyo" },
            { texto: "Compensarlo con un sponsor", efecto: { dinero: -200, lealtad: 7 }, resumen: "-$200M · +7 lealtad" },
            { texto: "Mantener el reparto", efecto: { lealtad: -13, apoyo: -1 }, resumen: "-13 lealtad · -1 apoyo" }
        ]
    }
];

const estadoDirigentes = {
    lista: [],
    pedido: null,
    historial: []
};

function reiniciarDirigentes() {
    estadoDirigentes.lista = DIRIGENTES_BASE.map(function(d) {
        const club = EQUIPOS[d.clubId];
        return {
            id: d.id,
            nombre: d.nombre,
            clubId: d.clubId,
            club: club ? club.nombre : "—",
            rol: d.rol,
            lealtad: d.lealtad,
            avatar: iniciales(d.nombre),
            ultimo: null
        };
    });
    estadoDirigentes.pedido = null;
    estadoDirigentes.historial = [];
}

function dirigentePorId(id) {
    return estadoDirigentes.lista.filter(function(d) { return d.id === id; })[0];
}

function lealtadMedia() {
    if (!estadoDirigentes.lista.length) return 50;
    return Math.round(estadoDirigentes.lista.reduce(function(a, d) { return a + d.lealtad; }, 0) / estadoDirigentes.lista.length);
}

function bonoDirigentesAsamblea() {
    return (lealtadMedia() - 50) / 100 * 0.06;
}

function ajustarLealtadDirigente(id, delta, motivo) {
    const d = dirigentePorId(id);
    if (!d) return;
    d.lealtad = limitar(d.lealtad + delta, 0, 100);
    d.ultimo = motivo || "";
}

function generarPedidoDirigente() {
    // Elige al dirigente con menos lealtad: el que está por cambiar de bando.
    const ordenados = estadoDirigentes.lista.slice().sort(function(a, b) { return a.lealtad - b.lealtad; });
    const dirigente = ordenados[entre(0, Math.min(2, ordenados.length - 1))] || ordenados[0];
    const pedido = elegir(PEDIDOS);
    estadoDirigentes.pedido = {
        dirigenteId: dirigente.id,
        pedidoId: pedido.id,
        titulo: pedido.titulo,
        texto: dirigente.nombre + " (" + dirigente.club + ") " + pedido.texto,
        opciones: pedido.opciones
    };
    return estadoDirigentes.pedido;
}

function resolverPedidoDirigente(idx) {
    const pedido = estadoDirigentes.pedido;
    if (!pedido) return null;
    const op = pedido.opciones[idx];
    if (!op) return null;

    const ef = op.efecto || {};
    if (ef.dinero) ajustarDinero(ef.dinero, "Pedido de " + (dirigentePorId(pedido.dirigenteId) || {}).nombre);
    if (ef.apoyo) ajustarApoyo(ef.apoyo, "Pedido de dirigente");
    if (ef.prestigio) ajustarPrestigio(ef.prestigio, "Pedido de dirigente");
    if (ef.lealtad) ajustarLealtadDirigente(pedido.dirigenteId, ef.lealtad, op.texto);

    estadoDirigentes.historial.push({
        anio: presidente.anioMandato,
        fecha: estadoLigas.fechaActual,
        dirigente: (dirigentePorId(pedido.dirigenteId) || {}).nombre,
        pedido: pedido.titulo,
        respuesta: op.texto
    });
    estadoDirigentes.pedido = null;
    return op;
}
