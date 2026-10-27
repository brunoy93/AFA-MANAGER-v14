// ============================================
// EVENTOS: eventos aleatorios del fútbol argentino
// ============================================
// Algunos son contextuales (dependen del estado del juego).
// Algunos son automáticos (positivos, sin opciones).
// Algunos tienen encadenamiento (desbloquean otros eventos).

const eventosHistoricos = [];
const colaEventos = [];
const marcasEventos = {};

// -----------------------------
// GENERAR UN EVENTO
// -----------------------------

function generarEvento() {
    // 1) Primero, ver si hay eventos encolados
    while (colaEventos.length > 0) {
        const id = colaEventos.shift();
        const ev = EVENTOS[id];
        if (ev) return ev;
    }

    const candidatosContextuales = [];

    // EVENTOS CONTEXTUALES
    if (typeof estadoFinanzas !== "undefined") {
        const clubesConDeuda = obtenerClubesConDeuda();
        if (clubesConDeuda.length > 0) {
            candidatosContextuales.push(EVENTOS.clubFundido);
            candidatosContextuales.push(EVENTOS.clubPidePrestamo);
        }
    }

    if (incidenciasHistoricas.length > 0) {
        candidatosContextuales.push(EVENTOS.arbitroRenuncia);
    }

    if (presidente.varActivo === false && presidente.anioMandato >= 2) {
        candidatosContextuales.push(EVENTOS.presionVAR);
    }

    if (presidente.apoyoClubes < 40) {
        candidatosContextuales.push(EVENTOS.dirigenteSePostula);
        candidatosContextuales.push(EVENTOS.asambleaExtraordinaria);
    }

    if (presidente.prestigioInternacional >= 70) {
        candidatosContextuales.push(EVENTOS.giraExitosa);
        candidatosContextuales.push(EVENTOS.documental);
    }

    if (presidente.dineroEnCaja < 3000) {
        candidatosContextuales.push(EVENTOS.sponsorSeVa);
        candidatosContextuales.push(EVENTOS.sponsorApuestas);
    }

    const totalRescates = Object.values(estadoFinanzas.rescates || {}).reduce(function(a, b) { return a + b; }, 0);
    if (totalRescates >= 3) {
        candidatosContextuales.push(EVENTOS.oposicionAuditoria);
    }

    // 2) Elegir entre contextuales y generales
    if (candidatosContextuales.length > 0 && Math.random() < 0.55) {
        return candidatosContextuales[Math.floor(Math.random() * candidatosContextuales.length)];
    }

    // 3) Pool general (incluye automáticos)
    const generales = [
        EVENTOS.apuestas,
        EVENTOS.huelgaJugadores,
        EVENTOS.empresaCompra,
        EVENTOS.jovenNacionaliza,
        EVENTOS.amenazaBomba,
        EVENTOS.sponsorSeVa,
        EVENTOS.dirigenteDenuncia,
        EVENTOS.huelgaArbitros,
        EVENTOS.apagon,
        EVENTOS.cambioSede,
        EVENTOS.estadioInspeccion,
        EVENTOS.jugador40,
        EVENTOS.juvenilRecord,
        EVENTOS.dtEuropeo,
        EVENTOS.doping,
        EVENTOS.presidenteRenuncia,
        EVENTOS.afipAllana,
        EVENTOS.libroExarbitro,
        EVENTOS.clubOtraFederacion,
        EVENTOS.ventaNombreEstadio,
        EVENTOS.marcaApuestas,
        // ✅ AHORA SÍ: eventos automáticos
        EVENTOS.giraExitosa,
        EVENTOS.documental,
        EVENTOS.donacionExjugador,
        EVENTOS.recordVenta,
        EVENTOS.premioFIFA,
        ...EVENTOS_V3
    ];

    return generales[Math.floor(Math.random() * generales.length)];
}

// -----------------------------
// DEFINICIÓN DE EVENTOS
// -----------------------------

const EVENTOS = {

    // ===== DEPORTIVOS =====

    clubFundido: {
        id: "clubFundido",
        titulo: "Un club del Federal A está fundido",
        descripcion: "Un club del Federal A no puede pagar sus deudas. Está al borde de la desaparición.",
        opciones: [
            {
                texto: "Rescatarlo con plata de la AFA",
                resumen: "-$500M · +5 apoyo de los clubes chicos",
                efecto: function() {
                    ajustarDinero(-500);
                    ajustarApoyo(5);
                    noticiaEvento("Azz", "La AFA rescata a un club del Federal A al borde de la quiebra", "Decisión aplaudida por los clubes chicos, criticada por los grandes.", "rumor");
                }
            },
            {
                texto: "Dejarlo desaparecer",
                resumen: "-8 apoyo de los clubes chicos",
                efecto: function() {
                    ajustarApoyo(-8);
                    noticiaEvento("Olé", "Un club del Federal A desaparece del mapa", "La AFA no intervino. Los clubes chicos, indignados.", "critica");
                }
            }
        ]
    },

    arbitroRenuncia: {
        id: "arbitroRenuncia",
        titulo: "Un árbitro renuncia por escándalo",
        descripcion: "Uno de los árbitros más cuestionados renunció tras las últimas polémicas.",
        opciones: [
            {
                texto: "Aceptar la renuncia",
                resumen: "+3 apoyo, -2 prestigio arbitral",
                efecto: function() {
                    ajustarApoyo(3);
                    ajustarPrestigio(-2);
                    noticiaEvento("TyC Sports", "Renunció un árbitro tras las polémicas", "La AFA aceptó su salida. Los clubes celebran.", "rumor");
                }
            },
            {
                texto: "Convencerlo de quedarse",
                resumen: "-3 apoyo, +3 prestigio arbitral",
                efecto: function() {
                    ajustarApoyo(-3);
                    ajustarPrestigio(3);
                    noticiaEvento("Azz", "La AFA defiende a un árbitro cuestionado", "Los clubes estallan. La terna arbitral respira.", "critica");
                }
            }
        ]
    },

    presionVAR: {
        id: "presionVAR",
        titulo: "Presión para implementar el VAR",
        descripcion: "Los clubes grandes presionan para que se implemente el VAR.",
        opciones: [
            {
                texto: "Implementar el VAR ahora",
                resumen: "-$2.000M, reduce errores arbitrales",
                efecto: function() {
                    if (presidente.dineroEnCaja < 2000) {
                        ajustarApoyo(-5);
                        noticiaEvento("Olé", "La AFA no puede pagar el VAR", "La promesa quedó en la nada.", "critica");
                        return;
                    }
                    ajustarDinero(-2000);
                    presidente.varActivo = true;
                    ajustarApoyo(5);
                    noticiaEvento("TyC Sports", "La AFA implementa el VAR", "Los clubes grandes celebran.", "elogio");
                }
            },
            {
                texto: "Mantener la decisión de no implementarlo",
                resumen: "+3 apoyo de los clubes chicos",
                efecto: function() {
                    ajustarApoyo(3);
                    noticiaEvento("Azz", "La AFA mantiene su postura: no al VAR", "Los clubes chicos respiran.", "rumor");
                }
            }
        ]
    },

    huelgaArbitros: {
        id: "huelgaArbitros",
        titulo: "Huelga de árbitros",
        descripcion: "Los árbitros piden un aumento del 40%. Si no hay acuerdo, no dirigen la próxima fecha.",
        opciones: [
            {
                texto: "Ceder al aumento",
                resumen: "-$600M, se juega la fecha",
                efecto: function() {
                    ajustarDinero(-600);
                    ajustarApoyo(3);
                    noticiaEvento("TyC Sports", "La AFA cede: aumento para los árbitros", "La fecha se juega sin problemas.", "rumor");
                }
            },
            {
                texto: "Mantener la postura: no hay plata",
                resumen: "-5 apoyo, se suspende una fecha",
                efecto: function() {
                    ajustarApoyo(-5);
                    ajustarPrestigio(-3);
                    ajustarDinero(-300);
                    noticiaEvento("Azz", "Se suspendió la fecha por huelga de árbitros", "La AFA no cedió. Los clubes furiosos.", "escandalo");
                }
            }
        ]
    },

    apagon: {
        id: "apagon",
        titulo: "Apagón en un estadio",
        descripcion: "En pleno partido, se cortó la luz en el estadio. El partido está 1-1 a los 70 minutos.",
        opciones: [
            {
                texto: "Suspender el partido",
                resumen: "Sin costo, se reprograma",
                efecto: function() {
                    noticiaEvento("Olé", "Partido suspendido por apagón", "Se reprograma para la próxima semana.", "rumor");
                }
            },
            {
                texto: "Seguir jugando con generadores",
                resumen: "+$200M, -3 prestigio, riesgo de lesión",
                efecto: function() {
                    ajustarDinero(200);
                    ajustarPrestigio(-3);
                    marcasEventos["estadioApagon"] = true;
                    noticiaEvento("Azz", "Polémica: jugaron con generadores tras apagón", "Los jugadores protestaron. La AFA no suspendió.", "escandalo");
                }
            }
        ]
    },

    cambioSede: {
        id: "cambioSede",
        titulo: "Un club quiere cambiar de sede",
        descripcion: "Un club histórico quiere mudarse a otra ciudad porque en su sede actual no tiene hinchas.",
        opciones: [
            {
                texto: "Permitir el cambio",
                resumen: "+3 apoyo de los clubes grandes, -5 de los chicos",
                efecto: function() {
                    ajustarApoyo(-2);
                    noticiaEvento("Olé", "Un club histórico cambia de ciudad", "Los hinchas, indignados. Los dirigentes, aliviados.", "escandalo");
                }
            },
            {
                texto: "Frenar el cambio",
                resumen: "+5 apoyo de los chicos, -2 de los grandes",
                efecto: function() {
                    ajustarApoyo(3);
                    noticiaEvento("TyC Sports", "La AFA frena el cambio de sede", "El club se queda. Los hinchas respiran.", "rumor");
                }
            }
        ]
    },

    estadioInspeccion: {
        id: "estadioInspeccion",
        titulo: "Un estadio no pasa la inspección",
        descripcion: "El estadio de un club importante no cumple con las normas de seguridad. La AFA debe decidir.",
        opciones: [
            {
                texto: "Clausurarlo hasta que se arregle",
                resumen: "-3 apoyo, +5 prestigio",
                efecto: function() {
                    ajustarApoyo(-3);
                    ajustarPrestigio(5);
                    noticiaEvento("Olé", "Estadio clausurado por fallas de seguridad", "Se juega a puertas cerradas hasta que se arregle.", "rumor");
                }
            },
            {
                texto: "Dar 6 meses de plazo",
                resumen: "+1 apoyo, -1 prestigio",
                efecto: function() {
                    ajustarApoyo(1);
                    ajustarPrestigio(-1);
                    noticiaEvento("Azz", "Plazo para el estadio en mal estado", "La AFA da tiempo pero vigila.", "rumor");
                }
            }
        ]
    },

    jugador40: {
        id: "jugador40",
        titulo: "Un jugador de 40 años quiere volver",
        descripcion: "Un histórico del fútbol argentino quiere volver a jugar a los 40 años. Un club chico le ofrece contrato.",
        opciones: [
            {
                texto: "Aplaudir la vuelta",
                resumen: "+3 prestigio, +2 apoyo",
                efecto: function() {
                    ajustarPrestigio(3);
                    ajustarApoyo(2);
                    noticiaEvento("Olé", "Vuelve un histórico a los 40", "La noticia emociona a los hinchas.", "elogio");
                }
            },
            {
                texto: "Ser neutral",
                resumen: "Sin efecto",
                efecto: function() {
                    noticiaEvento("TyC Sports", "Un histórico vuelve al fútbol", "La AFA no se pronuncia.", "rumor");
                }
            }
        ]
    },

    juvenilRecord: {
        id: "juvenilRecord",
        titulo: "Un juvenil rompe un récord",
        descripcion: "Un pibe de 17 años rompió el récord de goles en la Sub-17. Europa ya lo busca.",
        opciones: [
            {
                texto: "Homenajearlo públicamente",
                resumen: "+4 prestigio, +2 apoyo",
                efecto: function() {
                    ajustarPrestigio(4);
                    ajustarApoyo(2);
                    noticiaEvento("Olé", "La joya del fútbol argentino: 17 años y rompe récords", "La AFA lo homenajea.", "elogio");
                }
            },
            {
                texto: "Dejar que su club lo maneje",
                resumen: "Sin efecto inmediato",
                efecto: function() {
                    noticiaEvento("TyC Sports", "El pibe que ilusiona", "Su club negocia con Europa.", "rumor");
                }
            }
        ]
    },

    dtEuropeo: {
        id: "dtEuropeo",
        titulo: "Un DT europeo quiere llevarse a un jugador",
        descripcion: "Un grande de Europa ofrece $20M por un jugador joven de la Selección.",
        opciones: [
            {
                texto: "Dejar que se vaya",
                resumen: "+$500M (comisión), -3 prestigio",
                efecto: function() {
                    ajustarDinero(500);
                    ajustarPrestigio(-3);
                    noticiaEvento("TyC Sports", "Un jugador argentino se va a Europa", "Buena plata, pero pérdida de talento.", "rumor");
                }
            },
            {
                texto: "Bloquear la salida",
                resumen: "+3 prestigio, -5 apoyo del club",
                efecto: function() {
                    ajustarPrestigio(3);
                    ajustarApoyo(-5);
                    noticiaEvento("Azz", "La AFA bloquea la salida de un jugador", "El club está furioso por perder la plata.", "critica");
                }
            }
        ]
    },

    doping: {
        id: "doping",
        titulo: "Denuncia de dopaje",
        descripcion: "Un club denuncia que un jugador rival dio positivo en un control oculto.",
        opciones: [
            {
                texto: "Investigar seriamente",
                resumen: "-$300M, +5 prestigio",
                efecto: function() {
                    ajustarDinero(-300);
                    ajustarPrestigio(5);
                    noticiaEvento("Olé", "La AFA investiga el caso de dopaje", "Se activó el protocolo completo.", "elogio");
                }
            },
            {
                texto: "Archivar el caso",
                resumen: "-3 prestigio, +2 apoyo del club",
                efecto: function() {
                    ajustarPrestigio(-3);
                    ajustarApoyo(2);
                    noticiaEvento("Azz", "Polémica: la AFA archivó el caso de dopaje", "La prensa exige explicaciones.", "escandalo");
                }
            }
        ]
    },

    // ===== INSTITUCIONALES =====

    apuestas: {
        id: "apuestas",
        titulo: "Escándalo de apuestas",
        descripcion: "Se detectaron apuestas sospechosas en un partido de la Primera Nacional.",
        opciones: [
            {
                texto: "Investigar a fondo",
                resumen: "-$300M, +5 prestigio, +3 apoyo",
                efecto: function() {
                    ajustarDinero(-300);
                    ajustarPrestigio(5);
                    ajustarApoyo(3);
                    noticiaEvento("Olé", "La AFA investiga el escándalo de apuestas", "Se abre una causa.", "elogio");
                }
            },
            {
                texto: "Tapar el caso",
                resumen: "+$300M (coimas), -8 apoyo, -5 prestigio",
                efecto: function() {
                    ajustarDinero(300);
                    ajustarApoyo(-8);
                    ajustarPrestigio(-5);
                    marcasEventos["casoApuestasTapado"] = true;
                    noticiaEvento("Azz", "¿La AFA tapó un escándalo de apuestas?", "Rumores de encubrimiento.", "escandalo");
                }
            }
        ]
    },

    huelgaJugadores: {
        id: "huelgaJugadores",
        titulo: "Huelga de jugadores",
        descripcion: "Los jugadores de un club grande no cobran hace 3 meses y amenazan con no jugar.",
        opciones: [
            {
                texto: "Mediar y pagar parte de la deuda",
                resumen: "-$400M, +5 apoyo",
                efecto: function() {
                    ajustarDinero(-400);
                    ajustarApoyo(5);
                    noticiaEvento("Olé", "La AFA destraba el conflicto", "La fecha se juega.", "elogio");
                }
            },
            {
                texto: "Aplicar el reglamento",
                resumen: "-5 apoyo, +3 prestigio",
                efecto: function() {
                    ajustarApoyo(-5);
                    ajustarPrestigio(3);
                    noticiaEvento("TyC Sports", "La AFA no cede", "Los jugadores furiosos.", "critica");
                }
            }
        ]
    },

    empresaCompra: {
        id: "empresaCompra",
        titulo: "Una empresa quiere comprar un club",
        descripcion: "Un grupo inversor quiere comprar un club chico del Federal A.",
        opciones: [
            {
                texto: "Permitir la venta",
                resumen: "+$800M, -10 apoyo de los chicos",
                efecto: function() {
                    ajustarDinero(800);
                    ajustarApoyo(-10);
                    noticiaEvento("Azz", "Un club chico es vendido a un grupo inversor", "Cambiará de nombre.", "escandalo");
                }
            },
            {
                texto: "Frenar la venta",
                resumen: "+8 apoyo de los chicos",
                efecto: function() {
                    ajustarApoyo(8);
                    noticiaEvento("Olé", "La AFA frena la venta", "El club mantiene su identidad.", "elogio");
                }
            }
        ]
    },

    jovenNacionaliza: {
        id: "jovenNacionaliza",
        titulo: "Un joven se nacionaliza argentino",
        descripcion: "Un delantero de 19 años que juega en Europa obtuvo la ciudadanía argentina.",
        opciones: [
            {
                texto: "Convocarlo rápido a la Selección",
                resumen: "+3 prestigio, +2 apoyo",
                efecto: function() {
                    ajustarPrestigio(3);
                    ajustarApoyo(2);
                    noticiaEvento("Olé", "La Selección convoca a un joven nacionalizado", "El pibe promete.", "elogio");
                }
            },
            {
                texto: "Esperar a ver su evolución",
                resumen: "Sin efecto inmediato",
                efecto: function() {
                    noticiaEvento("TyC Sports", "La AFA evalúa a un joven", "El DT lo sigue de cerca.", "rumor");
                }
            }
        ]
    },

    amenazaBomba: {
        id: "amenazaBomba",
        titulo: "Amenaza de bomba en un estadio",
        descripcion: "Antes de un clásico, una amenaza de bomba obliga a evaluar la suspensión.",
        opciones: [
            {
                texto: "Suspender el partido",
                resumen: "-$200M, +5 apoyo",
                efecto: function() {
                    ajustarDinero(-200);
                    ajustarApoyo(5);
                    noticiaEvento("Olé", "Suspendido el clásico por amenaza", "La seguridad primero.", "rumor");
                }
            },
            {
                texto: "Jugar igual con operativo especial",
                resumen: "+$300M, -5 apoyo, -3 prestigio",
                efecto: function() {
                    ajustarDinero(300);
                    ajustarApoyo(-5);
                    ajustarPrestigio(-3);
                    encolarEvento("sancionConmebol");
                    noticiaEvento("Azz", "El clásico se jugó pese a la amenaza", "Polémica total.", "escandalo");
                }
            }
        ]
    },

    sponsorSeVa: {
        id: "sponsorSeVa",
        titulo: "Un sponsor importante se quiere ir",
        descripcion: "El sponsor principal amenaza con romper el contrato por los escándalos recientes.",
        opciones: [
            {
                texto: "Convencerlo con descuentos",
                resumen: "-$500M, mantiene sponsor",
                efecto: function() {
                    ajustarDinero(-500);
                    noticiaEvento("TyC Sports", "La AFA retiene a su sponsor", "Se renegoció el contrato.", "rumor");
                }
            },
            {
                texto: "Dejarlo ir",
                resumen: "Pierde sponsor, -5 apoyo",
                efecto: function() {
                    if (estadoFinanzas.sponsorActual) {
                        estadoFinanzas.sponsorActual = null;
                    }
                    ajustarApoyo(-5);
                    encolarEvento("sponsorCondiciones");
                    noticiaEvento("Azz", "La AFA pierde a su sponsor principal", "Los clubes cuestionan.", "critica");
                }
            }
        ]
    },

    dirigenteDenuncia: {
        id: "dirigenteDenuncia",
        titulo: "Un dirigente denuncia corrupción",
        descripcion: "Un dirigente histórico denuncia supuestos casos de corrupción en la AFA.",
        opciones: [
            {
                texto: "Investigar públicamente",
                resumen: "-$400M, +8 prestigio, +5 apoyo",
                efecto: function() {
                    ajustarDinero(-400);
                    ajustarPrestigio(8);
                    ajustarApoyo(5);
                    noticiaEvento("Olé", "La AFA investiga las denuncias", "Amplio respaldo.", "elogio");
                }
            },
            {
                texto: "Desmentir todo",
                resumen: "+2 apoyo, -8 prestigio",
                efecto: function() {
                    ajustarApoyo(2);
                    ajustarPrestigio(-8);
                    marcasEventos["denunciaDesmentida"] = true;
                    noticiaEvento("Azz", "La AFA desmiente las denuncias", "La oposición pide auditoría.", "escandalo");
                }
            }
        ]
    },

    presidenteRenuncia: {
        id: "presidenteRenuncia",
        titulo: "Renuncia un presidente de club",
        descripcion: "El presidente de un club importante renunció por problemas personales.",
        opciones: [
            {
                texto: "Aceptar la renuncia y convocar elecciones",
                resumen: "+3 apoyo, -1 prestigio",
                efecto: function() {
                    ajustarApoyo(3);
                    ajustarPrestigio(-1);
                    noticiaEvento("Olé", "Renunció un presidente de club", "Se convocan elecciones.", "rumor");
                }
            },
            {
                texto: "Pedirle que siga hasta fin de año",
                resumen: "+2 apoyo, -2 prestigio",
                efecto: function() {
                    ajustarApoyo(2);
                    ajustarPrestigio(-2);
                    noticiaEvento("TyC Sports", "El presidente sigue hasta fin de año", "Solución transitoria.", "rumor");
                }
            }
        ]
    },

    afipAllana: {
        id: "afipAllana",
        titulo: "La AFIP allana un club",
        descripcion: "La AFIP allanó la sede de un club por supuestas deudas impositivas.",
        opciones: [
            {
                texto: "Defender al club públicamente",
                resumen: "+5 apoyo, -3 prestigio",
                efecto: function() {
                    ajustarApoyo(5);
                    ajustarPrestigio(-3);
                    noticiaEvento("Olé", "La AFA defiende al club allanado", "Los clubes agradecen.", "rumor");
                }
            },
            {
                texto: "Dejar que la Justicia actúe",
                resumen: "+3 prestigio, -3 apoyo",
                efecto: function() {
                    ajustarPrestigio(3);
                    ajustarApoyo(-3);
                    noticiaEvento("Azz", "La AFA no interviene en el allanamiento", "Respeto por la Justicia.", "rumor");
                }
            }
        ]
    },

    libroExarbitro: {
        id: "libroExarbitro",
        titulo: "Un exárbitro escribe un libro bomba",
        descripcion: "Un exárbitro va a publicar un libro contando 'arreglos' de partidos durante su carrera.",
        opciones: [
            {
                texto: "Contestar públicamente",
                resumen: "-$200M, +3 prestigio",
                efecto: function() {
                    ajustarDinero(-200);
                    ajustarPrestigio(3);
                    noticiaEvento("TyC Sports", "La AFA responde al libro del exárbitro", "Comunicado oficial.", "rumor");
                }
            },
            {
                texto: "Ignorarlo",
                resumen: "-3 prestigio, +1 apoyo",
                efecto: function() {
                    ajustarPrestigio(-3);
                    ajustarApoyo(1);
                    noticiaEvento("Azz", "Silencio de la AFA ante el libro bomba", "La prensa especula.", "escandalo");
                }
            }
        ]
    },

    clubOtraFederacion: {
        id: "clubOtraFederacion",
        titulo: "Un club quiere irse a otra federación",
        descripcion: "Un club del Federal A amenaza con irse a una federación regional si no recibe más apoyo.",
        opciones: [
            {
                texto: "Negociar con el club",
                resumen: "-$400M, +3 apoyo",
                efecto: function() {
                    ajustarDinero(-400);
                    ajustarApoyo(3);
                    noticiaEvento("Olé", "La AFA retiene a un club en crisis", "Se llegó a un acuerdo.", "rumor");
                }
            },
            {
                texto: "Dejarlo ir",
                resumen: "+$200M, -5 apoyo, -3 prestigio",
                efecto: function() {
                    ajustarDinero(200);
                    ajustarApoyo(-5);
                    ajustarPrestigio(-3);
                    noticiaEvento("Azz", "Un club se va del fútbol argentino", "Escándalo institucional.", "escandalo");
                }
            }
        ]
    },

    ventaNombreEstadio: {
        id: "ventaNombreEstadio",
        titulo: "Un club quiere vender el nombre de su estadio",
        descripcion: "Un club grande quiere vender el nombre de su estadio a una empresa.",
        opciones: [
            {
                texto: "Permitir la venta",
                resumen: "+$400M (comisión), -4 prestigio",
                efecto: function() {
                    ajustarDinero(400);
                    ajustarPrestigio(-4);
                    noticiaEvento("Azz", "Un estadio cambia de nombre", "Los hinchas rechazan.", "escandalo");
                }
            },
            {
                texto: "Prohibir la venta",
                resumen: "+4 prestigio, +2 apoyo",
                efecto: function() {
                    ajustarPrestigio(4);
                    ajustarApoyo(2);
                    noticiaEvento("Olé", "La AFA prohíbe vender el nombre de los estadios", "Los hinchas aplauden.", "elogio");
                }
            }
        ]
    },

    marcaApuestas: {
        id: "marcaApuestas",
        titulo: "Una marca de apuestas quiere ser sponsor",
        descripcion: "Una casa de apuestas ofrece $2.000M para ser sponsor principal de la AFA.",
        opciones: [
            {
                texto: "Aceptar (polémico)",
                resumen: "+$2.000M, -8 apoyo, -5 prestigio",
                efecto: function() {
                    ajustarDinero(2000);
                    ajustarApoyo(-8);
                    ajustarPrestigio(-5);
                    noticiaEvento("Azz", "La AFA firma con una casa de apuestas", "Escándalo total.", "escandalo");
                }
            },
            {
                texto: "Rechazar la oferta",
                resumen: "+5 prestigio, +3 apoyo",
                efecto: function() {
                    ajustarPrestigio(5);
                    ajustarApoyo(3);
                    noticiaEvento("Olé", "La AFA rechaza a las apuestas", "Decisión ética.", "elogio");
                }
            }
        ]
    },

    clubPidePrestamo: {
        id: "clubPidePrestamo",
        titulo: "Un club pide un préstamo grande",
        descripcion: "Un club histórico pide un préstamo de $1.500M a la AFA para salvar sus finanzas.",
        opciones: [
            {
                texto: "Darle el préstamo",
                resumen: "-$1.500M ahora, +$1.800M en 3 años",
                efecto: function() {
                    ajustarDinero(-1500);
                    ajustarApoyo(4);
                    noticiaEvento("Olé", "La AFA le da un préstamo a un club histórico", "Se cobrará en cuotas.", "rumor");
                }
            },
            {
                texto: "Rechazar el pedido",
                resumen: "-4 apoyo",
                efecto: function() {
                    ajustarApoyo(-4);
                    noticiaEvento("Azz", "La AFA le dice no al club", "El club busca alternativas.", "critica");
                }
            }
        ]
    },

    dirigenteSePostula: {
        id: "dirigenteSePostula",
        titulo: "Un dirigente se postula contra vos",
        descripcion: "Un dirigente opositor anunció que se presentará a las próximas elecciones.",
        opciones: [
            {
                texto: "Responder públicamente",
                resumen: "+3 apoyo, -2 prestigio",
                efecto: function() {
                    ajustarApoyo(3);
                    ajustarPrestigio(-2);
                    noticiaEvento("TyC Sports", "El presidente responde al opositor", "Cruce político.", "rumor");
                }
            },
            {
                texto: "Ignorarlo",
                resumen: "-3 apoyo",
                efecto: function() {
                    ajustarApoyo(-3);
                    noticiaEvento("Azz", "Silencio oficial ante la candidatura opositora", "La prensa especula.", "rumor");
                }
            }
        ]
    },

    asambleaExtraordinaria: {
        id: "asambleaExtraordinaria",
        titulo: "Clubes piden una asamblea extraordinaria",
        descripcion: "Un grupo de clubes pide una asamblea para revisar tu gestión.",
        opciones: [
            {
                texto: "Convocarla",
                resumen: "+4 apoyo, -2 prestigio",
                efecto: function() {
                    ajustarApoyo(4);
                    ajustarPrestigio(-2);
                    noticiaEvento("Olé", "La AFA convoca asamblea extraordinaria", "Se debate la gestión.", "rumor");
                }
            },
            {
                texto: "Rechazar el pedido",
                resumen: "-6 apoyo, -2 prestigio",
                efecto: function() {
                    ajustarApoyo(-6);
                    ajustarPrestigio(-2);
                    noticiaEvento("Azz", "La AFA rechaza la asamblea", "Los clubes estallan.", "critica");
                }
            }
        ]
    },

    oposicionAuditoria: {
        id: "oposicionAuditoria",
        titulo: "La oposición pide una auditoría",
        descripcion: "Por los rescates a clubes, la oposición pide una auditoría externa.",
        opciones: [
            {
                texto: "Aceptar la auditoría",
                resumen: "-$200M, +5 prestigio",
                efecto: function() {
                    ajustarDinero(-200);
                    ajustarPrestigio(5);
                    noticiaEvento("Olé", "La AFA acepta una auditoría externa", "Transparencia total.", "elogio");
                }
            },
            {
                texto: "Rechazarla",
                resumen: "-6 apoyo, -3 prestigio",
                efecto: function() {
                    ajustarApoyo(-6);
                    ajustarPrestigio(-3);
                    noticiaEvento("Azz", "La AFA rechaza la auditoría", "Sospechas de encubrimiento.", "escandalo");
                }
            }
        ]
    },

    // ===== EVENTOS AUTOMÁTICOS (POSITIVOS) =====

    giraExitosa: {
        id: "giraExitosa",
        titulo: "Un club argentino hizo una gira exitosa",
        descripcion: "Un club argentino ganó un torneo amistoso internacional. La AFA recibe un bonus.",
        automatico: true,
        efecto: function() {
            ajustarDinero(300);
            ajustarPrestigio(2);
            noticiaEvento("TyC Sports", "Un club argentino brilla en el exterior", "La AFA recibe +$300M.", "elogio");
        }
    },

    documental: {
        id: "documental",
        titulo: "Un canal internacional compra un documental",
        descripcion: "Un canal europeo compró los derechos de un documental sobre el fútbol argentino.",
        automatico: true,
        efecto: function() {
            ajustarDinero(400);
            ajustarPrestigio(3);
            noticiaEvento("Olé", "El fútbol argentino llega al mundo", "Documental internacional.", "elogio");
        }
    },

    donacionExjugador: {
        id: "donacionExjugador",
        titulo: "Un exjugador dona plata a la AFA",
        descripcion: "Un exjugador exitoso donó $500M para las inferiores.",
        automatico: true,
        efecto: function() {
            ajustarDinero(500);
            ajustarApoyo(3);
            noticiaEvento("Olé", "Un exjugador dona $500M a la AFA", "Gesto enorme.", "elogio");
        }
    },

    recordVenta: {
        id: "recordVenta",
        titulo: "Se rompe un récord de venta",
        descripcion: "Un club argentino vendió a un jugador por un récord histórico. La AFA recibe una comisión.",
        automatico: true,
        efecto: function() {
            ajustarDinero(600);
            ajustarPrestigio(3);
            noticiaEvento("TyC Sports", "Récord de venta: la AFA recibe $600M", "El fútbol argentino exporta talento.", "elogio");
        }
    },

    premioFIFA: {
        id: "premioFIFA",
        titulo: "La FIFA premia al fútbol argentino",
        descripcion: "La FIFA reconoció al fútbol argentino por su desarrollo juvenil. Bonus económico.",
        automatico: true,
        efecto: function() {
            ajustarDinero(800);
            ajustarPrestigio(5);
            noticiaEvento("Olé", "La FIFA premia al fútbol argentino", "Reconocimiento internacional.", "elogio");
        }
    },

    // ===== EVENTOS ENCADENADOS =====

    sancionConmebol: {
        id: "sancionConmebol",
        titulo: "La Conmebol sanciona al estadio",
        descripcion: "Tras jugar pese a la amenaza de bomba, la Conmebol sancionó al estadio con 3 partidos a puertas cerradas.",
        opciones: [
            {
                texto: "Apelar la sanción",
                resumen: "-$300M, +3 prestigio",
                efecto: function() {
                    ajustarDinero(-300);
                    ajustarPrestigio(3);
                    noticiaEvento("Azz", "La AFA apela la sanción de Conmebol", "Defensa institucional.", "rumor");
                }
            },
            {
                texto: "Aceptar la sanción",
                resumen: "-3 apoyo, +1 prestigio",
                efecto: function() {
                    ajustarApoyo(-3);
                    ajustarPrestigio(1);
                    noticiaEvento("TyC Sports", "La AFA acepta la sanción", "Se cumplen los 3 partidos.", "rumor");
                }
            }
        ]
    },

    sponsorCondiciones: {
        id: "sponsorCondiciones",
        titulo: "Otro sponsor pide condiciones especiales",
        descripcion: "Tras la salida del sponsor principal, una nueva marca ofrece firmar, pero pide condiciones especiales.",
        opciones: [
            {
                texto: "Aceptar las condiciones",
                resumen: "+$800M, -3 prestigio",
                efecto: function() {
                    ajustarDinero(800);
                    ajustarPrestigio(-3);
                    noticiaEvento("Azz", "La AFA firma con condiciones especiales", "Un sponsor con mucho poder.", "rumor");
                }
            },
            {
                texto: "Rechazar las condiciones",
                resumen: "+2 prestigio, sin sponsor",
                efecto: function() {
                    ajustarPrestigio(2);
                    noticiaEvento("Olé", "La AFA rechaza condiciones especiales", "Dignidad institucional.", "elogio");
                }
            }
        ]
    }
};

// -----------------------------
// HELPERS
// -----------------------------

function noticiaEvento(medio, titulo, cuerpo, tipo) {
    agregarNoticia(medio, titulo, cuerpo, tipo);
}

function registrarEvento(evento, eleccion) {
    eventosHistoricos.push({
        anio: presidente.anioMandato,
        fecha: estadoLigas.fechaActual,
        titulo: evento.titulo,
        eleccion: eleccion || "Automático"
    });
}

function encolarEvento(idEvento) {
    colaEventos.push(idEvento);
}

function obtenerUltimoEvento() {
    if (eventosHistoricos.length === 0) return null;
    return eventosHistoricos[eventosHistoricos.length - 1];
}
// ============================================
// EVENTOS v3: nuevas situaciones
// ============================================

const EVENTOS_V3 = [
    {
        id: "sponsorChino",
        titulo: "Un sponsor asiático pone la plata sobre la mesa",
        descripcion: "Una marca internacional ofrece $3.000M por ser sponsor principal, pero quiere cambiarle el nombre a la Copa Argentina.",
        opciones: [
            {
                texto: "Aceptar y rebautizar la copa",
                resumen: "+$3.000M, -8 prestigio, -4 apoyo",
                efecto: function() {
                    ajustarDinero(3000, "Sponsor internacional");
                    ajustarPrestigio(-8, "Nombre comercial de la copa");
                    ajustarApoyo(-4, "Nombre comercial de la copa");
                    noticiaEvento("Olé", "La Copa Argentina cambia de nombre", "El torneo llevará el nombre de una marca internacional. La tradición, en debate.", "critica");
                }
            },
            {
                texto: "Aceptar sólo como sponsor, sin tocar el nombre",
                resumen: "+$1.500M",
                efecto: function() {
                    ajustarDinero(1500, "Sponsor internacional");
                }
            },
            {
                texto: "Rechazar la oferta",
                resumen: "+3 prestigio, +2 apoyo",
                efecto: function() {
                    ajustarPrestigio(3, "Rechazo al naming");
                    ajustarApoyo(2, "Rechazo al naming");
                }
            }
        ]
    },
    {
        id: "dtEuropeo",
        titulo: "Un club europeo quiere a tu DT",
        descripcion: "El entrenador de la Selección tiene una oferta de un grande de Europa. Pide una reunión urgente.",
        opciones: [
            {
                texto: "Mejorarle el contrato para retenerlo",
                resumen: "-$900M, +4 prestigio",
                efecto: function() {
                    ajustarDinero(-900, "Mejora de contrato del DT");
                    ajustarPrestigio(4, "Continuidad del DT");
                }
            },
            {
                texto: "Dejarlo ir y buscar un reemplazo",
                resumen: "-6 prestigio, +$400M de rescisión",
                efecto: function() {
                    ajustarPrestigio(-6, "Salida del DT");
                    ajustarDinero(400, "Rescisión del DT");
                    noticiaEvento("TyC Sports", "Bomba: el DT de la Selección se va a Europa", "La AFA no pudo retenerlo. Comienza la búsqueda de un reemplazo.", "escandalo");
                }
            },
            {
                texto: "Convencerlo de quedarse hasta el Mundial",
                resumen: "+2 prestigio, -2 apoyo",
                efecto: function() {
                    ajustarPrestigio(2, "Acuerdo con el DT");
                    ajustarApoyo(-2, "Acuerdo con el DT");
                }
            }
        ]
    },
    {
        id: "streamingPirata",
        titulo: "La piratería se come la recaudación",
        descripcion: "El 40% de los hinchas mira el fútbol por streams ilegales. Las empresas de TV amenazan con renegociar el contrato.",
        opciones: [
            {
                texto: "Campaña antipiratería y controles",
                resumen: "-$350M, +$600M de recupero",
                efecto: function() {
                    ajustarDinero(-350, "Campaña antipiratería");
                    ajustarDinero(600, "Recupero de derechos");
                }
            },
            {
                texto: "No gastar y dejar pasar",
                resumen: "-$800M de ingresos",
                efecto: function() {
                    ajustarDinero(-800, "Caída de derechos de TV");
                }
            },
            {
                texto: "Bajar el precio del abono oficial",
                resumen: "+6 apoyo, -$500M",
                efecto: function() {
                    ajustarApoyo(6, "Abono accesible");
                    ajustarDinero(-500, "Abono accesible");
                }
            }
        ]
    },
    {
        id: "hinchadaViolenta",
        titulo: "Incidentes en la tribuna",
        descripcion: "Una facción de la barra brava se enfrentó en el último clásico. Hay 12 heridos y la presión para actuar es enorme.",
        opciones: [
            {
                texto: "Cierre total del estadio por 6 fechas",
                resumen: "+7 prestigio, -5 apoyo",
                efecto: function() {
                    ajustarPrestigio(7, "Sanción ejemplar");
                    ajustarApoyo(-5, "Sanción ejemplar");
                }
            },
            {
                texto: "Multa y protocolo conjunto con la policía",
                resumen: "+2 prestigio, -$200M",
                efecto: function() {
                    ajustarPrestigio(2, "Protocolo de seguridad");
                    ajustarDinero(-200, "Protocolo de seguridad");
                }
            },
            {
                texto: "Minimizar el hecho",
                resumen: "-6 prestigio, -4 apoyo",
                efecto: function() {
                    ajustarPrestigio(-6, "Silencio ante la violencia");
                    ajustarApoyo(-4, "Silencio ante la violencia");
                }
            }
        ]
    },
    {
        id: "documentalFinal",
        titulo: "Un documental sobre la final del Mundial",
        descripcion: "Una plataforma quiere hacer una serie sobre la final perdida y las luces de tu gestión. Ponen plata y proyección.",
        opciones: [
            {
                texto: "Dar acceso total",
                resumen: "+$700M, +3 prestigio, -2 apoyo",
                efecto: function() {
                    ajustarDinero(700, "Documental");
                    ajustarPrestigio(3, "Documental");
                    ajustarApoyo(-2, "Documental");
                }
            },
            {
                texto: "Participar sólo si el guion se acuerda",
                resumen: "+$300M, +4 prestigio",
                efecto: function() {
                    ajustarDinero(300, "Documental");
                    ajustarPrestigio(4, "Documental");
                }
            },
            {
                texto: "Rechazarlo",
                resumen: "Sin cambios",
                efecto: function() {}
            }
        ]
    },
    {
        id: "clubAjena",
        titulo: "Un club quiere jugar en otra federación",
        descripcion: "Un club del Interior amenaza con pasarse a la liga de otra provincia. La asamblea mira con atención.",
        opciones: [
            {
                texto: "Darle una plaza en el Federal A",
                resumen: "+6 apoyo, -$250M",
                efecto: function() {
                    ajustarApoyo(6, "Plaza federal");
                    ajustarDinero(-250, "Plaza federal");
                }
            },
            {
                texto: "Dejarlo ir",
                resumen: "-5 apoyo, -2 prestigio",
                efecto: function() {
                    ajustarApoyo(-5, "Club que se va");
                    ajustarPrestigio(-2, "Club que se va");
                }
            },
            {
                texto: "Armar una comisión de diálogo",
                resumen: "+2 apoyo, -$80M",
                efecto: function() {
                    ajustarApoyo(2, "Comisión de diálogo");
                    ajustarDinero(-80, "Comisión de diálogo");
                }
            }
        ]
    }
];
