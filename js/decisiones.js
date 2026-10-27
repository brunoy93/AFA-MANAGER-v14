// ============================================
// DECISIONES: todas las decisiones del presidente
// ============================================
// Cada decisión tiene: id, titulo, descripcion, categoria, opciones.
// Opcionalmente: desbloquea (id de otra decisión que se encola).
// Opcionalmente: condicion (función que devuelve true/false para que aparezca).

const colaDecisiones = [];

const DECISIONES = [

    // ==================== DECISIONES BASE ====================

    {
        id: "sad",
        titulo: "Capital privado en los clubes",
        descripcion: "Un grupo empresario ofrece invertir 50 millones de dólares en un club grande. Los clubes del Interior amenazan con romper relaciones si lo permitís.",
        categoria: "institucional",
        opciones: [
            {
                texto: "Permitir la inversión (SAD sí)",
                efecto: function() {
                    ajustarDinero(3000);
                    ajustarApoyo(-10);
                    ajustarPrestigio(5);
                    encolarDecision("regular_sad");
                },
                resumen: "+$3.000M, -10 apoyo, +5 prestigio · Desbloquea un debate futuro"
            },
            {
                texto: "Prohibir la inversión (SAD no)",
                efecto: function() {
                    ajustarApoyo(8);
                    ajustarPrestigio(-5);
                },
                resumen: "+8 apoyo, -5 prestigio"
            },
            {
                texto: "Crear una comisión para estudiarlo",
                efecto: function() {
                    ajustarApoyo(-4);
                    ajustarDinero(-300);
                },
                resumen: "-4 apoyo, -$300M (nadie queda contento)"
            }
        ]
    },

    {
        id: "fechasfifa",
        titulo: "Calendario y fechas FIFA",
        descripcion: "La liga sigue jugándose durante las fechas FIFA. Los clubes pierden a sus convocados en partidos clave y amenazan con no cederlos.",
        categoria: "deportiva",
        opciones: [
            {
                texto: "Pausar la liga en fechas FIFA",
                efecto: function() {
                    ajustarApoyo(10);
                    ajustarDinero(-500);
                },
                resumen: "+10 apoyo, -$500M (menos taquilla, más paz)"
            },
            {
                texto: "Seguir jugando igual",
                efecto: function() {
                    ajustarApoyo(-8);
                    ajustarDinero(600);
                },
                resumen: "-8 apoyo, +$600M"
            }
        ]
    },

    {
        id: "tv",
        titulo: "Contrato de televisión",
        descripcion: "La TV ofrece renovar el contrato por 3 años, pero con una rebaja del 15%. Los clubes chicos dependen de ese dinero para sobrevivir.",
        categoria: "economica",
        opciones: [
            {
                texto: "Aceptar la rebaja",
                efecto: function() {
                    ajustarDinero(1500);
                    ajustarApoyo(-6);
                    encolarDecision("clubes_chicos_reclaman");
                },
                resumen: "+$1.500M, -6 apoyo · Desbloquea un reclamo futuro"
            },
            {
                texto: "Rechazar y negociar con otra empresa",
                efecto: function() {
                    if (Math.random() < 0.5) {
                        ajustarDinero(4500);
                        ajustarApoyo(4);
                    } else {
                        ajustarDinero(-800);
                        ajustarApoyo(-10);
                    }
                },
                resumen: "50%: +$4.500M +4 apoyo / 50%: -$800M -10 apoyo"
            }
        ]
    },

    {
        id: "ascenso",
        titulo: "Reparto del dinero del Ascenso",
        descripcion: "Los clubes del Interior del Ascenso denuncian que los de Buenos Aires reciben casi el doble de dinero por TV. Exigen igualdad.",
        categoria: "economica",
        opciones: [
            {
                texto: "Igualar el reparto",
                efecto: function() {
                    ajustarApoyo(12);
                    ajustarDinero(-900);
                },
                resumen: "+12 apoyo, -$900M"
            },
            {
                texto: "Mantener la diferencia",
                efecto: function() {
                    ajustarApoyo(-10);
                    ajustarDinero(400);
                },
                resumen: "-10 apoyo, +$400M"
            }
        ]
    },

    {
        id: "veron",
        titulo: "Sanción por incidentes en la Supercopa",
        descripcion: "El presidente de un club grande tuvo incidentes con la terna arbitral en la final. La prensa exige una sanción ejemplar.",
        categoria: "institucional",
        opciones: [
            {
                texto: "Sancionarlo con dureza (1 año sin cancha)",
                efecto: function() {
                    ajustarApoyo(5);
                    ajustarPrestigio(6);
                    encolarDecision("reincidencia_club");
                },
                resumen: "+5 apoyo, +6 prestigio · Desbloquea un futuro incidente"
            },
            {
                texto: "Multa simbólica y a otra cosa",
                efecto: function() {
                    ajustarApoyo(-6);
                    ajustarPrestigio(-5);
                    ajustarDinero(250);
                },
                resumen: "-6 apoyo, -5 prestigio, +$250M"
            }
        ]
    },

    // ==================== DEPORTIVAS ====================

    {
        id: "extranjeros",
        titulo: "Cupo de extranjeros",
        descripcion: "El cupo actual es de 5 extranjeros por equipo. Los clubes grandes piden aumentarlo a 7. Los chicos quieren bajarlo a 3.",
        categoria: "deportiva",
        opciones: [
            {
                texto: "Aumentar a 7",
                efecto: function() {
                    ajustarPrestigio(5);
                    ajustarApoyo(-6);
                    encolarDecision("revisar_cupo");
                },
                resumen: "+5 prestigio, -6 apoyo · Desbloquea debate futuro"
            },
            {
                texto: "Reducir a 3",
                efecto: function() {
                    ajustarApoyo(6);
                    ajustarPrestigio(-4);
                },
                resumen: "+6 apoyo, -4 prestigio"
            },
            {
                texto: "Mantener 5",
                efecto: function() {
                    ajustarApoyo(-2);
                },
                resumen: "-2 apoyo (nadie conforme)"
            }
        ]
    },

    {
        id: "descensos",
        titulo: "¿Suspender los descensos?",
        descripcion: "Con la crisis económica, varios clubes piden suspender los descensos por un año. Los equipos chicos que pelean abajo se verían beneficiados.",
        categoria: "deportiva",
        opciones: [
            {
                texto: "Suspender los descensos",
                efecto: function() {
                    ajustarApoyo(10);
                    ajustarPrestigio(-8);
                },
                resumen: "+10 apoyo, -8 prestigio (todo el mundo critica)"
            },
            {
                texto: "Mantener los descensos",
                efecto: function() {
                    ajustarApoyo(-8);
                    ajustarPrestigio(6);
                },
                resumen: "-8 apoyo, +6 prestigio (fair play)"
            }
        ]
    },

    {
        id: "sub20",
        titulo: "Inversión en la Selección Sub-20",
        descripcion: "La Sub-20 no clasificó al último Mundial juvenil. Los técnicos piden más presupuesto para inferiores.",
        categoria: "deportiva",
        opciones: [
            {
                texto: "Invertir fuerte ($800M)",
                efecto: function() {
                    ajustarDinero(-800);
                    ajustarPrestigio(6);
                },
                resumen: "-$800M, +6 prestigio"
            },
            {
                texto: "Inversión moderada ($300M)",
                efecto: function() {
                    ajustarDinero(-300);
                    ajustarPrestigio(2);
                },
                resumen: "-$300M, +2 prestigio"
            },
            {
                texto: "No invertir",
                efecto: function() {
                    ajustarPrestigio(-5);
                    ajustarApoyo(-3);
                },
                resumen: "-5 prestigio, -3 apoyo"
            }
        ]
    },

    {
        id: "femenino",
        titulo: "Profesionalizar el fútbol femenino",
        descripcion: "Las jugadoras piden contratos profesionales. Los clubes alegan que no tienen presupuesto.",
        categoria: "deportiva",
        opciones: [
            {
                texto: "Profesionalizar (AFA paga la mitad)",
                efecto: function() {
                    ajustarDinero(-1000);
                    ajustarPrestigio(8);
                    ajustarApoyo(-5);
                },
                resumen: "-$1.000M, +8 prestigio, -5 apoyo"
            },
            {
                texto: "Semi-profesional (solo viáticos)",
                efecto: function() {
                    ajustarDinero(-300);
                    ajustarPrestigio(3);
                },
                resumen: "-$300M, +3 prestigio"
            },
            {
                texto: "Dejar como está",
                efecto: function() {
                    ajustarPrestigio(-6);
                    ajustarApoyo(2);
                },
                resumen: "-6 prestigio, +2 apoyo (clubes contentos)"
            }
        ]
    },

    {
        id: "visitantes",
        titulo: "Regreso del público visitante",
        descripcion: "Hace años que no hay hinchas visitantes en las canchas. Algunos clubes piden que vuelvan. La policía advierte por incidentes.",
        categoria: "deportiva",
        opciones: [
            {
                texto: "Permitir en todos los partidos",
                efecto: function() {
                    ajustarApoyo(6);
                    ajustarDinero(400);
                    ajustarPrestigio(-5);
                },
                resumen: "+6 apoyo, +$400M, -5 prestigio"
            },
            {
                texto: "Permitir solo en clásicos",
                efecto: function() {
                    ajustarApoyo(2);
                    ajustarDinero(200);
                },
                resumen: "+2 apoyo, +$200M"
            },
            {
                texto: "Mantener la prohibición",
                efecto: function() {
                    ajustarApoyo(-4);
                    ajustarPrestigio(3);
                },
                resumen: "-4 apoyo, +3 prestigio"
            }
        ]
    },

    {
        id: "copa_nacional",
        titulo: "Crear una Copa Nacional",
        descripcion: "Se propone crear un torneo tipo Copa Argentina con todos los clubes del país. Suma fechas pero da prestigio.",
        categoria: "deportiva",
        opciones: [
            {
                texto: "Crear la Copa Nacional",
                efecto: function() {
                    ajustarPrestigio(4);
                    ajustarApoyo(5);
                    ajustarDinero(-400);
                },
                resumen: "+4 prestigio, +5 apoyo, -$400M"
            },
            {
                texto: "No crear",
                efecto: function() {
                    ajustarApoyo(-3);
                },
                resumen: "-3 apoyo"
            }
        ]
    },

    // ==================== ECONÓMICAS ====================

    {
        id: "tv_exterior",
        titulo: "Vender los derechos de TV al exterior",
        descripcion: "Una empresa internacional ofrece comprar los derechos del fútbol argentino para el exterior. Paga bien, pero quiere manejar los horarios.",
        categoria: "economica",
        opciones: [
            {
                texto: "Vender todo (cambio de horarios)",
                efecto: function() {
                    ajustarDinero(2000);
                    ajustarApoyo(-8);
                },
                resumen: "+$2.000M, -8 apoyo (los hinchas se quejan)"
            },
            {
                texto: "Vender solo los partidos de visitante",
                efecto: function() {
                    ajustarDinero(1000);
                    ajustarApoyo(-2);
                },
                resumen: "+$1.000M, -2 apoyo"
            },
            {
                texto: "No vender",
                efecto: function() {
                    ajustarApoyo(3);
                },
                resumen: "+3 apoyo (todo sigue igual)"
            }
        ]
    },

    {
        id: "sueldos_minimos",
        titulo: "Sueldos mínimos de jugadores",
        descripcion: "Los jugadores de la Primera Nacional y Federal A denuncian sueldos miserables. Piden un piso salarial.",
        categoria: "economica",
        opciones: [
            {
                texto: "Fijar piso salarial alto ($200K/mes)",
                efecto: function() {
                    ajustarApoyo(8);
                    ajustarDinero(-900);
                },
                resumen: "+8 apoyo, -$900M"
            },
            {
                texto: "Fijar piso salarial bajo ($80K/mes)",
                efecto: function() {
                    ajustarApoyo(3);
                    ajustarDinero(-300);
                    encolarDecision("huelgaDecisiones");
                },
                resumen: "+3 apoyo, -$300M · Desbloquea conflicto gremial"
            },
            {
                texto: "Dejar libre el mercado",
                efecto: function() {
                    ajustarApoyo(-8);
                    ajustarDinero(200);
                },
                resumen: "-8 apoyo, +$200M"
            }
        ]
    },

    {
        id: "limite_salarial",
        titulo: "Límite salarial",
        descripcion: "Los clubes chicos piden un tope a los sueldos para que los grandes no se lleven a todos los buenos. Los grandes amenazan con resistir.",
        categoria: "economica",
        opciones: [
            {
                texto: "Implementar tope salarial general",
                efecto: function() {
                    ajustarApoyo(7);
                    ajustarPrestigio(-3);
                    ajustarDinero(-200);
                },
                resumen: "+7 apoyo, -3 prestigio, -$200M"
            },
            {
                texto: "Tope solo para Primera",
                efecto: function() {
                    ajustarApoyo(2);
                    ajustarDinero(-100);
                },
                resumen: "+2 apoyo, -$100M"
            },
            {
                texto: "No implementar tope",
                efecto: function() {
                    ajustarApoyo(-5);
                    ajustarDinero(300);
                },
                resumen: "-5 apoyo, +$300M"
            }
        ]
    },

    {
        id: "sponsor_seleccion",
        titulo: "Sponsor de la camiseta de la Selección",
        descripcion: "Hay 3 marcas ofreciendo ser sponsor principal de la camiseta. Una es polémica pero paga más.",
        categoria: "economica",
        opciones: [
            {
                texto: "Aceptar la marca polémica (más plata)",
                efecto: function() {
                    ajustarDinero(1800);
                    ajustarApoyo(-8);
                    ajustarPrestigio(-3);
                },
                resumen: "+$1.800M, -8 apoyo, -3 prestigio"
            },
            {
                texto: "Aceptar la marca tradicional",
                efecto: function() {
                    ajustarDinero(900);
                    ajustarApoyo(4);
                },
                resumen: "+$900M, +4 apoyo"
            },
            {
                texto: "Dejar la camiseta sin sponsor",
                efecto: function() {
                    ajustarApoyo(6);
                    ajustarDinero(-100);
                },
                resumen: "+6 apoyo, -$100M"
            }
        ]
    },

    {
        id: "venta_jugadores",
        titulo: "Cupos para venta de jugadores al exterior",
        descripcion: "Los clubes venden cada vez más jóvenes a Europa. Algunos piden poner cupos para retener talento. Los clubes necesitan la plata.",
        categoria: "economica",
        opciones: [
            {
                texto: "Poner cupos estrictos (máx. 2 por club por año)",
                efecto: function() {
                    ajustarApoyo(-6);
                    ajustarPrestigio(5);
                },
                resumen: "-6 apoyo, +5 prestigio (mejor futuro)"
            },
            {
                texto: "Sin cupos (libre mercado)",
                efecto: function() {
                    ajustarApoyo(6);
                    ajustarDinero(500);
                    ajustarPrestigio(-5);
                },
                resumen: "+6 apoyo, +$500M, -5 prestigio"
            }
        ]
    },

    // ==================== INSTITUCIONALES ====================

    {
        id: "intervencion",
        titulo: "Intervención a clubes en crisis",
        descripcion: "Hay 3 clubes con deudas enormes. La oposición pide que la AFA los intervenga. Los clubes rechazan la intervención.",
        categoria: "institucional",
        opciones: [
            {
                texto: "Intervenir los 3 clubes",
                efecto: function() {
                    ajustarApoyo(-6);
                    ajustarPrestigio(4);
                    ajustarDinero(-800);
                },
                resumen: "-6 apoyo, +4 prestigio, -$800M"
            },
            {
                texto: "Darles un préstamo blando",
                efecto: function() {
                    ajustarApoyo(4);
                    ajustarDinero(-1200);
                },
                resumen: "+4 apoyo, -$1.200M"
            },
            {
                texto: "Dejar que se arreglen",
                efecto: function() {
                    ajustarApoyo(-3);
                },
                resumen: "-3 apoyo (nadie conforme)"
            }
        ]
    },

    {
        id: "conmebol",
        titulo: "Relación con Conmebol",
        descripcion: "La Conmebol quiere que la AFA apoye su nueva propuesta de calendario continental. A cambio ofrece más cupos.",
        categoria: "institucional",
        opciones: [
            {
                texto: "Apoyar a Conmebol",
                efecto: function() {
                    ajustarPrestigio(5);
                    ajustarApoyo(-4);
                    ajustarDinero(500);
                },
                resumen: "+5 prestigio, -4 apoyo, +$500M"
            },
            {
                texto: "Rechazar la propuesta",
                efecto: function() {
                    ajustarApoyo(6);
                    ajustarPrestigio(-4);
                },
                resumen: "+6 apoyo, -4 prestigio"
            },
            {
                texto: "Abstenerse",
                efecto: function() {
                    ajustarApoyo(-1);
                    ajustarPrestigio(-1);
                },
                resumen: "-1 apoyo, -1 prestigio"
            }
        ]
    },

    {
        id: "corrupcion",
        titulo: "Denuncia de corrupción interna",
        descripcion: "Un exdirectivo denuncia un esquema de coimas en el manejo de los derechos de TV de los últimos años. La prensa está encima.",
        categoria: "institucional",
        opciones: [
            {
                texto: "Investigar a fondo y publicar todo",
                efecto: function() {
                    ajustarDinero(-600);
                    ajustarPrestigio(8);
                    ajustarApoyo(-4);
                    encolarDecision("juicio_mediatico");
                },
                resumen: "-$600M, +8 prestigio, -4 apoyo · Desbloquea juicio mediático"
            },
            {
                texto: "Investigar en silencio",
                efecto: function() {
                    ajustarDinero(-200);
                    ajustarPrestigio(-3);
                },
                resumen: "-$200M, -3 prestigio"
            },
            {
                texto: "Desmentir todo públicamente",
                efecto: function() {
                    ajustarApoyo(-8);
                    ajustarPrestigio(-8);
                    ajustarDinero(200);
                },
                resumen: "-8 apoyo, -8 prestigio, +$200M (tiempo comprado)"
            }
        ]
    },

    {
        id: "seguridad",
        titulo: "Estándares de seguridad en los estadios",
        descripcion: "Dos estadios no cumplen con las normas mínimas de seguridad. La AFA debe decidir si los clausura o les da plazo.",
        categoria: "institucional",
        opciones: [
            {
                texto: "Clausurar hasta que se arreglen",
                efecto: function() {
                    ajustarApoyo(-5);
                    ajustarPrestigio(6);
                },
                resumen: "-5 apoyo, +6 prestigio"
            },
            {
                texto: "Dar 6 meses de plazo",
                efecto: function() {
                    ajustarApoyo(-2);
                    ajustarPrestigio(2);
                },
                resumen: "-2 apoyo, +2 prestigio"
            },
            {
                texto: "Permitir con observaciones",
                efecto: function() {
                    ajustarApoyo(3);
                    ajustarPrestigio(-5);
                },
                resumen: "+3 apoyo, -5 prestigio (riesgo futuro)"
            }
        ]
    },

    {
        id: "torneo_verano",
        titulo: "Torneo de verano",
        descripcion: "Se propone un torneo de verano con clubes europeos. Da visibilidad y plata, pero carga el calendario.",
        categoria: "institucional",
        opciones: [
            {
                texto: "Hacer torneo internacional",
                efecto: function() {
                    ajustarDinero(800);
                    ajustarPrestigio(3);
                    ajustarApoyo(-3);
                },
                resumen: "+$800M, +3 prestigio, -3 apoyo"
            },
            {
                texto: "Torneo solo con clubes argentinos",
                efecto: function() {
                    ajustarDinero(300);
                    ajustarApoyo(2);
                },
                resumen: "+$300M, +2 apoyo"
            },
            {
                texto: "No hacer torneo",
                efecto: function() {
                    ajustarApoyo(-1);
                },
                resumen: "-1 apoyo"
            }
        ]
    },

    // ==================== ENCADENADAS ====================

    {
        id: "regular_sad",
        titulo: "Regular las SAD",
        descripcion: "Tras haber aprobado la entrada de capital privado, tres clubes más quieren abrirse a las SAD. La oposición pide reglas claras.",
        categoria: "institucional",
        opciones: [
            {
                texto: "Regular con reglas estrictas",
                efecto: function() {
                    ajustarPrestigio(4);
                    ajustarApoyo(-4);
                    ajustarDinero(300);
                },
                resumen: "+4 prestigio, -4 apoyo, +$300M"
            },
            {
                texto: "Permitir libremente",
                efecto: function() {
                    ajustarDinero(1500);
                    ajustarApoyo(-10);
                    ajustarPrestigio(-3);
                },
                resumen: "+$1.500M, -10 apoyo, -3 prestigio"
            },
            {
                texto: "Frenar la expansión de las SAD",
                efecto: function() {
                    ajustarApoyo(6);
                    ajustarPrestigio(-2);
                },
                resumen: "+6 apoyo, -2 prestigio"
            }
        ]
    },

    {
        id: "clubes_chicos_reclaman",
        titulo: "Los clubes chicos reclaman por TV",
        descripcion: "Tras aceptar la rebaja de la TV, los clubes chicos quedaron al borde de la quiebra. Reclaman un auxilio inmediato.",
        categoria: "economica",
        opciones: [
            {
                texto: "Auxiliarlos con $800M",
                efecto: function() {
                    ajustarDinero(-800);
                    ajustarApoyo(8);
                },
                resumen: "-$800M, +8 apoyo"
            },
            {
                texto: "Auxiliarlos con $300M",
                efecto: function() {
                    ajustarDinero(-300);
                    ajustarApoyo(3);
                },
                resumen: "-$300M, +3 apoyo"
            },
            {
                texto: "Que se arreglen solos",
                efecto: function() {
                    ajustarApoyo(-8);
                    ajustarPrestigio(-3);
                },
                resumen: "-8 apoyo, -3 prestigio"
            }
        ]
    },

    {
        id: "reincidencia_club",
        titulo: "Reincidencia del club violento",
        descripcion: "El club que sancionaste por los incidentes en la Supercopa volvió a tener problemas. Ahora es más grave.",
        categoria: "institucional",
        opciones: [
            {
                texto: "Sancionarlo con descenso administrativo",
                efecto: function() {
                    ajustarApoyo(-5);
                    ajustarPrestigio(8);
                    ajustarDinero(-200);
                },
                resumen: "-5 apoyo, +8 prestigio, -$200M"
            },
            {
                texto: "Quitarle 15 puntos",
                efecto: function() {
                    ajustarApoyo(2);
                    ajustarPrestigio(4);
                },
                resumen: "+2 apoyo, +4 prestigio"
            },
            {
                texto: "Multa y advertencia final",
                efecto: function() {
                    ajustarApoyo(-3);
                    ajustarPrestigio(-4);
                },
                resumen: "-3 apoyo, -4 prestigio"
            }
        ]
    },

    {
        id: "huelgaDecisiones",
        titulo: "Huelga de futbolistas",
        descripcion: "Tras fijar sueldos mínimos muy bajos, los futbolistas del Ascenso decretaron una huelga. No se juega la próxima fecha.",
        categoria: "economica",
        opciones: [
            {
                texto: "Ceder y subir el piso salarial",
                efecto: function() {
                    ajustarDinero(-700);
                    ajustarApoyo(8);
                },
                resumen: "-$700M, +8 apoyo"
            },
            {
                texto: "Negociar un aumento gradual",
                efecto: function() {
                    ajustarDinero(-300);
                    ajustarApoyo(3);
                },
                resumen: "-$300M, +3 apoyo"
            },
            {
                texto: "Aplicar el reglamento: no juegan, pierden puntos",
                efecto: function() {
                    ajustarApoyo(-7);
                    ajustarPrestigio(3);
                },
                resumen: "-7 apoyo, +3 prestigio"
            }
        ]
    },

    {
        id: "revisar_cupo",
        titulo: "Los clubes piden revisar el cupo de extranjeros",
        descripcion: "Tras aumentar el cupo a 7, varios clubes chicos se quejan de que ya no pueden competir. Piden volver atrás.",
        categoria: "deportiva",
        opciones: [
            {
                texto: "Volver al cupo de 5",
                efecto: function() {
                    ajustarApoyo(6);
                    ajustarPrestigio(-2);
                },
                resumen: "+6 apoyo, -2 prestigio"
            },
            {
                texto: "Mantener 7",
                efecto: function() {
                    ajustarApoyo(-3);
                    ajustarPrestigio(3);
                },
                resumen: "-3 apoyo, +3 prestigio"
            },
            {
                texto: "Cupo mixto (5 en cancha, 7 en plantel)",
                efecto: function() {
                    ajustarApoyo(2);
                    ajustarPrestigio(1);
                },
                resumen: "+2 apoyo, +1 prestigio (solución salomónica)"
            }
        ]
    },

    {
        id: "juicio_mediatico",
        titulo: "Juicio mediático por la corrupción",
        descripcion: "Tras haber investigado la corrupción interna, la prensa descubrió que algunos directivos actuales están implicados. La opinión pública explota.",
        categoria: "institucional",
        opciones: [
            {
                texto: "Echar a los implicados",
                efecto: function() {
                    ajustarApoyo(6);
                    ajustarPrestigio(6);
                    ajustarDinero(-400);
                },
                resumen: "+6 apoyo, +6 prestigio, -$400M"
            },
            {
                texto: "Suspenderlos hasta que se aclare",
                efecto: function() {
                    ajustarApoyo(2);
                    ajustarPrestigio(3);
                },
                resumen: "+2 apoyo, +3 prestigio"
            },
            {
                texto: "Defenderlos públicamente",
                efecto: function() {
                    ajustarApoyo(-10);
                    ajustarPrestigio(-8);
                },
                resumen: "-10 apoyo, -8 prestigio"
            }
        ]
    },

    // ==================== DECISIONES NUEVAS (v3) ====================

    {
        id: "federal_ascensos",
        titulo: "El Federal A pide dos ascensos más",
        descripcion: "Los clubes del Federal A reclaman más plazas de ascenso a la Primera Nacional. La B se opone: dicen que se desvaloriza.",
        categoria: "federal",
        opciones: [
            {
                texto: "Darles dos ascensos extra",
                resumen: "+10 apoyo del Interior, -$200M",
                efecto: function() {
                    ajustarApoyo(10);
                    ajustarDinero(-200);
                    agregarNoticia("Azz", "El Federal A consigue dos ascensos más", "El Interior celebra. La Primera Nacional habla de capricho político.", "elogio");
                }
            },
            {
                texto: "Mantener las plazas actuales",
                resumen: "-8 apoyo del Interior, +4 apoyo de la B",
                efecto: function() {
                    ajustarApoyo(-8);
                    ajustarConfianzaArea("federal", -6, "Ascensos del Federal A");
                }
            },
            {
                texto: "Crear un repechaje entre las dos categorías",
                resumen: "+3 apoyo, -$150M, +2 prestigio",
                efecto: function() {
                    ajustarApoyo(3);
                    ajustarPrestigio(2);
                    ajustarDinero(-150);
                    ajustarConfianzaArea("federal", 3, "Repechaje federal");
                }
            }
        ]
    },

    {
        id: "predio_ezeiza",
        titulo: "Vender el predio de Ezeiza",
        descripcion: "Un grupo inmobiliario ofrece una fortuna por una parte del predio de la Selección. El cuerpo técnico estalla.",
        categoria: "economica",
        opciones: [
            {
                texto: "Vender una franja del predio",
                resumen: "+$4.000M, -10 prestigio, -6 apoyo",
                efecto: function() {
                    ajustarDinero(4000);
                    ajustarPrestigio(-10);
                    ajustarApoyo(-6);
                    ajustarConfianzaArea("economico", 10, "Venta del predio");
                }
            },
            {
                texto: "Rechazar la oferta",
                resumen: "+6 prestigio, +4 apoyo",
                efecto: function() {
                    ajustarPrestigio(6);
                    ajustarApoyo(4);
                }
            },
            {
                texto: "Alquilar las instalaciones en la temporada baja",
                resumen: "+$1.200M, -2 apoyo",
                efecto: function() {
                    ajustarDinero(1200);
                    ajustarApoyo(-2);
                }
            }
        ]
    },

    {
        id: "chat_filtrado",
        titulo: "Se filtró un chat tuyo con un dirigente",
        descripcion: "Un portal publicó mensajes donde prometés favores arbitrales. Es falso, pero ya es tendencia.",
        categoria: "mediatica",
        opciones: [
            {
                texto: "Salir a desmentirlo en conferencia",
                resumen: "+3 prestigio, -2 apoyo, -$100M",
                efecto: function() {
                    ajustarPrestigio(3);
                    ajustarApoyo(-2);
                    ajustarDinero(-100);
                    ajustarConfianzaArea("mediatico", 5, "Desmentida");
                }
            },
            {
                texto: "No responder y dejar que se enfríe",
                resumen: "-5 prestigio, -3 apoyo",
                efecto: function() {
                    ajustarPrestigio(-5);
                    ajustarApoyo(-3);
                    ajustarConfianzaArea("mediatico", -6, "Silencio mediático");
                }
            },
            {
                texto: "Denunciar al portal por difamación",
                resumen: "-$300M, +4 prestigio, +2 apoyo",
                efecto: function() {
                    ajustarDinero(-300);
                    ajustarPrestigio(4);
                    ajustarApoyo(2);
                }
            }
        ]
    },

    {
        id: "seleccion_interior",
        titulo: "Llevar a la Selección al Interior",
        descripcion: "La FIFA autoriza un amistoso en el Interior. Los clubes grandes quieren el partido en Buenos Aires.",
        categoria: "seleccion",
        opciones: [
            {
                texto: "Jugar en el Interior",
                resumen: "+12 apoyo, -$400M",
                efecto: function() {
                    ajustarApoyo(12);
                    ajustarDinero(-400);
                    ajustarConfianzaArea("federal", 8, "Amistoso en el Interior");
                    agregarNoticia("Azz", "La Selección jugará en el Interior", "La gente del Interior, de fiesta. Los grandes, molestos por la taquilla.", "elogio");
                }
            },
            {
                texto: "Jugar en el Monumental",
                resumen: "+$800M, -8 apoyo",
                efecto: function() {
                    ajustarDinero(800);
                    ajustarApoyo(-8);
                    ajustarConfianzaArea("federal", -8, "Amistoso en Buenos Aires");
                }
            },
            {
                texto: "Hacer dos amistosos: uno y uno",
                resumen: "+5 apoyo, -$200M",
                efecto: function() {
                    ajustarApoyo(5);
                    ajustarDinero(-200);
                }
            }
        ]
    },

    {
        id: "sede_final",
        titulo: "¿Dónde se juega la final de la Copa Argentina?",
        descripcion: "Tres provincias ofrecen estadios. La decisión deja contentos a unos y enojados a otros.",
        categoria: "federal",
        opciones: [
            {
                texto: "Mendoza",
                resumen: "+6 apoyo, -$250M, +2 prestigio",
                efecto: function() {
                    ajustarApoyo(6);
                    ajustarDinero(-250);
                    ajustarPrestigio(2);
                }
            },
            {
                texto: "Córdoba",
                resumen: "+5 apoyo, -$200M",
                efecto: function() {
                    ajustarApoyo(5);
                    ajustarDinero(-200);
                }
            },
            {
                texto: "Buenos Aires (con más recaudación)",
                resumen: "+$600M, -5 apoyo",
                efecto: function() {
                    ajustarDinero(600);
                    ajustarApoyo(-5);
                }
            }
        ]
    },

    {
        id: "tope_salarial",
        titulo: "Tope salarial para los clubes",
        descripcion: "Los clubes chicos piden un tope de sueldos para competir. Los grandes amenazan con ir a la justicia.",
        categoria: "economica",
        opciones: [
            {
                texto: "Imponer un tope general",
                resumen: "+8 apoyo, +2 prestigio",
                efecto: function() {
                    ajustarApoyo(8);
                    ajustarPrestigio(2);
                    ajustarConfianzaArea("federal", 5, "Tope salarial");
                }
            },
            {
                texto: "Dejar libertad de contratación",
                resumen: "-6 apoyo, +$500M",
                efecto: function() {
                    ajustarApoyo(-6);
                    ajustarDinero(500);
                }
            },
            {
                texto: "Tope solo para los clubes con déficit",
                resumen: "+4 apoyo, -$200M",
                efecto: function() {
                    ajustarApoyo(4);
                    ajustarDinero(-200);
                }
            }
        ]
    },

    {
        id: "cancha_visitante",
        titulo: "¿Vuelve el público visitante?",
        descripcion: "La policía no quiere saber nada. Los hinchas, hace años, sueñan con volver a ver a su equipo de visitante.",
        categoria: "deportiva",
        opciones: [
            {
                texto: "Volver a habilitarlo con cupo reducido",
                resumen: "+7 apoyo, +3 prestigio, -$300M",
                efecto: function() {
                    ajustarApoyo(7);
                    ajustarPrestigio(3);
                    ajustarDinero(-300);
                }
            },
            {
                texto: "Mantener la prohibición",
                resumen: "-3 apoyo",
                efecto: function() {
                    ajustarApoyo(-3);
                }
            },
            {
                texto: "Solo para clásicos y con protocolo estricto",
                resumen: "+2 apoyo, -$150M",
                efecto: function() {
                    ajustarApoyo(2);
                    ajustarDinero(-150);
                }
            }
        ]
    },

    {
        id: "derechos_formativas",
        titulo: "Derechos de formación de juveniles",
        descripcion: "Los clubes formadores reclaman una compensación cuando un juvenil se va libre al exterior.",
        categoria: "institucional",
        opciones: [
            {
                texto: "Crear un fondo de compensación",
                resumen: "+9 apoyo, -$700M, +3 prestigio",
                efecto: function() {
                    ajustarApoyo(9);
                    ajustarDinero(-700);
                    ajustarPrestigio(3);
                    ajustarConfianzaArea("institucional", 5, "Fondo de formación");
                }
            },
            {
                texto: "Dejar que el mercado lo resuelva",
                resumen: "-7 apoyo",
                efecto: function() {
                    ajustarApoyo(-7);
                }
            },
            {
                texto: "Cobrar un canon a los representantes",
                resumen: "+4 apoyo, +$300M, -2 prestigio",
                efecto: function() {
                    ajustarApoyo(4);
                    ajustarDinero(300);
                    ajustarPrestigio(-2);
                }
            }
        ]
    },

    // ==================== DECISIONES v4 ====================

    {
        id: "clasico_exterior",
        titulo: "El clásico en el exterior",
        descripcion: "Un promotor ofrece una fortuna por llevar el Superclásico a Miami. Los hinchas amenazan con no ir nunca más a la cancha.",
        categoria: "economica",
        opciones: [
            {
                texto: "Jugarlo en Miami",
                resumen: "+$2.500M, -8 apoyo, -3 prestigio",
                efecto: function() {
                    ajustarDinero(2500);
                    ajustarApoyo(-8);
                    ajustarPrestigio(-3);
                    agregarNoticia("Olé", "El Superclásico se juega en Miami", "La AFA cobra una fortuna. Los hinchas hablan de traición.", "critica");
                }
            },
            {
                texto: "Rechazar la oferta",
                resumen: "+6 apoyo, +2 prestigio",
                efecto: function() {
                    ajustarApoyo(6);
                    ajustarPrestigio(2);
                }
            },
            {
                texto: "Jugarlo en el Interior con precios populares",
                resumen: "+7 apoyo, +$400M",
                efecto: function() {
                    ajustarApoyo(7);
                    ajustarDinero(400);
                }
            }
        ]
    },

    {
        id: "apuestas_liga",
        titulo: "Escándalo de apuestas en la B",
        descripcion: "Una casa de apuestas patrocina a cinco clubes de la Primera Nacional. La FIFA pide explicaciones y la comisión de ética investiga.",
        categoria: "institucional",
        opciones: [
            {
                texto: "Prohibir el sponsoreo de apuestas",
                resumen: "+7 prestigio, -$600M de ingresos",
                efecto: function() {
                    ajustarPrestigio(7);
                    ajustarDinero(-600);
                    ajustarConfianzaArea("institucional", 5, "Prohibición de apuestas");
                }
            },
            {
                texto: "Regularlo con un fondo de integridad",
                resumen: "+3 prestigio, -$200M",
                efecto: function() {
                    ajustarPrestigio(3);
                    ajustarDinero(-200);
                }
            },
            {
                texto: "Dejar que cada club decida",
                resumen: "-5 prestigio, +$400M",
                efecto: function() {
                    ajustarPrestigio(-5);
                    ajustarDinero(400);
                }
            }
        ]
    },

    {
        id: "juveniles_seleccion",
        titulo: "¿La Selección con juveniles?",
        descripcion: "El DT quiere llevar a tres pibes de 18 años a la Copa América. Los clubes temen perderlos y los periodistas hablan de experimento.",
        categoria: "seleccion",
        opciones: [
            {
                texto: "Apoyar la apuesta juvenil",
                resumen: "+5 prestigio, +3 apoyo, sin costo",
                efecto: function() {
                    ajustarPrestigio(5);
                    ajustarApoyo(3);
                    estadoSeleccion.plantel.forEach(function(j) {
                        if (j.edad <= 21) j.nivel = Math.min(96, j.nivel + 2);
                    });
                    agregarNoticia("TyC Sports", "La Selección apuesta a los pibes", "Tres juveniles convocados para la Copa América. El futuro, dicen, ya llegó.", "elogio");
                }
            },
            {
                texto: "Ir con los nombres de siempre",
                resumen: "+2 apoyo, -2 prestigio",
                efecto: function() {
                    ajustarApoyo(2);
                    ajustarPrestigio(-2);
                }
            },
            {
                texto: "Convocar a los juveniles pero cederlos al Mundial Sub-20",
                resumen: "+3 prestigio, -$150M",
                efecto: function() {
                    ajustarPrestigio(3);
                    ajustarDinero(-150);
                }
            }
        ]
    },

    {
        id: "representantes",
        titulo: "Los representantes quieren comisiones",
        descripcion: "Los agentes presionan para quedarse con un porcentaje de cada venta al exterior. La AFA cobra la solidaridad y ellos quieren su parte.",
        categoria: "economica",
        opciones: [
            {
                texto: "Regular las comisiones al 10%",
                resumen: "+4 prestigio, -3 apoyo, -$100M",
                efecto: function() {
                    ajustarPrestigio(4);
                    ajustarApoyo(-3);
                    ajustarDinero(-100);
                    encolarDecision("mercado_negro");
                }
            },
            {
                texto: "Dejar el mercado libre",
                resumen: "-4 prestigio, +$500M",
                efecto: function() {
                    ajustarPrestigio(-4);
                    ajustarDinero(500);
                    encolarDecision("mercado_negro");
                }
            },
            {
                texto: "Crear un registro oficial de agentes",
                resumen: "+2 prestigio, +2 apoyo, -$250M",
                efecto: function() {
                    ajustarPrestigio(2);
                    ajustarApoyo(2);
                    ajustarDinero(-250);
                }
            }
        ]
    },

    {
        id: "mercado_negro",
        titulo: "Se destapó el mercado negro de pases",
        descripcion: "Una investigación reveló transferencias truchas entre clubes del Interior y empresarios. Hay dirigentes implicados y la plata no aparece.",
        categoria: "institucional",
        opciones: [
            {
                texto: "Intervenir los clubes implicados",
                resumen: "+8 prestigio, -6 apoyo, -$400M",
                efecto: function() {
                    ajustarPrestigio(8);
                    ajustarApoyo(-6);
                    ajustarDinero(-400);
                }
            },
            {
                texto: "Aplicar multas y seguir",
                resumen: "+2 prestigio, +$700M",
                efecto: function() {
                    ajustarPrestigio(2);
                    ajustarDinero(700);
                }
            },
            {
                texto: "Pasar todo a la Justicia",
                resumen: "+4 prestigio, -2 apoyo",
                efecto: function() {
                    ajustarPrestigio(4);
                    ajustarApoyo(-2);
                }
            }
        ]
    },

    {
        id: "final_federal",
        titulo: "El Interior pide la final del Federal A",
        descripcion: "Los clubes del Federal A quieren que la final se juegue en su cancha, no en Buenos Aires. La TV prefiere el Monumental.",
        categoria: "federal",
        opciones: [
            {
                texto: "Final en el Interior, a cancha llena",
                resumen: "+10 apoyo, -$200M, +2 prestigio",
                efecto: function() {
                    ajustarApoyo(10);
                    ajustarDinero(-200);
                    ajustarPrestigio(2);
                }
            },
            {
                texto: "Final en Buenos Aires",
                resumen: "+$800M, -8 apoyo",
                efecto: function() {
                    ajustarDinero(800);
                    ajustarApoyo(-8);
                }
            },
            {
                texto: "Ida y vuelta, una en cada cancha",
                resumen: "+5 apoyo, +$300M",
                efecto: function() {
                    ajustarApoyo(5);
                    ajustarDinero(300);
                }
            }
        ]
    },

    // ==================== DECISIONES CON EXPEDIENTE ====================

    {
        id: "estadio_nuevo",
        titulo: "La promesa del estadio",
        descripcion: "Prometiste un estadio nuevo para la final. La constructora pide una seña y la obra va a llevar varias fechas. La prensa ya tiene la pala lista para la foto.",
        categoria: "federal",
        opciones: [
            {
                texto: "Firmar la obra y poner la seña",
                resumen: "-$1.200M ahora, +4 apoyo, +2 prestigio en 4 fechas",
                efecto: function() {
                    ajustarDinero(-1200);
                    abrirExpedienteCatalogo("estadio");
                }
            },
            {
                texto: "Prometer para el año que viene",
                resumen: "+2 apoyo, -1 prestigio",
                efecto: function() {
                    ajustarApoyo(2);
                    ajustarPrestigio(-1);
                }
            },
            {
                texto: "Cancelar el proyecto",
                resumen: "-6 apoyo, +$0M",
                efecto: function() {
                    ajustarApoyo(-6);
                }
            }
        ]
    },

    {
        id: "inferiores_fondo",
        titulo: "Fondo para las inferiores",
        descripcion: "Los clubes formadores piden un fondo permanente. Es plata que no vuelve rápido, pero en seis fechas puede dar frutos deportivos.",
        categoria: "deportiva",
        opciones: [
            {
                texto: "Crear el fondo y bancar el proceso",
                resumen: "-$900M ahora, +3 prestigio y +2 apoyo en 6 fechas",
                efecto: function() {
                    ajustarDinero(-900);
                    abrirExpedienteCatalogo("inferiores");
                }
            },
            {
                texto: "Aportar solo a los clubes con deuda",
                resumen: "-$300M, +2 apoyo",
                efecto: function() {
                    ajustarDinero(-300);
                    ajustarApoyo(2);
                }
            },
            {
                texto: "No hay plata para eso",
                resumen: "-4 apoyo",
                efecto: function() {
                    ajustarApoyo(-4);
                }
            }
        ]
    },

    {
        id: "auditoria_externa",
        titulo: "¿Auditoría externa?",
        descripcion: "La oposición pide una auditoría internacional sobre las cuentas de la AFA. Si sale limpia, te blindás. Si aparece algo, es un terremoto.",
        categoria: "institucional",
        opciones: [
            {
                texto: "Aceptar la auditoría",
                resumen: "-$500M, resultado en 5 fechas",
                efecto: function() {
                    ajustarDinero(-500);
                    abrirExpedienteCatalogo("auditoria");
                }
            },
            {
                texto: "Ofrecer una auditoría interna",
                resumen: "+2 prestigio, -2 apoyo",
                efecto: function() {
                    ajustarPrestigio(2);
                    ajustarApoyo(-2);
                }
            },
            {
                texto: "Rechazarla de plano",
                resumen: "-5 prestigio, +2 apoyo",
                efecto: function() {
                    ajustarPrestigio(-5);
                    ajustarApoyo(2);
                }
            }
        ]
    },

    {
        id: "tv_federal",
        titulo: "Reparto de la TV",
        descripcion: "Prometiste en campaña repartir la TV con los clubes chicos. El contrato se firma ahora y la plata tiene que aparecer.",
        categoria: "federal",
        opciones: [
            {
                texto: "Cumplir la promesa",
                resumen: "-$900M ahora, +6 apoyo en 4 fechas",
                efecto: function() {
                    abrirExpedienteCatalogo("promesaTV");
                }
            },
            {
                texto: "Repartir la mitad",
                resumen: "-$400M, +3 apoyo",
                efecto: function() {
                    ajustarDinero(-400);
                    ajustarApoyo(3);
                }
            },
            {
                texto: "Patear para el año que viene",
                resumen: "-6 apoyo, +2 prestigio",
                efecto: function() {
                    ajustarApoyo(-6);
                    ajustarPrestigio(2);
                }
            }
        ]
    },

    // ==================== DECISIONES DE STREAMING ====================

    {
        id: "picado_invita",
        titulo: "Te invitan a Picado TV",
        descripcion: "El streamer más picante quiere tenerte en vivo, sin filtro y con preguntas que nadie hace. Si te va bien, explotás; si te va mal, te comen.",
        categoria: "mediatica",
        opciones: [
            {
                texto: "Ir y bancarte todo",
                resumen: "+3 apoyo, -1 prestigio",
                efecto: function() {
                    ajustarApoyo(3, "Entrevista en Picado TV");
                    ajustarPrestigio(-1, "Entrevista en Picado TV");
                    if (typeof ajustarOpinionStreamer === "function") ajustarOpinionStreamer("picado", 8);
                }
            },
            {
                texto: "Mandar al DT a que hable",
                resumen: "+1 prestigio, -2 apoyo",
                efecto: function() {
                    ajustarPrestigio(1);
                    ajustarApoyo(-2);
                    if (typeof ajustarOpinionStreamer === "function") ajustarOpinionStreamer("picado", -4);
                }
            },
            {
                texto: "No ir",
                resumen: "-2 apoyo, +2 prestigio",
                efecto: function() {
                    ajustarApoyo(-2);
                    ajustarPrestigio(2);
                    if (typeof ajustarOpinionStreamer === "function") ajustarOpinionStreamer("picado", -10);
                }
            }
        ]
    },

    {
        id: "cobra_destrozo",
        titulo: "La Cobra te destrozó en vivo",
        descripcion: "Mil clips, mil reproducciones. La Cobra dijo que tu gestión es \"una murga\" y que los clubes te van a echar. La noche entera fue tendencia.",
        categoria: "mediatica",
        opciones: [
            {
                texto: "Responderle en vivo, cara a cara",
                resumen: "+2 apoyo, -2 prestigio",
                efecto: function() {
                    ajustarApoyo(2, "Respuesta a La Cobra");
                    ajustarPrestigio(-2, "Respuesta a La Cobra");
                    if (typeof ajustarOpinionStreamer === "function") ajustarOpinionStreamer("cobra", 6);
                }
            },
            {
                texto: "Ignorarla",
                resumen: "-1 apoyo",
                efecto: function() {
                    ajustarApoyo(-1);
                    if (typeof ajustarOpinionStreamer === "function") ajustarOpinionStreamer("cobra", -3);
                }
            },
            {
                texto: "Prohibirle la cancha",
                resumen: "-6 prestigio, +4 apoyo",
                efecto: function() {
                    ajustarPrestigio(-6, "Prohibición a La Cobra");
                    ajustarApoyo(4, "Prohibición a La Cobra");
                    if (typeof ajustarOpinionStreamer === "function") ajustarOpinionStreamer("cobra", -20);
                    agregarNoticia("Azz", "La AFA le prohibió la cancha a La Cobra", "Libertad de prensa en debate. Los clubes, contentos con la medida.", "escandalo");
                }
            }
        ]
    },

    {
        id: "azz_exclusividad",
        titulo: "Azz pide exclusividad",
        descripcion: "El streamer irónico ofrece transmitir todo el torneo, pero quiere exclusividad total. La TV tradicional estalla.",
        categoria: "mediatica",
        opciones: [
            {
                texto: "Darle la exclusividad",
                resumen: "+$600M, -3 prestigio",
                efecto: function() {
                    ajustarDinero(600, "Exclusividad streaming");
                    ajustarPrestigio(-3, "Exclusividad streaming");
                    if (typeof ajustarOpinionStreamer === "function") ajustarOpinionStreamer("azz", 12);
                }
            },
            {
                texto: "Compartir con la TV tradicional",
                resumen: "+$300M, +1 prestigio",
                efecto: function() {
                    ajustarDinero(300);
                    ajustarPrestigio(1);
                    if (typeof ajustarOpinionStreamer === "function") ajustarOpinionStreamer("azz", 3);
                }
            },
            {
                texto: "Negociar solo algunos partidos",
                resumen: "+$200M, +2 apoyo",
                efecto: function() {
                    ajustarDinero(200);
                    ajustarApoyo(2);
                    if (typeof ajustarOpinionStreamer === "function") ajustarOpinionStreamer("azz", -5);
                }
            }
        ]
    },

    {
        id: "davox_datos",
        titulo: "Davoxneize quiere los datos",
        descripcion: "El streamer analítico pide acceso a las planillas de la AFA para hacer un especial sobre las cuentas. Transparencia total o portazo.",
        categoria: "mediatica",
        opciones: [
            {
                texto: "Abrirle todas las planillas",
                resumen: "+3 prestigio, -2 apoyo",
                efecto: function() {
                    ajustarPrestigio(3, "Transparencia con Davoxneize");
                    ajustarApoyo(-2, "Transparencia con Davoxneize");
                    if (typeof ajustarOpinionStreamer === "function") ajustarOpinionStreamer("davox", 12);
                }
            },
            {
                texto: "Darle un resumen",
                resumen: "+1 prestigio",
                efecto: function() {
                    ajustarPrestigio(1);
                    if (typeof ajustarOpinionStreamer === "function") ajustarOpinionStreamer("davox", 2);
                }
            },
            {
                texto: "Negarle el acceso",
                resumen: "-3 prestigio, +1 apoyo",
                efecto: function() {
                    ajustarPrestigio(-3);
                    ajustarApoyo(1);
                    if (typeof ajustarOpinionStreamer === "function") ajustarOpinionStreamer("davox", -12);
                }
            }
        ]
    }
];

// -----------------------------
// SISTEMA DE DECISIONES
// -----------------------------

function encolarDecision(idDecision) {
    colaDecisiones.push(idDecision);
}

function obtenerDecisionDisponible(idsUsados) {
    // 1) Primero, cola de encadenadas
    while (colaDecisiones.length > 0) {
        const id = colaDecisiones.shift();
        if (!idsUsados.includes(id)) {
            const dec = DECISIONES.find(function(d) { return d.id === id; });
            if (dec) return dec;
        }
    }

    // 2) Mezcla: la mitad de las veces una decisión procedural con sujeto nuevo
    if (typeof decisionProcedural === "function" && probabilidad(0.55)) {
        const generada = decisionProcedural(idsUsados);
        if (generada) return generada;
    }

    // 3) Decisiones escritas a mano
    const disponibles = DECISIONES.filter(function(d) {
        return !idsUsados.includes(d.id);
    });
    if (disponibles.length > 0) return elegir(disponibles);

    // 4) Si se agotaron las escritas, seguimos con el generador
    if (typeof decisionProcedural === "function") return decisionProcedural(idsUsados);
    return null;
}