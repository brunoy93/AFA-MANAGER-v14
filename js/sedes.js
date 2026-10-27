// ============================================
// SEDES: estadios neutrales para la Copa Argentina
// ============================================
// 32 estadios: 8 de Buenos Aires + 24 del Interior.
// Cada uno tiene: id, nombre, ciudad, provincia, categoria.

const SEDES = [
    // ===== BUENOS AIRES (8) =====
    { id: 1,  nombre: "Estadio Monumental",            ciudad: "Buenos Aires",  provincia: "CABA",           categoria: "elite",    capacidad: 84000 },
    { id: 2,  nombre: "La Bombonera",                  ciudad: "Buenos Aires",  provincia: "CABA",           categoria: "elite",    capacidad: 54000 },
    { id: 3,  nombre: "Estadio Libertadores de América",ciudad: "Avellaneda",   provincia: "Buenos Aires",   categoria: "elite",    capacidad: 48000 },
    { id: 4,  nombre: "Estadio Presidente Perón",      ciudad: "Avellaneda",    provincia: "Buenos Aires",   categoria: "elite",    capacidad: 55000 },
    { id: 5,  nombre: "Estadio Ciudad de La Plata",    ciudad: "La Plata",      provincia: "Buenos Aires",   categoria: "elite",    capacidad: 53000 },
    { id: 6,  nombre: "Estadio José Amalfitani",       ciudad: "Buenos Aires",  provincia: "CABA",           categoria: "elite",    capacidad: 49500 },
    { id: 7,  nombre: "Estadio Nuevo Gasómetro",       ciudad: "Buenos Aires",  provincia: "CABA",           categoria: "elite",    capacidad: 47000 },
    { id: 8,  nombre: "Estadio Tomás A. Ducó",         ciudad: "Buenos Aires",  provincia: "CABA",           categoria: "grande",   capacidad: 48000 },

    // ===== INTERIOR (24) =====
    { id: 9,  nombre: "Estadio Mario Alberto Kempes",  ciudad: "Córdoba",       provincia: "Córdoba",        categoria: "elite",    capacidad: 57000 },
    { id: 10, nombre: "Estadio Gigante de Arroyito",   ciudad: "Rosario",       provincia: "Santa Fe",       categoria: "elite",    capacidad: 41000 },
    { id: 11, nombre: "Estadio Marcelo Bielsa",        ciudad: "Rosario",       provincia: "Santa Fe",       categoria: "grande",   capacidad: 42000 },
    { id: 12, nombre: "Estadio Malvinas Argentinas",   ciudad: "Mendoza",       provincia: "Mendoza",        categoria: "grande",   capacidad: 40000 },
    { id: 13, nombre: "Estadio Bicentenario",          ciudad: "San Juan",      provincia: "San Juan",       categoria: "grande",   capacidad: 25000 },
    { id: 14, nombre: "Estadio Padre Ernesto Martearena",ciudad: "Salta",       provincia: "Salta",          categoria: "grande",   capacidad: 20000 },
    { id: 15, nombre: "Estadio Monumental José Fierro",ciudad: "Tucumán",       provincia: "Tucumán",        categoria: "grande",   capacidad: 35000 },
    { id: 16, nombre: "Estadio Mario Losano",          ciudad: "Santiago del Estero", provincia: "Santiago del Estero", categoria: "medio", capacidad: 20000 },
    { id: 17, nombre: "Estadio Ciudad de La Rioja",    ciudad: "La Rioja",      provincia: "La Rioja",       categoria: "medio",    capacidad: 15000 },
    { id: 18, nombre: "Estadio del Bicentenario",      ciudad: "Catamarca",     provincia: "Catamarca",      categoria: "medio",    capacidad: 15000 },
    { id: 19, nombre: "Estadio San Martín",            ciudad: "San Miguel de Tucumán", provincia: "Tucumán", categoria: "medio",   capacidad: 15000 },
    { id: 20, nombre: "Estadio Juan Domingo Perón",    ciudad: "Avellaneda",    provincia: "Buenos Aires",   categoria: "medio",    capacidad: 18000 },
    { id: 21, nombre: "Estadio Ciudad de Vicente López",ciudad: "Vicente López",provincia: "Buenos Aires",   categoria: "medio",    capacidad: 20000 },
    { id: 22, nombre: "Estadio Florencio Sola",        ciudad: "Banfield",      provincia: "Buenos Aires",   categoria: "grande",   capacidad: 34000 },
    { id: 23, nombre: "Estadio Norberto Tito Tomaghello",ciudad: "Florencio Varela", provincia: "Buenos Aires", categoria: "medio", capacidad: 18000 },
    { id: 24, nombre: "Estadio El Cilindro",           ciudad: "Avellaneda",    provincia: "Buenos Aires",   categoria: "elite",    capacidad: 55000 },
    { id: 25, nombre: "Estadio José María Minella",    ciudad: "Mar del Plata", provincia: "Buenos Aires",   categoria: "grande",   capacidad: 35000 },
    { id: 26, nombre: "Estadio Eva Perón",             ciudad: "Junín",         provincia: "Buenos Aires",   categoria: "medio",    capacidad: 22000 },
    { id: 27, nombre: "Estadio Nuevo Francisco Urbano",ciudad: "Morón",         provincia: "Buenos Aires",   categoria: "medio",    capacidad: 18000 },
    { id: 28, nombre: "Estadio Alfredo Beranger",      ciudad: "Temperley",     provincia: "Buenos Aires",   categoria: "medio",    capacidad: 13000 },
    { id: 29, nombre: "Estadio Julio Humberto Grondona",ciudad: "Sarandí",      provincia: "Buenos Aires",   categoria: "medio",    capacidad: 16000 },
    { id: 30, nombre: "Estadio Ciudad de Caseros",     ciudad: "Caseros",       provincia: "Buenos Aires",   categoria: "medio",    capacidad: 15000 },
    { id: 31, nombre: "Estadio Chateau Carreras",      ciudad: "Córdoba",       provincia: "Córdoba",        categoria: "grande",   capacidad: 35000 },
    { id: 32, nombre: "Estadio Único de La Plata",     ciudad: "La Plata",      provincia: "Buenos Aires",   categoria: "elite",    capacidad: 53000 }
];

function obtenerSedeAleatoria() {
    return SEDES[Math.floor(Math.random() * SEDES.length)];
}

function obtenerSedePorId(id) {
    return SEDES.find(function(s) { return s.id === id; }) || null;
}

// Devuelve el nombre del "dueño" provincial de una sede para el bonus de localía.
// Si el club es de la misma provincia que la sede, tiene ventaja.
function provinciaSede(sede) {
    return sede ? sede.provincia : null;
}