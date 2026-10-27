// ============================================
// PRENSA: conferencias de prensa con periodistas
// ============================================
// Cada ~18 fechas, un periodista te hace 2 preguntas.
// Tus respuestas afectan apoyo/prestigio/caja.

const conferenciasHistoricas = [];
const preguntasYaRespondidas = new Set();

// -----------------------------
// PREGUNTAS POR PERSONALIDAD
// -----------------------------

const PREGUNTAS = {
    carrozza: [
        {
            id: "carrozza_var",
            texto: "Presidente, el VAR sigue sin implementarse y el último clásico tuvo errores graves. ¿Qué le responde a los hinchas?",
            opciones: [
                { texto: "El costo es alto, lo estamos evaluando", efecto: function() { ajustarApoyo(-2); }, resumen: "-2 apoyo" },
                { texto: "El VAR no resuelve todo", efecto: function() { ajustarPrestigio(1); ajustarApoyo(-2); }, resumen: "+1 prestigio, -2 apoyo" },
                { texto: "Lo vamos a implementar antes de fin de año", efecto: function() { ajustarApoyo(3); ajustarPrestigio(-1); }, resumen: "+3 apoyo, -1 prestigio (promesa)" }
            ]
        },
        {
            id: "carrozza_reparto",
            texto: "Los clubes del Interior siguen reclamando por el reparto de TV. ¿Vas a hacer algo?",
            opciones: [
                { texto: "Vamos a igualar el reparto", efecto: function() { ajustarApoyo(5); ajustarDinero(-800); }, resumen: "+5 apoyo, -$800M" },
                { texto: "El reparto actual es justo", efecto: function() { ajustarApoyo(-3); ajustarDinero(200); }, resumen: "-3 apoyo, +$200M" },
                { texto: "Sin comentarios", efecto: function() {}, resumen: "Sin efecto" }
            ]
        },
        {
            id: "carrozza_corrupcion",
            texto: "Hay rumores de corrupción interna que involucran a exdirectivos. ¿Vas a investigar?",
            opciones: [
                { texto: "Vamos a investigar a fondo", efecto: function() { ajustarPrestigio(5); ajustarApoyo(-2); ajustarDinero(-300); }, resumen: "+5 prestigio, -2 apoyo, -$300M" },
                { texto: "No hay nada que investigar", efecto: function() { ajustarApoyo(-4); ajustarPrestigio(-4); }, resumen: "-4 apoyo, -4 prestigio" },
                { texto: "Sin comentarios", efecto: function() {}, resumen: "Sin efecto" }
            ]
        },
        {
            id: "carrozza_libro",
            texto: "Hay un nuevo libro de un exárbitro con acusaciones fuertes. ¿Qué opina la AFA?",
            opciones: [
                { texto: "Vamos a responder públicamente", efecto: function() { ajustarDinero(-200); ajustarPrestigio(3); }, resumen: "-$200M, +3 prestigio" },
                { texto: "Lo ignoramos", efecto: function() { ajustarPrestigio(-3); }, resumen: "-3 prestigio" },
                { texto: "Vamos a investigar las denuncias", efecto: function() { ajustarPrestigio(4); ajustarApoyo(-1); }, resumen: "+4 prestigio, -1 apoyo" }
            ]
        },
        {
            id: "carrozza_caja",
            texto: "Las arcas de la AFA están en un momento delicado. ¿Cómo piensa resolverlo?",
            opciones: [
                { texto: "Vamos a buscar nuevos sponsors", efecto: function() { ajustarDinero(400); ajustarPrestigio(-1); }, resumen: "+$400M, -1 prestigio" },
                { texto: "Vamos a recortar gastos", efecto: function() { ajustarDinero(300); ajustarApoyo(-3); }, resumen: "+$300M, -3 apoyo" },
                { texto: "La situación no es tan grave", efecto: function() { ajustarPrestigio(-2); }, resumen: "-2 prestigio" }
            ]
        }
    ],

    bambino: [
        {
            id: "bambino_futuro",
            texto: "¡Qué lindo, presidente! La Selección viene bien. ¿Cómo ve el futuro de la era post-Messi?",
            opciones: [
                { texto: "Vamos a construir algo grande", efecto: function() { ajustarPrestigio(3); ajustarApoyo(2); }, resumen: "+3 prestigio, +2 apoyo" },
                { texto: "Hay que ser prudentes", efecto: function() {}, resumen: "Sin efecto" },
                { texto: "El objetivo es ganar el próximo Mundial", efecto: function() { ajustarPrestigio(4); ajustarApoyo(-1); }, resumen: "+4 prestigio, -1 apoyo (presión)" }
            ]
        },
        {
            id: "bambino_juveniles",
            texto: "Los pibes de las inferiores están rompiendo récords. ¿Vas a invertir más en juveniles?",
            opciones: [
                { texto: "Sí, vamos a invertir fuerte", efecto: function() { ajustarDinero(-600); ajustarPrestigio(5); }, resumen: "-$600M, +5 prestigio" },
                { texto: "Con lo que tenemos alcanza", efecto: function() { ajustarApoyo(-2); }, resumen: "-2 apoyo" },
                { texto: "Vamos a buscar sponsors para juveniles", efecto: function() { ajustarDinero(300); ajustarPrestigio(2); }, resumen: "+$300M, +2 prestigio" }
            ]
        },
        {
            id: "bambino_femenino",
            texto: "El fútbol femenino viene creciendo. ¿Se viene la profesionalización?",
            opciones: [
                { texto: "Sí, es el momento", efecto: function() { ajustarDinero(-1000); ajustarPrestigio(6); }, resumen: "-$1.000M, +6 prestigio" },
                { texto: "Paso a paso", efecto: function() { ajustarPrestigio(2); }, resumen: "+2 prestigio" },
                { texto: "No está en la agenda", efecto: function() { ajustarPrestigio(-4); }, resumen: "-4 prestigio" }
            ]
        },
        {
            id: "bambino_visitantes",
            texto: "¡Qué fiesta la de los hinchas en la última fecha! ¿Vas a permitir visitantes en las canchas?",
            opciones: [
                { texto: "Sí, es hora", efecto: function() { ajustarApoyo(5); ajustarDinero(300); ajustarPrestigio(-3); }, resumen: "+5 apoyo, +$300M, -3 prestigio" },
                { texto: "Solo en clásicos", efecto: function() { ajustarApoyo(2); }, resumen: "+2 apoyo" },
                { texto: "No por ahora", efecto: function() { ajustarApoyo(-3); ajustarPrestigio(2); }, resumen: "-3 apoyo, +2 prestigio" }
            ]
        },
        {
            id: "bambino_copa",
            texto: "Se viene la Copa América. ¿Cómo ve a la Selección?",
            opciones: [
                { texto: "Vamos a pelear por el título", efecto: function() { ajustarPrestigio(3); }, resumen: "+3 prestigio" },
                { texto: "Hay que ir paso a paso", efecto: function() {}, resumen: "Sin efecto" },
                { texto: "Es una obligación ganarla", efecto: function() { ajustarPrestigio(2); ajustarApoyo(-2); }, resumen: "+2 prestigio, -2 apoyo (presión)" }
            ]
        }
    ],

    liberman: [
        {
            id: "liberman_gestion",
            texto: "Presidente, le voy a ser frontal: la gestión no arrancó bien. ¿Qué le dice al hincha?",
            opciones: [
                { texto: "Vamos a enderezar el rumbo", efecto: function() { ajustarApoyo(3); ajustarPrestigio(2); }, resumen: "+3 apoyo, +2 prestigio" },
                { texto: "Los resultados van a llegar", efecto: function() {}, resumen: "Sin efecto" },
                { texto: "Las críticas no me afectan", efecto: function() { ajustarApoyo(-5); ajustarPrestigio(-2); }, resumen: "-5 apoyo, -2 prestigio" }
            ]
        },
        {
            id: "liberman_clubes",
            texto: "Los clubes chicos están quebrando. ¿Qué hace la AFA?",
            opciones: [
                { texto: "Vamos a rescatarlos", efecto: function() { ajustarDinero(-800); ajustarApoyo(6); }, resumen: "-$800M, +6 apoyo" },
                { texto: "Que se arreglen solos", efecto: function() { ajustarApoyo(-6); ajustarPrestigio(-2); }, resumen: "-6 apoyo, -2 prestigio" },
                { texto: "Vamos a dar préstamos blandos", efecto: function() { ajustarDinero(-400); ajustarApoyo(3); }, resumen: "-$400M, +3 apoyo" }
            ]
        },
        {
            id: "liberman_renuncia",
            texto: "El apoyo al presidente está bajo. ¿Piensa en renunciar?",
            opciones: [
                { texto: "De ninguna manera", efecto: function() { ajustarApoyo(2); }, resumen: "+2 apoyo" },
                { texto: "Voy a terminar mi mandato", efecto: function() { ajustarApoyo(1); ajustarPrestigio(2); }, resumen: "+1 apoyo, +2 prestigio" },
                { texto: "Si los clubes lo piden, lo evalúo", efecto: function() { ajustarApoyo(-4); }, resumen: "-4 apoyo" }
            ]
        },
        {
            id: "liberman_violencia",
            texto: "¿Por qué no se toman medidas más duras contra los violentos?",
            opciones: [
                { texto: "Vamos a endurecer las sanciones", efecto: function() { ajustarPrestigio(5); ajustarApoyo(-3); }, resumen: "+5 prestigio, -3 apoyo" },
                { texto: "La AFA no tiene esas facultades", efecto: function() { ajustarApoyo(-4); ajustarPrestigio(-3); }, resumen: "-4 apoyo, -3 prestigio" },
                { texto: "Estamos trabajando en eso", efecto: function() {}, resumen: "Sin efecto" }
            ]
        },
        {
            id: "liberman_caja",
            texto: "Se dice que la AFA está fundida. ¿Es cierto?",
            opciones: [
                { texto: "Tenemos las cuentas ordenadas", efecto: function() { ajustarPrestigio(2); }, resumen: "+2 prestigio" },
                { texto: "La herencia recibida fue muy mala", efecto: function() { ajustarApoyo(-2); ajustarPrestigio(1); }, resumen: "-2 apoyo, +1 prestigio" },
                { texto: "Sin comentarios", efecto: function() { ajustarPrestigio(-2); }, resumen: "-2 prestigio" }
            ]
        }
    ]
};

// -----------------------------
// GENERAR UNA CONFERENCIA
// -----------------------------

function generarConferencia() {
    const apoyo = presidente.apoyoClubes;
    const caja = presidente.dineroEnCaja;
    const prestigio = presidente.prestigioInternacional;

    // Pesos base según contexto
    let pesos = { carrozza: 33, liberman: 34, bambino: 33 };

    if (apoyo < 40) {
        pesos = { carrozza: 40, liberman: 50, bambino: 10 };
    } else if (apoyo > 70) {
        pesos = { carrozza: 20, liberman: 15, bambino: 65 };
    }

    // Ajuste por caja
    if (caja < 3000) {
        pesos.liberman += 15;
        pesos.bambino -= 10;
        pesos.carrozza -= 5;
    } else if (caja > 15000) {
        pesos.bambino += 10;
        pesos.liberman -= 10;
    }

    // Ajuste por prestigio
    if (prestigio < 40) {
        pesos.carrozza += 10;
        pesos.bambino -= 10;
    } else if (prestigio > 70) {
        pesos.bambino += 10;
        pesos.carrozza -= 5;
        pesos.liberman -= 5;
    }

    const personalidad = elegirPonderado([
        { valor: "carrozza", peso: Math.max(5, pesos.carrozza) },
        { valor: "liberman", peso: Math.max(5, pesos.liberman) },
        { valor: "bambino", peso: Math.max(5, pesos.bambino) }
    ]);

    // Elegir 2 preguntas no respondidas aún
    const disponibles = PREGUNTAS[personalidad].filter(function(p) {
        return !preguntasYaRespondidas.has(p.id);
    });

    // Si no hay suficientes sin responder, reseteamos las de esa personalidad
    let pool = disponibles;
    if (pool.length < 2) {
        PREGUNTAS[personalidad].forEach(function(p) {
            preguntasYaRespondidas.delete(p.id);
        });
        pool = PREGUNTAS[personalidad].slice();
    }

    // Mezclar
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    const preguntasElegidas = pool.slice(0, 2);

    // Marcar como respondidas
    preguntasElegidas.forEach(function(p) {
        preguntasYaRespondidas.add(p.id);
    });

    return {
        personalidad: personalidad,
        preguntas: preguntasElegidas
    };
}

function elegirPonderado(lista) {
    const total = lista.reduce(function(s, x) { return s + x.peso; }, 0);
    let random = Math.random() * total;
    for (let i = 0; i < lista.length; i++) {
        random -= lista[i].peso;
        if (random <= 0) return lista[i].valor;
    }
    return lista[lista.length - 1].valor;
}

// -----------------------------
// REGISTRAR LA CONFERENCIA
// -----------------------------

function registrarConferencia(personalidad, cantidadRespondidas) {
    conferenciasHistoricas.push({
        anio: presidente.anioMandato,
        fecha: estadoLigas.fechaActual,
        personalidad: personalidad,
        respondidas: cantidadRespondidas
    });
}

// -----------------------------
// RELACIÓN CON LOS MEDIOS (0-100)
// -----------------------------

function relacionPrensaMedia() {
    let base = (presidente.relacionPrensaBase != null ? presidente.relacionPrensaBase : 50) +
        (presidente.prestigioInternacional - 50) * 0.32;

    base += Math.min(12, conferenciasHistoricas.length * 2);

    const decisionesMediaticas = presidente.historialDecisiones.filter(function(d) {
        return d.categoria === "mediatica";
    }).length;
    base += decisionesMediaticas * 2;

    if (typeof noticiasHistoricas !== "undefined") {
        const escandalos = noticiasHistoricas.filter(function(n) { return n.tipo === "escandalo"; }).length;
        base -= Math.min(22, escandalos * 1.5);
    }

    return limitar(Math.round(base), 0, 100);
}