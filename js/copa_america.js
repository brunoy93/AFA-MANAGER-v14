// ============================================
// COPA AMÉRICA: torneo oficial de selecciones
// ============================================

const SELECCIONES_COPA = [
    { nombre: "Argentina", fuerza: 87 },
    { nombre: "Brasil", fuerza: 88 },
    { nombre: "Uruguay", fuerza: 82 },
    { nombre: "Colombia", fuerza: 80 },
    { nombre: "Chile", fuerza: 74 },
    { nombre: "Perú", fuerza: 71 },
    { nombre: "Ecuador", fuerza: 75 },
    { nombre: "Paraguay", fuerza: 72 },
    { nombre: "México", fuerza: 76 },
    { nombre: "Estados Unidos", fuerza: 75 },
    { nombre: "Venezuela", fuerza: 69 },
    { nombre: "Bolivia", fuerza: 61 }
];

let copaActual = null;
const historialCopas = [];

// -----------------------------
// SORTEO DE GRUPOS
// -----------------------------

function sortearGrupos() {
    const copia = SELECCIONES_COPA.slice();
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }

    return {
        A: copia.slice(0, 4),
        B: copia.slice(4, 8),
        C: copia.slice(8, 12)
    };
}

// -----------------------------
// SIMULAR PARTIDOS
// -----------------------------

function simularPartidoSelecciones(equipoA, equipoB) {
    const dif = equipoA.fuerza - equipoB.fuerza;
    const espA = Math.max(0.3, 1.2 + dif / 20);
    const espB = Math.max(0.3, 1.2 - dif / 20);

    return {
        golesA: poisson(espA),
        golesB: poisson(espB)
    };
}

function simularPartidoEliminatorio(equipoA, equipoB) {
    const r = simularPartidoSelecciones(equipoA, equipoB);

    if (r.golesA !== r.golesB) {
        return {
            ...r,
            penales: null,
            ganador: r.golesA > r.golesB ? equipoA : equipoB
        };
    }

    // Empate → penales
    const dif = equipoA.fuerza - equipoB.fuerza;
    const probA = 0.5 + dif / 100;
    const ganaA = Math.random() < probA;

    return {
        golesA: r.golesA,
        golesB: r.golesB,
        penales: ganaA ? "4-3" : "3-4",
        ganador: ganaA ? equipoA : equipoB
    };
}

// -----------------------------
// SIMULAR UN GRUPO
// -----------------------------

function simularGrupo(equipos) {
    const tabla = {};
    equipos.forEach(function(e) {
        tabla[e.nombre] = {
            nombre: e.nombre,
            PJ: 0, G: 0, E: 0, P: 0,
            GF: 0, GC: 0, DG: 0, Pts: 0
        };
    });

    const partidos = [];
    for (let i = 0; i < equipos.length; i++) {
        for (let j = i + 1; j < equipos.length; j++) {
            const a = equipos[i];
            const b = equipos[j];
            const r = simularPartidoSelecciones(a, b);

            tabla[a.nombre].PJ++;
            tabla[b.nombre].PJ++;
            tabla[a.nombre].GF += r.golesA;
            tabla[a.nombre].GC += r.golesB;
            tabla[b.nombre].GF += r.golesB;
            tabla[b.nombre].GC += r.golesA;

            if (r.golesA > r.golesB) {
                tabla[a.nombre].G++; tabla[a.nombre].Pts += 3; tabla[b.nombre].P++;
            } else if (r.golesA < r.golesB) {
                tabla[b.nombre].G++; tabla[b.nombre].Pts += 3; tabla[a.nombre].P++;
            } else {
                tabla[a.nombre].E++; tabla[b.nombre].E++;
                tabla[a.nombre].Pts++; tabla[b.nombre].Pts++;
            }

            partidos.push({
                local: a.nombre, visitante: b.nombre,
                golesLocal: r.golesA, golesVisitante: r.golesB
            });
        }
    }

    Object.values(tabla).forEach(function(t) {
        t.DG = t.GF - t.GC;
    });

    const ordenados = Object.values(tabla).sort(function(a, b) {
        if (b.Pts !== a.Pts) return b.Pts - a.Pts;
        if (b.DG !== a.DG) return b.DG - a.DG;
        if (b.GF !== a.GF) return b.GF - a.GF;
        return Math.random() - 0.5; // sorteo final
    });

    return { tabla: ordenados, partidos: partidos };
}

function nombreAEquipo(nombre) {
    return SELECCIONES_COPA.find(function(s) { return s.nombre === nombre; });
}

function jugarPartidoEliminatorio(nombreA, nombreB) {
    const a = nombreAEquipo(nombreA);
    const b = nombreAEquipo(nombreB);
    const r = simularPartidoEliminatorio(a, b);
    return {
        equipoA: nombreA,
        equipoB: nombreB,
        golesA: r.golesA,
        golesB: r.golesB,
        penales: r.penales,
        ganador: r.ganador.nombre
    };
}

// -----------------------------
// SIMULAR COPA COMPLETA
// -----------------------------

function simularCopa() {
    const grupos = sortearGrupos();

    const resultadosGrupos = {
        A: simularGrupo(grupos.A),
        B: simularGrupo(grupos.B),
        C: simularGrupo(grupos.C)
    };

    const primeros = [
        resultadosGrupos.A.tabla[0],
        resultadosGrupos.B.tabla[0],
        resultadosGrupos.C.tabla[0]
    ];
    const segundos = [
        resultadosGrupos.A.tabla[1],
        resultadosGrupos.B.tabla[1],
        resultadosGrupos.C.tabla[1]
    ];

    const terceros = [
        resultadosGrupos.A.tabla[2],
        resultadosGrupos.B.tabla[2],
        resultadosGrupos.C.tabla[2]
    ].sort(function(a, b) {
        if (b.Pts !== a.Pts) return b.Pts - a.Pts;
        if (b.DG !== a.DG) return b.DG - a.DG;
        return b.GF - a.GF;
    });

    const mejoresTerceros = terceros.slice(0, 2);

    const clasificados = primeros.concat(segundos).concat(mejoresTerceros);

    const mezclados = clasificados.slice();
    for (let i = mezclados.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mezclados[i], mezclados[j]] = [mezclados[j], mezclados[i]];
    }

    const cuartos = [
        jugarPartidoEliminatorio(mezclados[0].nombre, mezclados[1].nombre),
        jugarPartidoEliminatorio(mezclados[2].nombre, mezclados[3].nombre),
        jugarPartidoEliminatorio(mezclados[4].nombre, mezclados[5].nombre),
        jugarPartidoEliminatorio(mezclados[6].nombre, mezclados[7].nombre)
    ];

    const semis = [
        jugarPartidoEliminatorio(cuartos[0].ganador, cuartos[1].ganador),
        jugarPartidoEliminatorio(cuartos[2].ganador, cuartos[3].ganador)
    ];

    const final = jugarPartidoEliminatorio(semis[0].ganador, semis[1].ganador);

    const posicionArg = calcularPosicionArgentina(clasificados, cuartos, semis, final);

    aplicarPremiosCopa(posicionArg);
    actualizarRankingPorCopa(posicionArg);

    copaActual = {
        anio: presidente.anioMandato,
        grupos: grupos,
        resultadosGrupos: resultadosGrupos,
        clasificados: clasificados.map(function(c) { return c.nombre; }),
        cuartos: cuartos,
        semis: semis,
        final: final,
        posicionArgentina: posicionArg
    };

    historialCopas.push(copaActual);

    return copaActual;
}

// -----------------------------
// POSICIÓN DE ARGENTINA
// -----------------------------

function calcularPosicionArgentina(clasificados, cuartos, semis, final) {
    const arg = "Argentina";

    if (final.ganador === arg) return "campeon";
    if (final.equipoA === arg || final.equipoB === arg) return "subcampeon";

    const enSemis = semis.some(function(p) {
        return p.equipoA === arg || p.equipoB === arg;
    });
    if (enSemis) return "semifinales";

    const enCuartos = cuartos.some(function(p) {
        return p.equipoA === arg || p.equipoB === arg;
    });
    if (enCuartos) return "cuartos";

    return "grupos";
}

// -----------------------------
// PREMIOS
// -----------------------------

function aplicarPremiosCopa(posicion) {
    switch (posicion) {
        case "campeon":
            ajustarPrestigio(20);
            ajustarDinero(2000);
            break;
        case "subcampeon":
            ajustarPrestigio(10);
            ajustarDinero(1000);
            break;
        case "semifinales":
            ajustarPrestigio(4);
            ajustarDinero(500);
            break;
        case "cuartos":
            ajustarPrestigio(0);
            ajustarDinero(200);
            break;
        case "grupos":
            ajustarPrestigio(-10);
            ajustarDinero(-300);
            break;
    }
}

// -----------------------------
// INFO
// -----------------------------

function obtenerCopaActual() {
    return copaActual;
}

function obtenerHistorialCopas() {
    return historialCopas;
}