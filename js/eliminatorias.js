// ============================================
// ELIMINATORIAS: el camino al Mundial 2030
// ============================================

const RIVALES_ELIMINATORIAS = [
    { nombre: "Brasil", fuerza: 88, bandera: "brasil" },
    { nombre: "Uruguay", fuerza: 82, bandera: "uruguay" },
    { nombre: "Colombia", fuerza: 80, bandera: "colombia" },
    { nombre: "Ecuador", fuerza: 75, bandera: "ecuador" },
    { nombre: "Chile", fuerza: 74, bandera: "chile" },
    { nombre: "Paraguay", fuerza: 72, bandera: "paraguay" },
    { nombre: "Perú", fuerza: 71, bandera: "peru" },
    { nombre: "Venezuela", fuerza: 69, bandera: "venezuela" },
    { nombre: "Bolivia", fuerza: 61, bandera: "bolivia" }
];

const estadoEliminatorias = {
    rondas: [],
    ronda: 0,
    tabla: {},
    resultados: [],
    estadoFinal: null,
    mundial: null
};

function fuerzaDeSeleccion(nombre) {
    if (nombre === "Argentina") {
        return (typeof fuerzaSeleccion === "function") ? fuerzaSeleccion() : 80;
    }
    const r = RIVALES_ELIMINATORIAS.filter(function(x) { return x.nombre === nombre; })[0];
    return r ? r.fuerza : 72;
}

function nombreEquipoElim(nombre) {
    return { nombre: nombre, fuerza: fuerzaDeSeleccion(nombre) };
}

function roundRobin(nombres) {
    const lista = nombres.slice();
    const n = lista.length;
    const rondas = [];

    for (let r = 0; r < n - 1; r++) {
        const ronda = [];
        for (let i = 0; i < n / 2; i++) {
            const a = lista[i];
            const b = lista[n - 1 - i];
            ronda.push(r % 2 === 0 ? { local: a, visitante: b } : { local: b, visitante: a });
        }
        rondas.push(ronda);
        lista.splice(1, 0, lista.pop());
    }
    const vuelta = rondas.map(function(ronda) {
        return ronda.map(function(p) { return { local: p.visitante, visitante: p.local }; });
    });
    return rondas.concat(vuelta);
}

function tablaVaciaElim() {
    const t = {};
    ["Argentina"].concat(RIVALES_ELIMINATORIAS.map(function(r) { return r.nombre; })).forEach(function(n) {
        t[n] = { nombre: n, pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 };
    });
    return t;
}

function reiniciarEliminatorias() {
    estadoEliminatorias.rondas = roundRobin(["Argentina"].concat(RIVALES_ELIMINATORIAS.map(function(r) { return r.nombre; })));
    estadoEliminatorias.ronda = 0;
    estadoEliminatorias.tabla = tablaVaciaElim();
    estadoEliminatorias.resultados = [];
    estadoEliminatorias.estadoFinal = null;
    estadoEliminatorias.mundial = null;
}

function sumarTablaElim(local, visitante, gl, gv) {
    const t = estadoEliminatorias.tabla;
    const a = t[local], b = t[visitante];
    if (!a || !b) return;
    a.pj++; b.pj++;
    a.gf += gl; a.gc += gv; b.gf += gv; b.gc += gl;
    a.dg = a.gf - a.gc; b.dg = b.gf - b.gc;
    if (gl > gv) { a.g++; a.pts += 3; b.p++; }
    else if (gl < gv) { b.g++; b.pts += 3; a.p++; }
    else { a.e++; b.e++; a.pts++; b.pts++; }
}

function simularPartidoElim(local, visitante) {
    const a = nombreEquipoElim(local);
    const b = nombreEquipoElim(visitante);
    const dif = a.fuerza - b.fuerza;
    const gl = poisson(Math.max(0.2, 1.25 + dif / 26));
    const gv = poisson(Math.max(0.2, 1.15 - dif / 26));
    return { local: local, visitante: visitante, golesLocal: gl, golesVisitante: gv };
}

function jugarRondaEliminatorias() {
    if (estadoEliminatorias.ronda >= estadoEliminatorias.rondas.length) return null;
    const ronda = estadoEliminatorias.rondas[estadoEliminatorias.ronda];
    const resultados = ronda.map(function(p) {
        const r = simularPartidoElim(p.local, p.visitante);
        sumarTablaElim(r.local, r.visitante, r.golesLocal, r.golesVisitante);
        return r;
    });

    const propio = resultados.filter(function(r) {
        return r.local === "Argentina" || r.visitante === "Argentina";
    })[0];

    estadoEliminatorias.resultados.push({ ronda: estadoEliminatorias.ronda + 1, partidos: resultados });
    if (estadoEliminatorias.resultados.length > 20) estadoEliminatorias.resultados.shift();
    estadoEliminatorias.ronda++;

    if (propio) {
        const gano = propio.local === "Argentina" ? propio.golesLocal > propio.golesVisitante : propio.golesVisitante > propio.golesLocal;
        const empato = propio.golesLocal === propio.golesVisitante;
        const rival = propio.local === "Argentina" ? propio.visitante : propio.local;
        if (gano) { ajustarPrestigio(1, "Eliminatorias vs " + rival); }
        else if (!empato) { ajustarPrestigio(-1, "Eliminatorias vs " + rival); }
    }
    return { ronda: estadoEliminatorias.ronda, propio: propio, resultados: resultados };
}

function tablaEliminada() {
    return Object.values(estadoEliminatorias.tabla).sort(function(a, b) {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.dg !== a.dg) return b.dg - a.dg;
        return b.gf - a.gf;
    });
}

function posicionArgentinaElim() {
    return tablaEliminada().map(function(t) { return t.nombre; }).indexOf("Argentina") + 1;
}

function totalRondasElim() { return estadoEliminatorias.rondas.length; }

function cerrarEliminatorias() {
    if (estadoEliminatorias.estadoFinal) return estadoEliminatorias.estadoFinal;
    const pos = posicionArgentinaElim();
    let estado = "eliminado";
    if (pos <= 4) estado = "clasificado";
    else if (pos === 5) estado = "repechaje";
    estadoEliminatorias.estadoFinal = { posicion: pos, estado: estado };
    return estadoEliminatorias.estadoFinal;
}

// -----------------------------
// MUNDIAL 2030 (simulación compacta)
// -----------------------------

const RIVALES_MUNDIAL = [
    { nombre: "Francia", fuerza: 87 }, { nombre: "España", fuerza: 87 }, { nombre: "Inglaterra", fuerza: 85 },
    { nombre: "Alemania", fuerza: 84 }, { nombre: "Brasil", fuerza: 88 }, { nombre: "Portugal", fuerza: 84 },
    { nombre: "Países Bajos", fuerza: 83 }, { nombre: "Bélgica", fuerza: 80 }, { nombre: "Croacia", fuerza: 80 },
    { nombre: "Italia", fuerza: 82 }, { nombre: "Uruguay", fuerza: 82 }, { nombre: "Marruecos", fuerza: 79 },
    { nombre: "Japón", fuerza: 78 }, { nombre: "Estados Unidos", fuerza: 76 }, { nombre: "México", fuerza: 75 },
    { nombre: "Corea del Sur", fuerza: 74 }, { nombre: "Senegal", fuerza: 77 }, { nombre: "Colombia", fuerza: 80 },
    { nombre: "Ecuador", fuerza: 75 }, { nombre: "Australia", fuerza: 72 }
];

function simularPartidoMundial(fa, fb) {
    const gl = poisson(Math.max(0.2, 1.2 + (fa - fb) / 28));
    const gv = poisson(Math.max(0.2, 1.2 - (fa - fb) / 28));
    if (gl === gv) {
        // penales
        return { gl: gl, gv: gv, penales: probabilidad(0.5) ? "si" : "no" };
    }
    return { gl: gl, gv: gv, penales: null };
}

function jugarMundial() {
    if (estadoEliminatorias.mundial) return estadoEliminatorias.mundial;
    const clasif = cerrarEliminatorias();
    if (clasif.estado === "eliminado") {
        estadoEliminatorias.mundial = { jugado: true, posicion: "no clasificado", premio: 0 };
        return estadoEliminatorias.mundial;
    }

    // La posición en las eliminatorias marca el envión: puntero suma más.
    const bonusPos = clasif.posicion === 1 ? 4 : clasif.posicion <= 4 ? 2 : 0;
    const fuerza = fuerzaSeleccion() + bonusPos;
    const rivales = barajar(RIVALES_MUNDIAL).slice(0, 3);
    let puntos = 0;
    rivales.forEach(function(r) {
        const m = simularPartidoMundial(fuerza, r.fuerza);
        if (m.gl > m.gv) puntos += 3;
        else if (m.gl === m.gv) puntos += 1;
    });

    if (puntos < 3) {
        estadoEliminatorias.mundial = { jugado: true, posicion: "fase de grupos", premio: 0 };
        return estadoEliminatorias.mundial;
    }

    // Eliminatorias: 4 rondas
    let fase = "octavos";
    let vivo = true;
    const rondas = [
        { nombre: "octavos", premio: 1200, prestigio: 3 },
        { nombre: "cuartos", premio: 1800, prestigio: 6 },
        { nombre: "semifinal", premio: 2600, prestigio: 10 },
        { nombre: "final", premio: 4000, prestigio: 16 }
    ];

    for (let i = 0; i < rondas.length && vivo; i++) {
        const rival = elegir(RIVALES_MUNDIAL.filter(function(r) { return r.fuerza >= 80; }));
        const m = simularPartidoMundial(fuerza, rival.fuerza);
        let gana = m.gl > m.gv;
        if (m.gl === m.gv) gana = probabilidad(0.5);
        if (!gana) {
            estadoEliminatorias.mundial = { jugado: true, posicion: rondas[i].nombre, premio: rondas[i].premio / 2, prestigio: rondas[i].prestigio / 2, rival: rival.nombre };
            vivo = false;
        } else if (i === rondas.length - 1) {
            estadoEliminatorias.mundial = { jugado: true, posicion: "campeón", premio: rondas[i].premio, prestigio: rondas[i].prestigio, rival: rival.nombre };
        }
    }
    if (!estadoEliminatorias.mundial) {
        estadoEliminatorias.mundial = { jugado: true, posicion: "cuartos", premio: 900, prestigio: 4 };
    }

    const m = estadoEliminatorias.mundial;
    if (m.premio) ajustarDinero(m.premio, "Mundial 2030");
    if (m.prestigio) ajustarPrestigio(Math.round(m.prestigio), "Mundial 2030");
    if (typeof noticiaDeMundial === "function") noticiaDeMundial(m);
    return m;
}

function textoMundial(pos) {
    const mapa = {
        "campeón": "Campeón del mundo",
        "final": "Subcampeón",
        "semifinal": "Semifinales",
        "cuartos": "Cuartos de final",
        "octavos": "Octavos de final",
        "fase de grupos": "Eliminado en grupos",
        "no clasificado": "No clasificó"
    };
    return mapa[pos] || pos;
}
