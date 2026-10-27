// ============================================
// VISTAS: pantallas del juego (parte 2)
// ============================================

// -----------------------------
// MERCADO DE PASES
// -----------------------------

function vistaMercado() {
    const resumen = resumenMercado();
    const pendientes = ofertasPendientes();
    const figuras = estadoMercado.figuras.slice().sort(function(a, b) { return b.valor - a.valor; });
    const proxima = MERCADO_VENTANAS.filter(function(f) { return f > estadoLigas.fechaActual; })[0];

    const ofertasHTML = pendientes.length ? pendientes.map(function(o) {
        const f = estadoMercado.figuras.filter(function(x) { return x.id === o.figuraId; })[0];
        const club = EQUIPOS[o.clubId];
        if (!f) return "";
        return "<div class='oferta-mercado'>" +
            "<div class='oferta-cab'>" +
            "<span class='pos-badge pos-" + f.posicion.toLowerCase() + "'>" + f.posicion + "</span>" +
            "<div class='crecer'><strong>" + escapar(f.nombre) + "</strong>" +
            "<div class='mini tenue'>" + escapar(club ? club.nombre : "") + " · " + f.edad + " años</div></div>" +
            "<div class='oferta-monto'>" + fmt.plata(o.monto) + "<span class='mini tenue'>de " + escapar(o.comprador) + "</span></div>" +
            "</div>" +
            "<div class='oferta-acciones'>" +
            "<button class='btn' data-accion='mercado-decidir' data-id='" + o.id + "' data-decision='vender'>Aprobar <span class='mini pos'>+" + fmt.plata(comisionAFA(o.monto)) + "</span></button>" +
            "<button class='btn' data-accion='mercado-decidir' data-id='" + o.id + "' data-decision='renegociar'>Renegociar</button>" +
            "<button class='btn-suave' data-accion='mercado-decidir' data-id='" + o.id + "' data-decision='retener'>Retener</button>" +
            "</div></div>";
    }).join("") : "<p class='chico suave'>No hay ofertas sobre la mesa. Las ventanas se abren en las fechas " + MERCADO_VENTANAS.join(" y ") + ".</p>";

    const filas = figuras.slice(0, 14).map(function(f) {
        const club = EQUIPOS[f.clubId];
        return "<tr class='" + (f.vendido ? "vendido" : "") + "'>" +
            "<td><span class='pos-badge pos-" + f.posicion.toLowerCase() + "'>" + f.posicion + "</span></td>" +
            "<td><strong>" + escapar(f.nombre) + "</strong></td>" +
            "<td class='mini tenue'>" + escapar(club ? club.nombre : "") + "</td>" +
            "<td class='num centro'>" + f.edad + "</td>" +
            "<td class='num centro'>" + f.nivel + "</td>" +
            "<td class='num derecha'>" + (f.vendido ? "<span class='tag gris'>vendido</span>" : fmt.plata(f.valor)) + "</td>" +
            "</tr>";
    }).join("");

    const historial = resumen.historial.length ? resumen.historial.map(function(h) {
        return "<div class='lista-item'>" +
            "<span class='lista-avatar'>" + icono("maletin", "tenue", 16) + "</span>" +
            "<span class='lista-cuerpo'><span class='lista-titulo'>" + escapar(h.figura) + " → " + escapar(h.comprador) + "</span>" +
            "<span class='lista-sub'>" + escapar(h.club) + " · " + escapar(h.decision) + "</span></span>" +
            "<span class='lista-meta'>" + fmt.plata(h.monto) + "</span></div>";
    }).join("") : vVacio("maletin", "Sin operaciones", "Las ventanas de pases llegan dos veces por temporada.");

    return "<div class='pantalla'>" +
        vCabecera("Mercado de pases", "Los europeos vienen por las figuras del torneo. La AFA cobra el 8% de solidaridad y los clubes se quedan sin su joya.",
            "<button class='btn' data-accion='ayuda-mercado'>" + icono("info", "", 16) + "Cómo funciona</button>") +
        "<div class='grid grid-4'>" +
        vStat("Ventanas", resumen.ventanas, proxima ? "Próxima: fecha " + proxima : "Cerradas por este año") +
        vStat("Figuras", resumen.figuras, resumen.vendidas + " vendidas") +
        vStat("Vendido", fmt.plata(resumen.totalVendido), "Total de las operaciones") +
        vStat("Solidaridad AFA", fmt.plata(Math.round(resumen.totalVendido * 0.08)), "8% de cada venta") +
        "</div>" +
        vPanel("Ofertas sobre la mesa", "maletin", ofertasHTML, { meta: pendientes.length + " pendientes" }) +
        "<div class='grid grid-hero'>" +
        vPanel("Figuras del torneo", "usuario",
            "<div class='tabla-wrap'><table class='tabla compacta'><thead><tr><th>Pos</th><th>Jugador</th><th>Club</th><th class='centro'>Edad</th><th class='centro'>Nivel</th><th class='derecha'>Valor</th></tr></thead>" +
            "<tbody>" + filas + "</tbody></table></div>", { ajustado: true }) +
        vPanel("Últimas operaciones", "lista", historial) +
        "</div>" +
        "</div>";
}

// -----------------------------
// COPAS
// -----------------------------

function vistaCopas() {
    const tab = estadoUI.copaTab || "argentina";
    const tabs = [
        { id: "argentina", nombre: "Copa Argentina" },
        { id: "libertadores", nombre: "Libertadores" },
        { id: "sudamericana", nombre: "Sudamericana" },
        { id: "america", nombre: "Copa América" },
        { id: "supercopa", nombre: "Supercopa" },
        { id: "ligapro", nombre: "Copa de la Liga" },
        { id: "mundialclubes", nombre: "Mundial de Clubes" }
    ].map(function(t) {
        return "<button class='seg " + (tab === t.id ? "activo" : "") + "' data-accion='tab-copa' data-tab='" + t.id + "'>" + t.nombre + "</button>";
    }).join("");

    let cuerpo = "";
    if (tab === "argentina") cuerpo = copaArgentinaHTML();
    else if (tab === "america") cuerpo = copaAmericaHTML();
    else if (tab === "supercopa") cuerpo = (typeof panelSupercopa === "function" ? panelSupercopa() : "");
    else if (tab === "ligapro") cuerpo = (typeof copaLigaHTML === "function" ? copaLigaHTML() : "");
    else if (tab === "mundialclubes") cuerpo = (typeof mundialClubesHTML === "function" ? mundialClubesHTML() : "");
    else cuerpo = continentalHTML(tab);

    return "<div class='pantalla'>" +
        vCabecera("Copas", "Todo el fútbol de eliminación directa, con los clubes argentinos y la Selección.") +
        "<div class='segmented'>" + tabs + "</div>" +
        cuerpo +
        "</div>";
}

function copaArgentinaHTML() {
    const estado = estadoCopaArgentina;
    const historial = (typeof obtenerHistorialCopaArgentina === "function") ? obtenerHistorialCopaArgentina() : (estado.historial || []);

    if (!estado.bracket || !estado.bracket.length) {
        return vPanel("Copa Argentina", "trofeo",
            "<p class='chico suave'>Participan los " + clubesAsamblea().length + " clubes del país. La primera ronda se juega en la fecha 5.</p>" +
            (historial.length ? "<h4 class='seccion-mini'>Historial</h4>" + historial.slice(-3).reverse().map(function(h) {
                return "<div class='metrica-fila'><span>Año " + h.anio + "</span><strong>" + escapar(h.campeon) + "</strong></div>";
            }).join("") : ""));
    }

    const rondas = estado.bracket.slice().reverse().map(function(r) {
        const partidos = (r.partidos || []).map(function(p) {
            return "<div class='partido-copa'>" +
                "<span class='" + (p.ganadorId === p.localId ? "gana" : "pierde") + "'>" + escapar(p.local) + "</span>" +
                "<span class='resultado-marca'>" + p.golesLocal + " - " + p.golesVisitante + (p.penales ? " <span class='mini tenue'>(" + p.penales + ")</span>" : "") + "</span>" +
                "<span class='" + (p.ganadorId === p.visitanteId ? "gana" : "pierde") + "'>" + escapar(p.visitante) + "</span>" +
                "</div>";
        }).join("");
        return "<div class='llave-ronda'>" +
            "<div class='llave-ronda-cab'><span>" + escapar(r.nombre) + "</span><span class='tenue'>" + (r.partidos || []).length + " partidos</span></div>" +
            partidos +
            "" +
            "</div>";
    }).join("");

    return "<div class='grid grid-hero'>" +
        vPanel("Ronda actual", "trofeo", rondas || vVacio("trofeo", "Sin partidos", "La copa arranca en la fecha 5."),
            { meta: estado.rondaActual + " rondas jugadas" }) +
        vPanel("Historial", "medalla", historial.length ? historial.slice().reverse().map(function(h) {
            return "<div class='metrica-fila'><span>Año " + h.anio + "</span><strong class='oro'>" + escapar(h.campeon) + "</strong></div>";
        }).join("") : vVacio("medalla", "Sin campeones", "Todavía no se definió ninguna edición.")) +
        "</div>";
}

function continentalHTML(tipo) {
    const historial = typeof historialContinentales !== "undefined" ? historialContinentales : [];
    if (!historial.length) {
        return vPanel(tipo === "libertadores" ? "Copa Libertadores" : "Copa Sudamericana", "copa",
            vVacio("copa", "Sin edición jugada", "Se juega al final de cada temporada con los mejores 8 clubes argentinos."));
    }
    const ultimo = historial[historial.length - 1];
    const campanas = (tipo === "libertadores" ? ultimo.libertadores : ultimo.sudamericana) || [];

    const filas = campanas.slice().sort(function(a, b) {
        const orden = { campeon: 0, final: 1, semis: 2, cuartos: 3, octavos: 4, grupos: 5 };
        return (orden[a.etapa] || 9) - (orden[b.etapa] || 9);
    }).map(function(c) {
        return "<div class='lista-item'>" +
            "<span class='lista-avatar'>" + htmlEscudo(c.clubId, c.club, 26) + "</span>" +
            "<span class='lista-cuerpo'><span class='lista-titulo'>" + escapar(c.club) +
            (c.etapa === "campeon" ? " <span class='tag oro'>campeón</span>" : "") + "</span>" +
            "<span class='lista-sub'>" + nombreEtapaCorta(c.etapa) + "</span></span>" +
            "<span class='lista-meta'>Fuerza " + Math.round(c.fuerza) + "</span></div>";
    }).join("");

    const campeon = campanas.filter(function(c) { return c.etapa === "campeon"; })[0];

    return "<div class='grid grid-hero'>" +
        vPanel(tipo === "libertadores" ? "Copa Libertadores" : "Copa Sudamericana", "copa",
            filas || vVacio("copa", "Sin campañas"), { meta: "Año " + ultimo.anio }) +
        vPanel("Resumen", "medalla",
            vMetrica("Campeón", campeon ? campeon.club : "Sin argentino", campeon ? "oro" : "") +
            vMetrica("Equipos argentinos", campanas.length) +
            vMetrica("Dinero ingresado", fmt.plata(ultimo.dineroTotal || 0), "pos") +
            vMetrica("Prestigio ganado", "+" + (ultimo.prestigioTotal || 0)) +
            "<p class='mini tenue' style='margin-top:12px'>Los cuatro primeros de la tabla anual van a la Libertadores; del 5° al 8°, a la Sudamericana.</p>") +
        "</div>";
}

function nombreEtapaCorta(etapa) {
    const mapa = {
        grupos: "Fase de grupos",
        octavos: "Octavos de final",
        cuartos: "Cuartos de final",
        semis: "Semifinales",
        final: "Subcampeón",
        campeon: "Campeón"
    };
    return mapa[etapa] || etapa;
}

function copaAmericaHTML() {
    const copa = copaActual;
    const historial = typeof historialCopas !== "undefined" ? historialCopas : [];

    if (!copa) {
        return vPanel("Copa América", "bandera",
            vVacio("bandera", "Sin edición en curso", "Se juega al final del Año 1 y del Año 3. La Selección tiene que estar a la altura.") +
            (historial.length ? "<h4 class='seccion-mini'>Historial</h4>" + historial.slice().reverse().map(function(c) {
                return "<div class='metrica-fila'><span>Año " + c.anio + "</span><strong>" + escapar(c.final ? c.final.ganador : "—") + "</strong></div>";
            }).join("") : ""));
    }

    const final = copa.final || {};
    const partido = function(p) {
        if (!p || !p.equipoA) return "";
        return "<div class='partido-copa'><span class='" + (p.ganador === p.equipoA ? "gana" : "pierde") + "'>" + escapar(p.equipoA) + "</span>" +
            "<span class='resultado-marca'>" + p.golesA + " - " + p.golesB + "</span>" +
            "<span class='" + (p.ganador === p.equipoB ? "gana" : "pierde") + "'>" + escapar(p.equipoB) + "</span></div>";
    };

    const gruposHTML = Object.keys(copa.grupos || {}).map(function(g) {
        const tabla = (copa.resultadosGrupos && copa.resultadosGrupos[g] && copa.resultadosGrupos[g].tabla) || [];
        if (!tabla.length) {
            return "<div class='metrica-fila'><span>Grupo " + g + "</span><strong>" + (copa.grupos[g] || []).map(function(e) { return escapar(e.nombre); }).join(" · ") + "</strong></div>";
        }
        return "<div class='llave-ronda'><div class='llave-ronda-cab'><span>Grupo " + g + "</span></div>" +
            tabla.map(function(t, i) {
                return "<div class='metrica-fila'><span>" + (i + 1) + ". " + escapar(t.nombre) + (i < 2 ? " <span class='tag verde'>clasifica</span>" : "") + "</span>" +
                    "<strong>" + t.Pts + " pts · " + (t.DG > 0 ? "+" : "") + t.DG + "</strong></div>";
            }).join("") + "</div>";
    }).join("");

    return "<div class='grid grid-hero'>" +
        vPanel("Copa América " + copa.anio, "bandera",
            "<div class='aviso " + (copa.posicionArgentina === "campeon" ? "verde" : copa.posicionArgentina === "grupos" ? "rojo" : "azul") + "' style='margin-bottom:14px'>" +
            icono("bandera", "", 18) + "<div><div class='aviso-titulo'>Argentina: " + textoPosicionCopa(copa.posicionArgentina) + "</div>" +
            "<div class='aviso-texto'>Torneo de 12 selecciones en tres grupos, con cuartos, semis y final.</div></div></div>" +
            "<h4 class='seccion-mini'>Fase final</h4>" +
            (copa.cuartos || []).map(partido).join("") +
            (copa.semis && copa.semis.length ? "<div class='mini tenue' style='margin:8px 0 2px'>Semifinales</div>" + copa.semis.map(partido).join("") : "") +
            (final.equipoA ? "<div class='mini tenue' style='margin:8px 0 2px'>Final</div>" + partido(final) +
                "<div class='centro mini tenue' style='margin-top:8px'>Campeón: <strong class='oro'>" + escapar(final.ganador) + "</strong></div>" : "")) +
        vPanel("Grupos", "lista", gruposHTML) +
        "</div>";
}

function textoPosicionCopa(pos) {
    const mapa = { campeon: "campeón", subcampeon: "subcampeón", semis: "semifinales", cuartos: "cuartos", grupos: "eliminado en grupos" };
    return mapa[pos] || "sin participación";
}

// -----------------------------
// SELECCIÓN
// -----------------------------

function vistaSeleccion() {
    const ranking = obtenerRanking();
    const historialRanking = obtenerHistorialRanking();
    const amistosos = typeof historialAmistosos !== "undefined" ? historialAmistosos : [];
    const copas = typeof historialCopas !== "undefined" ? historialCopas : [];
    const plantel = plantelSeleccion();
    const top = jugadoresConvocados().slice().sort(function(a, b) { return b.nivel - a.nivel; }).slice(0, 7);

    const serieRanking = historialRanking.slice(-12).map(function(h) { return 16 - h.puesto; });

    const amistososHTML = amistosos.length ? amistosos.slice().reverse().map(function(a) {
        return "<div class='resultado'>" +
            "<div class='resultado-eq local'><span>Argentina</span>" + htmlBandera("argentina", 22) + "</div>" +
            "<div class='resultado-marca'>" + a.golesArg + " - " + a.golesRival + "</div>" +
            "<div class='resultado-eq'><span>" + escapar(a.rival) + "</span>" + htmlBandera(a.rival, 22) + "</div>" +
            "</div>";
    }).join("") : vVacio("calendario", "Sin amistosos", "Se juegan cuatro por temporada.");

    const filasTop = top.map(function(j, i) {
        return "<div class='lista-item'>" +
            "<span class='lista-avatar'><span class='pos-badge pos-" + j.posicion.toLowerCase() + "'>" + j.posicion + "</span></span>" +
            "<span class='lista-cuerpo'><span class='lista-titulo'>" + escapar(j.nombre) +
            (j.capitan ? " <span class='tag oro'>capitán</span>" : "") + "</span>" +
            "<span class='lista-sub'>" + escapar(j.club) + " · " + j.edad + " años</span></span>" +
            "<span class='lista-meta num' style='font-size:17px'>" + j.nivel + "</span></div>";
    }).join("");

    return "<div class='pantalla'>" +
        vCabecera("Selección argentina", "El equipo de todos. El DT que elegiste, la convocatoria, la tanda y el camino internacional.",
            "<button class='btn' data-accion='abrir-convocatoria'>" + icono("lista", "", 16) + "Convocatoria</button>" +
            "<button class='btn' data-accion='jugar-tanda'>" + icono("objetivo", "", 16) + "Tanda de penales</button>") +
        "<div class='grid grid-3'>" +
        vStat("Ranking FIFA", "#" + ranking, ranking <= 3 ? "Potencia mundial" : ranking <= 8 ? "Entre los mejores" : "Necesita resultados",
            serieRanking.length > 1 ? Charts.sparkline(serieRanking, { color: "#6aa9ff", alto: 40 }) : "") +
        vStat("DT", presidente.seleccionador || "Vacante", "Fuerza " + fuerzaDTActual() + " · " + fmt.plata(sueldoDTActual()) + " por año") +
        vStat("Convocados", promedioConvocados(), (estadoSeleccion.convocados || []).length + " / " + CONVOCADOS_TOTAL + " · " + (convocatoriaValida() ? "lista" : "incompleta")) +
        "</div>" +
        (typeof panelEliminatorias === "function" ? panelEliminatorias() : "") +
        "<div class='grid grid-hero'>" +
        vPanel("Los mejores del plantel", "usuario", filasTop || vVacio("usuario", "Sin plantel"),
            { meta: "Convocados: " + promedioConvocados(), pie: "<span class='mini tenue'>" + mensajeConvocatoria() + "</span><button class='btn-fantasma' data-accion='abrir-convocatoria'>Editar lista " + icono("derecha", "", 14) + "</button>" }) +
        "<div class='col' style='gap:16px'>" +
        vPanel("Amistosos", "bandera", amistososHTML, { meta: amistosos.length + " jugados" }) +
        vPanel("Ranking", "globo", historialRanking.length ? historialRanking.slice(-6).reverse().map(function(h) {
            return "<div class='metrica-fila'><span>" + escapar(h.motivo || "Actualización") + "</span><strong class='" + (h.cambio > 0 ? "pos" : h.cambio < 0 ? "neg" : "") + "'>#" + h.puesto + "</strong></div>";
        }).join("") : vVacio("globo", "Sin movimientos", "El ranking se mueve con amistosos y copas.")) +
        "</div>" +
        "</div>" +
        "</div>";
}

// -----------------------------
// ÁRBITROS
// -----------------------------

function vistaArbitros() {
    const ranking = obtenerRankingArbitros("primera");
    const incidencias = incidenciasHistoricas.slice(-6).reverse();
    const delAnio = incidenciasHistoricas.filter(function(i) { return i.anio === presidente.anioMandato; });
    const bajoLupa = ranking.filter(function(a) { return a.sospechoso; })[0];

    const filas = ranking.map(function(a, i) {
        const dirigidos = Object.keys(designacionesPorFecha).filter(function(k) { return designacionesPorFecha[k] === a.id; }).length;
        return "<tr class='clicable' data-accion='arbitro' data-id='" + a.id + "'>" +
            "<td class='num'>" + (i + 1) + "</td>" +
            "<td><strong>" + escapar(a.nombre) + "</strong>" +
            (a.sancionado ? " <span class='tag rojo'>sancionado</span>" : "") +
            (a.sospechoso ? " <span class='tag oro'>bajo la lupa</span>" : "") + "</td>" +
            "<td class='num centro'>" + a.nivel + "</td>" +
            "<td class='centro oculto-movil'>" + escapar(a.estilo) + "</td>" +
            "<td class='num centro'>" + dirigidos + "</td>" +
            "<td class='num centro'>" + a.incidencias + "</td>" +
            "<td class='num centro " + (a.confiabilidad >= 80 ? "pos" : a.confiabilidad >= 60 ? "" : "neg") + "'>" + Math.round(a.confiabilidad) + "</td>" +
            "</tr>";
    }).join("");

    const incidenciasHTML = incidencias.length ? incidencias.map(function(i) {
        const fav = i.clubFavorecidoId && EQUIPOS[i.clubFavorecidoId] ? EQUIPOS[i.clubFavorecidoId].nombre : null;
        return "<div class='polemica-item'>" +
            "<div class='polemica-cab'><span class='tag rojo'>" + escapar(nombreTipoIncidencia(i.tipo)) + "</span>" +
            "<strong>" + escapar(i.local) + " vs " + escapar(i.visitante) + "</strong>" +
            "<span class='crecer'></span><span class='mini tenue'>F" + ((i.fecha || 0) + 1) + "</span></div>" +
            "<div class='polemica-texto'>" + escapar(i.descripcion) + "</div>" +
            (fav ? "<div class='mini tenue'>Favoreció a " + escapar(fav) + "</div>" : "") +
            "</div>";
    }).join("") : vVacio("check", "Sin escándalos", "El cuerpo arbitral está tranquilo.");

    return "<div class='pantalla'>" +
        vCabecera("Cuerpo arbitral", "Nivel, confiabilidad y polémicas. Podés sancionar, mandar al Federal, sentarte en la mesa de designaciones o mandar un veedor.",
            "<button class='btn-suave' data-accion='abrir-veedor'>" + icono("ojo", "", 16) + "Veedor</button>" +
            "<button class='btn' data-accion='abrir-designaciones'>" + icono("balanza", "", 16) + "Mesa de designaciones</button>") +
        "<div class='grid grid-4'>" +
        vStat("VAR", presidente.varActivo ? "Activo" : "Apagado", presidente.varActivo ? "−50% de errores · " + fmt.plata(-500) + " por año" : "Sin costo · más polémica") +
        vStat("Árbitros", ranking.length, "en Primera") +
        vStat("Polémicas del año", delAnio.length, "en " + (estadoLigas.fechaActual + 1) + " fechas") +
        vStat("Bajo la lupa", bajoLupa ? bajoLupa.nombre.split(" ")[0] : "Ninguno", bajoLupa ? "sospechoso de favorecer" : "sin sospechas") +
        "</div>" +
        "<div class='grid grid-hero'>" +
        vPanel("Ranking de confiabilidad", "balanza",
            "<div class='tabla-wrap'><table class='tabla'><thead><tr><th>#</th><th>Árbitro</th><th class='centro'>Nivel</th><th class='centro oculto-movil'>Estilo</th><th class='centro'>PJ</th><th class='centro'>Inc.</th><th class='centro'>Conf.</th></tr></thead>" +
            "<tbody>" + filas + "</tbody></table></div>", { meta: "Tocá un árbitro para ver el legajo" }) +
        vPanel("Últimas polémicas", "alerta", incidenciasHTML) +
        "</div>" +
        (typeof historialArbitralHTML === "function" ?
            "<div class='grid grid-2'>" +
            vPanel("Últimos partidos arbitrados", "calendario", historialArbitralHTML()) +
            vPanel("Sanciones", "alerta", sancionesArbitralesHTML()) +
            "</div>" : "") +
        "</div>";
}

// -----------------------------
// FINANZAS
// -----------------------------

function vistaFinanzas() {
    const resumen = obtenerResumenFinanciero();
    const libro = resumen.libro.slice(-14).reverse();
    const porConcepto = {};
    resumen.libro.forEach(function(l) {
        if (l.monto >= 0) return;
        const clave = l.concepto;
        porConcepto[clave] = (porConcepto[clave] || 0) + Math.abs(l.monto);
    });
    const topConceptos = Object.keys(porConcepto).sort(function(a, b) { return porConcepto[b] - porConcepto[a]; }).slice(0, 6);

    return "<div class='pantalla'>" +
        vCabecera("Finanzas", "Cada fecha entra y sale plata. Acá ves el detalle, sin sorpresas de fin de año.",
            "<button class='btn' data-accion='pedir-prestamo'>" + icono("dinero", "", 16) + "Pedir préstamo</button>") +

        "<div class='grid grid-4'>" +
        vStat("Caja", fmt.plata(presidente.dineroEnCaja), "Disponible hoy") +
        vStat("Ingresos del año", fmt.plata(resumen.ingresos), "TV, sponsor y taquilla", "") +
        vStat("Egresos del año", fmt.plata(-resumen.egresos), "Estructura, DT y VAR") +
        vStat("Resultado", fmt.plata(resumen.balance), resumen.balance >= 0 ? "El año cierra en verde" : "El año cierra en rojo") +
        "</div>" +

        "<div class='grid grid-hero'>" +
        vPanel("Evolución de la caja", "grafico",
            Charts.sparkline(serieHistorial("dinero", 30), { color: "#f0c869", alto: 90 }) +
            "<div class='fila sep mini tenue' style='margin-top:8px'><span>Inicio de gestión</span><span>Hoy: " + fmt.plata(presidente.dineroEnCaja) + "</span></div>") +
        vPanel("Contratos", "maletin",
            "<div class='contrato'>" +
            "<div class='contrato-cab'>" + icono("diario", "tenue", 16) + "<strong>Televisión</strong><span class='crecer'></span><span class='mini tenue'>vence año " + estadoFinanzas.tv.venceAnio + "</span></div>" +
            "<div class='num' style='font-size:24px'>" + fmt.plata(estadoFinanzas.tv.montoAnual) + " <span class='mini tenue'>/ año</span></div>" +
            "</div>" +
            "<div class='contrato'>" +
            "<div class='contrato-cab'>" + icono("maletin", "tenue", 16) + "<strong>" + (resumen.sponsor ? escapar(resumen.sponsor.nombre) : "Sin sponsor") + "</strong>" +
            "<span class='crecer'></span><span class='mini tenue'>" + (resumen.sponsor ? "vence año " + resumen.sponsor.venceAnio : "—") + "</span></div>" +
            "<div class='num' style='font-size:24px'>" + (resumen.sponsor ? fmt.plata(resumen.sponsor.montoBase) : "—") + " <span class='mini tenue'>/ año</span></div>" +
            "</div>" +
            (resumen.prestamos.length ? "<h4 class='seccion-mini'>Préstamos activos</h4>" + resumen.prestamos.map(function(p) {
                return "<div class='metrica-fila'><span>" + fmt.plata(p.monto) + " · " + Math.round(p.tasa * 1000) / 10 + "%</span><strong>" + p.cuotasRestantes + " cuotas</strong></div>";
            }).join("") : "")) +
        "</div>" +

        "<div class='grid grid-hero'>" +
        vPanel("Movimientos recientes", "lista",
            "<div class='tabla-wrap'><table class='tabla compacta'><thead><tr><th>Fecha</th><th>Concepto</th><th class='derecha'>Monto</th></tr></thead><tbody>" +
            libro.map(function(l) {
                return "<tr><td class='num tenue'>F" + (l.fecha + 1) + "</td><td>" + escapar(l.concepto) + "</td>" +
                    "<td class='num derecha " + (l.monto >= 0 ? "pos" : "neg") + "'>" + fmt.plata(l.monto) + "</td></tr>";
            }).join("") + "</tbody></table></div>", { ajustado: true }) +
        vPanel("En qué se va la plata", "grafico",
            Charts.barras(topConceptos.map(function(c) {
                return { nombre: c, valor: porConcepto[c], texto: fmt.plata(-porConcepto[c]), color: "#ff6f5e" };
            })) +
            "<p class='mini tenue' style='margin-top:12px'>Un club en crisis te puede costar hasta " + fmt.plata(4500) + " de rescate.</p>") +
        "</div>" +
        "</div>";
}

// -----------------------------
// PRENSA
// -----------------------------

function vistaPrensa() {
    const noticias = noticiasHistoricas.slice().reverse();
    const encuesta = typeof obtenerUltimaEncuesta === "function" ? obtenerUltimaEncuesta() : null;
    const relacion = typeof relacionPrensaMedia === "function" ? relacionPrensaMedia() : 50;

    const notas = noticias.slice(0, 12).map(function(n) {
        return "<article class='nota' style='--medio:" + colorMedio(n.medio) + "'>" +
            "<div class='nota-medio'>" + icono("diario", "", 12) + escapar(n.medio || "Prensa") + "</div>" +
            "<h4 class='nota-titulo'>" + escapar(n.titulo) + "</h4>" +
            "<p class='nota-texto'>" + escapar(n.cuerpo) + "</p>" +
            "<div class='nota-pie'>" + escapar(n.fecha || "") + "</div>" +
            "</article>";
    }).join("");

    return "<div class='pantalla'>" +
        vCabecera("Prensa", "Lo que se dice de tu gestión. La relación con los medios también pesa en el consejo.") +
        (typeof panelTapa === "function" ? panelTapa() : "") +
        (encuesta ? "<div class='grid grid-2'>" +
            vPanel("Encuesta de opinión", "grafico",
                "<div class='fila sep' style='margin-bottom:10px'><span class='mini tenue'>Aprobación</span><strong class='pos'>" + encuesta.aprobacion + "%</strong></div>" +
                "<div class='progreso'><span style='width:" + encuesta.aprobacion + "%'></span></div>" +
                "<div class='fila sep' style='margin-top:12px'><span class='mini tenue'>Desaprobación</span><strong class='neg'>" + encuesta.desaprobacion + "%</strong></div>" +
                "<div class='progreso rojo'><span style='width:" + encuesta.desaprobacion + "%'></span></div>" +
                (encuesta.motivos && encuesta.motivos.length ? "<p class='mini suave' style='margin-top:12px'>" + escapar(encuesta.motivos[0]) + "</p>" : ""),
                { meta: "Año " + encuesta.anio + " · Fecha " + ((encuesta.fecha || 0) + 1) }) +
            vPanel("Relación con los medios", "mensaje",
                Charts.gauge(relacion, { etiqueta: "Relación", ancho: 170, alto: 96 }) +
                "<p class='mini suave'>Una buena relación con la prensa suma prestigio y calma al consejo. Las conferencias son tu herramienta.</p>") +
            "</div>" : "") +
        vPanel("Titulares", "diario", notas || vVacio("diario", "Sin noticias", "Jugá algunas fechas para ver los titulares."), { meta: noticias.length + " notas" }) +
        panelStreaming() +
        "</div>";
}

function panelStreaming() {
    const tarjetas = STREAMERS.map(function(s) {
        const color = s.opinion >= 60 ? "#3ddc84" : s.opinion >= 40 ? "#f0c869" : "#ff6f5e";
        return "<div class='streamer-card'>" +
            "<span class='streamer-avatar' style='background:linear-gradient(140deg," + s.color + "," + s.color + "aa)'>" +
            escapar(iniciales(s.nombre)) + "</span>" +
            "<div class='crecer'><strong>" + escapar(s.nombre) + "</strong>" +
            "<div class='mini tenue'>" + escapar(s.perfil) + " · " + fmt.num(s.seguidores) + "k seguidores</div>" +
            "<div class='progreso' style='margin-top:5px'><span style='width:" + s.opinion + "%;background:" + color + "'></span></div></div>" +
            "<span class='num' style='color:" + color + "'>" + s.opinion + "</span>" +
            "</div>";
    }).join("");

    const clips = clipsStreaming(5).map(function(c) {
        return "<div class='clip' style='border-left-color:" + c.color + "'>" +
            "<div class='clip-cab'><span class='clip-medio' style='color:" + c.color + "'>" + escapar(c.streamer) + "</span>" +
            "<span class='crecer'></span><span class='mini tenue'>" + fmt.num(c.alcance) + "k views</span></div>" +
            "<div class='clip-titulo'>" + escapar(c.titulo) + "</div>" +
            "<div class='clip-texto'>" + escapar(c.texto) + "</div>" +
            (c.efecto ? "<div class='mini tenue' style='margin-top:4px'>" + escapar(c.efecto) + "</div>" : "") +
            "</div>";
    }).join("");

    return vPanel("Streaming", "mensaje",
        "<div class='streamers'>" + tarjetas + "</div>" +
        (clips ? "<h4 class='seccion-mini'>Últimos clips</h4>" + clips : vVacio("mensaje", "Sin clips todavía", "Los streamers opinan después de cada fecha.")),
        { meta: "Opinión media " + opinionStreamingMedia() }
    );
}

function colorMedio(medio) {
    const colores = {
        "TyC Sports": "#3ddc84", "ESPN Argentina": "#ff6f5e", "Infobae Deportes": "#6aa9ff",
        "La Nación Deportiva": "#f0c869", "Clarín Deportivo": "#b18cff", "Olé": "#ff8fb1",
        "Azz": "#8ee6a8", "DSports": "#f0c869", "Fox Sports Argentina": "#6aa9ff", "Pablo Giralt": "#b18cff"
    };
    return colores[medio] || "#3ddc84";
}

// -----------------------------
// LEGADO
// -----------------------------

function vistaLegado() {
    const puntos = puntajeLegado();
    const rango = rangoLegado(puntos);
    const logros = LOGROS.map(function(l) {
        const hecho = !!logrosDesbloqueados[l.id];
        return "<div class='logro " + (hecho ? "" : "bloqueado") + "'>" +
            "<span class='logro-ico'>" + icono(l.icono, "", 17) + "</span>" +
            "<div class='crecer'><div class='logro-nombre'>" + l.nombre + "</div>" +
            "<div class='logro-desc'>" + l.desc + "</div></div>" +
            (hecho ? "<span class='tag verde'>hecho</span>" : "<span class='tag gris'>pendiente</span>") +
            "</div>";
    }).join("");

    const asambleas = estadoAsamblea.historial.map(function(e) {
        return "<div class='metrica-fila'><span>Año " + e.anio + "</span><strong class='" + (e.gana ? "pos" : "neg") + "'>" +
            Math.round(e.pct * 100) + "% · " + (e.gana ? "reelegido" : "sin apoyo") + "</strong></div>";
    }).join("");

    const historialFin = estadoFinanzas.historial.map(function(h) {
        return "<div class='metrica-fila'><span>Año " + h.anio + "</span><strong class='" + (h.balance >= 0 ? "pos" : "neg") + "'>" + fmt.plata(h.balance) + "</strong></div>";
    }).join("");

    const hitos = [];
    if (presidente.seleccionador) {
        hitos.push({ anio: 1, texto: "Elegiste a <strong>" + escapar(presidente.seleccionador) + "</strong> como DT de la Selección." });
    }
    estadoAsamblea.historial.forEach(function(e) {
        hitos.push({
            anio: e.anio,
            tono: e.gana ? "verde" : "rojo",
            texto: "Asamblea: <strong>" + Math.round(e.pct * 100) + "%</strong> de los votos. " + (e.gana ? "Te ratificaron." : "Se terminó el mandato.")
        });
    });
    (typeof historialCopas !== "undefined" ? historialCopas : []).forEach(function(c) {
        hitos.push({
            anio: c.anio,
            tono: c.posicionArgentina === "campeon" ? "oro" : "",
            texto: "Copa América: Argentina " + textoPosicionCopa(c.posicionArgentina) + "."
        });
    });
    (typeof historialContinentales !== "undefined" ? historialContinentales : []).forEach(function(h) {
        const campeon = (h.libertadores || []).filter(function(c) { return c.etapa === "campeon"; })[0];
        if (campeon) hitos.push({ anio: h.anio, tono: "oro", texto: "<strong>" + escapar(campeon.club) + "</strong> ganó la Copa Libertadores." });
    });
    Object.keys(logrosDesbloqueados).forEach(function(id) {
        const l = LOGROS.filter(function(x) { return x.id === id; })[0];
        if (!l) return;
        hitos.push({ anio: logrosDesbloqueados[id].anio, tono: "violeta", texto: "Logro: <strong>" + escapar(l.nombre) + "</strong>." });
    });
    hitos.sort(function(a, b) { return a.anio - b.anio; });

    const historia = hitos.slice(-12).map(function(h) {
        return "<div class='hito'><span class='hito-anio'>Año " + h.anio + "</span>" +
            "<span class='hito-texto " + (h.tono === "oro" ? "oro" : h.tono === "rojo" ? "neg" : h.tono === "verde" ? "pos" : "") + "'>" + h.texto + "</span></div>";
    }).join("");

    return "<div class='pantalla'>" +
        vCabecera("Legado", "Cómo te va a recordar el fútbol argentino.") +
        "<div class='legado-hero'>" +
        "<div class='legado-puntos'><span>" + puntos + "</span><small>puntos de legado</small></div>" +
        "<div><div class='legado-rango' style='color:" + rango.color + "'>" + rango.nombre + "</div>" +
        "<p class='suave'>" + rango.desc + "</p>" +
        (typeof partidaIniciada !== "undefined" && partidaIniciada ? "<p class='mini tenue'>Puntaje en curso: se consolida al final del mandato.</p>" : "") +
        "</div>" +
        "</div>" +
        "<div class='grid grid-2'>" +
        vPanel("Logros", "medalla", logros, { meta: cantidadLogros() + " / " + LOGROS.length }) +
        "<div class='col' style='gap:16px'>" +
        vPanel("Historia del mandato", "libro", historia || vVacio("libro", "Todavía no pasó nada", "Jugá una temporada completa.")) +
        vPanel("Asambleas", "bandera", asambleas || vVacio("bandera", "Todavía no hubo", "Al cierre del año la asamblea vota.")) +
        vPanel("Cierres económicos", "dinero", historialFin || vVacio("dinero", "Sin cierres", "El primer balance llega al final del año.")) +
        (typeof panelHemeroteca === "function" ? panelHemeroteca() : "") +
        "</div>" +
        "</div>" +
        "</div>";
}
