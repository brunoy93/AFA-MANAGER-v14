// ============================================
// INFERIORES: la fábrica de jugadores
// ============================================

const estadoInferiores = {
    nivel: 50,
    juveniles: [],
    invertido: 0,
    camadas: 0
};

const POSICIONES_JUVENIL = ["ARQ", "DEF", "DEF", "MED", "MED", "DEL"];

function reiniciarInferiores() {
    estadoInferiores.nivel = 50;
    estadoInferiores.juveniles = [];
    estadoInferiores.invertido = 0;
    estadoInferiores.camadas = 0;
}

function generarCamadaJuveniles() {
    if (!estadoInferiores.juveniles.length) {
        estadoInferiores.nivel = 50;
    }
    estadoInferiores.camadas++;
    const cantidad = 3;
    const nuevos = [];

    for (let i = 0; i < cantidad; i++) {
        const posicion = elegir(POSICIONES_JUVENIL);
        const edad = entre(16, 19);
        const potencial = limitar(Math.round(estadoInferiores.nivel + entre(-8, 28)), 52, 96);
        const nivel = limitar(potencial - entre(12, 26), 38, 72);
        const clubId = elegir(LIGAS.primera.equipos);
        nuevos.push({
            id: "j" + Date.now() + "_" + i,
            nombre: elegir(NOMBRES_PILA) + " " + elegir(APELLIDOS),
            posicion: posicion,
            edad: edad,
            nivel: nivel,
            potencial: potencial,
            clubId: clubId,
            club: EQUIPOS[clubId] ? EQUIPOS[clubId].nombre : "",
            promovido: false,
            vendido: false
        });
    }

    nuevos.forEach(function(j) { estadoInferiores.juveniles.push(j); });
    if (estadoInferiores.juveniles.length > 12) {
        estadoInferiores.juveniles = estadoInferiores.juveniles.slice(-12);
    }
    return nuevos;
}

function juvenilesDisponibles() {
    return estadoInferiores.juveniles.filter(function(j) { return !j.promovido && !j.vendido; });
}

function invertirEnInferiores(monto) {
    try {
        if (presidente.dineroEnCaja < monto) return { ok: false, motivo: "No hay caja suficiente." };
        ajustarDinero(-monto, "Inversión en inferiores");
        estadoInferiores.invertido += monto;
        estadoInferiores.nivel = limitar(estadoInferiores.nivel + Math.round(monto / 250), 10, 95);
        ajustarConfianzaArea("deportivo", 2, "Inversión en inferiores");
        return { ok: true, nivel: estadoInferiores.nivel };
    } catch (e) {
        console.error("Inversión en inferiores", e);
        return { ok: false, motivo: "No se pudo invertir." };
    }
}

function promoverJuvenil(id) {
    const j = estadoInferiores.juveniles.filter(function(x) { return x.id === id; })[0];
    if (!j || j.promovido) return { ok: false, motivo: "Ese juvenil ya fue promovido." };

    const valor = Math.round((j.potencial * 45) / 50) * 50;
    if (typeof estadoMercado !== "undefined" && estadoMercado.figuras) {
        estadoMercado.figuras.push({
            id: "f" + Date.now(),
            nombre: j.nombre,
            clubId: j.clubId,
            posicion: j.posicion,
            edad: j.edad,
            valor: Math.max(400, valor),
            nivel: j.potencial,
            vendido: false,
            juvenil: true
        });
    }
    const club = EQUIPOS[j.clubId];
    if (club) club.fuerza = Math.min(100, club.fuerza + 2);

    j.promovido = true;
    ajustarApoyo(2, "Promoción de " + j.nombre);
    ajustarPrestigio(1, "Promoción de " + j.nombre);
    if (typeof registrarFavor === "function") registrarFavor(j.clubId, "institucional", 3, "Promoción de " + j.nombre);
    agregarNoticia("Azz", "Debutó " + j.nombre + " en " + j.club, "El pibe de " + j.edad + " años firmó su primer contrato profesional.", "elogio");
    return { ok: true, valor: valor };
}

function venderJuvenil(id) {
    const j = estadoInferiores.juveniles.filter(function(x) { return x.id === id; })[0];
    if (!j || j.vendido) return { ok: false, motivo: "Ese juvenil ya no está." };
    const monto = Math.round((j.potencial * 12) / 50) * 50;
    ajustarDinero(monto, "Venta de juvenil " + j.nombre);
    ajustarApoyo(-2, "Venta de " + j.nombre);
    j.vendido = true;
    return { ok: true, monto: monto };
}

function becarJuvenil(id) {
    const j = estadoInferiores.juveniles.filter(function(x) { return x.id === id; })[0];
    if (!j) return { ok: false, motivo: "No existe." };
    if (presidente.dineroEnCaja < 200) return { ok: false, motivo: "No hay caja." };
    ajustarDinero(-200, "Beca para " + j.nombre);
    j.potencial = limitar(j.potencial + 4, 40, 99);
    j.nivel = limitar(j.nivel + 1, 30, 95);
    estadoInferiores.nivel = limitar(estadoInferiores.nivel + 1, 10, 95);
    return { ok: true, potencial: j.potencial };
}

function promedioPotencial() {
    const lista = juvenilesDisponibles();
    if (!lista.length) return 0;
    return Math.round(lista.reduce(function(a, j) { return a + j.potencial; }, 0) / lista.length);
}

function nivelCantera() {
    return Math.round(estadoInferiores.nivel);
}
