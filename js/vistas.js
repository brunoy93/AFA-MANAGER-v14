// ============================================
// VISTAS: pantallas del juego (parte 1)
// ============================================

// -----------------------------
// HELPERS DE RENDER
// -----------------------------

function vCabecera(titulo, sub, accionesHTML) {
    return "<div class='pantalla-cab'>" +
        "<div>" +
        "<h2>" + titulo + "</h2>" +
        (sub ? "<p class='pantalla-sub'>" + sub + "</p>" : "") +
        "</div>" +
        (accionesHTML ? "<div class='pantalla-acciones'>" + accionesHTML + "</div>" : "") +
        "</div>";
}

function textoFecha() {
    const anio = "Año " + presidente.anioMandato + " de " + presidente.anioMaximo;
    if (estadoLigas.fechaActual >= estadoLigas.totalFechas) return anio + " · Temporada terminada";
    return anio + " · Fecha " + (estadoLigas.fechaActual + 1) + " de " + estadoLigas.totalFechas;
}

function vPanel(titulo, iconoNombre, cuerpo, opciones) {
    const opt = opciones || {};
    return "<section class='panel " + (opt.clase || "") + "'>" +
        (titulo ? "<header class='panel-cab'><h3>" + (iconoNombre ? icono(iconoNombre, "", 15) : "") + titulo + "</h3>" +
            (opt.meta ? "<span class='panel-meta'>" + opt.meta + "</span>" : "") + "</header>" : "") +
        "<div class='panel-cuerpo " + (opt.ajustado ? "ajustado" : "") + "'>" + cuerpo + "</div>" +
        (opt.pie ? "<div class='panel-pie'>" + opt.pie + "</div>" : "") +
        "</section>";
}

function vStat(etiqueta, valor, sub, extra) {
    return "<div class='stat'>" +
        "<span class='stat-label'>" + etiqueta + "</span>" +
        "<span class='stat-valor'>" + valor + "</span>" +
        (sub ? "<span class='stat-sub'>" + sub + "</span>" : "") +
        (extra ? "<div class='stat-extra'>" + extra + "</div>" : "") +
        "</div>";
}

function vMetrica(etiqueta, valor, clase) {
    return "<div class='metrica-fila'><span>" + etiqueta + "</span><strong class='" + (clase || "") + "'>" + valor + "</strong></div>";
}

function vProgreso(valor, textoIzq, textoDer, tono) {
    const pct = Math.round(limitar(valor, 0, 1) * 100);
    return "<div class='progreso-fila'><span>" + textoIzq + "</span><span class='tenue'>" + (textoDer || pct + "%") + "</span></div>" +
        "<div class='progreso " + (tono || "") + "'><span style='width:" + pct + "%'></span></div>";
}

function vVacio(iconoNombre, titulo, texto) {
    return "<div class='vacio'>" + icono(iconoNombre, "", 30) +
        "<strong>" + titulo + "</strong>" + (texto ? "<p>" + texto + "</p>" : "") + "</div>";
}

function vAviso(tono, iconoNombre, titulo, texto) {
    return "<div class='aviso " + tono + "'>" + icono(iconoNombre, "", 18) +
        "<div><div class='aviso-titulo'>" + titulo + "</div>" +
        (texto ? "<div class='aviso-texto'>" + texto + "</div>" : "") + "</div></div>";
}

function vChipEstado(conf) {
    const est = estadoConfianza(conf);
    return "<span class='chip' style='color:" + est.color + ";border-color:" + est.color + "55;background:" + est.color + "14'>" +
        icono("consejo", "", 13) + est.etiqueta + "</span>";
}

// -----------------------------
// ESCRITORIO
// -----------------------------

function mensajeHero() {
    const fecha = estadoLigas.fechaActual;
    const total = estadoLigas.totalFechas;
    const proyeccion = calcularAsamblea();

    if (fecha === 0) {
        return {
            etiqueta: "Temporada " + presidente.anioMandato,
            titulo: "La pelota empieza a rodar",
            texto: "Elegiste a " + (presidente.seleccionador || "tu DT") + ". Ahora hay que jugar, administrar y sostener el apoyo de los clubes."
        };
    }
    if (estadoLigas.fechaActual >= total) {
        return {
            etiqueta: "Temporada terminada",
            titulo: "Hora del balance",
            texto: "Se jugó todo. El consejo evalúa los objetivos y la asamblea define si seguís."
        };
    }
    if (calcularAsamblea().proyeccion < 0.5) {
        return {
            etiqueta: "Alerta electoral",
            titulo: "La asamblea está en duda",
            texto: "La proyección de voto está en " + Math.round(proyeccion.proyeccion * 100) + "%. Necesitás " +
                Math.round(proyeccion.umbral * 100) + "%. Es momento de hacer política."
        };
    }
    if (presidente.dineroEnCaja < 2500) {
        return {
            etiqueta: "Alerta económica",
            titulo: "La caja no da para más",
            texto: "Quedan " + fmt.plata(presidente.dineroEnCaja) + ". Podés pedir un préstamo o recortar gastos."
        };
    }
    return {
        etiqueta: "Fecha " + (fecha + 1) + " de " + total,
        titulo: "Seguí jugando el partido",
        texto: "Hay " + (total - fecha) + " fechas por delante. Cada decisión mueve el apoyo, el prestigio y la caja."
    };
}

function proximosPartidos(cantidad) {
    const calendario = estadoLigas.calendarios.primera;
    if (!calendario) return [];
    const fecha = calendario[estadoLigas.fechaActual];
    if (!fecha) return [];
    return fecha.map(function(p) {
        const local = EQUIPOS[p.local];
        const visitante = EQUIPOS[p.visitante];
        return {
            local: local,
            visitante: visitante,
            peso: Math.max(local.pesoHistorico, visitante.pesoHistorico) + (esClasico(p.local, p.visitante) ? 30 : 0),
            clasico: esClasico(p.local, p.visitante)
        };
    }).sort(function(a, b) { return b.peso - a.peso; }).slice(0, cantidad);
}

function panelProximaFecha() {
    const partidos = proximosPartidos(4);
    if (!partidos.length) return "";

    const filas = partidos.map(function(p) {
        return "<div class='resultado'>" +
            "<div class='resultado-eq local'><span>" + escapar(p.local.nombre) + "</span>" + htmlEscudo(p.local.id, p.local.nombre, 22) + "</div>" +
            "<div class='resultado-marca'>vs</div>" +
            "<div class='resultado-eq'><span>" + escapar(p.visitante.nombre) + (p.clasico ? " <span class='tag oro'>clásico</span>" : "") + "</span>" + htmlEscudo(p.visitante.id, p.visitante.nombre, 22) + "</div>" +
            "</div>";
    }).join("");

    return vPanel("Próxima fecha", "calendario", filas, {
        meta: "Fecha " + (estadoLigas.fechaActual + 1) + " · Liga Profesional"
    });
}

function mensajeAsistente() {
    if (colaModales.length) return "Tenés " + colaModales.length + " asunto" + (colaModales.length > 1 ? "s" : "") + " sin resolver en la bandeja.";
    if (presidente.apoyoClubes < 30) {
        return "Alerta roja: con " + presidente.apoyoClubes + " de apoyo, la asamblea te suelta la mano. Necesitás un golpe de efecto ya.";
    }
    if (presidente.apoyoClubes < 45) {
        return "El apoyo está flojo (" + presidente.apoyoClubes + "). Rescatar un club, cumplir un objetivo o una campaña te devuelven aire.";
    }
    if (estadoExpedientes && estadoExpedientes.abiertos.length) {
        return "Hay " + estadoExpedientes.abiertos.length + " expediente" + (estadoExpedientes.abiertos.length > 1 ? "s" : "") + " en curso. Van a volver con novedades.";
    }
    if (calcularAsamblea().proyeccion < 0.55) {
        return "La asamblea está en riesgo. Probá una acción de campaña o una medida que sume apoyo.";
    }
    if (presidente.dineroEnCaja < 2500) {
        return "La caja está en rojo. Podés pedir un préstamo o recortar gastos antes de que sea tarde.";
    }
    if (estadoMercado.ofertas.some(function(o) { return !o.resuelta; })) {
        return "Quedan ofertas de pases sin resolver. Tomá una decisión antes de que se cierre la ventana.";
    }
    if (typeof fuerzaOposicion === "function" && fuerzaOposicion() > 65) {
        return "El rival está creciendo. Un buen debate o un año sólido lo devuelven a su lugar.";
    }
    return "Todo en orden, presidente. Avanzá la fecha y mirá cómo se mueve el tablero.";
}

function panelExpedientes() {
    if (!estadoExpedientes || !estadoExpedientes.abiertos.length) return "";
    const filas = estadoExpedientes.abiertos.map(function(e) {
        const faltan = Math.max(0, e.fechaDisparo - estadoLigas.fechaActual);
        return "<div class='lista-item'>" +
            "<span class='lista-avatar'>" + icono("lista", "tenue", 16) + "</span>" +
            "<span class='lista-cuerpo'><span class='lista-titulo'>" + escapar(e.titulo) + "</span>" +
            "<span class='lista-sub'>" + escapar(e.descripcion) + "</span></span>" +
            "<span class='lista-meta'>" + (faltan <= 0 ? "esta fecha" : "en " + faltan + " fechas") + "</span></div>";
    }).join("");
    return vPanel("Expedientes en curso", "lista", "<div class='lista'>" + filas + "</div>", { meta: estadoExpedientes.abiertos.length });
}

function panelUltimaFecha() {
    const fecha = estadoLigas.fechaActual - 1;
    const resultados = (estadoLigas.resultados.primera || [])[fecha];
    if (!resultados || !resultados.length) return "";

    const ordenados = resultados.slice().sort(function(a, b) {
        return (b.golesLocal + b.golesVisitante) - (a.golesLocal + a.golesVisitante);
    }).slice(0, 5);

    const filas = ordenados.map(function(r) {
        return "<div class='resultado compacto'>" +
            "<div class='resultado-eq local'><span>" + escapar(r.local) + "</span></div>" +
            "<div class='resultado-marca " + (r.incidencia ? "incidencia" : "") + "'>" + r.golesLocal + " - " + r.golesVisitante + "</div>" +
            "<div class='resultado-eq'><span>" + escapar(r.visitante) + "</span></div></div>";
    }).join("");

    return vPanel("Última fecha", "calendario", filas,
        { meta: "Fecha " + (fecha + 1), pie: "<button class='btn-fantasma' data-accion='nav' data-pantalla='torneo'>Ver el torneo " + icono("derecha", "", 14) + "</button>" });
}

function panelGoleadoresMini() {
    const top = tablaGoleadores(3);
    if (!top.length) return "";
    const filas = top.map(function(g, i) {
        return "<div class='lista-item'>" +
            "<span class='lista-avatar'><span class='pos-badge'>" + (i + 1) + "</span></span>" +
            "<span class='lista-cuerpo'><span class='lista-titulo'>" + escapar(g.nombre) + "</span>" +
            "<span class='lista-sub'>" + escapar(g.club) + "</span></span>" +
            "<span class='lista-meta num' style='font-size:17px'>" + g.goles + "</span></div>";
    }).join("");
    return vPanel("Goleadores", "objetivo", "<div class='lista'>" + filas + "</div>",
        { pie: "<button class='btn-fantasma' data-accion='ver-goleadores'>Ver la tabla " + icono("derecha", "", 14) + "</button>" });
}

function pantallaMandatoTerminado() {
    const puntos = (typeof puntajeLegado === "function") ? puntajeLegado() : 0;
    const rango = (typeof rangoLegado === "function") ? rangoLegado(puntos) : { nombre: "", color: "#3ddc84", desc: "" };
    return "<div class='pantalla'>" +
        "<div class='portada' style='--club:#3ddc84'>" +
        "<div class='portada-cab'><span class='portada-liga'>FIN DEL MANDATO</span></div>" +
        "<div class='portada-principal' style='padding:10px 0'>" +
        "<h2 class='hero-titulo'>TU MANDATO TERMINÓ</h2>" +
        "<p class='hero-texto'>La asamblea no te renovó. Es hora de mirar el documental y empezar de nuevo.</p>" +
        "<div class='legado-datos' style='margin:16px 0'>" +
        "<div><span>Puntos</span><strong>" + puntos + "</strong></div>" +
        "<div><span>Rango</span><strong style='color:" + rango.color + "'>" + rango.nombre + "</strong></div>" +
        "<div><span>Años</span><strong>" + presidente.anioMandato + "</strong></div>" +
        "<div><span>Apoyo final</span><strong>" + presidente.apoyoClubes + "</strong></div>" +
        "</div>" +
        "<div class='hero-acciones'>" +
        "<button class='btn-primario' data-accion='ver-documental'>" + icono("camara", "", 18) + "Ver el documental</button>" +
        "<button class='btn' data-accion='reiniciar-partida'>" + icono("recargar", "", 16) + "Nueva partida</button>" +
        "<button class='btn-suave' data-accion='ir-pantalla' data-pantalla='legado'>Ver legado</button>" +
        "</div></div></div></div>";
}

function vistaEscritorio() {
    if (presidente.mandatoTerminado) return pantallaMandatoTerminado();
    const hero = mensajeHero();
    const asamblea = calcularAsamblea();
    const conf = ConfianzaConsejo();
    const objetivos = objetivosDelAnio();

    const pendientes = colaModales.length;

    const heroHTML = (typeof panelPortada === "function")
        ? panelPortada(hero, asamblea)
        : "<section class='hero'>" +
          "<div class='hero-etiqueta'>" + icono("rayo", "", 14) + hero.etiqueta + "</div>" +
          "<h2 class='hero-titulo'>" + hero.titulo + "</h2>" +
          "<p class='hero-texto'>" + hero.texto + "</p>" +
          "</section>";

    const numeros =
        "<div class='grid grid-4'>" +
        vStat("Apoyo de clubes", presidente.apoyoClubes, tendenciaTexto("apoyo"), Charts.sparkline(serieHistorial("apoyo", 14), { color: "#3ddc84", alto: 40 })) +
        vStat("Prestigio", presidente.prestigioInternacional, tendenciaTexto("prestigio"), Charts.sparkline(serieHistorial("prestigio", 14), { color: "#6aa9ff", alto: 40 })) +
        vStat("Caja", fmt.plata(presidente.dineroEnCaja), "Resultado del año: " + fmt.plata(FinanzasLibro.totales().balance), Charts.sparkline(serieHistorial("dinero", 14), { color: "#f0c869", alto: 40 })) +
        vStat("Consejo", conf + " / 100", estadoConfianza(conf).etiqueta, Charts.sparkline(serieHistorial("consejo", 14), { color: "#b18cff", alto: 40 })) +
        "</div>";

    const consejoPanel = vPanel("Consejo directivo", "consejo",
        "<div class='fila' style='gap:16px;align-items:center'>" +
        Charts.gauge(conf, { etiqueta: "Confianza", ancho: 150, alto: 84 }) +
        "<div class='crecer col' style='gap:4px'>" +
        "<span class='mini tenue'>" + estadoConfianza(conf).desc + "</span>" +
        "<div class='fila' style='gap:6px;margin-top:6px'>" + miembrosConsejo.map(function(m) {
            return "<span class='consejero-mini' title='" + escapar(m.nombre) + "' style='background:" + AREAS_CONSEJO[m.area].color + "22;border-color:" + AREAS_CONSEJO[m.area].color + "55'>" +
                m.avatar + "</span>";
        }).join("") + "</div>" +
        "</div>" +
        "</div>",
        { pie: "<span class='mini tenue'>Riesgo de censura: " + Math.round(riesgoCensura() * 100) + "%</span><button class='btn-fantasma' data-accion='ir-pantalla' data-pantalla='consejo'>Detalle " + icono("derecha", "", 14) + "</button>" }
    );

    const objetivosPanel = vPanel("Objetivos del año", "objetivo",
        objetivos.length ? objetivos.map(function(o) {
            const p = progresoObjetivo(o);
            return "<div style='margin-bottom:14px'>" +
                vProgreso(p, "<span class='fila' style='gap:6px'>" + icono(o.icono, "tenue", 14) + escapar(o.titulo) + "</span>", progresoTexto(o), p >= 1 ? "" : "oro") +
                "</div>";
        }).join("") : vVacio("objetivo", "Sin objetivos", "Se generan al empezar el año."),
        { meta: objetivosCumplidos() + " / " + objetivos.length }
    );

    const asambleaPanel = vPanel("Proyección de asamblea", "bandera",
        "<div class='fila' style='gap:14px;align-items:center'>" +
        Charts.hemiciclo([
            { valor: asamblea.opositor.votos, color: "#ff6f5e", nombre: "Oposición" },
            { valor: asamblea.indeciso.votos, color: "#f0c869", nombre: "Indecisos" },
            { valor: asamblea.oficial.votos, color: "#3ddc84", nombre: "Oficialismo" }
        ], { ancho: 300, alto: 150 }) +
        "</div>" +
        "<div class='fila sep' style='margin-top:8px'>" +
        "<span class='mini tenue'>Oficialismo " + Math.round(asamblea.oficial.pct * 100) + "%</span>" +
        "<span class='mini tenue'>Indecisos " + Math.round(asamblea.indeciso.pct * 100) + "%</span>" +
        "<span class='mini tenue'>Oposición " + Math.round(asamblea.opositor.pct * 100) + "%</span>" +
        "</div>" +
        "<div class='aviso " + (asamblea.gana ? "verde" : "rojo") + "' style='margin-top:12px'>" +
        icono(asamblea.gana ? "check" : "alerta", "", 16) +
        "<div class='aviso-texto'>Proyección <strong>" + Math.round(asamblea.proyeccion * 100) + "%</strong> · necesitás " +
        Math.round(asamblea.umbral * 100) + "%</div></div>",
        { pie: "<span class='mini tenue'>" + asamblea.total + " votos en juego</span><button class='btn-fantasma' data-accion='ir-pantalla' data-pantalla='consejo'>Campaña " + icono("derecha", "", 14) + "</button>" }
    );

    const noticias = noticiasHistoricas.slice(-4).reverse();
    const noticiasPanel = vPanel("Últimas noticias", "diario",
        noticias.length ? "<div class='lista'>" + noticias.map(function(n) {
            return "<div class='lista-item'><span class='lista-avatar'>" + icono("diario", "tenue", 16) + "</span>" +
                "<span class='lista-cuerpo'><span class='lista-titulo'>" + escapar(n.titulo) + "</span>" +
                "<span class='lista-sub'>" + escapar(n.medio || "Prensa") + "</span></span>" +
                "<span class='lista-meta'>" + escapar(n.fecha || "") + "</span></div>";
        }).join("") + "</div>" : vVacio("diario", "Sin noticias todavía", "Jugá una fecha para ver los titulares."),
        { pie: "<button class='btn-fantasma' data-accion='ir-pantalla' data-pantalla='prensa'>Ver toda la prensa " + icono("derecha", "", 14) + "</button>" }
    );

    const pendientesPanel = pendientes ?
        vPanel("Pendientes", "sobre", colaModales.map(function(m) {
            const t = m.tipo === "decision" ? m.datos.titulo : m.tipo === "evento" ? m.datos.titulo : m.tipo === "conferencia" ? "Conferencia de prensa" : m.tipo === "censura" ? "Moción de censura" : "Incidencia arbitral";
            return "<div class='pendiente'><span class='pendiente-ico'>" + icono("alerta", "", 17) + "</span>" +
                "<div class='crecer'><div class='pendiente-titulo'>" + escapar(t) + "</div>" +
                "<div class='pendiente-sub'>Requiere tu decisión</div></div>" +
                "<button class='btn' data-accion='abrir-bandeja'>Resolver</button></div>";
        }).join("")) : "";

    const primerosPasos = (presidente.anioMandato === 1 && estadoLigas.fechaActual === 0) ?
        vPanel("Primeros pasos", "info",
            "<div class='paso'><span class='paso-num'>1</span><div><strong>Ya tenés DT.</strong> " +
            escapar(presidente.seleccionador || "") + " dirige a la Selección. Podés verlo en la pestaña Selección.</div></div>" +
            "<div class='paso'><span class='paso-num'>2</span><div><strong>Avanzá la fecha.</strong> Se juegan las tres divisiones, la Copa Argentina y se mueve la caja." +
            " Cada seis fechas te llega una decisión.</div></div>" +
            "<div class='paso'><span class='paso-num'>3</span><div><strong>Mirá el consejo.</strong> Si la confianza cae por debajo de 32, te pueden pedir una asamblea anticipada." +
            " Al final del año, los clubes votan tu continuidad.</div></div>") : "";

    return "<div class='pantalla'>" +
        vCabecera("Escritorio", "Buen día, " + escapar(presidente.nombre) + ". Esto es lo que pasa hoy en la AFA.") +
        heroHTML +
        "<div class='asistente'>" + icono("mensaje", "", 16) +
        "<div><span class='asistente-rotulo'>El secretario dice</span>" +
        "<span class='asistente-texto'>" + mensajeAsistente() + "</span></div></div>" +
        primerosPasos +
        (pendientesPanel ? pendientesPanel : "") +
        numeros +
        "<div class='oficina'>" +
        "<div class='oficina-col'>" +
        consejoPanel +
        objetivosPanel +
        "</div>" +
        "<div class='oficina-col'>" +
        panelProximaFecha() +
        panelUltimaFecha() +
        panelExpedientes() +
        panelGoleadoresMini() +
        asambleaPanel +
        noticiasPanel +
        "</div>" +
        "</div>" +
        "</div>";
}

function tendenciaTexto(clave) {
    const serie = serieHistorial(clave, 6);
    if (serie.length < 2) return "Sin historial";
    const dif = serie[serie.length - 1] - serie[0];
    if (dif === 0) return "Estable en las últimas fechas";
    return (dif > 0 ? "Sube " : "Baja ") + Math.abs(dif) + " en las últimas " + (serie.length - 1) + " fechas";
}

// -----------------------------
// CONSEJO
// -----------------------------

function panelOposicion() {
    const rival = estadoOposicion.lider;
    if (!rival) return "";
    const fuerza = fuerzaOposicion();
    const debate = estadoOposicion.ultimoDebate;
    const total = estadoLigas.totalFechas;
    const fechaDebate = total - 4;

    let estadoDebate = "<div class='mini tenue'>El debate es en la fecha " + (fechaDebate + 1) + ".</div>";
    if (debate && debate.anio === presidente.anioMandato) {
        estadoDebate = "<div class='chip " + (debate.gana ? "verde" : debate.empate ? "oro" : "rojo") + "'>" +
            (debate.gana ? "Ganaste el debate" : debate.empate ? "Debate empatado" : "Perdiste el debate") +
            " · " + debate.puntos + "-" + debate.puntosRival + "</div>";
    }

    return vPanel("La oposición", "consejo",
        "<div class='rival-ficha'>" +
        "<span class='debate-avatar rival-avatar'>" + escapar(iniciales(rival.nombre)) + "</span>" +
        "<div class='crecer'><strong>" + escapar(rival.nombre) + "</strong>" +
        "<div class='mini tenue'>" + escapar(rival.perfil) + "</div>" +
        "<div class='mini suave' style='margin-top:4px'>Promete: " + escapar(rival.promesa) + "</div></div>" +
        "<div class='num' style='font-size:26px'>" + fuerza + "</div>" +
        "</div>" +
        "<div class='progreso rojo' style='margin:10px 0 12px'><span style='width:" + fuerza + "%'></span></div>" +
        "<div class='mini tenue'>Fuerza del rival. Si sube, te cuesta más la asamblea.</div>" +
        "<div style='margin-top:10px'>" + estadoDebate + "</div>",
        { meta: "Fuerza " + fuerza, pie: "<span class='mini tenue'>Penalización electoral: " + Math.round((typeof bonoOposicionAsamblea === "function" ? bonoOposicionAsamblea() : 0) * 100) + "%</span>" }
    );
}

function panelDirigentes() {
    if (!estadoDirigentes.lista.length) return "";
    const filas = estadoDirigentes.lista.map(function(d) {
        const color = d.lealtad >= 65 ? "#3ddc84" : d.lealtad >= 40 ? "#f0c869" : "#ff6f5e";
        return "<div class='dirigente-fila'>" +
            "<span class='lista-avatar'>" + htmlEscudo(d.clubId, d.club, 26) + "</span>" +
            "<span class='crecer'><span class='dirigente-nombre'>" + escapar(d.nombre) + "</span>" +
            "<span class='mini tenue'>" + escapar(d.rol) + " · " + escapar(d.club) + "</span>" +
            "<div class='progreso' style='margin-top:5px'><span style='width:" + Math.round(d.lealtad) + "%;background:" + color + "'></span></div></span>" +
            "<span class='num' style='color:" + color + "'>" + Math.round(d.lealtad) + "</span>" +
            "</div>";
    }).join("");

    return vPanel("Los dirigentes", "usuario",
        "<div class='mini tenue' style='margin-bottom:10px'>Lealtad media: <strong>" + lealtadMedia() + "</strong>. Cada pedido que respondés mueve la asamblea.</div>" +
        filas,
        { meta: "Bono " + Math.round(bonoDirigentesAsamblea() * 100) + "%" }
    );
}

function panelCambiosApoyo() {
    const cambios = (typeof ultimosCambios === "function") ? ultimosCambios("apoyo", 8) : [];
    if (!cambios.length) {
        return vPanel("¿Por qué cambió el apoyo?", "grafico", vVacio("grafico", "Sin movimientos", "Jugá una fecha para ver el detalle."));
    }
    const filas = cambios.map(function(c) {
        return "<div class='metrica-fila'><span>" + escapar(c.motivo) + " <span class='mini tenue'>A" + c.anio + " · F" + ((c.fecha || 0) + 1) + "</span></span>" +
            "<strong class='" + (c.delta > 0 ? "pos" : "neg") + "'>" + (c.delta > 0 ? "+" : "") + c.delta + "</strong></div>";
    }).join("");
    return vPanel("¿Por qué cambió el apoyo?", "grafico", filas, { meta: "últimos 8 movimientos" });
}

function panelDesgloseAsamblea(asamblea) {
    if (!asamblea.componentes) return "";
    const filas = asamblea.componentes.filter(function(c) {
        return Math.abs(c.valor) > 0.0001;
    }).map(function(c) {
        const puntos = Math.round(c.valor * 1000) / 10;
        return "<div class='metrica-fila'><span>" + escapar(c.nombre) + "</span>" +
            "<strong class='" + (puntos >= 0 ? "pos" : "neg") + "'>" + (puntos >= 0 ? "+" : "") + puntos + " pts</strong></div>";
    }).join("");
    return vPanel("Cómo se forma la proyección", "bandera",
        filas +
        "<div class='metrica-fila' style='border-top:1px solid var(--linea);margin-top:6px;padding-top:8px'>" +
        "<span><strong>Total</strong></span><strong>" + Math.round(asamblea.proyeccion * 100) + "% (umbral " + Math.round(asamblea.umbral * 100) + "%)</strong></div>");
}

function vistaConsejo() {
    const conf = ConfianzaConsejo();
    const estadoC = estadoConfianza(conf);
    const asamblea = calcularAsamblea();

    const consejeros = miembrosConsejo.map(function(m) {
        const area = AREAS_CONSEJO[m.area];
        return "<button class='consejero' data-accion='perfil-consejero' data-id='" + m.id + "' style='text-align:left;width:100%;background:rgba(255,255,255,.02);cursor:pointer'>" +
            "<span class='consejero-avatar' style='background:linear-gradient(140deg," + area.color + "," + area.color + "99)'>" + m.avatar + "</span>" +
            "<span><span class='consejero-nombre'>" + escapar(m.nombre) + "</span>" +
            "<span class='consejero-rol'>" + escapar(m.rol) + " · " + area.nombre + "</span>" +
            "<div class='mini tenue' style='margin-top:4px'>" + escapar(fraseDelConsejero(m)) + "</div></span>" +
            "<span class='consejero-conf'>" +
            "<span class='num' style='font-size:18px;color:" + (m.confianza >= 60 ? "#3ddc84" : m.confianza >= 40 ? "#f0c869" : "#ff6f5e") + "'>" + Math.round(m.confianza) + "</span>" +
            "<div class='progreso' style='margin-top:4px'><span style='width:" + Math.round(m.confianza) + "%;background:" + area.color + "'></span></div>" +
            "</span>" +
            "</button>";
    }).join("");

    const objetivos = objetivosDelAnio().map(function(o) {
        const p = progresoObjetivo(o);
        return "<div style='margin-bottom:16px'>" +
            vProgreso(p, escapar(o.titulo), progresoTexto(o), p >= 1 ? "" : "oro") +
            "<div class='mini tenue' style='margin-top:6px'>" + escapar(o.desc) + "</div>" +
            "</div>";
    }).join("");

    const campaña = ACCIONES_CAMPANA.map(function(a) {
        const hecha = estadoAsamblea.campana.usadas.indexOf(a.id) !== -1;
        const puede = campanaDisponible() && !hecha && presidente.dineroEnCaja >= a.costo;
        return "<div class='campana-item'>" +
            "<div class='crecer'><strong>" + escapar(a.nombre) + "</strong>" +
            "<div class='mini tenue'>" + escapar(a.detalle) + "</div></div>" +
            "<span class='mini " + (a.costo ? "oro" : "tenue") + "'>" + (a.costo ? fmt.plata(-a.costo) : "Gratis") + "</span>" +
            "<button class='btn " + (puede ? "" : "btn-fantasma") + "' data-accion='campana' data-id='" + a.id + "' " + (puede ? "" : "disabled") + ">" +
            (hecha ? "Hecha" : "Hacer") + "</button></div>";
    }).join("");

    const grupos = gruposAsamblea();
    const filasGrupos = Object.keys(grupos).map(function(k) {
        const g = grupos[k];
        return "<div class='metrica-fila'><span>" + g.nombre + "</span><strong>" +
            "<span class='pos'>" + g.oficial + "</span> · <span class='oro'>" + g.indeciso + "</span> · <span class='neg'>" + g.opositor + "</span></strong></div>";
    }).join("");

    return "<div class='pantalla'>" +
        vCabecera("Consejo y asamblea",
            "Cinco consejeros sostienen tu gestión. La asamblea de clubes decide si seguís.",
            "<button class='btn' data-accion='ver-historial'>" + icono("lista", "", 16) + "Decisiones tomadas</button>" +
            "<button class='btn-suave' data-accion='abrir-mesa-chica'>" + icono("usuario", "", 16) + "Mesa chica</button>" +
            "<button class='btn-suave' data-accion='abrir-reglamento'>" + icono("libro", "", 16) + "Reglamento</button>") +

        "<div class='grid grid-hero'>" +
        vPanel("Estado del consejo", "consejo",
            "<div class='fila' style='gap:20px;align-items:center;flex-wrap:wrap'>" +
            Charts.gauge(conf, { etiqueta: "Confianza global", ancho: 190, alto: 104 }) +
            "<div class='crecer'>" +
            "<div class='chip' style='color:" + estadoC.color + ";border-color:" + estadoC.color + "55;background:" + estadoC.color + "14'>" + estadoC.etiqueta + "</div>" +
            "<p class='chico suave' style='margin-top:10px'>" + estadoC.desc + "</p>" +
            "<div class='mini tenue'>Riesgo de moción de censura: <strong>" + Math.round(riesgoCensura() * 100) + "%</strong> por fecha</div>" +
            "</div></div>") +
        vPanel("Proyección electoral", "bandera",
            Charts.hemiciclo([
                { valor: asamblea.opositor.votos, color: "#ff6f5e", nombre: "Oposición" },
                { valor: asamblea.indeciso.votos, color: "#f0c869", nombre: "Indecisos" },
                { valor: asamblea.oficial.votos, color: "#3ddc84", nombre: "Oficialismo" }
            ], { ancho: 320, alto: 156 }) +
            "<div class='fila sep' style='margin-top:10px'>" +
            "<span class='mini tenue'>Proyección</span>" +
            "<strong class='" + (asamblea.gana ? "pos" : "neg") + "'>" + Math.round(asamblea.proyeccion * 100) + "% / " + Math.round(asamblea.umbral * 100) + "%</strong></div>") +
        "</div>" +

        "<div class='grid grid-2'>" +
        panelOposicion() +
        panelDirigentes() +
        "</div>" +

        "<div class='grid grid-2'>" +
        panelCambiosApoyo() +
        panelDesgloseAsamblea(asamblea) +
        "</div>" +

        "<div class='grid grid-2'>" +
        vPanel("Los cinco", "consejo", consejeros, { meta: conf + " / 100" }) +
        "<div class='col' style='gap:16px'>" +
        vPanel("Objetivos del año", "objetivo", objetivos || vVacio("objetivo", "Sin objetivos"), { meta: objetivosCumplidos() + " / 3" }) +
        vPanel("Campaña electoral", "consejo",
            "<p class='mini tenue' style='margin-bottom:12px'>Te quedan <strong>" + accionesCampanaRestantes() + "</strong> acciones este año.</p>" +
            campaña) +
        "</div>" +
        "</div>" +

        "<div class='grid grid-2'>" +
        vPanel("Bloques de la asamblea", "lista", filasGrupos +
            "<p class='mini tenue' style='margin-top:10px'>Verde: oficialistas · Amarillo: indecisos · Rojo: oposición.</p>") +
        vPanel("Cómo se vota", "info",
            "<p class='chico suave'>Cada club pesa según su historia: los grandes valen 3 votos, los medios 2 y los chicos 1. " +
            "Para seguir necesitás <strong>" + Math.round(asamblea.umbral * 100) + "%</strong> de los " + asamblea.total + " votos.</p>" +
            "<p class='chico suave'>Rescatar clubes, repartir la TV y hacer campaña mueve la aguja. Ignorar a los chicos, también.</p>") +
        "</div>" +
        "</div>";
}

// -----------------------------
// CLUBES
// -----------------------------

function formaClub(idEquipo, ligaId) {
    const resultados = estadoLigas.resultados[ligaId] || [];
    const forma = [];
    for (let f = resultados.length - 1; f >= 0 && forma.length < 5; f--) {
        const fecha = resultados[f];
        for (let i = 0; i < fecha.length; i++) {
            const r = fecha[i];
            if (r.localId === Number(idEquipo) || r.visitanteId === Number(idEquipo)) {
                const esLocal = r.localId === Number(idEquipo);
                const gf = esLocal ? r.golesLocal : r.golesVisitante;
                const gc = esLocal ? r.golesVisitante : r.golesLocal;
                forma.push(gf > gc ? "g" : gf === gc ? "e" : "p");
                break;
            }
        }
    }
    return forma;
}

function tablaConMovimiento(ligaId) {
    const actual = obtenerTablaOrdenada(ligaId).map(function(e) { return Object.assign({}, e); });
    const resultados = estadoLigas.resultados[ligaId] || [];
    const previa = {};

    // Reconstruir la tabla de la fecha anterior
    const copia = {};
    Object.keys(estadoLigas.tablas[ligaId] || {}).forEach(function(id) {
        const t = estadoLigas.tablas[ligaId][id];
        copia[id] = { id: t.id, nombre: t.nombre, PJ: t.PJ, G: t.G, E: t.E, P: t.P, GF: t.GF, GC: t.GC, DG: t.DG, Pts: t.Pts };
    });

    if (resultados.length) {
        const ultima = resultados[resultados.length - 1];
        ultima.forEach(function(r) {
            const l = copia[r.localId], v = copia[r.visitanteId];
            if (!l || !v) return;
            l.PJ--; v.PJ--;
            l.GF -= r.golesLocal; l.GC -= r.golesVisitante;
            v.GF -= r.golesVisitante; v.GC -= r.golesLocal;
            l.DG = l.GF - l.GC; v.DG = v.GF - v.GC;
            if (r.golesLocal > r.golesVisitante) { l.G--; l.Pts -= 3; v.P--; }
            else if (r.golesLocal < r.golesVisitante) { v.G--; v.Pts -= 3; l.P--; }
            else { l.E--; v.E--; l.Pts--; v.Pts--; }
        });
    }

    Object.values(copia).sort(function(a, b) {
        if (b.Pts !== a.Pts) return b.Pts - a.Pts;
        if (b.DG !== a.DG) return b.DG - a.DG;
        return b.GF - a.GF;
    }).forEach(function(e, i) { previa[e.id] = i + 1; });

    return actual.map(function(e, i) {
        const pos = i + 1;
        const anterior = previa[e.id] || pos;
        return { equipo: e, pos: pos, mov: anterior - pos, forma: formaClub(e.id, ligaId) };
    });
}

function filaTabla(fila, ligaId, totalEquipos) {
    const eq = EQUIPOS[fila.equipo.id];
    const zona = fila.pos <= 4 ? "zona-libertadores" : fila.pos <= 8 ? "zona-sudamericana" : (fila.pos > totalEquipos - 3 && ligaId !== "federalA") ? "zona-descenso" : "";
    const flecha = fila.mov > 0 ? "<span class='pos-mov sube'>▲</span>" : fila.mov < 0 ? "<span class='pos-mov baja'>▼</span>" : "<span class='pos-mov igual'>–</span>";
    const forma = fila.forma.map(function(f) { return "<i class='" + f + "'>" + f.toUpperCase() + "</i>"; }).join("");
    return "<tr class='" + zona + " clicable club-fila' style='--club:" + colorClub(eq.id) + "' data-accion='club' data-id='" + eq.id + "'>" +
        "<td><div class='pos-celda'><span class='pos-num'>" + fila.pos + "</span>" + flecha + "</div></td>" +
        "<td><div class='nombre-club'>" + htmlEscudo(eq.id, eq.nombre, 24) + "<span>" + escapar(eq.nombre) + "</span></div></td>" +
        "<td class='num centro'>" + fila.equipo.PJ + "</td>" +
        "<td class='num centro oculto-movil'>" + fila.equipo.G + "</td>" +
        "<td class='num centro oculto-movil'>" + fila.equipo.E + "</td>" +
        "<td class='num centro oculto-movil'>" + fila.equipo.P + "</td>" +
        "<td class='num centro oculto-movil'>" + fila.equipo.GF + "</td>" +
        "<td class='num centro oculto-movil'>" + fila.equipo.GC + "</td>" +
        "<td class='num centro'>" + (fila.equipo.DG > 0 ? "+" + fila.equipo.DG : fila.equipo.DG) + "</td>" +
        "<td class='num centro fuerte'>" + fila.equipo.Pts + "</td>" +
        "<td class='oculto-movil'><span class='forma'>" + forma + "</span></td>" +
        "</tr>";
}

function vistaClubes() {
    const ligaId = estadoUI.liga;
    const liga = LIGAS[ligaId];
    const filas = tablaConMovimiento(ligaId);
    const total = liga.equipos.length;
    const seccion = estadoUI.clubesSeccion || "tabla";

    const tabs = Object.keys(LIGAS).map(function(id) {
        return "<button class='seg " + (id === ligaId ? "activo" : "") + "' data-accion='tab-liga' data-liga='" + id + "'>" +
            LIGAS[id].nombre + " <span class='tenue'>(" + LIGAS[id].equipos.length + ")</span></button>";
    }).join("");

    const secciones = [
        { id: "tabla", nombre: "Posiciones" },
        { id: "resultados", nombre: "Resultados" },
        { id: "goleadores", nombre: "Goleadores" },
        { id: "polemicas", nombre: "Polémicas" }
    ].map(function(s) {
        return "<button class='seg " + (seccion === s.id ? "activo" : "") + "' data-accion='seccion-clubes' data-seccion='" + s.id + "'>" + s.nombre + "</button>";
    }).join("");

    const tablaHTML =
        "<div class='tabla-wrap'><table class='tabla'>" +
        "<thead><tr><th>#</th><th>Equipo</th><th class='centro'>PJ</th>" +
        "<th class='centro oculto-movil'>G</th><th class='centro oculto-movil'>E</th><th class='centro oculto-movil'>P</th>" +
        "<th class='centro oculto-movil'>GF</th><th class='centro oculto-movil'>GC</th>" +
        "<th class='centro'>DG</th><th class='centro'>Pts</th><th class='oculto-movil'>Forma</th></tr></thead>" +
        "<tbody>" + filas.map(function(f) { return filaTabla(f, ligaId, total); }).join("") + "</tbody></table></div>";

    let cuerpo = "";
    let titulo = "";
    let iconoPanel = "lista";

    if (seccion === "tabla") {
        titulo = "Tabla de posiciones";
        cuerpo = tablaHTML;
    } else if (seccion === "resultados") {
        titulo = "Resultados";
        iconoPanel = "calendario";
        cuerpo = visorResultados(ligaId);
    } else if (seccion === "goleadores") {
        titulo = "Tabla de goleadores";
        iconoPanel = "objetivo";
        cuerpo = tablaGoleadoresHTML();
    } else {
        titulo = "Polémicas arbitrales";
        iconoPanel = "balanza";
        cuerpo = polemicasHTML();
    }

    const deudas = obtenerClubesConDeuda();
    const deudaHTML = deudas.length ? deudas.slice(0, 8).map(function(c) {
        const color = c.nivel === "fundido" ? "rojo" : c.nivel === "crisis" ? "oro" : "azul";
        return "<div class='lista-item'>" +
            "<span class='lista-avatar'>" + htmlEscudo(c.id, c.nombre, 26) + "</span>" +
            "<span class='lista-cuerpo'><span class='lista-titulo'>" + escapar(c.nombre) + " <span class='tag " + color + "'>" + c.nivel + "</span></span>" +
            "<span class='lista-sub'>" + escapar(c.liga) + " · rescatado " + c.rescates + " " + fmt.plural(c.rescates, "vez", "veces") + "</span></span>" +
            "<button class='btn' data-accion='rescatar' data-id='" + c.id + "'>Rescatar · " + fmt.plata(c.costoRescate) + "</button></div>";
    }).join("") : vVacio("check", "Ningún club en crisis", "Todos los clubes están sanos. El consejo lo valora.");

    return "<div class='pantalla'>" +
        vCabecera("Clubes", "Las tres divisiones, la tabla, los resultados, los goleadores y las polémicas del fin de semana.",
            "<button class='btn' data-accion='pedir-prestamo'>" + icono("dinero", "", 16) + "Pedir préstamo</button>") +
        "<div class='fila wrap' style='gap:8px'>" +
        "<div class='segmented'>" + tabs + "</div>" +
        "<div class='segmented'>" + secciones + "</div>" +
        "</div>" +
        vPanel(titulo, iconoPanel, cuerpo, { meta: liga.nombre, ajustado: seccion === "tabla" }) +
        vPanel("Clubes con deuda", "escudo", deudaHTML, { meta: deudas.length + " clubes" }) +
        "</div>";
}

function tablaGoleadoresHTML() {
    const ligaId = estadoUI.liga || "primera";
    const goleadores = tablaGoleadores(20, ligaId);
    if (!goleadores.length) {
        return vVacio("objetivo", "Todavía no hay goles", "Jugá una fecha para ver los goleadores de esta división.");
    }
    const filas = goleadores.map(function(g, i) {
        return "<tr class='clicable' data-accion='club' data-id='" + g.clubId + "'>" +
            "<td class='num'>" + (i + 1) + "</td>" +
            "<td><strong>" + escapar(g.nombre) + "</strong></td>" +
            "<td class='mini tenue'>" + escapar(g.club) + "</td>" +
            "<td class='num centro fuerte'>" + g.goles + "</td></tr>";
    }).join("");
    return "<p class='mini tenue' style='margin-bottom:8px'>Solo jugadores de " + escapar(LIGAS[ligaId].nombre) + ".</p>" +
        "<div class='tabla-wrap'><table class='tabla'>" +
        "<thead><tr><th>#</th><th>Jugador</th><th>Club</th><th class='centro'>Goles</th></tr></thead>" +
        "<tbody>" + filas + "</tbody></table></div>";
}

function polemicasHTML() {
    const incs = incidenciasHistoricas
        .filter(function(i) { return i.anio === presidente.anioMandato; })
        .slice(-12).reverse();

    if (!incs.length) {
        return vVacio("check", "Sin polémicas este año", "El cuerpo arbitral viene limpio.");
    }

    return "<div class='lista'>" + incs.map(function(i) {
        const fav = i.clubFavorecidoId && EQUIPOS[i.clubFavorecidoId] ? EQUIPOS[i.clubFavorecidoId].nombre : "—";
        const perj = i.clubPerjudicadoId && EQUIPOS[i.clubPerjudicadoId] ? EQUIPOS[i.clubPerjudicadoId].nombre : "—";
        const cambió = i.golesOriginales && i.golesFinales &&
            (i.golesOriginales.local !== i.golesFinales.local || i.golesOriginales.visitante !== i.golesFinales.visitante);
        return "<div class='polemica-item'>" +
            "<div class='polemica-cab'>" +
            "<span class='tag rojo'>" + escapar(nombreTipoIncidencia(i.tipo)) + "</span>" +
            "<strong>" + escapar(i.local) + " vs " + escapar(i.visitante) + "</strong>" +
            "<span class='crecer'></span>" +
            "<span class='mini tenue'>F" + ((i.fecha || 0) + 1) + (i.manual ? " · designación manual" : "") + "</span>" +
            "</div>" +
            "<div class='polemica-texto'>" + escapar(i.descripcion) + "</div>" +
            "<div class='polemica-pie'>" +
            "<span class='mini'><span class='oro'>Favoreció:</span> " + escapar(fav) + "</span>" +
            "<span class='mini'><span class='neg'>Perjudicó:</span> " + escapar(perj) + "</span>" +
            (i.clubFavorecidoId && typeof indiceSecanuca === "function"
                ? "<span class='mini'>SECANUCA: <strong class='" + (indiceSecanuca(i.clubFavorecidoId) >= 60 ? "neg" : "") + "'>" + indiceSecanuca(i.clubFavorecidoId) + "</strong></span>"
                : "") +
            (cambió ? "<span class='mini tenue'>Resultado " + i.golesOriginales.local + "-" + i.golesOriginales.visitante + " → " + i.golesFinales.local + "-" + i.golesFinales.visitante + "</span>" : "") +
            "</div></div>";
    }).join("") + "</div>";
}

function nombreTipoIncidencia(tipo) {
    const mapa = { penal: "Penal dudoso", golAnulado: "Gol anulado", rojaDudosa: "Roja dudosa" };
    return mapa[tipo] || "Polémica";
}

function visorResultados(ligaId) {
    const resultados = estadoLigas.resultados[ligaId] || [];
    const total = estadoLigas.totalFechas;
    let fecha = estadoUI.fechaVisor;
    if (fecha == null) fecha = Math.max(0, resultados.length - 1);
    fecha = limitar(fecha, 0, Math.max(0, resultados.length - 1));

    const fila = resultados[fecha];
    if (!fila || !fila.length) {
        return vVacio("calendario", "Sin resultados", "Todavía no se jugó esta fecha.");
    }

    return "<div class='fila sep' style='margin-bottom:10px'>" +
        "<button class='btn-icono' data-accion='fecha-mover' data-delta='-1' " + (fecha <= 0 ? "disabled" : "") + ">" + icono("izquierda", "", 16) + "</button>" +
        "<strong class='num' style='font-size:18px'>Fecha " + (fecha + 1) + "</strong>" +
        "<button class='btn-icono' data-accion='fecha-mover' data-delta='1' " + (fecha >= resultados.length - 1 ? "disabled" : "") + ">" + icono("derecha", "", 16) + "</button>" +
        "</div>" +
        "<button class='btn-fantasma' data-accion='fecha-hoy' style='margin-bottom:8px'>Ir a la última jugada</button>" +
        "<div>" + fila.map(function(r, i) {
            return "<div class='resultado clicable' data-accion='ver-partido' data-liga='" + ligaId + "' data-fecha='" + fecha + "' data-idx='" + i + "'>" +
                "<div class='resultado-eq local'><span>" + escapar(r.local) + "</span>" + htmlEscudo(r.localId, r.local, 20) + "</div>" +
                "<div class='resultado-marca " + (r.incidencia ? "incidencia" : "") + "'>" + r.golesLocal + " - " + r.golesVisitante + "</div>" +
                "<div class='resultado-eq'><span>" + escapar(r.visitante) + "</span>" + htmlEscudo(r.visitanteId, r.visitante, 20) + "</div>" +
                "</div>";
        }).join("") + "</div>";
}

function moverVisorFecha(delta) {
    const ligaId = estadoUI.liga;
    const resultados = estadoLigas.resultados[ligaId] || [];
    const max = Math.max(0, resultados.length - 1);
    estadoUI.fechaVisor = limitar((estadoUI.fechaVisor || 0) + delta, 0, max);
    refrescar();
}
