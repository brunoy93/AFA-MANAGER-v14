// ============================================
// COPA DE LA LIGA Y MUNDIAL DE CLUBES
// ============================================

const estadoCopaLiga = {
    activa: false,
    anio: 0,
    zonas: { A: [], B: [] },
    tablas: { A: {}, B: {} },
    rondas: [],
    ronda: 0,
    playoffs: null,
    campeon: null,
    historial: [],
    resultados: { A: [], B: [] }
};

function mezclarZonas(lista) {
    const copia = lista.slice();
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = copia[i]; copia[i] = copia[j]; copia[j] = tmp;
    }
    return copia;
}

function roundRobinConDescanso(equipos) {
    const lista = equipos.slice();
    if (lista.length % 2 !== 0) lista.push(null);
    const n = lista.length;
    const rondas = [];
    for (let r = 0; r < n - 1; r++) {
        const ronda = [];
        for (let i = 0; i < n / 2; i++) {
            const a = lista[i];
            const b = lista[n - 1 - i];
            if (a !== null && b !== null) ronda.push({ local: a, visitante: b });
        }
        rondas.push(ronda);
        lista.splice(1, 0, lista.pop());
    }
    return rondas;
}

function tablaVaciaCopa(equipos) {
    const t = {};
    equipos.forEach(function(id) { t[id] = { id: id, pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 }; });
    return t;
}

function iniciarCopaLiga() {
    const equipos = LIGAS.primera.equipos.slice();
    const orden = mezclarZonas(equipos);
    estadoCopaLiga.activa = true;
    estadoCopaLiga.anio = presidente.anioMandato;
    estadoCopaLiga.zonas = { A: orden.slice(0, 15), B: orden.slice(15, 30) };
    estadoCopaLiga.tablas = { A: tablaVaciaCopa(estadoCopaLiga.zonas.A), B: tablaVaciaCopa(estadoCopaLiga.zonas.B) };
    estadoCopaLiga.rondas = {
        A: roundRobinConDescanso(estadoCopaLiga.zonas.A).slice(0, 7),
        B: roundRobinConDescanso(estadoCopaLiga.zonas.B).slice(0, 7)
    };
    estadoCopaLiga.ronda = 0;
    estadoCopaLiga.playoffs = null;
    estadoCopaLiga.resultados = { A: [], B: [] };
    estadoCopaLiga.campeon = null;
}

function sumarTablaCopa(zona, local, visitante, gl, gv) {
    const t = estadoCopaLiga.tablas[zona];
    const a = t[local], b = t[visitante];
    if (!a || !b) return;
    a.pj++; b.pj++;
    a.gf += gl; a.gc += gv; b.gf += gv; b.gc += gl;
    a.dg = a.gf - a.gc; b.dg = b.gf - b.gc;
    if (gl > gv) { a.g++; a.pts += 3; b.p++; }
    else if (gl < gv) { b.g++; b.pts += 3; a.p++; }
    else { a.e++; b.e++; a.pts++; b.pts++; }
}

function jugarRondaCopaLiga() {
    if (!estadoCopaLiga.activa || estadoCopaLiga.ronda >= 7) return null;
    const salida = [];
    ["A", "B"].forEach(function(zona) {
        const ronda = estadoCopaLiga.rondas[zona][estadoCopaLiga.ronda] || [];
        const deZona = [];
        ronda.forEach(function(p) {
            const r = simularPartido(EQUIPOS[p.local], EQUIPOS[p.visitante]);
            sumarTablaCopa(zona, p.local, p.visitante, r.golesLocal, r.golesVisitante);
            salida.push(r);
            deZona.push(r);
        });
        if (!estadoCopaLiga.resultados) estadoCopaLiga.resultados = { A: [], B: [] };
        estadoCopaLiga.resultados[zona].push(deZona);
    });
    estadoCopaLiga.ronda++;
    if (estadoCopaLiga.ronda >= 7) armarPlayoffsCopaLiga();
    return salida;
}

function tablaZonaCopa(zona) {
    return Object.keys(estadoCopaLiga.tablas[zona]).map(function(id) {
        return estadoCopaLiga.tablas[zona][id];
    }).sort(function(a, b) {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.dg !== a.dg) return b.dg - a.dg;
        return b.gf - a.gf;
    });
}

function armarPlayoffsCopaLiga() {
    const a = tablaZonaCopa("A");
    const b = tablaZonaCopa("B");
    estadoCopaLiga.playoffs = {
        cuartos: [
            { local: a[0].id, visitante: b[3].id },
            { local: b[0].id, visitante: a[3].id },
            { local: a[1].id, visitante: b[2].id },
            { local: b[1].id, visitante: a[2].id }
        ],
        semis: [],
        final: null
    };
}

function jugarCopaDeLaLiga() {
    if (!estadoCopaLiga.activa) return null;
    const p = estadoCopaLiga.playoffs;
    if (!p) return null;

    if (!p.semis.length) {
        const ganadores = p.cuartos.map(function(c) {
            return jugarEliminatoriaCopa(c.local, c.visitante);
        });
        p.semis = [
            { local: ganadores[0], visitante: ganadores[1] },
            { local: ganadores[2], visitante: ganadores[3] }
        ];
        return { fase: "cuartos", ganadores: ganadores };
    }
    if (!p.final) {
        const g1 = jugarEliminatoriaCopa(p.semis[0].local, p.semis[0].visitante);
        const g2 = jugarEliminatoriaCopa(p.semis[1].local, p.semis[1].visitante);
        p.final = { local: g1, visitante: g2 };
        return { fase: "semis", ganadores: [g1, g2] };
    }
    const campeon = jugarEliminatoriaCopa(p.final.local, p.final.visitante);
    estadoCopaLiga.campeon = campeon;
    estadoCopaLiga.activa = false;
    estadoCopaLiga.historial.push({ anio: presidente.anioMandato, campeon: campeon });
    const eq = EQUIPOS[campeon];
    if (eq) eq.fuerza = Math.min(100, eq.fuerza + 2);
    ajustarPrestigio(2, "Copa de la Liga");
    agregarNoticia("TyC Sports", (eq ? eq.nombre : "Un club") + " ganó la Copa de la Liga",
        "Se quedó con el título y suma un lugar internacional para la próxima temporada.", "elogio");
    return { fase: "final", campeon: campeon };
}

function jugarEliminatoriaCopa(idA, idB) {
    const a = EQUIPOS[idA], b = EQUIPOS[idB];
    if (!a || !b) return idA;
    const r = simularPartido(a, b);
    if (r.golesLocal > r.golesVisitante) return idA;
    if (r.golesVisitante > r.golesLocal) return idB;
    return probabilidad(0.5) ? idA : idB;
}

// -----------------------------
// MUNDIAL DE CLUBES
// -----------------------------

const estadoMundialClubes = {
    anio: 0,
    participantes: [],
    campeon: null,
    historial: []
};

const GIGANTES_MUNDIAL = [
    { nombre: "Real Madrid", fuerza: 92 }, { nombre: "Manchester City", fuerza: 91 },
    { nombre: "Bayern Münich", fuerza: 89 }, { nombre: "PSG", fuerza: 87 },
    { nombre: "Liverpool", fuerza: 88 }, { nombre: "Inter", fuerza: 86 },
    { nombre: "Barcelona", fuerza: 87 }, { nombre: "Flamengo", fuerza: 84 }
];

function jugarMundialDeClubes() {
    const temporadas = estadoHistorial.temporadas;
    if (!temporadas.length) return null;
    const ultima = temporadas[temporadas.length - 1];
    if (!ultima.campeonId) return null;
    if (estadoMundialClubes.anio === ultima.anio) return estadoMundialClubes.campeon;

    const campeon = EQUIPOS[ultima.campeonId];
    const copa = Object.keys(EQUIPOS).map(function(k) { return EQUIPOS[k]; })
        .filter(function(e) { return e.nombre === ultima.copaArgentina; })[0];

    const participantes = [];
    if (campeon) participantes.push({ nombre: campeon.nombre, fuerza: campeon.fuerza, id: campeon.id, local: true });
    if (copa && (!campeon || copa.id !== campeon.id)) participantes.push({ nombre: copa.nombre, fuerza: copa.fuerza, id: copa.id, local: true });
    GIGANTES_MUNDIAL.slice(0, 6).forEach(function(g) { participantes.push({ nombre: g.nombre, fuerza: g.fuerza }); });

    const resultados = [];
    let ronda = participantes.slice();
    while (ronda.length > 1) {
        const siguiente = [];
        for (let i = 0; i < ronda.length; i += 2) {
            const a = ronda[i], b = ronda[i + 1];
            if (!b) { siguiente.push(a); continue; }
            const r = simularPartido({ id: a.id || a.nombre, nombre: a.nombre, fuerza: a.fuerza },
                { id: b.id || b.nombre, nombre: b.nombre, fuerza: b.fuerza });
            const gana = r.golesLocal > r.golesVisitante ? a : r.golesVisitante > r.golesLocal ? b : (probabilidad(0.5) ? a : b);
            resultados.push({ a: a.nombre, b: b.nombre, gl: r.golesLocal, gv: r.golesVisitante, gana: gana.nombre });
            siguiente.push(gana);
        }
        ronda = siguiente;
    }

    const campeonMundial = ronda[0];
    estadoMundialClubes.anio = ultima.anio;
    estadoMundialClubes.participantes = participantes.map(function(p) { return p.nombre; });
    estadoMundialClubes.campeon = campeonMundial.nombre;
    estadoMundialClubes.historial.push({ anio: ultima.anio, campeon: campeonMundial.nombre, resultados: resultados });

    if (campeonMundial.local) {
        ajustarPrestigio(6, "Mundial de Clubes");
        ajustarDinero(1500, "Mundial de Clubes");
    } else {
        ajustarPrestigio(1, "Mundial de Clubes");
    }
    agregarNoticia("Olé", "Mundial de Clubes: " + campeonMundial.nombre + " levantó el trofeo",
        "El torneo reunió a los campeones de Argentina con los gigantes de Europa.", "elogio");
    return campeonMundial.nombre;
}
