// ============================================
// VIDA DE LOS CLUBES: técnicos, clásicos y cancha
// ============================================

const estadoTecnicos = {
    porClub: {},
    cesantes: []
};

const CLASICOS_CLUBES = [
    { a: "River Plate", b: "Boca Juniors", nombre: "Superclásico" },
    { a: "Racing Club", b: "Independiente", nombre: "Clásico de Avellaneda" },
    { a: "San Lorenzo", b: "Huracán", nombre: "Clásico de barrio" },
    { a: "Estudiantes de La Plata", b: "Gimnasia y Esgrima La Plata", nombre: "Clásico platense" },
    { a: "Newell's Old Boys", b: "Rosario Central", nombre: "Clásico rosarino" },
    { a: "Talleres", b: "Belgrano", nombre: "Clásico cordobés" },
    { a: "Vélez Sarsfield", b: "Argentinos Juniors", nombre: "Clásico de barrio" },
    { a: "Lanús", b: "Banfield", nombre: "Clásico del sur" }
];

const estadoClasicos = { historial: {} };

const APELLIDOS_DT = ["Gallardo", "Bianchi", "Gago", "Almeyda", "Russo", "Zubeldía", "Coudet", "Battaglia", "Ibarra", "Gareca", "Milito", "Domínguez", "Médici", "Sava", "Guede", "Pékerman", "Zielinski", "Barros Schelotto"];

function reiniciarVidaClubes() {
    estadoTecnicos.porClub = {};
    estadoTecnicos.cesantes = [];
    estadoClasicos.historial = {};
    LIGAS.primera.equipos.forEach(function(id) {
        estadoTecnicos.porClub[id] = {
            nombre: elegir(APELLIDOS_DT),
            desde: presidente.anioMandato,
            partidos: 0,
            malos: 0
        };
    });
}

function dtDeClub(idClub) {
    return estadoTecnicos.porClub[Number(idClub)] || null;
}

function actualizarTecnicos() {
    const tabla = obtenerTablaOrdenada("primera");
    const cola = tabla.slice(-5).map(function(t) { return t.id; });

    tabla.forEach(function(t) {
        const id = t.id;
        if (!estadoTecnicos.porClub[id]) {
            estadoTecnicos.porClub[id] = { nombre: elegir(APELLIDOS_DT), desde: presidente.anioMandato, partidos: 0, malos: 0 };
        }
        const dt = estadoTecnicos.porClub[id];
        dt.partidos = (dt.partidos || 0) + 1;
    });

    cola.forEach(function(id) {
        const dt = estadoTecnicos.porClub[id];
        if (!dt) return;
        dt.malos = (dt.malos || 0) + 1;
        if (dt.partidos > 6 && dt.malos > 4 && probabilidad(0.22)) {
            estadoTecnicos.cesantes.push({
                clubId: id,
                club: EQUIPOS[id].nombre,
                nombre: dt.nombre,
                anio: presidente.anioMandato,
                fecha: estadoLigas.fechaActual
            });
            if (estadoTecnicos.cesantes.length > 20) estadoTecnicos.cesantes.shift();
            const viejo = dt.nombre;
            estadoTecnicos.porClub[id] = {
                nombre: elegir(APELLIDOS_DT.filter(function(n) { return n !== viejo; })),
                desde: presidente.anioMandato,
                partidos: 0,
                malos: 0
            };
            agregarNoticia("TyC Sports", EQUIPOS[id].nombre + " echó a " + viejo,
                "La dirigencia del club decidió cortar por lo sano. Llega " + estadoTecnicos.porClub[id].nombre + " para enderezar el rumbo.", "rumor");
        }
    });
}

// -----------------------------
// CLÁSICOS
// -----------------------------

function clasicoDe(local, visitante) {
    const nL = EQUIPOS[local] ? EQUIPOS[local].nombre : local;
    const nV = EQUIPOS[visitante] ? EQUIPOS[visitante].nombre : visitante;
    return CLASICOS_CLUBES.filter(function(c) {
        return (c.a === nL && c.b === nV) || (c.a === nV && c.b === nL);
    })[0] || null;
}

function registrarClasico(local, visitante, gl, gv) {
    const c = clasicoDe(local, visitante);
    if (!c) return null;
    const clave = c.nombre;
    if (!estadoClasicos.historial[clave]) {
        estadoClasicos.historial[clave] = { nombre: clave, partidos: 0, ganaA: 0, ganaB: 0, empates: 0, golesA: 0, golesB: 0 };
    }
    const h = estadoClasicos.historial[clave];
    h.partidos++;
    if (gl === gv) h.empates++;
    else {
        const ganoLocal = gl > gv;
        const ganoA = (ganoLocal && EQUIPOS[local].nombre === c.a) || (!ganoLocal && EQUIPOS[visitante].nombre === c.a);
        if (ganoA) h.ganaA++; else h.ganaB++;
    }
    if (EQUIPOS[local].nombre === c.a) { h.golesA += gl; h.golesB += gv; }
    else { h.golesA += gv; h.golesB += gl; }
    return h;
}

function clasicosHistorial() {
    return Object.keys(estadoClasicos.historial).map(function(k) { return estadoClasicos.historial[k]; });
}

// -----------------------------
// ASISTENCIA (calculada, no persiste)
// -----------------------------

function asistenciaEstimada(r, posLocal) {
    const local = EQUIPOS[r.localId];
    if (!local) return 0;
    const capacidad = 18000 + local.pesoHistorico * 420;
    const arrastre = r.golesLocal > r.golesVisitante ? 1.1 : 0.86;
    const factorTabla = posLocal ? limitar(1.15 - posLocal * 0.02, 0.7, 1.15) : 1;
    return Math.round(capacidad * arrastre * factorTabla * (0.85 + Math.random() * 0.2));
}
