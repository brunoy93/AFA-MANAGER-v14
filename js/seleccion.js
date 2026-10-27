// ============================================
// SELECCIÓN: candidatos a DT y lógica de elección
// ============================================

const CANDIDATOS_DT = [
    {
        id: "aimar",
        nombre: "Pablo Aimar",
        perfil: "Continuidad",
        descripcion: "El cerebro del cuerpo técnico campeón del mundo. Conoce a cada jugador y no rompe nada.",
        costo: 300,
        efectoPrestigio: 0,
        efectoApoyo: 0,
        resumen: "-$300M · Transición estable"
    },
    {
        id: "samuel",
        nombre: "Walter Samuel",
        perfil: "Continuidad defensiva",
        descripcion: "El 'Muro' fue ayudante de Scaloni desde 2018. Perfil defensivo, muy respetado por el plantel.",
        costo: 250,
        efectoPrestigio: 0,
        efectoApoyo: 2,
        resumen: "-$250M · +2 apoyo de clubes"
    },
    {
        id: "simeone",
        nombre: "Diego Simeone",
        perfil: "Autoridad mundial",
        descripcion: "El 'Cholo' lleva más de una década en el Atlético. Garra, orden y una identidad inconfundible.",
        costo: 1500,
        efectoPrestigio: 8,
        efectoApoyo: 0,
        resumen: "-$1.500M · +8 prestigio internacional"
    },
    {
        id: "gallardo",
        nombre: "Marcelo Gallardo",
        perfil: "Ídolo local",
        descripcion: "El 'Muñeco' ganó todo con River y está libre. La prensa y la gente lo piden a gritos.",
        costo: 800,
        efectoPrestigio: 5,
        efectoApoyo: 0,
        resumen: "-$800M · +5 prestigio internacional"
    },
    {
        id: "mascherano",
        nombre: "Javier Mascherano",
        perfil: "Nueva generación",
        descripcion: "El 'Jefecito' dirigió juveniles y la Sub-20. Conoce a los pibes que vienen y trabajó con Messi en Miami.",
        costo: 500,
        efectoPrestigio: 0,
        efectoApoyo: 0,
        resumen: "-$500M · Buen ojo con los jóvenes"
    },
    {
        id: "mohamed",
        nombre: "Antonio Mohamed",
        perfil: "Pragmático",
        descripcion: "El 'Turco' tiene 20 años de experiencia y 14 títulos. Dijo que está listo. Barato y confiable.",
        costo: 200,
        efectoPrestigio: 0,
        efectoApoyo: 0,
        resumen: "-$200M · Sin sorpresas"
    },
    {
        id: "pekelman",
        nombre: "José Pekerman",
        perfil: "Formador",
        descripcion: "El 'Flaco' es el gran formador de la historia reciente. Apostaría fuerte a las inferiores.",
        costo: 400,
        efectoPrestigio: 3,
        efectoApoyo: 0,
        resumen: "-$400M · +3 prestigio (apuesta a juveniles)"
    }
];

// Aplica la elección del DT al estado del presidente
function elegirDT(candidato) {
    ajustarDinero(-candidato.costo);
    if (candidato.efectoPrestigio !== 0) ajustarPrestigio(candidato.efectoPrestigio);
    if (candidato.efectoApoyo !== 0) ajustarApoyo(candidato.efectoApoyo);
    presidente.seleccionador = candidato.nombre;
}

function obtenerCandidatoPorNombre(nombre) {
    return CANDIDATOS_DT.find(function(c) { return c.nombre === nombre; }) || null;
}