// ============================================
// NOTICIAS: sistema de prensa deportiva argentina
// ============================================

// -----------------------------
// MEDIOS Y PERIODISTAS
// -----------------------------

const MEDIOS = [
    { nombre: "Olé", tipo: "diario" },
    { nombre: "Azz", tipo: "diario" },
    { nombre: "TyC Sports", tipo: "tv" },
    { nombre: "ESPN Argentina", tipo: "tv" },
    { nombre: "Infobae Deportes", tipo: "portal" },
    { nombre: "La Nación Deportiva", tipo: "diario" },
    { nombre: "Clarín Deportivo", tipo: "diario" },
    { nombre: "DSports", tipo: "tv" },
    { nombre: "Fox Sports Argentina", tipo: "tv" },
    { nombre: "Pablo Giralt", tipo: "periodista" }
];

// -----------------------------
// PERSONALIDADES
// -----------------------------

const PERSONALIDADES = {
    carrozza: {
        nombre: "Carrozza",
        icono: "🔍",
        color: "#fbbf24",
        estilo: "analítico y conspirativo"
    },
    bambino: {
        nombre: "Bambino Pons",
        icono: "🎸",
        color: "#a78bfa",
        estilo: "festivo e irónico"
    },
    liberman: {
        nombre: "Liberman",
        icono: "🔥",
        color: "#ef4444",
        estilo: "frontal y polémico"
    }
};

// -----------------------------
// PONDERACIÓN POR TIPO DE NOTICIA
// -----------------------------

const PONDERACION_POR_TIPO = {
    critica:   { carrozza: 40, liberman: 60, bambino: 10, otros: 30 },
    escandalo: { carrozza: 60, liberman: 50, bambino: 5,  otros: 30 },
    elogio:    { carrozza: 10, liberman: 5,  bambino: 70, otros: 30 },
    rumor:     { carrozza: 40, liberman: 30, bambino: 20, otros: 40 },
    ironica:   { carrozza: 20, liberman: 10, bambino: 60, otros: 20 },
    "":        { carrozza: 30, liberman: 30, bambino: 30, otros: 40 }
};

// -----------------------------
// HISTORIAL DE NOTICIAS
// -----------------------------

const noticiasHistoricas = [];

// -----------------------------
// GENERADOR PRINCIPAL
// -----------------------------

function agregarNoticia(medio, titulo, cuerpo, tipo) {
    // Evitar duplicados consecutivos idénticos
    const ultima = noticiasHistoricas[noticiasHistoricas.length - 1];
    if (ultima && ultima.titulo === titulo && ultima.cuerpo === cuerpo) {
        return;
    }

    noticiasHistoricas.push({
        medio: medio,
        titulo: titulo,
        cuerpo: cuerpo,
        tipo: tipo || "",
        fecha: "Año " + presidente.anioMandato + " · Fecha " + estadoLigas.fechaActual
    });

    if (typeof renderizarNoticias === "function") {
        renderizarNoticias();
    }
}

// -----------------------------
// ELECCIÓN DEL MEDIO (ponderada por tipo)
// -----------------------------

function medioAlAzar(tipo) {
    const tipoActual = tipo || "";
    const pesos = PONDERACION_POR_TIPO[tipoActual] || PONDERACION_POR_TIPO[""];

    const candidatos = [
        { nombre: PERSONALIDADES.carrozza.icono + " " + PERSONALIDADES.carrozza.nombre, peso: pesos.carrozza },
        { nombre: PERSONALIDADES.bambino.icono + " " + PERSONALIDADES.bambino.nombre, peso: pesos.bambino },
        { nombre: PERSONALIDADES.liberman.icono + " " + PERSONALIDADES.liberman.nombre, peso: pesos.liberman }
    ];

    MEDIOS.forEach(function(m) {
        candidatos.push({ nombre: m.nombre, peso: pesos.otros / MEDIOS.length });
    });

    const totalPeso = candidatos.reduce(function(sum, c) { return sum + c.peso; }, 0);
    let random = Math.random() * totalPeso;

    for (let i = 0; i < candidatos.length; i++) {
        random -= candidatos[i].peso;
        if (random <= 0) return candidatos[i].nombre;
    }

    return candidatos[candidatos.length - 1].nombre;
}

function medioPorTipo(tipo) {
    const filtrados = MEDIOS.filter(function(m) { return m.tipo === tipo; });
    if (filtrados.length === 0) return medioAlAzar();
    return filtrados[Math.floor(Math.random() * filtrados.length)].nombre;
}

// -----------------------------
// NOTICIAS DE INICIO
// -----------------------------

function noticiasDeBienvenida() {
    agregarNoticia(
        "Olé",
        "Nuevo presidente de la AFA asume en medio de una crisis",
        "Tras la salida de Messi y la no continuidad de Scaloni, el fútbol argentino busca un rumbo. El nuevo presidente promete 'ordenar la casa'.",
        "rumor"
    );

    agregarNoticia(
        "🔥 Liberman",
        "La era post-Messi genera expectativa y dudas",
        "Los hinchas se ilusionan con un recambio, pero los clubes del Interior reclaman por el reparto de dinero. ¿Está preparado el nuevo presidente?",
        "critica"
    );

    agregarNoticia(
        "🎸 Bambino Pons",
        "¿Quién será el nuevo DT de la Selección?",
        "Los nombres que suenan: Aimar, Samuel, Simeone, Gallardo, Mascherano, Mohamed y Pekerman. ¡Qué lindo momento para el fútbol argentino, señores!",
        "rumor"
    );
}

// -----------------------------
// NOTICIAS POR DECISIÓN
// -----------------------------

function noticiaDeDecision(decision, eleccion) {
    let titulo = "";
    let cuerpo = "";
    let tipo = "rumor";

    if (decision.indexOf("Capital privado") !== -1) {
        if (eleccion.indexOf("Permitir") !== -1) {
            titulo = "¡Bomba! La AFA permite capital privado en los clubes";
            cuerpo = "Los clubes del Interior estallaron. Las SAD avanzan en el fútbol argentino. La oposición pide explicaciones.";
            tipo = "escandalo";
        } else if (eleccion.indexOf("Prohibir") !== -1) {
            titulo = "SAD rechazadas: los clubes celebran la decisión";
            cuerpo = "El presidente de la AFA frenó la entrada de capitales privados. Los socios respiran tranquilos.";
            tipo = "elogio";
        } else {
            titulo = "Comisión para estudiar las SAD: decisión salomónica";
            cuerpo = "Una comisión analizará el tema. Nadie quedó conforme, pero tampoco nadie rompió relaciones.";
            tipo = "rumor";
        }
    } else if (decision.indexOf("Calendario") !== -1) {
        if (eleccion.indexOf("Pausar") !== -1) {
            titulo = "La AFA frena la liga en fechas FIFA";
            cuerpo = "Los clubes celebran poder contar con sus convocados. Los televisores, enojados por el bache.";
            tipo = "elogio";
        } else {
            titulo = "La liga no se detiene: polémica con los convocados";
            cuerpo = "Los clubes reclaman por perder jugadores en partidos clave. La AFA prioriza la taquilla.";
            tipo = "critica";
        }
    } else if (decision.indexOf("televisión") !== -1) {
        if (eleccion.indexOf("Aceptar") !== -1) {
            titulo = "La AFA acepta la rebaja de la TV";
            cuerpo = "El contrato se renueva con menos dinero. Los clubes chicos, preocupados.";
            tipo = "critica";
        } else {
            titulo = "Negociación televisiva: la AFA se la juega";
            cuerpo = "Rechazaron la oferta y negocian con otra empresa. La decisión puede salir bien o muy mal.";
            tipo = "rumor";
        }
    } else if (decision.indexOf("Ascenso") !== -1) {
        if (eleccion.indexOf("Igualar") !== -1) {
            titulo = "Reparto igualitario en el Ascenso: decisión histórica";
            cuerpo = "Los clubes del Interior celebran. Los de Buenos Aires, resignados.";
            tipo = "elogio";
        } else {
            titulo = "Polémica: el Ascenso sigue con reparto desigual";
            cuerpo = "Los clubes del Interior amenazan con medidas de fuerza. La AFA mantiene la diferencia.";
            tipo = "critica";
        }
    } else if (decision.indexOf("Sanción") !== -1) {
        if (eleccion.indexOf("dureza") !== -1) {
            titulo = "Sanción ejemplar tras los incidentes en la Supercopa";
            cuerpo = "Un año sin cancha para el presidente del club. La AFA marca la cancha.";
            tipo = "elogio";
        } else {
            titulo = "Multa simbólica: la AFA deja pasar los incidentes";
            cuerpo = "La prensa habla de 'mano blanda'. Los clubes chicos, indignados.";
            tipo = "critica";
        }
    } else if (decision.indexOf("Cupo de extranjeros") !== -1) {
        if (eleccion.indexOf("Aumentar") !== -1) {
            titulo = "La AFA amplía el cupo de extranjeros";
            cuerpo = "Los grandes celebran. Los chicos advierten que se profundizará la desigualdad.";
            tipo = "rumor";
        } else if (eleccion.indexOf("Reducir") !== -1) {
            titulo = "Apuesta al talento nacional: cupo reducido";
            cuerpo = "Los clubes chicos respiran. Los grandes, preocupados por perder calidad.";
            tipo = "elogio";
        } else {
            titulo = "El cupo de extranjeros queda igual";
            cuerpo = "Nadie conforme, pero nadie rompió relaciones.";
            tipo = "rumor";
        }
    } else if (decision.indexOf("descensos") !== -1) {
        if (eleccion.indexOf("Suspender") !== -1) {
            titulo = "¡No hay descensos! La AFA suspende las caídas";
            cuerpo = "Los clubes chicos celebran. Los que peleaban arriba, indignados por perder el incentivo.";
            tipo = "escandalo";
        } else {
            titulo = "Se mantienen los descensos";
            cuerpo = "La AFA apuesta al fair play. Los clubes chicos, en alerta.";
            tipo = "critica";
        }
    } else if (decision.indexOf("femenino") !== -1) {
        if (eleccion.indexOf("Profesionalizar") !== -1) {
            titulo = "La AFA profesionaliza el fútbol femenino";
            cuerpo = "Un paso histórico. Las jugadoras celebran, los clubes se quejan por el costo.";
            tipo = "elogio";
        } else {
            titulo = "El fútbol femenino sigue en la nebulosa";
            cuerpo = "La AFA no dio el paso. Colectivos feministas reclaman.";
            tipo = "critica";
        }
    } else if (decision.indexOf("visitantes") !== -1) {
        if (eleccion.indexOf("Permitir") !== -1) {
            titulo = "Vuelve el público visitante: fiesta en las canchas";
            cuerpo = "Los hinchas celebran. La policía, alerta.";
            tipo = "elogio";
        } else {
            titulo = "Sigue la prohibición al público visitante";
            cuerpo = "Los hinchas protestan. La seguridad respira.";
            tipo = "critica";
        }
    } else if (decision.indexOf("corrupción") !== -1 || decision.indexOf("corrupcion") !== -1) {
        if (eleccion.indexOf("Investigar") !== -1) {
            titulo = "La AFA investiga la corrupción interna";
            cuerpo = "Comisión especial. La oposición pide auditoría externa.";
            tipo = "elogio";
        } else {
            titulo = "Silencio oficial ante las denuncias de corrupción";
            cuerpo = "La prensa huele encubrimiento. La oposición pide explicaciones.";
            tipo = "escandalo";
        }
    } else if (decision.indexOf("Sueldos mínimos") !== -1) {
        if (eleccion.indexOf("alto") !== -1) {
            titulo = "Sueldos mínimos altos: los jugadores respiran";
            cuerpo = "Los clubes chicos se quejan. La AFA pone plata.";
            tipo = "elogio";
        } else {
            titulo = "Sueldos mínimos bajos: tensión con los jugadores";
            cuerpo = "Los gremios amenazan con medidas de fuerza.";
            tipo = "critica";
        }
    } else if (decision.indexOf("Límite salarial") !== -1) {
        if (eleccion.indexOf("general") !== -1) {
            titulo = "La AFA implementa un tope salarial";
            cuerpo = "Los clubes chicos aplauden. Los grandes amenazan con resistir.";
            tipo = "elogio";
        } else {
            titulo = "Sin tope salarial: los grandes sacan ventaja";
            cuerpo = "Los clubes chicos denuncian desigualdad.";
            tipo = "critica";
        }
    } else {
        titulo = decision + ": la decisión que tomó la AFA";
        cuerpo = "El presidente resolvió: " + eleccion + ". Los clubes tomaron nota y la prensa ya empezó a opinar.";
        tipo = "rumor";
    }

    const medio = medioAlAzar(tipo);
    agregarNoticia(medio, titulo, cuerpo, tipo);
}

// -----------------------------
// NOTICIAS POR RESCATE
// -----------------------------

function noticiaDeRescate(equipo, costo, cantidadRescates) {
    let titulo = "";
    let cuerpo = "";
    let tipo = "rumor";

    if (cantidadRescates === 1) {
        titulo = "La AFA rescata a " + equipo + " con $" + costo + "M";
        cuerpo = "El club respira. Los demás toman nota: ¿será el primero de muchos?";
        tipo = "rumor";
    } else if (cantidadRescates === 2) {
        titulo = "Otra vez: la AFA vuelve a rescatar a " + equipo;
        cuerpo = "La prensa habla de 'favoritismo'. El presidente ya fue marcado como padrino del club.";
        tipo = "critica";
    } else {
        titulo = "¡Escándalo! " + equipo + " rescatado " + cantidadRescates + " veces por la AFA";
        cuerpo = "Los clubes estallan. Se habla de un 'club amigo' del poder. La oposición pide auditoría.";
        tipo = "escandalo";
    }

    const medio = medioAlAzar(tipo);
    agregarNoticia(medio, titulo, cuerpo, tipo);
}

// -----------------------------
// NOTICIAS POR INCIDENCIA ARBITRAL
// -----------------------------

function noticiaDeIncidencia(incidencia, partido) {
    const titulo = "¡Bomba en el clásico! " + incidencia.descripcion;
    const cuerpo = "El partido " + partido.local + " vs " + partido.visitante + " terminó envuelto en polémica. La AFA deberá tomar cartas en el asunto.";
    const medio = medioAlAzar("escandalo");
    agregarNoticia(medio, titulo, cuerpo, "escandalo");
}

// -----------------------------
// NOTICIAS POR FIN DE TEMPORADA
// -----------------------------

function noticiasDeFinDeTemporada(campeonPrimera, campeonNacional, campeonFederalA) {
    agregarNoticia(
        medioAlAzar("elogio"),
        "¡" + campeonPrimera + " campeón de la Liga Profesional!",
        "El equipo dio la vuelta olímpica en un torneo apasionante. Los hinchas festejan en las calles.",
        "elogio"
    );

    agregarNoticia(
        medioAlAzar("rumor"),
        "Así quedó el fútbol argentino tras la temporada",
        "Campeones: " + campeonPrimera + " (Primera), " + campeonNacional + " (Nacional), " + campeonFederalA + " (Federal A). Se viene el mercado de pases.",
        "rumor"
    );

    if (presidente.apoyoClubes < 40) {
        agregarNoticia(
            "🔥 Liberman",
            "Los clubes, en pie de guerra contra el presidente",
            "El apoyo al mandatario cayó al " + presidente.apoyoClubes + "%. Se habla de una posible moción de censura. Esto no da para más.",
            "critica"
        );
    } else if (presidente.apoyoClubes >= 70) {
        agregarNoticia(
            "🎸 Bambino Pons",
            "La AFA navega en aguas tranquilas",
            "Con " + presidente.apoyoClubes + "% de apoyo, el presidente consolidó su gestión entre los clubes. ¡Qué grande, señores!",
            "elogio"
        );
    }
}

// -----------------------------
// NOTICIAS POR COPA AMÉRICA
// -----------------------------

function noticiaDeCopa(posicion) {
    let titulo = "";
    let cuerpo = "";
    let tipo = "rumor";

    if (posicion === "campeon") {
        titulo = "¡Argentina campeón de la Copa América!";
        cuerpo = "La Selección dio la vuelta en un torneo inolvidable. El DT " + presidente.seleccionador + " se consagra.";
        tipo = "elogio";
    } else if (posicion === "subcampeon") {
        titulo = "Argentina subcampeón de la Copa América";
        cuerpo = "Se quedó en la puerta. El equipo mostró cosas buenas pero le faltó el gol final.";
        tipo = "rumor";
    } else if (posicion === "semifinales") {
        titulo = "Argentina cayó en semifinales";
        cuerpo = "Una Copa América amarga. El equipo no encontró su mejor versión.";
        tipo = "critica";
    } else if (posicion === "cuartos") {
        titulo = "Argentina eliminada en cuartos de la Copa América";
        cuerpo = "Decepción total. Los hinchas piden explicaciones al cuerpo técnico.";
        tipo = "critica";
    } else {
        titulo = "¡Papelón! Argentina eliminada en fase de grupos";
        cuerpo = "Histórico fracaso. La prensa pide la renuncia del DT y cuestiona a la AFA.";
        tipo = "escandalo";
    }

    const medio = medioAlAzar(tipo);
    agregarNoticia(medio, titulo, cuerpo, tipo);
}

// -----------------------------
// NOTICIA POR VAR
// -----------------------------

function noticiaDeVAR(activado) {
    if (activado) {
        agregarNoticia(
            "TyC Sports",
            "La AFA activa el VAR en el fútbol argentino",
            "La implementación costará millones, pero promete reducir los errores arbitrales. Los clubes chicos respiran.",
            "elogio"
        );
    } else {
        agregarNoticia(
            "🔍 Carrozza",
            "La AFA rechaza el VAR: polémica en el fútbol argentino",
            "Los árbitros seguirán decidiendo sin asistencia tecnológica. ¿Por qué la AFA no quiere el VAR? Acá hay algo raro.",
            "critica"
        );
    }
}

// -----------------------------
// NOTICIA POR SPONSOR
// -----------------------------

function noticiaDeSponsor(sponsor) {
    if (sponsor.popularidad === "polemico") {
        agregarNoticia(
            medioAlAzar("critica"),
            "Polémica por el nuevo sponsor de la AFA: " + sponsor.nombre,
            "La marca genera rechazo en algunos sectores. El contrato, sin embargo, es muy jugoso para la AFA.",
            "critica"
        );
    } else if (sponsor.popularidad === "popular") {
        agregarNoticia(
            medioAlAzar("elogio"),
            "La AFA firma con " + sponsor.nombre + ": aplausos en el ambiente",
            "La marca es querida por los hinchas y los clubes. Buen acuerdo para todos.",
            "elogio"
        );
    }
}

// -----------------------------
// NOTICIA POR ELECCIÓN DE DT
// -----------------------------

function noticiaDeEleccionDT(candidato) {
    agregarNoticia(
        "Olé",
        candidato.nombre + " es el nuevo DT de la Selección Argentina",
        "El elegido por el presidente para liderar la era post-Messi. Perfil: " + candidato.perfil + ".",
        "rumor"
    );

    if (candidato.perfil.indexOf("Continuidad") !== -1) {
        agregarNoticia(
            "TyC Sports",
            "Apuesta a la continuidad: " + candidato.nombre + " al mando",
            "Conoce el vestuario y el sistema. La apuesta es no romper lo que funcionó.",
            "elogio"
        );
    } else if (candidato.perfil.indexOf("Autoridad") !== -1 || candidato.perfil.indexOf("mundial") !== -1) {
        agregarNoticia(
            "🔥 Liberman",
            "Bomba: " + candidato.nombre + " dirige a la Selección",
            "Su llegada genera expectativa, pero también dudas por su estilo y su costo. Veremos si está a la altura.",
            "rumor"
        );
    } else if (candidato.perfil.indexOf("Nueva") !== -1 || candidato.perfil.indexOf("generación") !== -1) {
        agregarNoticia(
            "🎸 Bambino Pons",
            "Apuesta al recambio: " + candidato.nombre + " al frente de la Selección",
            "Conoce a los juveniles y tiene contacto con Messi. ¡Esto puede ser una canción de rock!",
            "rumor"
        );
    } else {
        agregarNoticia(
            medioAlAzar("rumor"),
            candidato.nombre + " dirigirá a la Selección Argentina",
            "Un nombre con experiencia. La apuesta es orden y resultados.",
            "rumor"
        );
    }
}
// ============================================
// NOTICIAS v3: TV y préstamos
// ============================================

function noticiaDeTV(montoAnual) {
    agregarNoticia(
        medioAlAzar("rumor"),
        "Nuevo contrato de TV: la AFA cobrará " + fmt.plata(montoAnual) + " por año",
        "La renegociación de los derechos audiovisuales marca el rumbo económico de la gestión.",
        "rumor"
    );
}

function noticiaDePrestamo(monto) {
    agregarNoticia(
        "La Nación Deportiva",
        "La AFA toma un préstamo de " + fmt.plata(monto),
        "El consejo aprobó el crédito para cubrir gastos corrientes. La oposición pide explicaciones.",
        "critica"
    );
}
