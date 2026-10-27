// ============================================
// LOGROS Y LEGADO
// ============================================

let logrosDesbloqueados = {};

const LOGROS = [
    { id: "primer-dia", nombre: "Primer día de gestión", desc: "Jugá tu primera fecha como presidente.", icono: "calendario", check: function() { return estadoLigas.fechaActual >= 1; } },
    { id: "primer-dt", nombre: "El heredero", desc: "Elegiste al DT de la era post-Messi.", icono: "usuario", check: function() { return !!presidente.seleccionador; } },
    { id: "var", nombre: "Tecnología en la cancha", desc: "Activaste el VAR.", icono: "rayo", check: function() { return presidente.varActivo; } },
    { id: "copa-america", nombre: "La Copa vuelve a casa", desc: "Ganá una Copa América.", icono: "trofeo", check: function() { return hayTitulo("copa"); } },
    { id: "libertadores", nombre: "Gloria eterna", desc: "Un club argentino gana la Libertadores.", icono: "copa", check: function() { return hayTitulo("libertadores"); } },
    { id: "sudamericana", nombre: "La otra orejona", desc: "Un club argentino gana la Sudamericana.", icono: "copa", check: function() { return hayTitulo("sudamericana"); } },
    { id: "copa-argentina", nombre: "Todos contra todos", desc: "Completá una Copa Argentina.", icono: "bandera", check: function() { return !!(estadoCopaArgentina.activa || estadoCopaArgentina.rondaActual > 0) && typeof obtenerHistorialCopaArgentina === "function" && obtenerHistorialCopaArgentina().length > 0; } },
    { id: "reeleccion", nombre: "Reelegido", desc: "Ganá tu primera asamblea.", icono: "consejo", check: function() { return estadoAsamblea.historial.some(function(e) { return e.gana; }); } },
    { id: "dos-mandatos", nombre: "Dos mandatos", desc: "Ganá dos asambleas consecutivas.", icono: "corona", check: function() { return estadoAsamblea.historial.filter(function(e) { return e.gana; }).length >= 2; } },
    { id: "apoyo-90", nombre: "Los clubes te aman", desc: "Llegá a 90 de apoyo.", icono: "consejo", check: function() { return presidente.apoyoClubes >= 90; } },
    { id: "prestigio-90", nombre: "Respeto internacional", desc: "Llegá a 90 de prestigio.", icono: "estrella", check: function() { return presidente.prestigioInternacional >= 90; } },
    { id: "caja-20k", nombre: "Caja fuerte", desc: "Acumulá $20.000M.", icono: "dinero", check: function() { return presidente.dineroEnCaja >= 20000; } },
    { id: "caja-roja", nombre: "Fundido", desc: "Quedate con menos de $500M en caja.", icono: "alerta", check: function() { return presidente.dineroEnCaja < 500; } },
    { id: "sin-deuda", nombre: "Cero crisis", desc: "Terminá una fecha sin clubes en crisis ni fundidos.", icono: "escudo", check: function() { return obtenerClubesConDeuda().filter(function(c) { return c.nivel === "crisis" || c.nivel === "fundido"; }).length === 0; } },
    { id: "rescatador", nombre: "Salvador", desc: "Rescatá 5 clubes.", icono: "escudo", check: function() { return Object.values(estadoFinanzas.rescates).reduce(function(a, b) { return a + b; }, 0) >= 5; } },
    { id: "ranking-1", nombre: "Número uno", desc: "Volvé al puesto 1 del ranking FIFA.", icono: "globo", check: function() { return obtenerRanking() === 1; } },
    { id: "ranking-top3", nombre: "Poderío", desc: "Mantené a la Selección en el top 3.", icono: "globo", check: function() { return obtenerRanking() <= 3; } },
    { id: "objetivos-3", nombre: "Alumno aplicado", desc: "Cumplí los tres objetivos del año.", icono: "objetivo", check: function() { return estadoObjetivos.lista.length === 3 && objetivosCumplidos() === 3; } },
    { id: "prensa-amiga", nombre: "Buena prensa", desc: "Llegá a 70 de relación con los medios.", icono: "diario", check: function() { return typeof relacionPrensaMedia === "function" && relacionPrensaMedia() >= 70; } },
    { id: "clasicos", nombre: "El juez de los clásicos", desc: "Designá árbitro en 5 clásicos.", icono: "balanza", check: function() { return Object.keys(designacionesPorFecha || {}).length >= 5; } },
    { id: "simeone", nombre: "El Cholo", desc: "Contratá a Diego Simeone como DT.", icono: "usuario", check: function() { return presidente.seleccionador === "Diego Simeone"; } },
    { id: "barato", nombre: "Gestión austera", desc: "Terminá un año con más de $15.000M en caja.", icono: "dinero", check: function() { return presidente.anioMandato >= 2 && presidente.dineroEnCaja >= 15000; } },
    { id: "promesa", nombre: "Palabra cumplida", desc: "Cumplí una promesa de campaña.", icono: "check", check: function() { return presidente.promesas.some(function(p) { return p.cumplida; }); } },
    { id: "leyenda", nombre: "Leyenda de la AFA", desc: "Completá los cuatro años de mandato.", icono: "medalla", check: function() { return estadoAsamblea.historial.length >= 4; } }
];

function hayTitulo(tipo) {
    try {
        if (tipo === "copa" && typeof historialCopas !== "undefined") {
            return historialCopas.some(function(c) { return c.campeon === "Argentina" || c.posicionArgentina === "campeon"; });
        }
        if (tipo === "libertadores" && typeof historialContinentales !== "undefined") {
            return historialContinentales.some(function(h) { return h.campeonLibertadores && h.campeonArgentinoLibertadores; });
        }
        if (tipo === "sudamericana" && typeof historialContinentales !== "undefined") {
            return historialContinentales.some(function(h) { return h.campeonSudamericana && h.campeonArgentinoSudamericana; });
        }
    } catch (e) { return false; }
    return false;
}

function logroDesbloqueado(id) { return !!logrosDesbloqueados[id]; }

function desbloquearLogro(logro) {
    if (logrosDesbloqueados[logro.id]) return false;
    logrosDesbloqueados[logro.id] = {
        anio: presidente.anioMandato,
        fecha: estadoLigas.fechaActual
    };
    if (typeof toastLogro === "function") {
        toastLogro("<strong>Logro desbloqueado</strong><br>" + logro.nombre, logro.icono);
    }
    if (typeof sonidoLogro === "function") sonidoLogro();
    return true;
}

function revisarLogros() {
    LOGROS.forEach(function(logro) {
        if (logrosDesbloqueados[logro.id]) return;
        let cumple = false;
        try { cumple = logro.check(); } catch (e) { cumple = false; }
        if (cumple) desbloquearLogro(logro);
    });
}

function cantidadLogros() {
    return Object.keys(logrosDesbloqueados).length;
}

// -----------------------------
// PUNTAJE DE LEGADO
// -----------------------------

function desgloseLegado() {
    const anios = Math.max(0, presidente.anioMandato - 1);
    const asambleas = estadoAsamblea.historial.filter(function(e) { return e.gana; }).length;
    const titulos = (estadoHistorial && estadoHistorial.temporadas ? estadoHistorial.temporadas.length : 0);
    return [
        { nombre: "Años de mandato", valor: anios * 150 },
        { nombre: "Apoyo final", valor: presidente.apoyoClubes * 6 },
        { nombre: "Prestigio", valor: Math.round(presidente.prestigioInternacional * 1.2) },
        { nombre: "Caja", valor: Math.round(presidente.dineroEnCaja / 400) },
        { nombre: "Logros", valor: cantidadLogros() * 15 },
        { nombre: "Asambleas ganadas", valor: asambleas * 80 },
        { nombre: "Títulos de liga", valor: titulos * 100 },
        { nombre: "Copa Argentina", valor: (hayTitulo("copa") ? 120 : 0) },
        { nombre: "Libertadores", valor: (hayTitulo("libertadores") ? 150 : 0) },
        { nombre: "Salida anticipada", valor: (presidente.anioMandato < presidente.anioMaximo ? -320 : 0) }
    ];
}

function puntajeLegado() {
    return Math.max(0, desgloseLegado().reduce(function(a, d) { return a + d.valor; }, 0));
}

function rangoLegado(puntos) {
    if (puntos >= 1300) return { nombre: "Leyenda", color: "#f0c869", desc: "Tu nombre va en la puerta del edificio de la AFA." };
    if (puntos >= 1000) return { nombre: "Histórico", color: "#b18cff", desc: "Te van a recordar como un grande." };
    if (puntos >= 700) return { nombre: "Respetado", color: "#3ddc84", desc: "Dejaste la casa en orden." };
    if (puntos >= 400) return { nombre: "Correcto", color: "#6aa9ff", desc: "Gestión prolija, sin gloria." };
    return { nombre: "Turbio", color: "#ff6f5e", desc: "Mejor no preguntes cómo terminó." };
}
