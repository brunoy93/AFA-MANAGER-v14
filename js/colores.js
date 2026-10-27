// ============================================
// COLORES DE CLUB: la identidad de cada camiseta
// ============================================

const COLORES_CLUBES = {
    "River Plate": "#e2001a",
    "Boca Juniors": "#10357a",
    "Racing Club": "#2f6ec4",
    "Independiente": "#d61f26",
    "San Lorenzo": "#1b3f8b",
    "Huracán": "#d9d9d9",
    "Vélez Sarsfield": "#22409a",
    "Estudiantes de La Plata": "#d61f26",
    "Gimnasia y Esgrima La Plata": "#e6e6e6",
    "Newell's Old Boys": "#d61f26",
    "Rosario Central": "#f0c869",
    "Talleres": "#1b3f8b",
    "Belgrano": "#6bbf59",
    "Lanús": "#7a1f2b",
    "Banfield": "#6bbf59",
    "Argentinos Juniors": "#d61f26",
    "Defensa y Justicia": "#f0c869",
    "Godoy Cruz": "#1b3f8b",
    "Independiente Rivadavia": "#2f6ec4",
    "Atlético Tucumán": "#6aa9ff",
    "Tigre": "#d61f26",
    "Platense": "#e6e6e6",
    "Unión": "#d61f26",
    "Colón": "#d61f26",
    "Instituto": "#d61f26",
    "Barracas Central": "#d61f26",
    "Sarmiento": "#6bbf59",
    "Central Córdoba": "#f0c869",
    "Deportivo Riestra": "#1b3f8b",
    "San Martín de San Juan": "#6bbf59"
};

function colorClub(id) {
    const eq = EQUIPOS[id];
    if (!eq) return "#3ddc84";
    if (COLORES_CLUBES[eq.nombre]) return COLORES_CLUBES[eq.nombre];
    // Color estable por club para los que no están en la lista
    let hash = 0;
    const nombre = eq.nombre;
    for (let i = 0; i < nombre.length; i++) hash = (hash * 31 + nombre.charCodeAt(i)) % 360;
    return "hsl(" + hash + " 55% 55%)";
}

function colorClubSuave(id, alfa) {
    const c = colorClub(id);
    if (c.charAt(0) === "#" && c.length === 7) {
        const r = parseInt(c.slice(1, 3), 16);
        const g = parseInt(c.slice(3, 5), 16);
        const b = parseInt(c.slice(5, 7), 16);
        return "rgba(" + r + ", " + g + ", " + b + ", " + (alfa || 0.14) + ")";
    }
    return c;
}

function estiloClub(id) {
    return "--club:" + colorClub(id) + ";--club-suave:" + colorClubSuave(id, 0.16);
}
