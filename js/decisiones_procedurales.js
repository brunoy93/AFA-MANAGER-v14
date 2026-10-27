// ============================================
// DECISIONES PROCEDURALES: el generador infinito
// ============================================
// Cada plantilla elige un sujeto al azar (club, jugador, provincia, árbitro)
// y arma una decisión distinta. Se combinan con las decisiones escritas a mano.

const PERFIL_CLAVE = "afa_manager_perfil_v1";

function leerPerfil() {
    return Almacen.leer(PERFIL_CLAVE) || { plantillas: {}, partidas: 0 };
}

function guardarPerfil(perfil) {
    Almacen.escribir(PERFIL_CLAVE, perfil);
}

function registrarPlantillaUsada(idPlantilla) {
    const perfil = leerPerfil();
    perfil.plantillas[idPlantilla] = (perfil.plantillas[idPlantilla] || 0) + 1;
    guardarPerfil(perfil);
}

// ---------- helpers para escribir opciones cortas ----------
function opD(texto, resumen, efecto) {
    return { texto: texto, resumen: resumen, efecto: efecto };
}

function efecto(apoyo, prestigio, dinero, extra) {
    return function() {
        if (apoyo) ajustarApoyo(apoyo, "Decisión");
        if (prestigio) ajustarPrestigio(prestigio, "Decisión");
        if (dinero) ajustarDinero(dinero, "Decisión");
        if (typeof extra === "function") extra();
    };
}

function combinar() {
    const fns = Array.prototype.slice.call(arguments);
    return function() { fns.forEach(function(f) { if (typeof f === "function") f(); }); };
}

function clubesDe(liga) { return (LIGAS[liga] ? LIGAS[liga].equipos.slice() : []); }
function clubesPrimera() { return clubesDe("primera"); }
function clubesChicos() { return clubesPrimera().filter(function(id) { return EQUIPOS[id].pesoHistorico < 60; }); }
function clubesGrandes() { return clubesPrimera().filter(function(id) { return EQUIPOS[id].pesoHistorico >= 75; }); }
function clubesInterior() { return clubesDe("federalA").concat(clubesDe("nacional")); }
function clubesEnCrisis() {
    return Object.keys(estadoFinanzas.nivelDeuda)
        .filter(function(id) { return estadoFinanzas.nivelDeuda[id] !== "sano"; })
        .map(function(id) { return parseInt(id, 10); });
}
function figuraAlAzar() {
    const libres = estadoMercado.figuras.filter(function(f) { return !f.vendido; });
    return libres.length ? elegir(libres) : null;
}
const PROVINCIAS = ["Mendoza", "Córdoba", "Salta", "Tucumán", "Rosario", "Mar del Plata", "Bariloche", "San Juan", "La Plata", "Corrientes", "Neuquén", "Jujuy"];
const PAISES_GIRA = ["Brasil", "Uruguay", "Chile", "Paraguay", "Colombia", "Estados Unidos", "España", "Japón"];

const PLANTILLAS = [];

function plantilla(id, categoria, peso, requiere, construir) {
    PLANTILLAS.push({ id: id, categoria: categoria, peso: peso, requiere: requiere, construir: construir });
}

// -----------------------------
// FEDERAL / CLUBES
// -----------------------------

plantilla("rescate_club", "federal", 3,
    function() { return clubesEnCrisis().length > 0; },
    function() {
        const idClub = elegir(clubesEnCrisis());
        const club = EQUIPOS[idClub];
        const costo = COSTOS_RESCATE[estadoFinanzas.nivelDeuda[idClub]] || 800;
        return {
            id: "rescate_" + idClub + "_" + estadoLigas.fechaActual,
            titulo: "Rescate exprés: " + club.nombre,
            descripcion: club.nombre + " no puede pagar los sueldos y la situación es insostenible. El presidente del club pide una reunión de urgencia con la AFA.",
            categoria: "federal",
            opciones: [
                opD("Rescatarlo con plata de la AFA", "-" + fmt.plata(costo) + " · +6 apoyo", function() {
                    const r = rescatarClub(idClub);
                    if (!r.exito) { toastError(r.motivo); return; }
                }),
                opD("Darle un préstamo blando", "-" + fmt.plata(costo / 2) + " · +3 apoyo", efecto(0, 0, -costo / 2, function() {
                    ajustarApoyo(3, "Préstamo a " + club.nombre);
                })),
                opD("Dejarlo que se arregle", "-5 apoyo", efecto(-5, 0, 0))
            ]
        };
    });

plantilla("quiebra_club", "institucional", 2,
    function() { return clubesEnCrisis().length > 0; },
    function() {
        const idClub = elegir(clubesEnCrisis());
        const club = EQUIPOS[idClub];
        return {
            id: "quiebra_" + idClub + "_" + estadoLigas.fechaActual,
            titulo: "Concurso preventivo en " + club.nombre,
            descripcion: "La justicia abrió el concurso de acreedores de " + club.nombre + ". Si nadie interviene, desaparece del fútbol argentino.",
            categoria: "institucional",
            opciones: [
                opD("Intervenir el club", "-$1.500M · +7 apoyo · +2 prestigio", efecto(7, 2, -1500)),
                opD("Buscar un inversor privado", "+$800M · -4 apoyo", efecto(-4, 0, 800)),
                opD("Quebrado, que juegue igual", "-8 apoyo · -3 prestigio", efecto(-8, -3, 0))
            ]
        };
    });

plantilla("sede_final_provincia", "federal", 2,
    function() { return true; },
    function() {
        const a = elegir(PROVINCIAS);
        let b = elegir(PROVINCIAS);
        while (b === a) b = elegir(PROVINCIAS);
        return {
            id: "sede_" + estadoLigas.fechaActual + "_" + a + "_" + b,
            titulo: "¿Dónde jugamos la final?",
            descripcion: "Dos provincias ofrecen estadio para la final de la Copa Argentina: " + a + " y " + b + ". Las dos prometen lleno total.",
            categoria: "federal",
            opciones: [
                opD("Final en " + a, "+5 apoyo · -$200M", efecto(5, 1, -200, function() { agregarNoticia("Azz", "La final se juega en " + a, "El Interior celebra la decisión de la AFA.", "elogio"); })),
                opD("Final en " + b, "+5 apoyo · -$200M", efecto(5, 1, -200, function() { agregarNoticia("Azz", "La final se juega en " + b, "El Interior celebra la decisión de la AFA.", "elogio"); })),
                opD("Final en Buenos Aires", "+$700M · -5 apoyo", efecto(-5, 0, 700))
            ]
        };
    });

plantilla("seguridad_estadio", "institucional", 2,
    function() { return true; },
    function() {
        const idClub = elegir(clubesGrandes());
        const club = EQUIPOS[idClub];
        return {
            id: "seg_" + idClub + "_" + estadoLigas.fechaActual,
            titulo: "El estadio de " + club.nombre + " no pasa la inspección",
            descripcion: "Bomberos encontró fallas graves en el estadio de " + club.nombre + ". Si no se arregla, no puede jugar de local.",
            categoria: "institucional",
            opciones: [
                opD("Cerrar la cancha hasta que se arregle", "+3 prestigio · -6 apoyo", efecto(-6, 3, 0)),
                opD("Prorrogar la habilitación", "+2 apoyo · -4 prestigio", efecto(2, -4, 0, function() { agregarNoticia("Olé", "Habilitación provisoria para " + club.nombre, "La AFA dio otra oportunidad. Bomberos, enojado.", "critica"); })),
                opD("Fondos para las obras", "-$600M · +4 prestigio · +2 apoyo", efecto(2, 4, -600))
            ]
        };
    });

plantilla("federal_plazas", "federal", 2,
    function() { return true; },
    function() {
        const n = entre(1, 3);
        return {
            id: "fed_plazas_" + estadoLigas.fechaActual,
            titulo: "El Federal A pide " + n + " ascenso" + (n > 1 ? "s" : "") + " más",
            descripcion: "Los clubes del Interior reclaman más plazas de ascenso. La Primera Nacional amenaza con medidas si se las dan.",
            categoria: "federal",
            opciones: [
                opD("Dar " + n + " plazas más", "+8 apoyo · -$250M", efecto(8, 0, -250, function() { ajustarConfianzaArea("federal", 5, "Ascensos"); })),
                opD("Mantener el cupo", "-6 apoyo", efecto(-6, 0, 0, function() { ajustarConfianzaArea("federal", -5, "Ascensos"); })),
                opD("Repechaje entre categorías", "+3 apoyo · +2 prestigio · -$150M", efecto(3, 2, -150))
            ]
        };
    });

plantilla("club_nuevo_estadio", "economica", 2,
    function() { return true; },
    function() {
        const idClub = elegir(clubesPrimera());
        const club = EQUIPOS[idClub];
        return {
            id: "estadio_" + idClub + "_" + estadoLigas.fechaActual,
            titulo: club.nombre + " quiere estadio nuevo",
            descripcion: "El club presentó un proyecto de estadio con capital mixto. La AFA tiene que avalar la operación.",
            categoria: "economica",
            opciones: [
                opD("Avalar el proyecto", "+$500M · +4 prestigio", efecto(0, 4, 500)),
                opD("Avalar y poner plata", "-$800M · +6 apoyo · +3 prestigio", efecto(6, 3, -800, function() {
                    if (typeof registrarFavor === "function") registrarFavor(idClub, "institucional", 5, "AFA puso plata para el estadio");
                })),
                opD("Rechazarlo", "-3 apoyo", efecto(-3, 0, 0))
            ]
        };
    });

// -----------------------------
// ECONÓMICAS
// -----------------------------

plantilla("reparto_tv", "economica", 3,
    function() { return true; },
    function() {
        const monto = Math.round((estadoFinanzas.tv.montoAnual * (0.1 + Math.random() * 0.2)) / 50) * 50;
        return {
            id: "tv_reparto_" + estadoLigas.fechaActual,
            titulo: "¿Cómo repartimos los " + fmt.plata(monto) + " de la TV?",
            descripcion: "Cada año la pelea es la misma: los grandes quieren cobrar por audiencia, los chicos piden partes iguales.",
            categoria: "economica",
            opciones: [
                opD("Partes iguales", "-$" + monto + "M del fondo · +8 apoyo", efecto(8, 1, -monto, function() { agregarNoticia("Azz", "Reparto igualitario: el Interior celebra", "Los clubes chicos recibieron lo mismo que los grandes.", "elogio"); })),
                opD("Por audiencia", "+4 apoyo de los grandes", efecto(2, 0, 0, function() { ajustarConfianzaArea("institucional", 3, "Reparto por audiencia"); })),
                opD("Reparto mixto", "+3 apoyo · -$" + Math.round(monto / 2) + "M", efecto(3, 1, -Math.round(monto / 2)))
            ]
        };
    });

plantilla("sponsor_camiseta", "economica", 2,
    function() { return true; },
    function() {
        const s = elegir(SPONSORS_DISPONIBLES);
        return {
            id: "sponsor_" + s.id + "_" + estadoLigas.fechaActual,
            titulo: "Oferta de " + s.nombre + " para la camiseta",
            descripcion: s.nombre + " quiere ser sponsor de la camiseta de la Selección. Ofrece " + fmt.plata(s.montoBase) + " por año, pero pide meter mano en el diseño.",
            categoria: "economica",
            opciones: [
                opD("Aceptar", "+" + fmt.plata(s.montoBase) + " · -1 prestigio", efecto(0, -1, s.montoBase)),
                opD("Aceptar sin tocar el diseño", "+" + fmt.plata(s.montoBase / 2), efecto(0, 0, s.montoBase / 2)),
                opD("Rechazar", "+2 prestigio", efecto(0, 2, 0))
            ]
        };
    });

plantilla("apuestas_sponsor", "economica", 2,
    function() { return true; },
    function() {
        const idClub = elegir(clubesChicos());
        const club = EQUIPOS[idClub];
        return {
            id: "apuestas_" + idClub + "_" + estadoLigas.fechaActual,
            titulo: club.nombre + " firma con una casa de apuestas",
            descripcion: "El club cerró un acuerdo con una plataforma de apuestas. La FIFA pide explicaciones y la comisión de ética investiga.",
            categoria: "economica",
            opciones: [
                opD("Permitirlo", "+$400M · -4 prestigio", efecto(2, -4, 400)),
                opD("Prohibirlo y ofrecerle un sponsor propio", "-$300M · +5 prestigio", efecto(-2, 5, -300)),
                opD("No meterse", "-2 prestigio", efecto(0, -2, 0))
            ]
        };
    });

plantilla("inversor_club", "economica", 2,
    function() { return true; },
    function() {
        const idClub = elegir(clubesChicos());
        const club = EQUIPOS[idClub];
        const monto = entre(8, 30) * 100;
        return {
            id: "inversor_" + idClub + "_" + estadoLigas.fechaActual,
            titulo: "Un inversor quiere comprar " + club.nombre,
            descripcion: "Un fondo extranjero ofrece " + fmt.plata(monto) + " por el 70% del club. Los socios están divididos.",
            categoria: "economica",
            opciones: [
                opD("Aprobar la venta", "+" + fmt.plata(monto / 4) + " · -8 apoyo", efecto(-8, -2, monto / 4, function() { agregarNoticia("Olé", "Vendieron a " + club.nombre, "Los socios estallaron. La AFA avaló la operación.", "escandalo"); })),
                opD("Bloquearla", "+8 apoyo · -3 prestigio", efecto(8, -3, 0)),
                opD("Pedir una auditoría previa", "-$200M · +3 prestigio", efecto(0, 3, -200))
            ]
        };
    });

// -----------------------------
// ARBITRAJE
// -----------------------------

plantilla("fallo_arbitral", "deportiva", 3,
    function() { return true; },
    function() {
        const arbitro = elegir(ARBITROS_PRIMERA);
        const idClub = elegir(clubesGrandes());
        const club = EQUIPOS[idClub];
        return {
            id: "fallo_" + arbitro.id + "_" + estadoLigas.fechaActual,
            titulo: "Polémica con " + arbitro.nombre,
            descripcion: "El árbitro " + arbitro.nombre + " cobró un penal inexistente a favor de " + club.nombre + " en el último minuto. La prensa pide su cabeza.",
            categoria: "deportiva",
            opciones: [
                opD("Sancionarlo", "+4 apoyo · -2 prestigio", efecto(4, -2, 0, function() { sancionarArbitro(arbitro.id); })),
                opD("Mandar al Federal", "+6 apoyo · -4 prestigio", efecto(6, -4, 0, function() {
                    arbitro.sancionado = true; arbitro.fechasSancion = 8; arbitro.nivel = Math.max(40, arbitro.nivel - 4);
                })),
                opD("Bancarlo", "-4 apoyo · +2 prestigio", efecto(-4, 2, 0))
            ]
        };
    });

plantilla("designacion_sospechosa", "deportiva", 2,
    function() { return true; },
    function() {
        const arbitro = elegir(ARBITROS_PRIMERA);
        return {
            id: "desig_" + arbitro.id + "_" + estadoLigas.fechaActual,
            titulo: "Piden que " + arbitro.nombre + " no dirija más",
            descripcion: "Un club denunció que " + arbitro.nombre + " los perjudica sistemáticamente. Piden que no los dirija en lo que queda del torneo.",
            categoria: "deportiva",
            opciones: [
                opD("Aceptar el pedido", "+5 apoyo · -3 prestigio", efecto(5, -3, 0)),
                opD("Rechazarlo", "-3 apoyo · +3 prestigio", efecto(-3, 3, 0)),
                opD("Sortear sus partidos", "+1 apoyo", efecto(1, 0, 0))
            ]
        };
    });

// -----------------------------
// SELECCIÓN
// -----------------------------

plantilla("amistoso_interior", "seleccion", 2,
    function() { return true; },
    function() {
        const prov = elegir(PROVINCIAS);
        return {
            id: "amistoso_" + prov + "_" + estadoLigas.fechaActual,
            titulo: "La Selección en " + prov,
            descripcion: "La provincia de " + prov + " ofrece su estadio para un amistoso de la Selección. Los grandes quieren el partido en Buenos Aires.",
            categoria: "seleccion",
            opciones: [
                opD("Jugar en " + prov, "+8 apoyo · -$300M", efecto(8, 1, -300)),
                opD("Jugar en el Monumental", "+$500M · -5 apoyo", efecto(-5, 0, 500)),
                opD("Dos amistosos: uno y uno", "+4 apoyo · -$150M", efecto(4, 0, -150))
            ]
        };
    });

plantilla("gira_internacional", "seleccion", 2,
    function() { return true; },
    function() {
        const pais = elegir(PAISES_GIRA);
        return {
            id: "gira_" + pais + "_" + estadoLigas.fechaActual,
            titulo: "Gira por " + pais,
            descripcion: "Una promotora ofrece llevar a la Selección a " + pais + " para dos amistosos. Paga bien, pero el viaje desgasta al plantel.",
            categoria: "seleccion",
            opciones: [
                opD("Aceptar la gira", "+$900M · -2 prestigio", efecto(0, -2, 900)),
                opD("Aceptar y llevar juveniles", "+$600M · +2 prestigio", efecto(0, 2, 600, function() {
                    estadoSeleccion.plantel.forEach(function(j) { if (j.edad <= 21) j.nivel = Math.min(96, j.nivel + 1); });
                })),
                opD("Rechazar", "+3 prestigio", efecto(0, 3, 0))
            ]
        };
    });

plantilla("sub20_torneo", "seleccion", 2,
    function() { return true; },
    function() {
        return {
            id: "sub20_" + estadoLigas.fechaActual,
            titulo: "El Sudamericano Sub-20",
            descripcion: "La AFA tiene que decidir si lleva equipo completo al Sudamericano Sub-20 o si prioriza el torneo local.",
            categoria: "seleccion",
            opciones: [
                opD("Llevar lo mejor", "-$400M · +4 prestigio", efecto(0, 4, -400)),
                opD("Llevar un mix", "-$200M · +2 prestigio", efecto(0, 2, -200)),
                opD("No participar", "-3 prestigio · +2 apoyo", efecto(2, -3, 0))
            ]
        };
    });

// -----------------------------
// MEDIÁTICAS
// -----------------------------

plantilla("streamer_conflicto", "mediatica", 2,
    function() { return typeof STREAMERS !== "undefined"; },
    function() {
        const s = elegir(STREAMERS);
        return {
            id: "conf_" + s.id + "_" + estadoLigas.fechaActual,
            titulo: s.nombre + " te apuntó en vivo",
            descripcion: s.nombre + " dijo en stream que la AFA \"es un kiosco\". El clip tiene " + fmt.num(s.seguidores * 2) + " vistas y sigue subiendo.",
            categoria: "mediatica",
            opciones: [
                opD("Responderle en vivo", "+2 apoyo · -2 prestigio", efecto(2, -2, 0, function() { ajustarOpinionStreamer(s.id, 6); })),
                opD("Ignorarlo", "-1 apoyo", efecto(-1, 0, 0, function() { ajustarOpinionStreamer(s.id, -3); })),
                opD("Prohibirle la cancha", "+4 apoyo · -6 prestigio", efecto(4, -6, 0, function() { ajustarOpinionStreamer(s.id, -20); }))
            ]
        };
    });

plantilla("horario_partidos", "mediatica", 2,
    function() { return true; },
    function() {
        return {
            id: "horario_" + estadoLigas.fechaActual,
            titulo: "El horario de los partidos",
            descripcion: "La TV quiere correr los partidos a las 21:30 para vender más. Los hinchas se quejan por la vuelta a casa.",
            categoria: "mediatica",
            opciones: [
                opD("Aceptar el horario de la TV", "+$500M · -4 apoyo", efecto(-4, 0, 500)),
                opD("Mantener el horario", "+4 apoyo · -$300M", efecto(4, 0, -300)),
                opD("Horario mixto", "+2 apoyo", efecto(2, 0, 0))
            ]
        };
    });

plantilla("periodista_datos", "mediatica", 2,
    function() { return true; },
    function() {
        const medio = elegir(["Olé", "Azz", "TyC Sports", "La Nación Deportiva", "Infobae Deportes"]);
        return {
            id: "datos_" + estadoLigas.fechaActual,
            titulo: medio + " pide acceso a las cuentas",
            descripcion: medio + " quiere publicar un especial con todos los números de la AFA. Transparencia o portazo.",
            categoria: "mediatica",
            opciones: [
                opD("Abrir todo", "+3 prestigio · -2 apoyo", efecto(-2, 3, 0)),
                opD("Dar un resumen", "+1 prestigio", efecto(0, 1, 0)),
                opD("Negar el acceso", "-3 prestigio", efecto(0, -3, 0))
            ]
        };
    });

// -----------------------------
// DEPORTIVAS
// -----------------------------

plantilla("idolo_retiro", "deportiva", 2,
    function() { return true; },
    function() {
        const idClub = elegir(clubesPrimera());
        const club = EQUIPOS[idClub];
        return {
            id: "retiro_" + idClub + "_" + estadoLigas.fechaActual,
            titulo: "Se retira un ídolo de " + club.nombre,
            descripcion: "El capitán histórico de " + club.nombre + " anunció su retiro. La AFA puede organizarle un homenaje o dejarlo pasar.",
            categoria: "deportiva",
            opciones: [
                opD("Homenaje en la cancha", "-$250M · +5 apoyo · +2 prestigio", efecto(5, 2, -250)),
                opD("Partido despedida en la Selección", "-$500M · +3 prestigio", efecto(0, 3, -500)),
                opD("Sin homenaje", "-3 apoyo", efecto(-3, 0, 0))
            ]
        };
    });

plantilla("cupo_extranjeros", "deportiva", 2,
    function() { return true; },
    function() {
        const idClub = elegir(clubesGrandes());
        const club = EQUIPOS[idClub];
        return {
            id: "extranjeros_" + idClub + "_" + estadoLigas.fechaActual,
            titulo: club.nombre + " quiere más extranjeros",
            descripcion: "El club pide ampliar el cupo de extranjeros para competir en la Libertadores. Los chicos temen quedarse sin lugar.",
            categoria: "deportiva",
            opciones: [
                opD("Ampliar el cupo", "+3 apoyo de los grandes · -4 de los chicos", efecto(0, 1, 0, function() { ajustarConfianzaArea("institucional", 2, "Cupo de extranjeros"); })),
                opD("Mantener el cupo", "+4 apoyo", efecto(4, 0, 0)),
                opD("Cupo según el torneo", "+2 apoyo · +1 prestigio", efecto(2, 1, 0))
            ]
        };
    });

plantilla("dopaje", "institucional", 2,
    function() { return true; },
    function() {
        const idClub = elegir(clubesPrimera());
        const club = EQUIPOS[idClub];
        return {
            id: "dopaje_" + idClub + "_" + estadoLigas.fechaActual,
            titulo: "Caso de dopaje en " + club.nombre,
            descripcion: "Un jugador de " + club.nombre + " dio positivo. La AFA tiene que decidir si lo suspende preventivamente o espera la contraprueba.",
            categoria: "institucional",
            opciones: [
                opD("Suspenderlo ya", "+4 prestigio · -2 apoyo", efecto(-2, 4, 0)),
                opD("Esperar la contraprueba", "-2 prestigio", efecto(0, -2, 0)),
                opD("Mano dura con el club", "-$200M · +3 prestigio · -4 apoyo", efecto(-4, 3, -200))
            ]
        };
    });

plantilla("promedios_descenso", "institucional", 3,
    function() { return true; },
    function() {
        return {
            id: "promedios_" + estadoLigas.fechaActual,
            titulo: "¿Descensos por tabla o por promedios?",
            descripcion: "Hay dos clubes con promedio bajo que salvarían la categoría si se mantiene el sistema de promedios. Los que están últimos en la tabla piden que se cambie ya.",
            categoria: "institucional",
            opciones: [
                opD("Mantener los promedios", "+6 apoyo de los grandes · -5 de los chicos", efecto(1, 1, 0)),
                opD("Descensos por tabla", "-4 apoyo · +3 prestigio", efecto(-4, 3, 0)),
                opD("Suspender los descensos este año", "+8 apoyo · -6 prestigio", efecto(8, -6, 0, function() { agregarNoticia("Olé", "No hay descensos este año", "La AFA suspendió las caídas por una temporada.", "escandalo"); }))
            ]
        };
    });

plantilla("formato_copa", "deportiva", 1,
    function() { return true; },
    function() {
        return {
            id: "formato_" + estadoLigas.fechaActual,
            titulo: "Cambiar el formato de la Copa Argentina",
            descripcion: "Los clubes del Interior piden jugar la Copa Argentina a doble partido para recaudar en su cancha. Los grandes quieren todo en cancha neutral.",
            categoria: "deportiva",
            opciones: [
                opD("Ida y vuelta", "+6 apoyo · -$300M", efecto(6, 0, -300)),
                opD("Todo en cancha neutral", "+$400M · -5 apoyo", efecto(-5, 0, 400)),
                opD("Solo la final en neutral", "+2 apoyo", efecto(2, 0, 0))
            ]
        };
    });

plantilla("cupo_libertadores", "deportiva", 2,
    function() { return true; },
    function() {
        return {
            id: "libertadores_" + estadoLigas.fechaActual,
            titulo: "Más cupos para la Libertadores",
            descripcion: "La Conmebol ofrece un cupo extra para el fútbol argentino, pero exige jugar una ronda previa en enero.",
            categoria: "deportiva",
            opciones: [
                opD("Aceptar el cupo", "+3 prestigio · -2 apoyo", efecto(-2, 3, 0)),
                opD("Rechazarlo", "+3 apoyo", efecto(3, 0, 0)),
                opD("Aceptar y pedir otro para la Sudamericana", "+2 prestigio · +2 apoyo", efecto(2, 2, 0))
            ]
        };
    });

// -----------------------------
// INSTITUCIONALES
// -----------------------------

plantilla("femenino_fondo", "institucional", 2,
    function() { return true; },
    function() {
        const monto = entre(4, 12) * 100;
        return {
            id: "femenino_" + estadoLigas.fechaActual,
            titulo: "Profesionalizar el fútbol femenino",
            descripcion: "Las jugadoras piden contratos dignos y una liga profesional. El costo estimado es " + fmt.plata(monto) + " por año.",
            categoria: "institucional",
            opciones: [
                opD("Profesionalizar ya", "-" + fmt.plata(monto) + " · +5 prestigio · +3 apoyo", efecto(3, 5, -monto)),
                opD("Plan gradual", "-" + fmt.plata(monto / 2) + " · +2 prestigio", efecto(1, 2, -monto / 2)),
                opD("Seguir como está", "-4 prestigio", efecto(0, -4, 0))
            ]
        };
    });

plantilla("barra_incidente", "institucional", 2,
    function() { return true; },
    function() {
        const idClub = elegir(clubesPrimera());
        const club = EQUIPOS[idClub];
        return {
            id: "barra_" + idClub + "_" + estadoLigas.fechaActual,
            titulo: "Incidentes de la barra de " + club.nombre,
            descripcion: "La barra de " + club.nombre + " se enfrentó con la policía y hay 15 heridos. La presión para actuar es enorme.",
            categoria: "institucional",
            opciones: [
                opD("Cerrar la cancha 4 fechas", "+6 prestigio · -5 apoyo", efecto(-5, 6, 0)),
                opD("Multa y protocolo", "+2 prestigio · -$200M", efecto(0, 2, -200)),
                opD("Minimizar", "-5 prestigio · -3 apoyo", efecto(-3, -5, 0))
            ]
        };
    });

plantilla("pedido_dirigente", "institucional", 2,
    function() { return typeof estadoDirigentes !== "undefined" && estadoDirigentes.lista.length > 0; },
    function() {
        const d = elegir(estadoDirigentes.lista);
        return {
            id: "pedido_" + d.id + "_" + estadoLigas.fechaActual,
            titulo: d.nombre + " quiere una reunión",
            descripcion: d.nombre + " (" + d.club + ") pide una audiencia. Quiere que la AFA le financie un refuerzo para pelear el torneo.",
            categoria: "institucional",
            opciones: [
                opD("Darle el dinero", "-$400M · +10 lealtad", efecto(0, 0, -400, function() { ajustarLealtadDirigente(d.id, 10, "Financiación"); })),
                opD("Ayudarlo con un sponsor", "-$150M · +5 lealtad", efecto(0, 0, -150, function() { ajustarLealtadDirigente(d.id, 5, "Sponsor"); })),
                opD("Decirle que no", "-8 lealtad · +1 apoyo", efecto(1, 0, 0, function() { ajustarLealtadDirigente(d.id, -8, "Rechazo"); }))
            ]
        };
    });

plantilla("cantera_club", "deportiva", 2,
    function() { return true; },
    function() {
        const idClub = elegir(clubesChicos());
        const club = EQUIPOS[idClub];
        return {
            id: "cantera_" + idClub + "_" + estadoLigas.fechaActual,
            titulo: "La cantera de " + club.nombre,
            descripcion: club.nombre + " tiene tres pibes de 17 años que la rompen en la reserva. Los grandes ya preguntaron por ellos.",
            categoria: "deportiva",
            opciones: [
                opD("Becarlos en la AFA", "-$300M · +3 prestigio", efecto(0, 3, -300, function() {
                    club.fuerza = Math.min(100, club.fuerza + 2);
                    if (typeof registrarFavor === "function") registrarFavor(idClub, "institucional", 3, "Becas para la cantera");
                })),
                opD("Dejar que se vayan", "+$200M · -3 apoyo", efecto(-3, 0, 200, function() {
                    if (typeof registrarFavor === "function") registrarFavor(idClub, "mercado", -3, "Se fueron los pibes de la cantera");
                })),
                opD("Obligar a que debuten en Primera", "+4 apoyo · +1 prestigio", efecto(4, 1, 0, function() {
                    if (typeof registrarFavor === "function") registrarFavor(idClub, "institucional", 2, "La AFA los hizo debutar");
                }))
            ]
        };
    });

plantilla("derechos_formacion", "institucional", 2,
    function() { return true; },
    function() {
        const idClub = elegir(clubesChicos());
        const club = EQUIPOS[idClub];
        return {
            id: "formacion_" + idClub + "_" + estadoLigas.fechaActual,
            titulo: "Derechos de formación de " + club.nombre,
            descripcion: "Un club europeo se llevó a un juvenil de " + club.nombre + " y no pagó los derechos de formación. La AFA puede intervenir.",
            categoria: "institucional",
            opciones: [
                opD("Reclamar ante la FIFA", "-$150M · +3 prestigio", efecto(0, 3, -150)),
                opD("Negociar un acuerdo", "+$300M · -2 prestigio", efecto(0, -2, 300)),
                opD("Dejarlo pasar", "-3 apoyo", efecto(-3, 0, 0))
            ]
        };
    });

// -----------------------------
// MERCADO
// -----------------------------

plantilla("venta_figura", "economica", 3,
    function() { return figuraAlAzar() !== null; },
    function() {
        const f = figuraAlAzar();
        const club = EQUIPOS[f.clubId];
        const oferta = Math.round((f.valor * (0.8 + Math.random() * 0.6)) / 50) * 50;
        return {
            id: "venta_" + f.id + "_" + estadoLigas.fechaActual,
            titulo: "Oferta por " + f.nombre,
            descripcion: "Un club europeo ofrece " + fmt.plata(oferta) + " por " + f.nombre + " (" + club.nombre + "). El jugador quiere irse.",
            categoria: "economica",
            opciones: [
                opD("Aprobar la venta", "+" + fmt.plata(Math.round(oferta * 0.08)) + " para la AFA", efecto(0, 0, oferta * 0.08, function() {
                    f.vendido = true;
                    club.fuerza = Math.max(35, club.fuerza - 4);
                    ajustarApoyo(-2, "Venta de " + f.nombre);
                })),
                opD("Retenerlo", "+4 apoyo · -2 prestigio", efecto(4, -2, 0)),
                opD("Renegociar", "55% de +25%", efecto(0, 0, 0, function() {
                    if (probabilidad(0.55)) {
                        const nueva = Math.round(oferta * 1.25);
                        ajustarDinero(nueva * 0.08, "Venta de " + f.nombre);
                        f.vendido = true;
                        club.fuerza = Math.max(35, club.fuerza - 4);
                    } else {
                        ajustarPrestigio(-2, "Negociación fallida");
                    }
                }))
            ]
        };
    });

plantilla("prestamo_jugador", "economica", 1,
    function() { return figuraAlAzar() !== null; },
    function() {
        const f = figuraAlAzar();
        const club = EQUIPOS[f.clubId];
        return {
            id: "prestamo_" + f.id + "_" + estadoLigas.fechaActual,
            titulo: "Préstamo para " + f.nombre,
            descripcion: "Un club de Brasil quiere a " + f.nombre + " a préstamo por seis meses. " + club.nombre + " no sabe qué hacer.",
            categoria: "economica",
            opciones: [
                opD("Autorizar el préstamo", "+$250M · -2 apoyo", efecto(-2, 0, 250)),
                opD("Negociar una opción de compra", "+$400M · -3 apoyo", efecto(-3, 0, 400)),
                opD("Rechazarlo", "+2 apoyo", efecto(2, 0, 0))
            ]
        };
    });

// -----------------------------
// MOTOR
// -----------------------------

function plantillasDisponibles() {
    return PLANTILLAS.filter(function(p) {
        try { return !p.requiere || p.requiere(); } catch (e) { return false; }
    });
}

function elegirPlantilla(usadasPartida) {
    const perfil = leerPerfil();
    const disponibles = plantillasDisponibles().filter(function(p) {
        return usadasPartida.indexOf(p.id) === -1;
    });
    if (!disponibles.length) return null;

    let total = 0;
    const pesos = disponibles.map(function(p) {
        const usoGlobal = perfil.plantillas[p.id] || 0;
        const w = (p.peso || 1) / (1 + usoGlobal * 0.7);
        total += w;
        return w;
    });

    let r = Math.random() * total;
    for (let i = 0; i < disponibles.length; i++) {
        r -= pesos[i];
        if (r <= 0) return disponibles[i];
    }
    return disponibles[disponibles.length - 1];
}

function decisionProcedural(idsUsados) {
    const usadas = (presidente.plantillasUsadas || (presidente.plantillasUsadas = []));
    for (let intento = 0; intento < 6; intento++) {
        const p = elegirPlantilla(usadas);
        if (!p) return null;
        let d = null;
        try { d = p.construir(); } catch (e) { console.warn("Plantilla falló", p.id, e); continue; }
        if (!d) continue;
        if (idsUsados.indexOf(d.id) !== -1) continue;

        usadas.push(p.id);
        if (usadas.length > 60) usadas.shift();
        d.plantilla = p.id;
        d.procedural = true;
        registrarPlantillaUsada(p.id);
        return d;
    }
    return null;
}

function reiniciarPlantillasPartida() {
    presidente.plantillasUsadas = [];
    const perfil = leerPerfil();
    perfil.partidas = (perfil.partidas || 0) + 1;
    guardarPerfil(perfil);
}
