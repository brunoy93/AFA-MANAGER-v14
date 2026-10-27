// ============================================
// EVENTOS v4: tanda de penales y mercado
// ============================================

EVENTOS_V3.push({
    id: "finalPenales",
    titulo: "Se define por penales",
    descripcion: "La final terminó empatada y todo se define desde los doce pasos. La AFA tiene la última palabra en la lista de pateadores.",
    tanda: true,
    rival: "Brasil",
    premio: { prestigio: 6, apoyo: 4, dinero: 900 }
});

EVENTOS_V3.push({
    id: "ofertaRecord",
    titulo: "Oferta récord por la joya del torneo",
    descripcion: "Un club de Medio Oriente pone 40 millones por el pibe de 19 años que la rompe en el Federal A. El club está en crisis y la prensa ya habla de venta.",
    opciones: [
        {
            texto: "Aprobar la venta y cobrar la solidaridad",
            resumen: "+$1.600M, -6 apoyo, el club se salva",
            efecto: function() {
                ajustarDinero(1600, "Solidaridad por venta récord");
                ajustarApoyo(-6, "Venta récord");
                agregarNoticia("Olé", "Venta récord: la joya se va por 40 millones", "La AFA cobró su parte. El club respira, la hinchada no.", "critica");
            }
        },
        {
            texto: "Bloquear la operación",
            resumen: "+8 apoyo, -4 prestigio",
            efecto: function() {
                ajustarApoyo(8, "Bloqueo de la venta récord");
                ajustarPrestigio(-4, "Bloqueo de la venta récord");
            }
        },
        {
            texto: "Permitir la venta pero exigir una cláusula de recompra",
            resumen: "+$900M, +3 prestigio",
            efecto: function() {
                ajustarDinero(900, "Venta con recompra");
                ajustarPrestigio(3, "Cláusula de recompra");
            }
        }
    ]
});

EVENTOS_V3.push({
    id: "tandaAmistosa",
    titulo: "Desafío de penales en la concentración",
    descripcion: "Los jugadores te desafían a una tanda en el predio. La prensa está mirando y el video puede volverse viral.",
    tanda: true,
    rival: "Uruguay",
    premio: { prestigio: 3, apoyo: 1, dinero: 0 }
});
