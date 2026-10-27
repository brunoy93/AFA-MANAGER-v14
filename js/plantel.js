// ============================================
// PLANTEL: el universo de jugadores y la convocatoria
// ============================================

const NOMBRES_PILA = [
    "Franco", "Lautaro", "Julián", "Nicolás", "Facundo", "Thiago", "Valentín", "Máximo",
    "Bautista", "Joaquín", "Santiago", "Tomás", "Ignacio", "Emiliano", "Gonzalo", "Ramiro",
    "Agustín", "Bruno", "Ciro", "Dante", "Ezequiel", "Federico", "Gaspar", "Hernán",
    "Iván", "Kevin", "Lisandro", "Mauro", "Nahuel", "Octavio", "Pablo", "Simón",
    "Tobías", "Ulises", "Vicente", "Wamil", "Yair", "Zacarías", "Aarón", "Benjamín"
];

const APELLIDOS = [
    "Álvarez", "Martínez", "Gómez", "Romero", "Sosa", "Torres", "Fernández", "Ruiz",
    "Benítez", "Acosta", "Medina", "Herrera", "Aguirre", "Pereyra", "Giménez", "Molina",
    "Silva", "Castro", "Rojas", "Ortiz", "Núñez", "Ledesma", "Cabrera", "Vega",
    "Quiroga", "Zárate", "Peralta", "Ojeda", "Barrios", "Cáceres", "Villalba", "Escobar",
    "Ibarra", "Maidana", "Sánchez", "Paz", "Godoy", "Correa", "Ferreyra", "Luna",
    "Carrizo", "Arias", "Duarte", "Navarro", "Cortés", "Ríos", "Valdez", "Suárez",
    "Domínguez", "Bustos", "Alvarado", "Miranda", "Orellana", "Palacios", "Ramírez", "Salas"
];

const POSICIONES = [
    { id: "ARQ", nombre: "Arquero", cantidad: 4, minimo: 2 },
    { id: "DEF", nombre: "Defensor", cantidad: 10, minimo: 6 },
    { id: "MED", nombre: "Mediocampista", cantidad: 9, minimo: 6 },
    { id: "DEL", nombre: "Delantero", cantidad: 7, minimo: 4 }
];

const CLUBES_EJEMPLO = [
    "River Plate", "Boca Juniors", "Racing Club", "Independiente", "San Lorenzo",
    "Estudiantes de La Plata", "Vélez Sarsfield", "Rosario Central", "Newell's Old Boys",
    "Talleres", "Lanús", "Argentinos Juniors", "Benfica", "Porto", "Atlético Madrid",
    "Manchester City", "Inter", "Milan", "Brighton", "Fiorentina", "Sevilla", "Villarreal",
    "Al Nassr", "Inter Miami", "Cruz Azul", "Flamengo", "Palmeiras", "Lazio"
];

const estadoSeleccion = {
    plantel: [],
    convocados: [],
    generado: false,
    anioGenerado: 0
};

const CONVOCADOS_TOTAL = 23;

function generarPlantelSeleccion() {
    const base = 68 + Math.round((presidente.prestigioInternacional - 50) * 0.25);
    const plantel = [];
    let n = 0;

    POSICIONES.forEach(function(pos) {
        for (let i = 0; i < pos.cantidad; i++) {
            const nombre = elegir(NOMBRES_PILA) + " " + elegir(APELLIDOS);
            const edad = entre(18, 34);
            let nivel = base + entre(-7, 13);
            if (edad >= 30) nivel += 2;
            if (edad <= 21) nivel -= 2;
            if (typeof tieneModificador === "function" && tieneModificador("cantera") && edad <= 22) nivel += 4;

            plantel.push({
                id: "p" + (++n),
                nombre: nombre,
                posicion: pos.id,
                posicionNombre: pos.nombre,
                edad: edad,
                club: elegir(CLUBES_EJEMPLO),
                nivel: limitar(Math.round(nivel), 55, 96),
                penal: limitar(Math.round(nivel + entre(-10, 10)), 40, 99)
            });
        }
    });

    plantel.sort(function(a, b) { return b.nivel - a.nivel; });
    estadoSeleccion.plantel = plantel;
    estadoSeleccion.generado = true;
    estadoSeleccion.anioGenerado = presidente.anioMandato;
    autoConvocar();
    return plantel;
}

function plantelSeleccion() {
    if (!estadoSeleccion.generado || !estadoSeleccion.plantel.length) generarPlantelSeleccion();
    return estadoSeleccion.plantel;
}

// -----------------------------
// CONVOCATORIA
// -----------------------------

function estaConvocado(id) {
    return (estadoSeleccion.convocados || []).indexOf(id) !== -1;
}

function jugadoresConvocados() {
    const ids = estadoSeleccion.convocados || [];
    return plantelSeleccion().filter(function(j) { return ids.indexOf(j.id) !== -1; });
}

function contarPosicion(pos) {
    return jugadoresConvocados().filter(function(j) { return j.posicion === pos; }).length;
}

function convocatoriaCompleta() {
    return (estadoSeleccion.convocados || []).length === CONVOCADOS_TOTAL;
}

function convocatoriaValida() {
    if (!convocatoriaCompleta()) return false;
    return POSICIONES.every(function(p) { return contarPosicion(p.id) >= p.minimo; });
}

function mensajeConvocatoria() {
    if (!convocatoriaCompleta()) {
        return "Faltan " + (CONVOCADOS_TOTAL - (estadoSeleccion.convocados || []).length) + " jugadores.";
    }
    const faltan = POSICIONES.filter(function(p) { return contarPosicion(p.id) < p.minimo; })
        .map(function(p) { return (p.minimo - contarPosicion(p.id)) + " " + p.id; });
    if (faltan.length) return "Faltan mínimos por posición: " + faltan.join(", ") + ".";
    return "Convocatoria lista.";
}

function alternarConvocado(id) {
    const lista = estadoSeleccion.convocados || (estadoSeleccion.convocados = []);
    const idx = lista.indexOf(id);
    if (idx !== -1) {
        lista.splice(idx, 1);
        return { ok: true, agregado: false };
    }
    if (lista.length >= CONVOCADOS_TOTAL) {
        return { ok: false, motivo: "Ya tenés " + CONVOCADOS_TOTAL + " convocados. Sacá uno primero." };
    }
    lista.push(id);
    return { ok: true, agregado: true };
}

function autoConvocar() {
    const plantel = estadoSeleccion.plantel || [];
    const elegidos = [];
    POSICIONES.forEach(function(pos) {
        const dePos = plantel.filter(function(j) { return j.posicion === pos.id; })
            .sort(function(a, b) { return b.nivel - a.nivel; });
        dePos.slice(0, pos.minimo).forEach(function(j) { elegidos.push(j.id); });
    });
    const resto = plantel.slice().sort(function(a, b) { return b.nivel - a.nivel; });
    for (let i = 0; i < resto.length && elegidos.length < CONVOCADOS_TOTAL; i++) {
        if (elegidos.indexOf(resto[i].id) === -1) elegidos.push(resto[i].id);
    }
    estadoSeleccion.convocados = elegidos;
    return elegidos;
}

function promedioConvocados() {
    const jugadores = jugadoresConvocados();
    if (!jugadores.length) return 0;
    return Math.round(jugadores.reduce(function(a, j) { return a + j.nivel; }, 0) / jugadores.length);
}

function promedioPlantel() {
    const plantel = plantelSeleccion();
    if (!plantel.length) return 0;
    return Math.round(plantel.reduce(function(a, j) { return a + j.nivel; }, 0) / plantel.length);
}

function nivelPromedioPosicion(pos) {
    const jugadores = jugadoresConvocados().filter(function(j) { return j.posicion === pos; });
    if (!jugadores.length) return 0;
    return Math.round(jugadores.reduce(function(a, j) { return a + j.nivel; }, 0) / jugadores.length);
}

// Los mejores pateadores para la tanda
function pateadoresTanda(cantidad) {
    return plantelSeleccion()
        .filter(function(j) { return (estadoSeleccion.convocados || []).indexOf(j.id) !== -1; })
        .sort(function(a, b) { return b.penal - a.penal; })
        .slice(0, cantidad || 5);
}

function fuerzaConvocatoria() {
    const prom = promedioConvocados();
    if (!prom) return 76;
    return limitar(Math.round(prom * 0.9 + 5), 50, 96);
}
