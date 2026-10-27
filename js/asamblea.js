// ============================================
// ASAMBLEA: los 103 clubes, sus votos y la elección
// ============================================
// Cada club pesa según su historia y tiene una inclinación hacia
// el oficialismo. La asamblea se reúne al final de cada año.

const estadoAsamblea = {
    campana: { usadas: [], efectos: {}, anio: 0 },
    ultima: null,
    historial: []
};

// -----------------------------
// PESO Y GRUPO DE CADA CLUB
// -----------------------------

function pesoVotoClub(id) {
    const eq = EQUIPOS[id];
    if (!eq) return 1;
    if (eq.pesoHistorico >= 80) return 3;
    if (eq.pesoHistorico >= 55) return 2;
    return 1;
}

function grupoClub(id) {
    const eq = EQUIPOS[id];
    if (!eq) return "otros";
    if (eq.ligaId === "federalA") return "federal";
    if (eq.pesoHistorico >= 80) return "grandes";
    if (eq.pesoHistorico >= 55) return "medios";
    return "chicos";
}

function clubesAsamblea() {
    const ids = [];
    Object.keys(LIGAS).forEach(function(ligaId) {
        LIGAS[ligaId].equipos.forEach(function(id) { ids.push(id); });
    });
    return ids;
}

// -----------------------------
// INCLINACIÓN DE CADA CLUB
// -----------------------------

function etiquetasDecisiones() {
    const textos = presidente.historialDecisiones.map(function(d) {
        return (d.decision + " " + d.eleccion + " " + (d.resumen || "")).toLowerCase();
    });
    return textos;
}

function inclinacionClub(id) {
    const eq = EQUIPOS[id];
    if (!eq) return 0;
    const grupo = grupoClub(id);
    const peso = pesoVotoClub(id);
    const textos = etiquetasDecisiones();

    let valor = (presidente.apoyoClubes - 50) * 1.15 + (presidente.prestigioInternacional - 50) * 0.25;

    // Rescates: el club rescatado te lo debe.
    const rescates = (estadoFinanzas.rescates || {})[id] || 0;
    valor += rescates * 16;

    // Situación de deuda propia
    const deuda = (estadoFinanzas.nivelDeuda || {})[id];
    if (deuda === "fundido") valor -= 12;
    else if (deuda === "crisis") valor -= 6;

    // Decisiones que dejan marca
    const sadSi = textos.some(function(t) { return t.indexOf("sad sí") !== -1 || t.indexOf("permitir la inversión") !== -1; });
    const sadNo = textos.some(function(t) { return t.indexOf("sad no") !== -1 || t.indexOf("prohibir la inversión") !== -1; });
    const tvIgual = textos.some(function(t) { return t.indexOf("igualar") !== -1 || t.indexOf("reparto") !== -1 || t.indexOf("fondo de") !== -1; });
    const tvLibre = textos.some(function(t) { return t.indexOf("libre mercado") !== -1 || t.indexOf("vender") !== -1; });
    const ascensos = textos.some(function(t) { return t.indexOf("suspender los descensos") !== -1; });

    if (grupo === "grandes") {
        if (sadSi) valor += 14;
        if (sadNo) valor -= 8;
        if (tvIgual) valor -= 12;
        if (tvLibre) valor += 7;
    } else {
        if (sadSi) valor -= 10;
        if (sadNo) valor += 6;
        if (tvIgual) valor += 14;
        if (tvLibre) valor -= 9;
    }
    if (grupo === "federal" || grupo === "chicos") {
        if (ascensos) valor += 8;
    }

    // Campaña
    const efectos = estadoAsamblea.campana.efectos || {};
    valor += efectos.todos || 0;
    if (efectos[grupo]) valor += efectos[grupo];

    // La confianza del consejo empuja parejo
    valor += (ConfianzaConsejo() - 50) * 0.35;

    // Ruido estable por club (mismo en cada render) + sesgo histórico:
    // hay clubes que siempre están más cerca del oficialismo y otros de la oposición.
    valor += ((id * 37) % 9) - 4;
    valor += ((id * 53) % 41) - 20;

    // Los clubes con más peso son más exigentes, pero no tanto como para
    // quedar todos en la oposición desde el primer día.
    if (peso === 3) valor -= 1;

    return limitar(valor, -100, 100);
}

function sentidoVotoClub(id) {
    const v = inclinacionClub(id);
    if (v > 14) return "oficialista";
    if (v < -14) return "opositor";
    return "indeciso";
}

// -----------------------------
// COMPOSICIÓN
// -----------------------------

function calcularAsamblea() {
    const ids = clubesAsamblea();
    let votosOficial = 0;
    let votosOpositor = 0;
    let votosIndeciso = 0;
    let clubesOficial = 0;
    let clubesOpositor = 0;
    let clubesIndeciso = 0;

    ids.forEach(function(id) {
        const peso = pesoVotoClub(id);
        const sentido = sentidoVotoClub(id);
        if (sentido === "oficialista") { votosOficial += peso; clubesOficial++; }
        else if (sentido === "opositor") { votosOpositor += peso; clubesOpositor++; }
        else { votosIndeciso += peso; clubesIndeciso++; }
    });

    const total = votosOficial + votosOpositor + votosIndeciso;

    // La proyección se calcula sobre el estado general, no sobre el ruido
    // de cada club: así el número se mueve cuando movés apoyo o prestigio.
    const efectoCampana = suma(Object.keys(estadoAsamblea.campana.efectos || {}).map(function(k) {
        return estadoAsamblea.campana.efectos[k] || 0;
    })) / 100;

    const cApoyo = (presidente.apoyoClubes - 50) * 0.012;
    const cPrestigio = (presidente.prestigioInternacional - 50) * 0.0022;
    const cConsejo = (ConfianzaConsejo() - 50) * 0.0015;
    const cBonoConsejo = bonoConsejoAsamblea() / 100;
    const cOposicion = (typeof bonoOposicionAsamblea === "function" ? bonoOposicionAsamblea() : 0);
    const cDirigentes = (typeof bonoDirigentesAsamblea === "function" ? bonoDirigentesAsamblea() : 0);
    const cDebate = (typeof bonoDebate === "function" ? bonoDebate() : 0);

    const proyeccion = limitar(
        0.60 + cApoyo + cPrestigio + cConsejo + cBonoConsejo + cOposicion + cDirigentes + cDebate + efectoCampana,
        0.02, 0.98
    );

    const umbral = limitar(Dificultad().umbralAsamblea + (typeof umbralAsambleaExtra === "function" ? umbralAsambleaExtra() : 0), 0.3, 0.8);

    return {
        total: total,
        oficial: { votos: votosOficial, clubes: clubesOficial, pct: votosOficial / (total || 1) },
        opositor: { votos: votosOpositor, clubes: clubesOpositor, pct: votosOpositor / (total || 1) },
        indeciso: { votos: votosIndeciso, clubes: clubesIndeciso, pct: votosIndeciso / (total || 1) },
        proyeccion: proyeccion,
        umbral: umbral,
        gana: proyeccion >= umbral,
        componentes: [
            { nombre: "Base", valor: 0.60 },
            { nombre: "Apoyo de clubes", valor: cApoyo },
            { nombre: "Prestigio", valor: cPrestigio },
            { nombre: "Consejo", valor: cConsejo + cBonoConsejo },
            { nombre: "Oposición", valor: cOposicion },
            { nombre: "Dirigentes", valor: cDirigentes },
            { nombre: "Debate", valor: cDebate },
            { nombre: "Campaña", valor: efectoCampana }
        ]
    };
}

function gruposAsamblea() {
    const ids = clubesAsamblea();
    const grupos = {
        grandes: { nombre: "Grandes", oficial: 0, indeciso: 0, opositor: 0 },
        medios: { nombre: "Medios", oficial: 0, indeciso: 0, opositor: 0 },
        chicos: { nombre: "Chicos", oficial: 0, indeciso: 0, opositor: 0 },
        federal: { nombre: "Federal A", oficial: 0, indeciso: 0, opositor: 0 }
    };
    ids.forEach(function(id) {
        const g = grupoClub(id);
        if (!grupos[g]) return;
        const sentido = sentidoVotoClub(id);
        const clave = sentido === "oficialista" ? "oficial" : sentido === "opositor" ? "opositor" : "indeciso";
        grupos[g][clave] += 1;
    });
    return grupos;
}

// -----------------------------
// CAMPAÑA
// -----------------------------

const ACCIONES_CAMPANA = [
    {
        id: "gira",
        nombre: "Gira federal",
        desc: "Recorré el interior durante dos semanas y prometé obras en los clubes.",
        costo: 400,
        efecto: { federal: 11, chicos: 4 },
        detalle: "+11 en el Federal A, +4 en clubes chicos"
    },
    {
        id: "cena",
        nombre: "Cena con los grandes",
        desc: "Los presidentes de los clubes grandes quieren certezas sobre la TV.",
        costo: 650,
        efecto: { grandes: 12, medios: 3, chicos: -4 },
        detalle: "+12 en grandes, +3 en medios, −4 en chicos"
    },
    {
        id: "tv",
        nombre: "Prometer reparto de TV",
        desc: "Anunciá un fondo de televisión para los clubes chicos. Queda como promesa.",
        costo: 0,
        efecto: { chicos: 10, federal: 6, grandes: -3 },
        detalle: "+10 en chicos, +6 federal, −3 grandes · queda promesa",
        promesa: "Repartir los ingresos de TV con los clubes chicos"
    },
    {
        id: "medios",
        nombre: "Spot en todos los canales",
        desc: "Una campaña de imagen con los números de tu gestión.",
        costo: 300,
        efecto: { todos: 5 },
        detalle: "+5 en todos los bloques"
    },
    {
        id: "asado",
        nombre: "Asado con dirigentes",
        desc: "La vieja política: un asado, un acuerdo y una foto.",
        costo: 200,
        efecto: { todos: 3, grandes: 2 },
        detalle: "+3 general, +2 en grandes"
    },
    {
        id: "fondo",
        nombre: "Fondo solidario exprés",
        desc: "Girás plata directo a los clubes chicos y del Interior. Caro, pero se acuerda.",
        costo: 1500,
        efecto: { chicos: 12, federal: 10, medios: 4, grandes: 2 },
        detalle: "+12 chicos, +10 federal, +4 medios, +2 grandes"
    }
];

function campanaDisponible() {
    return estadoAsamblea.campana.usadas.length < 4;
}

function accionesCampanaRestantes() {
    return Math.max(0, 4 - estadoAsamblea.campana.usadas.length);
}

function aplicarAccionCampana(accionId) {
    const accion = ACCIONES_CAMPANA.filter(function(a) { return a.id === accionId; })[0];
    if (!accion) return { ok: false, motivo: "Acción desconocida." };
    if (!campanaDisponible()) return { ok: false, motivo: "Ya usaste las cuatro acciones del año." };
    if (estadoAsamblea.campana.usadas.indexOf(accionId) !== -1) return { ok: false, motivo: "Ya hiciste esa acción este año." };
    if (presidente.dineroEnCaja < accion.costo) return { ok: false, motivo: "No hay caja suficiente." };

    if (accion.costo) ajustarDinero(-accion.costo, "Campaña: " + accion.nombre);

    Object.keys(accion.efecto).forEach(function(grupo) {
        estadoAsamblea.campana.efectos[grupo] = (estadoAsamblea.campana.efectos[grupo] || 0) + accion.efecto[grupo];
    });
    estadoAsamblea.campana.usadas.push(accionId);

    if (accion.promesa) {
        presidente.promesas.push({ texto: accion.promesa, anio: presidente.anioMandato, fecha: estadoLigas.fechaActual, cumplida: false });
    }

    if (typeof sonidoDecision === "function") sonidoDecision();
    return { ok: true, accion: accion };
}

function reiniciarCampana() {
    estadoAsamblea.campana = { usadas: [], efectos: {}, anio: presidente.anioMandato };
}

// -----------------------------
// ELECCIÓN
// -----------------------------

function resolverEleccion() {
    const ids = clubesAsamblea();
    const composicion = calcularAsamblea();
    const total = composicion.total || 1;
    // Cada indeciso vota que sí con la probabilidad necesaria para que el
    // resultado esperado sea exactamente la proyección mostrada.
    const pIndeciso = limitar((composicion.proyeccion * total - composicion.oficial.votos) / Math.max(1, composicion.indeciso.votos), 0.02, 0.98);

    let si = 0;
    let no = 0;
    let abstencion = 0;
    const detalle = [];

    ids.forEach(function(id) {
        const peso = pesoVotoClub(id);
        const sentido = sentidoVotoClub(id);
        let voto = "no";
        if (sentido === "oficialista") voto = "si";
        else if (sentido === "indeciso") {
            voto = probabilidad(pIndeciso) ? "si" : "no";
        }
        if (voto === "si") si += peso;
        else no += peso;
        detalle.push({ id: id, voto: voto, peso: peso });
    });

    const totalVotos = si + no + abstencion;
    const pct = si / (totalVotos || 1);
    const umbralFinal = limitar(Dificultad().umbralAsamblea + (typeof umbralAsambleaExtra === "function" ? umbralAsambleaExtra() : 0), 0.3, 0.8);
    const resultado = {
        anio: presidente.anioMandato,
        si: si,
        no: no,
        abstencion: abstencion,
        pct: pct,
        umbral: umbralFinal,
        gana: pct >= umbralFinal,
        detalle: detalle,
        fecha: new Date().toISOString()
    };

    estadoAsamblea.ultima = resultado;
    estadoAsamblea.historial.push({
        anio: resultado.anio,
        si: si,
        no: no,
        abstencion: abstencion,
        pct: pct,
        gana: resultado.gana
    });

    return resultado;
}

function puedeCensura() {
    const conf = ConfianzaConsejo();
    const riesgo = riesgoCensura();
    if (conf >= 32 || riesgo <= 0) return false;
    // Nadie te censura en el arranque: hay que dejar pasar media temporada.
    if (estadoLigas.fechaActual < 15) return false;
    return probabilidad(riesgo);
}

function clubesEnRiesgo() {
    const ids = clubesAsamblea();
    return ids.filter(function(id) { return sentidoVotoClub(id) === "indeciso"; }).length;
}
