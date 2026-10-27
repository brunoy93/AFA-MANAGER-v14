// ============================================
// MERCADO DE PASES: la ventanilla de la AFA
// ============================================
// Dos ventanas por año. Los europeos vienen por las figuras del torneo
// local y vos decidís si aprobás, retenés o negociás.

const COMPRADORES = [
    "Real Madrid", "Barcelona", "Atlético Madrid", "Manchester City", "Liverpool",
    "Arsenal", "Chelsea", "Bayern Múnich", "Borussia Dortmund", "PSG",
    "Juventus", "Inter", "Milan", "Nápoles", "Benfica", "Porto", "Sporting",
    "Ajax", "PSV", "Sevilla", "Villarreal", "Brighton", "Newcastle", "Aston Villa"
];

const MERCADO_VENTANAS = [8, 24];

const estadoMercado = {
    figuras: [],
    ofertas: [],
    historial: [],
    ultimaVentana: -1,
    ventanas: 0,
    totalVendido: 0
};

function generarFiguras() {
    estadoMercado.figuras = [];
    const clubes = LIGAS.primera.equipos.slice();
    const posiciones = ["ARQ", "DEF", "DEF", "MED", "MED", "DEL"];
    let n = 0;

    clubes.forEach(function(clubId) {
        const club = EQUIPOS[clubId];
        if (!club) return;
        const posicion = elegir(posiciones);
        const edad = entre(18, 33);
        const valorBase = 600 + club.pesoHistorico * 45 + entre(-200, 400);
        const valor = Math.max(350, Math.round((valorBase + (28 - Math.abs(edad - 24)) * 40) / 50) * 50);

        estadoMercado.figuras.push({
            id: "f" + (++n),
            nombre: elegir(NOMBRES_PILA) + " " + elegir(APELLIDOS),
            clubId: clubId,
            posicion: posicion,
            edad: edad,
            valor: valor,
            nivel: limitar(Math.round(62 + club.pesoHistorico * 0.3 + entre(-5, 8)), 55, 95),
            vendido: false
        });
    });
}

function figuraEnClub(clubId) {
    return estadoMercado.figuras.filter(function(f) { return f.clubId === clubId && !f.vendido; });
}

function mercadistasDisponibles() {
    return estadoMercado.figuras.filter(function(f) { return !f.vendido; });
}

function crearOfertasVentana() {
    const disponibles = mercadistasDisponibles().slice().sort(function(a, b) { return b.valor - a.valor; });
    const top = disponibles.slice(0, Math.min(12, disponibles.length));
    const cantidad = 3 + ((typeof tieneModificador === "function" && tieneModificador("mercadocaliente")) ? 1 : 0);
    const elegidas = barajar(top).slice(0, cantidad);
    const factor = (typeof efectoModificador === "function") ? efectoModificador("valorMercado", 1) : 1;

    return elegidas.map(function(f, i) {
        const variacion = 0.9 + Math.random() * 0.5;
        const oferta = Math.round((f.valor * variacion * factor) / 50) * 50;
        return {
            id: "o" + Date.now() + "_" + i,
            figuraId: f.id,
            clubId: f.clubId,
            comprador: elegir(COMPRADORES),
            monto: oferta,
            resuelta: false,
            decision: null
        };
    });
}

function ventanaAbierta() {
    return MERCADO_VENTANAS.indexOf(estadoLigas.fechaActual) !== -1;
}

function abrirVentanaMercado() {
    if (estadoMercado.ultimaVentana === estadoLigas.fechaActual) return [];
    estadoMercado.ultimaVentana = estadoLigas.fechaActual;
    estadoMercado.ventanas++;
    estadoMercado.ofertas = crearOfertasVentana();
    return estadoMercado.ofertas;
}

function ofertasPendientes() {
    return estadoMercado.ofertas.filter(function(o) { return !o.resuelta; });
}

function comisionAFA(monto) {
    return Math.round(monto * 0.08);
}

function resolverOferta(idOferta, decision) {
    const oferta = estadoMercado.ofertas.filter(function(o) { return o.id === idOferta; })[0];
    if (!oferta || oferta.resuelta) return null;

    const figura = estadoMercado.figuras.filter(function(f) { return f.id === oferta.figuraId; })[0];
    const club = EQUIPOS[oferta.clubId];
    const resultado = { tipo: decision, figura: figura, club: club, oferta: oferta, mensaje: "" };

    if (decision === "vender") {
        const comision = comisionAFA(oferta.monto);
        ajustarDinero(comision, "Solidaridad por " + figura.nombre);
        estadoMercado.totalVendido += oferta.monto;
        figura.vendido = true;
        oferta.resuelta = true;
        oferta.decision = "vender";

        if (club) club.fuerza = Math.max(35, club.fuerza - 5);
        ajustarApoyo(-1, "Venta de " + figura.nombre);
        // El club cobra y respira
        const nivel = estadoFinanzas.nivelDeuda[oferta.clubId];
        if (nivel && nivel !== "sano" && probabilidad(0.5)) {
            estadoFinanzas.nivelDeuda[oferta.clubId] = subirNivelDeuda(nivel);
        }
        resultado.mensaje = escapar(figura.nombre) + " se va a " + oferta.comprador + ". La AFA cobra " + fmt.plata(comision) + " de solidaridad.";
        resultado.tono = "verde";
    } else if (decision === "retener") {
        oferta.resuelta = true;
        oferta.decision = "retener";
        ajustarApoyo(4, "Retención de " + figura.nombre);
        ajustarPrestigio(-2, "Retención de " + figura.nombre);
        resultado.mensaje = "Bloqueaste la salida de " + escapar(figura.nombre) + ". La hinchada lo celebra, Europa protesta.";
        resultado.tono = "oro";
    } else if (decision === "renegociar") {
        const exito = probabilidad(0.55 + (presidente.prestigioInternacional - 50) / 250);
        oferta.resuelta = true;
        oferta.decision = "renegociar";
        if (exito) {
            const nuevoMonto = Math.round(oferta.monto * 1.25);
            const comision = comisionAFA(nuevoMonto);
            ajustarDinero(comision, "Solidaridad por " + figura.nombre);
            estadoMercado.totalVendido += nuevoMonto;
            figura.vendido = true;
            if (club) club.fuerza = Math.max(35, club.fuerza - 5);
            ajustarApoyo(-1, "Venta de " + figura.nombre);
            resultado.mensaje = "Negociación redonda: " + escapar(figura.nombre) + " se va por " + fmt.plata(nuevoMonto) + ". La AFA cobra " + fmt.plata(comision) + ".";
            resultado.tono = "verde";
        } else {
            ajustarPrestigio(-2, "Negociación fallida");
            resultado.mensaje = "El comprador se cansó y se fue. " + escapar(figura.nombre) + " sigue, pero la operación quedó manchada.";
            resultado.tono = "rojo";
        }
    }

    estadoMercado.historial.push({
        anio: presidente.anioMandato,
        fecha: estadoLigas.fechaActual,
        figura: figura.nombre,
        club: club ? club.nombre : "—",
        comprador: oferta.comprador,
        monto: oferta.monto,
        decision: decision
    });
    if (estadoMercado.historial.length > 60) estadoMercado.historial.shift();

    if (typeof noticiaDeMercado === "function" && resultado.tono !== "rojo") {
        noticiaDeMercado(figura, oferta, decision, resultado);
    }
    if (typeof revisarLogros === "function") revisarLogros();

    return resultado;
}

function resumenMercado() {
    return {
        figuras: estadoMercado.figuras.length,
        vendidas: estadoMercado.figuras.filter(function(f) { return f.vendido; }).length,
        totalVendido: estadoMercado.totalVendido,
        ventanas: estadoMercado.ventanas,
        historial: estadoMercado.historial.slice(-10).reverse()
    };
}
