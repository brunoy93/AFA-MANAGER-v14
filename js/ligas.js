// ============================================
// LIGAS: estructura de las 3 divisiones + ascensos/descensos
// ============================================

const LIGAS = {
    primera: {
        id: "primera",
        nombre: "Liga Profesional",
        equipos: [],
        descensos: 3,
        tipo: "primera"
    },
    nacional: {
        id: "nacional",
        nombre: "Primera Nacional",
        equipos: [],
        descensos: 3,
        tipo: "segunda"
    },
    federalA: {
        id: "federalA",
        nombre: "Torneo Federal A",
        equipos: [],
        descensos: 0,
        tipo: "tercera"
    }
};

for (let i = 1; i <= 30; i++) LIGAS.primera.equipos.push(i);
for (let i = 31; i <= 66; i++) LIGAS.nacional.equipos.push(i);
for (let i = 67; i <= 103; i++) LIGAS.federalA.equipos.push(i);


const EQUIPOS = {
    // ===== PRIMERA (30) =====
    1:  { id: 1,  nombre: "River Plate",                    ligaId: "primera", pesoHistorico: 95, fuerza: 0 },
    2:  { id: 2,  nombre: "Boca Juniors",                   ligaId: "primera", pesoHistorico: 95, fuerza: 0 },
    3:  { id: 3,  nombre: "Racing Club",                    ligaId: "primera", pesoHistorico: 88, fuerza: 0 },
    4:  { id: 4,  nombre: "Independiente",                  ligaId: "primera", pesoHistorico: 88, fuerza: 0 },
    5:  { id: 5,  nombre: "San Lorenzo",                    ligaId: "primera", pesoHistorico: 85, fuerza: 0 },
    6:  { id: 6,  nombre: "Estudiantes de La Plata",        ligaId: "primera", pesoHistorico: 82, fuerza: 0 },
    7:  { id: 7,  nombre: "Vélez Sarsfield",                ligaId: "primera", pesoHistorico: 80, fuerza: 0 },
    8:  { id: 8,  nombre: "Rosario Central",                ligaId: "primera", pesoHistorico: 78, fuerza: 0 },
    9:  { id: 9,  nombre: "Newell's Old Boys",              ligaId: "primera", pesoHistorico: 78, fuerza: 0 },
    10: { id: 10, nombre: "Huracán",                        ligaId: "primera", pesoHistorico: 75, fuerza: 0 },
    11: { id: 11, nombre: "Talleres",                       ligaId: "primera", pesoHistorico: 75, fuerza: 0 },
    12: { id: 12, nombre: "Gimnasia y Esgrima La Plata",    ligaId: "primera", pesoHistorico: 72, fuerza: 0 },
    13: { id: 13, nombre: "Lanús",                          ligaId: "primera", pesoHistorico: 72, fuerza: 0 },
    14: { id: 14, nombre: "Argentinos Juniors",             ligaId: "primera", pesoHistorico: 70, fuerza: 0 },
    15: { id: 15, nombre: "Banfield",                       ligaId: "primera", pesoHistorico: 68, fuerza: 0 },
    16: { id: 16, nombre: "Tigre",                          ligaId: "primera", pesoHistorico: 65, fuerza: 0 },
    17: { id: 17, nombre: "Unión",                          ligaId: "primera", pesoHistorico: 65, fuerza: 0 },
    18: { id: 18, nombre: "Belgrano",                       ligaId: "primera", pesoHistorico: 65, fuerza: 0 },
    19: { id: 19, nombre: "Platense",                       ligaId: "primera", pesoHistorico: 62, fuerza: 0 },
    20: { id: 20, nombre: "Atlético Tucumán",               ligaId: "primera", pesoHistorico: 62, fuerza: 0 },
    21: { id: 21, nombre: "Defensa y Justicia",             ligaId: "primera", pesoHistorico: 55, fuerza: 0 },
    22: { id: 22, nombre: "Instituto",                      ligaId: "primera", pesoHistorico: 55, fuerza: 0 },
    23: { id: 23, nombre: "Aldosivi",                       ligaId: "primera", pesoHistorico: 55, fuerza: 0 },
    24: { id: 24, nombre: "Independiente Rivadavia",        ligaId: "primera", pesoHistorico: 55, fuerza: 0 },
    25: { id: 25, nombre: "Central Córdoba",                ligaId: "primera", pesoHistorico: 52, fuerza: 0 },
    26: { id: 26, nombre: "Sarmiento",                      ligaId: "primera", pesoHistorico: 52, fuerza: 0 },
    27: { id: 27, nombre: "Gimnasia Mendoza",               ligaId: "primera", pesoHistorico: 52, fuerza: 0 },
    28: { id: 28, nombre: "Barracas Central",               ligaId: "primera", pesoHistorico: 50, fuerza: 0 },
    29: { id: 29, nombre: "Estudiantes Río Cuarto",         ligaId: "primera", pesoHistorico: 48, fuerza: 0 },
    30: { id: 30, nombre: "Deportivo Riestra",              ligaId: "primera", pesoHistorico: 40, fuerza: 0 },

    // ===== NACIONAL (36) =====
    31: { id: 31, nombre: "Ferro Carril Oeste",             ligaId: "nacional", pesoHistorico: 65, fuerza: 0 },
    32: { id: 32, nombre: "Colón",                          ligaId: "nacional", pesoHistorico: 72, fuerza: 0 },
    33: { id: 33, nombre: "Godoy Cruz",                     ligaId: "nacional", pesoHistorico: 60, fuerza: 0 },
    34: { id: 34, nombre: "Tristán Suárez",                 ligaId: "nacional", pesoHistorico: 40, fuerza: 0 },
    35: { id: 35, nombre: "Deportivo Morón",                ligaId: "nacional", pesoHistorico: 48, fuerza: 0 },
    36: { id: 36, nombre: "Deportivo Madryn",               ligaId: "nacional", pesoHistorico: 42, fuerza: 0 },
    37: { id: 37, nombre: "Gimnasia y Tiro",                ligaId: "nacional", pesoHistorico: 38, fuerza: 0 },
    38: { id: 38, nombre: "Atlanta",                        ligaId: "nacional", pesoHistorico: 50, fuerza: 0 },
    39: { id: 39, nombre: "Temperley",                      ligaId: "nacional", pesoHistorico: 48, fuerza: 0 },
    40: { id: 40, nombre: "All Boys",                       ligaId: "nacional", pesoHistorico: 50, fuerza: 0 },
    41: { id: 41, nombre: "Almagro",                        ligaId: "nacional", pesoHistorico: 45, fuerza: 0 },
    42: { id: 42, nombre: "Nueva Chicago",                  ligaId: "nacional", pesoHistorico: 52, fuerza: 0 },
    43: { id: 43, nombre: "Chacarita Juniors",              ligaId: "nacional", pesoHistorico: 55, fuerza: 0 },
    44: { id: 44, nombre: "San Martín de Tucumán",          ligaId: "nacional", pesoHistorico: 45, fuerza: 0 },
    45: { id: 45, nombre: "San Martín de San Juan",         ligaId: "nacional", pesoHistorico: 42, fuerza: 0 },
    46: { id: 46, nombre: "Quilmes",                        ligaId: "nacional", pesoHistorico: 55, fuerza: 0 },
    47: { id: 47, nombre: "Estudiantes de Caseros",         ligaId: "nacional", pesoHistorico: 38, fuerza: 0 },
    48: { id: 48, nombre: "Defensores de Belgrano",         ligaId: "nacional", pesoHistorico: 40, fuerza: 0 },
    49: { id: 49, nombre: "Almirante Brown",                ligaId: "nacional", pesoHistorico: 42, fuerza: 0 },
    50: { id: 50, nombre: "Los Andes",                      ligaId: "nacional", pesoHistorico: 48, fuerza: 0 },
    51: { id: 51, nombre: "Colegiales",                     ligaId: "nacional", pesoHistorico: 35, fuerza: 0 },
    52: { id: 52, nombre: "Deportivo Maipú",                ligaId: "nacional", pesoHistorico: 38, fuerza: 0 },
    53: { id: 53, nombre: "Chaco For Ever",                 ligaId: "nacional", pesoHistorico: 42, fuerza: 0 },
    54: { id: 54, nombre: "Gimnasia de Jujuy",              ligaId: "nacional", pesoHistorico: 48, fuerza: 0 },
    55: { id: 55, nombre: "Racing de Córdoba",              ligaId: "nacional", pesoHistorico: 38, fuerza: 0 },
    56: { id: 56, nombre: "Atlético Rafaela",               ligaId: "nacional", pesoHistorico: 45, fuerza: 0 },
    57: { id: 57, nombre: "Agropecuario",                   ligaId: "nacional", pesoHistorico: 35, fuerza: 0 },
    58: { id: 58, nombre: "Patronato",                      ligaId: "nacional", pesoHistorico: 42, fuerza: 0 },
    59: { id: 59, nombre: "San Miguel",                     ligaId: "nacional", pesoHistorico: 32, fuerza: 0 },
    60: { id: 60, nombre: "Acassuso",                       ligaId: "nacional", pesoHistorico: 30, fuerza: 0 },
    61: { id: 61, nombre: "Güemes",                         ligaId: "nacional", pesoHistorico: 30, fuerza: 0 },
    62: { id: 62, nombre: "Mitre",                          ligaId: "nacional", pesoHistorico: 30, fuerza: 0 },
    63: { id: 63, nombre: "Central Norte",                  ligaId: "nacional", pesoHistorico: 32, fuerza: 0 },
    64: { id: 64, nombre: "San Telmo",                      ligaId: "nacional", pesoHistorico: 30, fuerza: 0 },
    65: { id: 65, nombre: "Ciudad de Bolívar",              ligaId: "nacional", pesoHistorico: 28, fuerza: 0 },
    66: { id: 66, nombre: "Midland",                        ligaId: "nacional", pesoHistorico: 30, fuerza: 0 },

    // ===== FEDERAL A (37) =====
    67: { id: 67, nombre: "Sol de América",                 ligaId: "federalA", pesoHistorico: 28, fuerza: 0 },
    68: { id: 68, nombre: "San Martín de Formosa",          ligaId: "federalA", pesoHistorico: 30, fuerza: 0 },
    69: { id: 69, nombre: "Guillermo Brown",                ligaId: "federalA", pesoHistorico: 35, fuerza: 0 },
    70: { id: 70, nombre: "Germinal",                       ligaId: "federalA", pesoHistorico: 25, fuerza: 0 },
    71: { id: 71, nombre: "Huracán Las Heras",              ligaId: "federalA", pesoHistorico: 32, fuerza: 0 },
    72: { id: 72, nombre: "Atlético San Martín",            ligaId: "federalA", pesoHistorico: 30, fuerza: 0 },
    73: { id: 73, nombre: "FADEP",                          ligaId: "federalA", pesoHistorico: 22, fuerza: 0 },
    74: { id: 74, nombre: "Sportivo Belgrano",              ligaId: "federalA", pesoHistorico: 35, fuerza: 0 },
    75: { id: 75, nombre: "Sportivo Las Parejas",           ligaId: "federalA", pesoHistorico: 28, fuerza: 0 },
    76: { id: 76, nombre: "Douglas Haig",                   ligaId: "federalA", pesoHistorico: 35, fuerza: 0 },
    77: { id: 77, nombre: "Racing de Córdoba (F)",          ligaId: "federalA", pesoHistorico: 32, fuerza: 0 },
    78: { id: 78, nombre: "Estudiantes de Río Cuarto (F)",  ligaId: "federalA", pesoHistorico: 30, fuerza: 0 },
    79: { id: 79, nombre: "Juventud Unida Universitario",   ligaId: "federalA", pesoHistorico: 25, fuerza: 0 },
    80: { id: 80, nombre: "Sportivo Peñarol",               ligaId: "federalA", pesoHistorico: 25, fuerza: 0 },
    81: { id: 81, nombre: "Círculo Deportivo",              ligaId: "federalA", pesoHistorico: 22, fuerza: 0 },
    82: { id: 82, nombre: "Independiente de Chivilcoy",     ligaId: "federalA", pesoHistorico: 28, fuerza: 0 },
    83: { id: 83, nombre: "Rivadavia de Lincoln",           ligaId: "federalA", pesoHistorico: 25, fuerza: 0 },
    84: { id: 84, nombre: "Villa Dálmine",                  ligaId: "federalA", pesoHistorico: 32, fuerza: 0 },
    85: { id: 85, nombre: "Atlético Camioneros",            ligaId: "federalA", pesoHistorico: 22, fuerza: 0 },
    86: { id: 86, nombre: "Deportivo Madryn (F)",           ligaId: "federalA", pesoHistorico: 35, fuerza: 0 },
    87: { id: 87, nombre: "Sportivo Desamparados",          ligaId: "federalA", pesoHistorico: 28, fuerza: 0 },
    88: { id: 88, nombre: "San Lorenzo de Alem",            ligaId: "federalA", pesoHistorico: 22, fuerza: 0 },
    89: { id: 89, nombre: "San Martín de Mendoza",          ligaId: "federalA", pesoHistorico: 28, fuerza: 0 },
    90: { id: 90, nombre: "Huracán de San Rafael",          ligaId: "federalA", pesoHistorico: 25, fuerza: 0 },
    91: { id: 91, nombre: "Pacífico",                       ligaId: "federalA", pesoHistorico: 22, fuerza: 0 },
    92: { id: 92, nombre: "Ferro de General Pico",          ligaId: "federalA", pesoHistorico: 25, fuerza: 0 },
    93: { id: 93, nombre: "Deportivo Rincón",               ligaId: "federalA", pesoHistorico: 20, fuerza: 0 },
    94: { id: 94, nombre: "Cipolletti",                     ligaId: "federalA", pesoHistorico: 32, fuerza: 0 },
    95: { id: 95, nombre: "Alvarado",                       ligaId: "federalA", pesoHistorico: 28, fuerza: 0 },
    96: { id: 96, nombre: "Villa Mitre",                    ligaId: "federalA", pesoHistorico: 30, fuerza: 0 },
    97: { id: 97, nombre: "Liniers",                        ligaId: "federalA", pesoHistorico: 25, fuerza: 0 },
    98: { id: 98, nombre: "Olimpo",                         ligaId: "federalA", pesoHistorico: 42, fuerza: 0 },
    99: { id: 99, nombre: "Argentino de Quilmes",           ligaId: "federalA", pesoHistorico: 28, fuerza: 0 },
    100:{ id: 100,nombre: "Deportivo Armenio",              ligaId: "federalA", pesoHistorico: 25, fuerza: 0 },
    101:{ id: 101,nombre: "Sportivo Italiano",              ligaId: "federalA", pesoHistorico: 28, fuerza: 0 },
    102:{ id: 102,nombre: "San Miguel (F)",                 ligaId: "federalA", pesoHistorico: 22, fuerza: 0 },
    103:{ id: 103,nombre: "Sportivo Barracas",              ligaId: "federalA", pesoHistorico: 20, fuerza: 0 }
};

// Contador para ids de equipos nuevos (del "Regional")
let proximoIdEquipo = 104;

// -----------------------------
// FUERZA INICIAL
// -----------------------------

function calcularFuerzaInicial(pesoHistorico) {
    // Rango más compacto: los grandes siguen siendo grandes, pero no hay
    // partidos decididos de antemano.
    const base = 52 + pesoHistorico * 0.38;
    const azar = Math.random() * 8;
    return Math.round(base + azar);
}

function inicializarEquipos() {
    Object.values(EQUIPOS).forEach(function(equipo) {
        equipo.fuerza = calcularFuerzaInicial(equipo.pesoHistorico);
    });
}

// Vuelve las tres divisiones a los 103 clubes originales (para una partida nueva)
function reiniciarEstructuraLigas() {
    ["primera", "nacional", "federalA"].forEach(function(k) { LIGAS[k].equipos.length = 0; });
    for (let i = 1; i <= 30; i++) LIGAS.primera.equipos.push(i);
    for (let i = 31; i <= 66; i++) LIGAS.nacional.equipos.push(i);
    for (let i = 67; i <= 103; i++) LIGAS.federalA.equipos.push(i);

    Object.keys(EQUIPOS).forEach(function(id) {
        const n = Number(id);
        if (n > 103) { delete EQUIPOS[id]; return; }
        EQUIPOS[id].ligaId = n <= 30 ? "primera" : n <= 66 ? "nacional" : "federalA";
    });
    proximoIdEquipo = 104;
}

// -----------------------------
// ASCENSOS Y DESCENSOS
// -----------------------------

function cantidadDescensos() {
    return (presidente.reglamento && presidente.reglamento.descensos) ? presidente.reglamento.descensos : 3;
}

function metodoDescenso() {
    return (presidente.reglamento && presidente.reglamento.metodo) ? presidente.reglamento.metodo : "tabla";
}

function idsQueDesciendenDePrimera(cantidad) {
    if (metodoDescenso() === "promedios" && typeof tablaPromedios === "function") {
        const promedios = tablaPromedios().filter(function(p) { return p.pj > 0; });
        if (promedios.length >= LIGAS.primera.equipos.length) {
            return promedios.slice(-cantidad).map(function(p) { return p.id; });
        }
    }
    return obtenerTablaOrdenada("primera").slice(-cantidad).map(function(eq) { return eq.id; });
}

function aplicarAscensosYDescensos() {
    const resumen = {
        ascendidos: [],
        descendidos: [],
        nuevos: [],
        metodo: metodoDescenso()
    };
    const cupo = cantidadDescensos();

    // Guardamos las tablas ANTES de mover nada
    const tablaPrimera = obtenerTablaOrdenada("primera");
    const tablaNacional = obtenerTablaOrdenada("nacional");
    const tablaFederalA = obtenerTablaOrdenada("federalA");

    // Guardamos los ids de los que van a moverse
    const idsDesciendenPrimera = idsQueDesciendenDePrimera(cupo);
    const idsAsciendenNacional = tablaNacional.slice(0, cupo).map(function(eq) { return eq.id; });
    const idsDesciendenNacional = tablaNacional.slice(-cupo).map(function(eq) { return eq.id; });
    const idsAsciendenFederalA = tablaFederalA.slice(0, cupo).map(function(eq) { return eq.id; });

    // --- 1) DESCENSOS DE PRIMERA → NACIONAL ---
    idsDesciendenPrimera.forEach(function(id) {
        const eq = EQUIPOS[id];
        const nombre = eq.nombre;
        moverEquipo(id, "nacional");
        resumen.descendidos.push({ nombre: nombre, desde: "Liga Profesional", hacia: "Primera Nacional" });
    });

    // --- 2) ASCENSOS DE NACIONAL → PRIMERA ---
    idsAsciendenNacional.forEach(function(id) {
        const eq = EQUIPOS[id];
        const nombre = eq.nombre;
        moverEquipo(id, "primera");
        resumen.ascendidos.push({ nombre: nombre, desde: "Primera Nacional", hacia: "Liga Profesional" });
    });

    // --- 3) DESCENSOS DE NACIONAL → FEDERAL A ---
    // (evitamos mover a los que ya ascendieron)
    idsDesciendenNacional.forEach(function(id) {
        if (EQUIPOS[id].ligaId === "nacional") {
            const eq = EQUIPOS[id];
            const nombre = eq.nombre;
            moverEquipo(id, "federalA");
            resumen.descendidos.push({ nombre: nombre, desde: "Primera Nacional", hacia: "Torneo Federal A" });
        }
    });

    // --- 4) ASCENSOS DE FEDERAL A → NACIONAL ---
    idsAsciendenFederalA.forEach(function(id) {
        if (EQUIPOS[id].ligaId === "federalA") {
            const eq = EQUIPOS[id];
            const nombre = eq.nombre;
            moverEquipo(id, "nacional");
            resumen.ascendidos.push({ nombre: nombre, desde: "Torneo Federal A", hacia: "Primera Nacional" });
        }
    });

    // --- 5) DESCENSOS DEL FEDERAL A AL REGIONAL ---
    // El Federal A tiene cupo fijo: los últimos tres bajan al Regional y
    // dejan su lugar a los tres clubes nuevos. Así el país sigue teniendo
    // los mismos clubes y el calendario no se estira año tras año.
    const idsBajanRegional = tablaFederalA.slice(-3).map(function(eq) { return eq.id; });
    idsBajanRegional.forEach(function(id) {
        if (EQUIPOS[id].ligaId !== "federalA") return;
        const eq = EQUIPOS[id];
        const nombre = eq.nombre;
        LIGAS.federalA.equipos = LIGAS.federalA.equipos.filter(function(x) { return x !== id; });
        eq.ligaId = "regional";
        resumen.descendidos.push({ nombre: nombre, desde: "Torneo Federal A", hacia: "Regional" });
    });

    // --- 6) EQUIPOS NUEVOS DEL REGIONAL AL FEDERAL A ---
    for (let i = 0; i < 3; i++) {
        const nuevoEquipo = generarEquipoRegional();
        EQUIPOS[nuevoEquipo.id] = nuevoEquipo;
        LIGAS.federalA.equipos.push(nuevoEquipo.id);
        resumen.nuevos.push({ nombre: nuevoEquipo.nombre, liga: "Torneo Federal A" });
    }

    return resumen;
}

function moverEquipo(idEquipo, nuevaLigaId) {
    const equipo = EQUIPOS[idEquipo];
    const ligaViejaId = equipo.ligaId;

    const ligaVieja = LIGAS[ligaViejaId];
    ligaVieja.equipos = ligaVieja.equipos.filter(function(id) { return id !== idEquipo; });

    const ligaNueva = LIGAS[nuevaLigaId];
    ligaNueva.equipos.push(idEquipo);
    equipo.ligaId = nuevaLigaId;
}

function generarEquipoRegional() {
    const adjetivos = [
        "Deportivo", "Atlético", "Sportivo", "Unión", "Defensores",
        "Racing", "Independiente", "Gimnasia", "Talleres", "Estudiantes",
        "Argentinos", "Alumni", "Ferro", "Huracán", "Banfield"
    ];
    const zonas = [
        "Regional Norte", "Regional Sur", "Regional Este", "Regional Oeste",
        "Regional Central", "del Litoral", "del Valle", "de la Pampa",
        "del Sur", "del Norte"
    ];

    const adjetivo = adjetivos[Math.floor(Math.random() * adjetivos.length)];
    const zona = zonas[Math.floor(Math.random() * zonas.length)];
    const sufijo = proximoIdEquipo;

    const peso = 15 + Math.floor(Math.random() * 15);

    const equipo = {
        id: proximoIdEquipo,
        nombre: adjetivo + " " + zona + " " + sufijo,
        ligaId: "federalA",
        pesoHistorico: peso,
        fuerza: calcularFuerzaInicial(peso)
    };
    proximoIdEquipo++;
    return equipo;
}

// -----------------------------
// RESET ANUAL
// -----------------------------

function resetearLigasParaNuevaTemporada() {
    Object.values(EQUIPOS).forEach(function(equipo) {
        const objetivo = equipo.pesoHistorico * 0.6 + Math.random() * 40 * 0.4;
        equipo.fuerza = Math.round((equipo.fuerza * 0.5) + (objetivo * 0.5));
    });
}