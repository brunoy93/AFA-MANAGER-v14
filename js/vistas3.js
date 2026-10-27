// ============================================
// VISTAS: inferiores y eliminatorias
// ============================================

function vistaInferiores() {
    const juveniles = juvenilesDisponibles();
    const nivel = nivelCantera();

    const tarjetas = juveniles.length ? juveniles.map(function(j) {
        const colorPot = j.potencial >= 80 ? "#3ddc84" : j.potencial >= 65 ? "#f0c869" : "#ff6f5e";
        return "<div class='juvenil-card'>" +
            "<div class='juvenil-cab'>" +
            "<span class='pos-badge pos-" + j.posicion.toLowerCase() + "'>" + j.posicion + "</span>" +
            "<div class='crecer'><strong>" + escapar(j.nombre) + "</strong>" +
            "<div class='mini tenue'>" + escapar(j.club) + " · " + j.edad + " años</div></div>" +
            "<div class='juvenil-pot' style='color:" + colorPot + "'>" + j.potencial + "</div>" +
            "</div>" +
            "<div class='progreso' style='margin:8px 0'><span style='width:" + j.potencial + "%;background:" + colorPot + "'></span></div>" +
            "<div class='mini tenue'>Nivel actual " + j.nivel + " · potencial " + j.potencial + "</div>" +
            "<div class='fila wrap' style='gap:6px;margin-top:10px'>" +
            "<button class='btn' data-accion='promover-juvenil' data-id='" + j.id + "'>Promover</button>" +
            "<button class='btn-suave' data-accion='becar-juvenil' data-id='" + j.id + "'>Beca · $200M</button>" +
            "<button class='btn-fantasma' data-accion='vender-juvenil' data-id='" + j.id + "'>Vender</button>" +
            "</div></div>";
    }).join("") : vVacio("rayo", "Sin juveniles en la camada", "Al empezar el año aparece una camada nueva.");

    return "<div class='pantalla'>" +
        vCabecera("Inferiores", "La fábrica de jugadores de la AFA. Si invertís, aparecen pibes mejores; si los vendés, entra plata y se enoja la gente.",
            "<button class='btn' data-accion='invertir-inferiores' data-monto='1000'>" + icono("dinero", "", 16) + "Invertir $1.000M</button>") +
        "<div class='grid grid-4'>" +
        vStat("Nivel de cantera", nivel + " / 100", nivel >= 70 ? "Una fábrica" : nivel >= 50 ? "En orden" : "Abandonada") +
        vStat("Juveniles", juveniles.length, "en la camada actual") +
        vStat("Potencial promedio", promedioPotencial(), "de los disponibles") +
        vStat("Invertido", fmt.plata(estadoInferiores.invertido), "en toda la partida") +
        "</div>" +
        vPanel("Inversión", "rayo",
            "<p class='mini tenue' style='margin-bottom:10px'>Cada $250M suben un punto el nivel de la cantera. Más nivel, mejores pibes.</p>" +
            "<div class='fila wrap' style='gap:8px'>" +
            "<button class='btn' data-accion='invertir-inferiores' data-monto='300'>$300M</button>" +
            "<button class='btn' data-accion='invertir-inferiores' data-monto='600'>$600M</button>" +
            "<button class='btn' data-accion='invertir-inferiores' data-monto='1000'>$1.000M</button>" +
            "</div>") +
        vPanel("La camada", "usuario", "<div class='juveniles'>" + tarjetas + "</div>", { meta: juveniles.length + " pibes" }) +
        "</div>";
}

function panelEliminatorias() {
    if (typeof estadoEliminatorias === "undefined") return "";
    const tabla = tablaEliminada().slice(0, 6);
    const pos = posicionArgentinaElim();
    const jugadas = estadoEliminatorias.ronda;
    const total = totalRondasElim();
    const mundial = estadoEliminatorias.mundial;

    const filas = tabla.map(function(t, i) {
        const esArg = t.nombre === "Argentina";
        return "<tr class='" + (esArg ? "fila-arg" : "") + "'>" +
            "<td class='num'>" + (i + 1) + "</td>" +
            "<td>" + (esArg ? htmlBandera("argentina", 16) + " " : "") + "<strong>" + escapar(t.nombre) + "</strong></td>" +
            "<td class='num centro'>" + t.pts + "</td>" +
            "<td class='num centro tenue'>" + t.dg + "</td></tr>";
    }).join("");

    return vPanel("Eliminatorias · Mundial 2030", "globo",
        "<div class='fila sep' style='margin-bottom:10px'>" +
        "<span class='mini tenue'>Ronda " + jugadas + " de " + total + "</span>" +
        "<span class='chip " + (jugadas === 0 ? "gris" : pos <= 4 ? "verde" : pos === 5 ? "oro" : "rojo") + "'>" +
        (jugadas === 0 ? "Sin jugar" : "Argentina " + pos + "°") + "</span>" +
        "</div>" +
        "<div class='tabla-wrap'><table class='tabla compacta'><thead><tr><th>#</th><th>Equipo</th><th class='centro'>Pts</th><th class='centro'>DG</th></tr></thead>" +
        "<tbody>" + filas + "</tbody></table></div>" +
        (mundial ? "<div class='aviso " + (mundial.posicion === "campeón" ? "verde" : "oro") + "' style='margin-top:12px'>" +
            icono("trofeo", "", 16) + "<div class='aviso-texto'>Mundial 2030: <strong>" + escapar(textoMundial(mundial.posicion)) + "</strong></div></div>" : ""),
        { pie: "<span class='mini tenue'>Los 4 primeros clasifican directo</span><button class='btn-fantasma' data-accion='ver-eliminatorias'>Ver tabla completa " + icono("derecha", "", 14) + "</button>" }
    );
}

// -----------------------------
// TORNEO
// -----------------------------

function vistaTorneo() {
    const seccion = estadoUI.torneoSeccion || "anual";
    const tabla = obtenerTablaOrdenada("primera");
    const lider = tabla[0];
    const promedios = tablaPromedios();
    const ultimaFecha = estadoLigas.fechaActual - 1;

    const tabs = [
        { id: "anual", nombre: "Tabla anual" },
        { id: "promedios", nombre: "Promedios" },
        { id: "ultima", nombre: "Última fecha" }
    ].map(function(s) {
        return "<button class='seg " + (seccion === s.id ? "activo" : "") + "' data-accion='seccion-torneo' data-seccion='" + s.id + "'>" + s.nombre + "</button>";
    }).join("");

    let cuerpo = "";
    let titulo = "";
    let iconoPanel = "lista";

    if (seccion === "anual") {
        titulo = "Tabla anual";
        const filas = tabla.map(function(t, i) {
            const pos = i + 1;
            const zona = pos <= 4 ? "zona-libertadores" : pos <= 8 ? "zona-sudamericana" : pos > tabla.length - 3 ? "zona-descenso" : "";
            return "<tr class='clicable " + zona + "' data-accion='club' data-id='" + t.id + "'>" +
                "<td class='num'>" + pos + "</td>" +
                "<td><div class='nombre-club'>" + htmlEscudo(t.id, t.nombre, 24) + "<span>" + escapar(t.nombre) + "</span></div></td>" +
                "<td class='num centro'>" + t.PJ + "</td>" +
                "<td class='num centro'>" + t.G + "</td>" +
                "<td class='num centro'>" + t.E + "</td>" +
                "<td class='num centro'>" + t.P + "</td>" +
                "<td class='num centro'>" + t.DG + "</td>" +
                "<td class='num centro fuerte'>" + t.Pts + "</td></tr>";
        }).join("");
        cuerpo = "<div class='tabla-wrap'><table class='tabla'><thead><tr><th>#</th><th>Equipo</th><th class='centro'>PJ</th><th class='centro'>G</th><th class='centro'>E</th><th class='centro'>P</th><th class='centro'>DG</th><th class='centro'>Pts</th></tr></thead><tbody>" + filas + "</tbody></table></div>";
    } else if (seccion === "promedios") {
        titulo = "Tabla de promedios";
        iconoPanel = "grafico";
        const filas = promedios.map(function(t, i) {
            const pos = i + 1;
            const zona = pos > promedios.length - 3 ? "zona-descenso" : "";
            return "<tr class='clicable " + zona + "' data-accion='club' data-id='" + t.id + "'>" +
                "<td class='num'>" + pos + "</td>" +
                "<td><div class='nombre-club'>" + htmlEscudo(t.id, t.nombre, 24) + "<span>" + escapar(t.nombre) + "</span></div></td>" +
                "<td class='num centro'>" + t.pts + "</td>" +
                "<td class='num centro'>" + t.pj + "</td>" +
                "<td class='num centro'>" + t.temporadas + "</td>" +
                "<td class='num centro fuerte'>" + (t.promedio ? t.promedio.toFixed(3) : "—") + "</td></tr>";
        }).join("");
        cuerpo = "<div class='tabla-wrap'><table class='tabla'><thead><tr><th>#</th><th>Equipo</th><th class='centro'>Pts</th><th class='centro'>PJ</th><th class='centro'>Temp.</th><th class='centro'>Promedio</th></tr></thead><tbody>" + filas + "</tbody></table></div>" +
            "<p class='mini tenue' style='margin-top:10px'>Los tres últimos de la tabla de promedios son los que descienden.</p>";
    } else {
        titulo = "Última fecha";
        iconoPanel = "calendario";
        const resultados = (estadoLigas.resultados.primera || [])[ultimaFecha];
        if (!resultados) {
            cuerpo = vVacio("calendario", "Todavía no se jugó ninguna fecha", "Avanzá la fecha para ver los resultados.");
        } else {
            cuerpo = "<div class='fila sep' style='margin-bottom:10px'><span class='mini tenue'>Fecha " + (ultimaFecha + 1) + "</span>" +
                "<button class='btn-fantasma' data-accion='nav' data-pantalla='clubes'>Ver todo " + icono("derecha", "", 14) + "</button></div>" +
                resultados.map(function(r, i) {
                    return "<div class='resultado clicable' data-accion='ver-partido' data-liga='primera' data-fecha='" + ultimaFecha + "' data-idx='" + i + "'>" +
                        "<div class='resultado-eq local'><span>" + escapar(r.local) + "</span>" + htmlEscudo(r.localId, r.local, 20) + "</div>" +
                        "<div class='resultado-marca " + (r.incidencia ? "incidencia" : "") + "'>" + r.golesLocal + " - " + r.golesVisitante + "</div>" +
                        "<div class='resultado-eq'><span>" + escapar(r.visitante) + "</span>" + htmlEscudo(r.visitanteId, r.visitante, 20) + "</div></div>";
                }).join("");
        }
    }

    return "<div class='pantalla'>" +
        vCabecera("Torneo", "Todo el torneo de un vistazo: la pelea por el título, los promedios del descenso y los resultados de la última fecha.",
            "<button class='btn' data-accion='nav' data-pantalla='clubes'>" + icono("escudo", "", 16) + "Ver clubes</button>") +
        "<div class='grid grid-3'>" +
        vStat("Puntero", lider ? lider.nombre : "—", lider ? lider.Pts + " puntos" : "Sin jugar") +
        vStat("Goleador", ((tablaGoleadores(1)[0] || {}).nombre) || "—", ((tablaGoleadores(1)[0] || {}).goles || 0) + " goles") +
        vStat("Descenso", promedios[promedios.length - 1] ? promedios[promedios.length - 1].nombre : "—", "último en promedios") +
        "</div>" +
        "<div class='segmented'>" + tabs + "</div>" +
        vPanel(titulo, iconoPanel, cuerpo, { ajustado: seccion === "anual" }) +
        panelClasicos() +
        "</div>";
}

function panelClasicos() {
    if (typeof clasicosHistorial !== "function") return "";
    const historial = clasicosHistorial();
    if (!historial.length) {
        return vPanel("Clásicos", "escudo", vVacio("escudo", "Sin clásicos jugados", "El historial arranca con el primer River-Boca."), { meta: "historial" });
    }
    const filas = historial.slice().sort(function(a, b) { return b.partidos - a.partidos; }).map(function(h) {
        return "<div class='metrica-fila'><span>" + escapar(h.nombre) + " <span class='tenue mini'>(" + h.partidos + ")</span></span>" +
            "<strong>" + h.ganaA + " - " + h.empates + " - " + h.ganaB + "</strong></div>";
    }).join("");
    return vPanel("Clásicos", "escudo", filas, { meta: historial.length + " clásicos" });
}

// -----------------------------
// HEMEROTECA (para Legado)
// -----------------------------

function panelHemeroteca() {
    const temporadas = estadoHistorial.temporadas;
    if (!temporadas.length) {
        return vPanel("Hemeroteca", "libro", vVacio("libro", "Sin temporadas cerradas", "Al terminar el primer año se guarda el campeón."));
    }

    const filas = temporadas.slice().reverse().map(function(t) {
        return "<div class='metrica-fila'><span>Año " + t.anio + "</span><strong>" + escapar(t.campeon) + "</strong></div>";
    }).join("");

    const supercopas = estadoHistorial.supercopas.slice().reverse().map(function(s) {
        return "<div class='metrica-fila'><span>Supercopa " + s.anio + "</span><strong>" + escapar(s.ganador) + "</strong></div>";
    }).join("");

    const records = estadoHistorial.records;
    const recordGoles = records.goles
        ? "<div class='metrica-fila'><span>Más goles en una temporada</span><strong>" + escapar(records.goles.nombre) + " (" + records.goles.cantidad + ")</strong></div>"
        : "";
    const recordPuntos = records.puntos
        ? "<div class='metrica-fila'><span>Más puntos de un campeón</span><strong>" + escapar(records.puntos.nombre) + " (" + records.puntos.cantidad + ")</strong></div>"
        : "";

    return vPanel("Hemeroteca", "libro",
        "<h4 class='seccion-mini'>Campeones</h4>" + filas +
        (supercopas ? "<h4 class='seccion-mini'>Supercopas</h4>" + supercopas : "") +
        ((recordGoles || recordPuntos) ? "<h4 class='seccion-mini'>Récords</h4>" + recordGoles + recordPuntos : "")
    );
}

function panelSupercopa() {
    const supercopas = estadoHistorial.supercopas.slice().reverse();
    const pendiente = (typeof supercopaPendiente === "function") ? supercopaPendiente() : null;

    const cuerpo = supercopas.length ? supercopas.map(function(s) {
        return "<div class='metrica-fila'><span>" + s.liga + " vs " + s.copa + " · " + s.anio + "</span>" +
            "<strong class='oro'>" + escapar(s.ganador) + "</strong></div>" +
            "<div class='mini tenue' style='margin:-4px 0 8px'>" + s.golesLiga + " - " + s.golesCopa + "</div>";
    }).join("") : vVacio("trofeo", "Sin supercopas", "Se juega al empezar el año, entre el campeón de la liga y el de la Copa Argentina.");

    return vPanel("Supercopa Argentina", "trofeo", cuerpo +
        (pendiente ? "<p class='mini tenue' style='margin-top:10px'>Pendiente: " + escapar(pendiente.campeon) + " vs " + escapar(pendiente.copaArgentina) + ".</p>" : ""),
        { meta: supercopas.length + " ediciones" });
}

// -----------------------------
// SECANUCA
// -----------------------------

function vistaSecanuca() {
    const ranking = rankingSecanuca();
    const top = ranking[0];
    const promedio = Math.round(ranking.reduce(function(a, r) { return a + r.indice; }, 0) / (ranking.length || 1));
    const escandalos = estadoSecanuca.eventos.filter(function(e) {
        return e.anio === presidente.anioMandato && e.tipo === "escandalo";
    }).length;

    const filas = ranking.slice(0, 15).map(function(r, i) {
        const color = r.indice >= 70 ? "#ff6f5e" : r.indice >= 55 ? "#f0c869" : "#3ddc84";
        return "<tr class='clicable' data-accion='club' data-id='" + r.id + "'>" +
            "<td class='num'>" + (i + 1) + "</td>" +
            "<td><div class='nombre-club'>" + htmlEscudo(r.id, r.nombre, 24) + "<span>" + escapar(r.nombre) + "</span></div></td>" +
            "<td style='width:150px'><div class='progreso'><span style='width:" + r.indice + "%;background:" + color + "'></span></div></td>" +
            "<td class='num centro fuerte' style='color:" + color + "'>" + r.indice + "</td>" +
            "<td class='num centro'>" + r.arbitral + "</td>" +
            "<td class='num centro'>" + r.institucional + "</td>" +
            "<td class='num centro'>" + r.mercado + "</td>" +
            "<td class='num centro'>" + r.escandalo + "</td></tr>";
    }).join("");

    const eventos = eventosSecanuca(10).map(function(e) {
        const t = SECANUCA_TIPOS[e.tipo] || { nombre: "Movimiento", color: "#8a8f98" };
        return "<div class='secanuca-evento'>" +
            "<span class='secanuca-tipo' style='color:" + t.color + "'>" + escapar(t.nombre) + "</span>" +
            "<span class='crecer'><strong>" + escapar(e.club) + "</strong> · " + escapar(e.motivo) + "</span>" +
            "<span class='num " + (e.puntos >= 0 ? "pos" : "neg") + "'>" + (e.puntos >= 0 ? "+" : "") + e.puntos + "</span></div>";
    }).join("") || vVacio("balanza", "Sin movimientos", "El SECANUCA todavía no registró favores.");

    return "<div class='pantalla'>" +
        vCabecera("SECANUCA", "Secretaría de Control y Análisis de Niveles y Coeficientes AFA. Acá se mide quién se ve favorecido por los fallos, la plata y las decisiones de la casa.",
            "<button class='btn' data-accion='abrir-operativo'>" + icono("balanza", "", 16) + "Operativo reservado</button>") +
        "<div class='grid grid-3'>" +
        vStat("Club más favorecido", top ? top.nombre : "—", top ? "índice " + top.indice : "sin datos") +
        vStat("Índice promedio", promedio, "de los 30 clubes") +
        vStat("Escándalos del año", escandalos, "registrados por la secretaría") +
        "</div>" +
        "<div class='grid grid-hero'>" +
        vPanel("Coeficiente del poder", "balanza",
            "<div class='tabla-wrap'><table class='tabla'><thead><tr><th>#</th><th>Club</th><th></th><th class='centro'>Índice</th><th class='centro'>Arb.</th><th class='centro'>AFA</th><th class='centro'>Merc.</th><th class='centro'>Esc.</th></tr></thead><tbody>" + filas + "</tbody></table></div>",
            { meta: "Índice 0-100 · base 50" }) +
        vPanel("Últimos movimientos", "lista", eventos) +
        "</div>" +
        "<p class='mini tenue'>La prensa usa este ranking para hablar de ayudas: cuando un club aparece arriba del SECANUCA, los titulares lo dicen.</p>" +
        "</div>";
}

// -----------------------------
// COPA DE LA LIGA
// -----------------------------

function tablaZonaHTML(zona) {
    const filas = tablaZonaCopa(zona).map(function(t, i) {
        const id = Number(t.id);
        const nombre = EQUIPOS[id] ? EQUIPOS[id].nombre : "—";
        const clasifica = i < 4;
        return "<tr class='" + (clasifica ? "clasifica" : "") + " clicable club-fila' style='--club:" + colorClub(id) + "' data-accion='club' data-id='" + id + "'>" +
            "<td class='num'>" + (i + 1) + "</td>" +
            "<td><div class='nombre-club'>" + htmlEscudo(id, nombre, 20) + "<span>" + escapar(nombre) + "</span></div></td>" +
            "<td class='num centro'>" + t.pj + "</td>" +
            "<td class='num centro'>" + t.dg + "</td>" +
            "<td class='num centro fuerte'>" + t.pts + "</td></tr>";
    }).join("");

    return "<div class='tabla-wrap'><table class='tabla compacta'><thead><tr><th>#</th><th>Equipo</th><th class='centro'>PJ</th><th class='centro'>DG</th><th class='centro'>Pts</th></tr></thead><tbody>" + filas + "</tbody></table></div>";
}

function copaLigaHTML() {
    if (!estadoCopaLiga.zonas || !estadoCopaLiga.zonas.A.length) {
        return vVacio("trofeo", "La Copa de la Liga arranca en la fecha 7", "Dos zonas de quince, siete fechas y playoffs entre los cuatro mejores de cada zona.");
    }

    const playoffs = estadoCopaLiga.playoffs;
    let bracket = "";
    if (playoffs) {
        const nombre = function(id) { return EQUIPOS[id] ? EQUIPOS[id].nombre : "—"; };
        const fila = function(a, b) {
            return "<div class='metrica-fila'><span>" + escapar(nombre(a)) + " vs " + escapar(nombre(b)) + "</span><strong class='mini tenue'>eliminatoria</strong></div>";
        };
        bracket = "<h4 class='seccion-mini'>Playoffs</h4>" +
            (playoffs.cuartos || []).map(function(c) { return fila(c.local, c.visitante); }).join("") +
            (playoffs.semis && playoffs.semis.length ? playoffs.semis.map(function(c) { return fila(c.local, c.visitante); }).join("") : "") +
            (playoffs.final ? fila(playoffs.final.local, playoffs.final.visitante) : "");
    }

    const campeon = estadoCopaLiga.campeon
        ? "<div class='aviso verde' style='margin-bottom:12px'>" + icono("trofeo", "", 18) +
          "<div><div class='aviso-titulo'>Campeón: " + escapar(EQUIPOS[estadoCopaLiga.campeon] ? EQUIPOS[estadoCopaLiga.campeon].nombre : "—") + "</div>" +
          "<div class='aviso-texto'>Título de la Copa de la Liga " + estadoCopaLiga.anio + ".</div></div></div>"
        : "";

    return campeon +
        "<div class='grid grid-2'>" +
        vPanel("Zona A", "lista", tablaZonaHTML("A"), { meta: "fecha " + estadoCopaLiga.ronda + " / 7" }) +
        vPanel("Zona B", "lista", tablaZonaHTML("B"), { meta: "top 4 a playoffs" }) +
        "</div>" +
        (bracket ? vPanel("Fase final", "trofeo", bracket) : "") +
        vPanel("Resultados por fecha", "calendario", resultadosCopaLigaHTML(), { meta: "zonas A y B" }) +
        (estadoCopaLiga.historial.length ? "<h4 class='seccion-mini'>Historial</h4>" +
            estadoCopaLiga.historial.slice().reverse().map(function(h) {
                return "<div class='metrica-fila'><span>Copa de la Liga " + h.anio + "</span><strong class='oro'>" + escapar(EQUIPOS[h.campeon] ? EQUIPOS[h.campeon].nombre : h.campeon) + "</strong></div>";
            }).join("") : "");
}

function mundialClubesHTML() {
    if (!estadoMundialClubes.historial.length) {
        return vVacio("trofeo", "Sin Mundial de Clubes todavía", "Al cerrar el año, el campeón de la liga y el de la Copa Argentina juegan contra los gigantes de Europa.");
    }
    return estadoMundialClubes.historial.slice().reverse().map(function(h) {
        const res = h.resultados || [];
        const cuartos = res.slice(0, 4);
        const semis = res.slice(4, 6);
        const final = res.slice(6, 7);
        const fila = function(r) {
            return "<div class='partido-copa'><span class='" + (r.gana === r.a ? "gana" : "pierde") + "'>" + escapar(r.a) + "</span>" +
                "<span class='resultado-marca'>" + r.gl + " - " + r.gv + "</span>" +
                "<span class='" + (r.gana === r.b ? "gana" : "pierde") + "'>" + escapar(r.b) + "</span></div>";
        };
        return "<h4 class='seccion-mini'>Edición " + h.anio + " · Campeón: " + escapar(h.campeon) + "</h4>" +
            "<div class='llave-ronda'><div class='llave-ronda-cab'><span>Cuartos de final</span></div>" + cuartos.map(fila).join("") + "</div>" +
            (semis.length ? "<div class='llave-ronda'><div class='llave-ronda-cab'><span>Semifinales</span></div>" + semis.map(fila).join("") + "</div>" : "") +
            (final.length ? "<div class='llave-ronda'><div class='llave-ronda-cab'><span>Final</span></div>" + final.map(fila).join("") + "</div>" : "");
    }).join("");
}

// -----------------------------
// DATOS
// -----------------------------

function vistaDatos() {
    const seccion = estadoUI.datosSeccion || "estadisticas";
    const est = estadisticasTorneo("primera");
    const tabs = [
        { id: "estadisticas", nombre: "Estadísticas" },
        { id: "cuotas", nombre: "Cuotas" },
        { id: "coeficiente", nombre: "Coeficiente" }
    ].map(function(s) {
        return "<button class='seg " + (seccion === s.id ? "activo" : "") + "' data-accion='seccion-datos' data-seccion='" + s.id + "'>" + s.nombre + "</button>";
    }).join("");

    let cuerpo = "";
    let titulo = "";
    let iconoPanel = "grafico";

    if (seccion === "estadisticas") {
        titulo = "Estadísticas del torneo";
        const extremos = mejoresAtaquesDefensas("primera");
        const fila = function(t, valor, color) {
            return "<div class='metrica-fila'><span>" + escapar(t.nombre) + "</span><strong class='" + (color || "") + "'>" + valor + "</strong></div>";
        };
        const fechas = Object.keys(est.porFecha).sort(function(a, b) { return a - b; });
        const maxGoles = Math.max.apply(null, fechas.map(function(f) { return est.porFecha[f]; }).concat([1]));
        const barras = fechas.slice(-12).map(function(f) {
            const h = Math.max(6, Math.round((est.porFecha[f] / maxGoles) * 60));
            return "<div class='barra-fecha' title='Fecha " + (Number(f) + 1) + ": " + est.porFecha[f] + " goles'>" +
                "<span style='height:" + h + "px'></span><i>" + (Number(f) + 1) + "</i></div>";
        }).join("");

        cuerpo = "<div class='grid grid-2'>" +
            vPanel("Más goles a favor", "objetivo",
                extremos.ataque.map(function(t) { return fila(t, t.GF + " goles", "pos"); }).join("")) +
            vPanel("Mejores defensas", "escudo",
                extremos.defensa.map(function(t) { return fila(t, t.GC + " en contra", "oro"); }).join("")) +
            "</div>" +
            vPanel("Goles por fecha", "grafico", "<div class='barras-fecha'>" + (barras || "<p class='mini tenue'>Sin fechas jugadas.</p>") + "</div>") +
            vPanel("Las goleadas de la temporada", "calendario",
                extremos.goleadas.length ? extremos.goleadas.map(function(g) {
                    return "<div class='metrica-fila'><span>" + escapar(g.r.local) + " " + g.r.golesLocal + " - " + g.r.golesVisitante + " " + escapar(g.r.visitante) + "</span><strong class='mini tenue'>F" + (g.fecha + 1) + "</strong></div>";
                }).join("") : "<p class='mini tenue'>Todavía no hay goleadas.</p>");
    } else if (seccion === "cuotas") {
        titulo = "Cuotas de las casas";
        iconoPanel = "dinero";
        const cuotas = cuotasProximaFecha();
        cuerpo = cuotas.length ? "<p class='mini tenue' style='margin-bottom:10px'>Los favoritos según las principales casas. Acá no se apuesta: se lee el mercado.</p>" +
            "<div class='tabla-wrap'><table class='tabla'><thead><tr><th>Partido</th><th class='centro'>Local</th><th class='centro'>Empate</th><th class='centro'>Visitante</th><th class='centro'>Favorito</th></tr></thead><tbody>" +
            cuotas.map(function(c) {
                const fav = c.cuotas.favorito === "local" ? c.local : c.visitante;
                return "<tr class='club-fila' style='--club:" + colorClub(c.localId) + "'>" +
                    "<td>" + escapar(c.local) + " vs " + escapar(c.visitante) + "</td>" +
                    "<td class='num centro'>" + c.cuotas.local.toFixed(2) + "</td>" +
                    "<td class='num centro'>" + c.cuotas.empate.toFixed(2) + "</td>" +
                    "<td class='num centro'>" + c.cuotas.visitante.toFixed(2) + "</td>" +
                    "<td class='centro mini'>" + escapar(fav) + "</td></tr>";
            }).join("") + "</tbody></table></div>"
            : vVacio("dinero", "Sin partidos próximos", "Avanzá la fecha para ver las cuotas.");
    } else {
        titulo = "Coeficiente de clubes";
        const coef = coeficienteClubes();
        cuerpo = "<div class='tabla-wrap'><table class='tabla'><thead><tr><th>#</th><th>Club</th><th class='centro'>Actual</th><th class='centro'>Histórico</th><th class='centro'>Promedio</th><th class='centro'>Coef.</th></tr></thead><tbody>" +
            coef.slice(0, 15).map(function(t, i) {
                return "<tr class='clicable club-fila' style='--club:" + colorClub(t.id) + "' data-accion='club' data-id='" + t.id + "'>" +
                    "<td class='num'>" + (i + 1) + "</td>" +
                    "<td><div class='nombre-club'>" + htmlEscudo(t.id, t.nombre, 22) + "<span>" + escapar(t.nombre) + "</span></div></td>" +
                    "<td class='num centro'>" + t.actual + "</td>" +
                    "<td class='num centro'>" + t.historico + "</td>" +
                    "<td class='num centro'>" + t.promedio.toFixed(3) + "</td>" +
                    "<td class='num centro fuerte'>" + t.coeficiente + "</td></tr>";
            }).join("") + "</tbody></table></div>";
    }

    return "<div class='pantalla'>" +
        vCabecera("Datos", "Todo lo que los números dicen del torneo: estadísticas, favoritos del mercado y coeficiente de los clubes.") +
        "<div class='grid grid-4'>" +
        vStat("Partidos", est.partidos, "jugados en Primera") +
        vStat("Goles", est.goles, "promedio " + est.promedioGoles) +
        vStat("Amarillas", est.amarillas, "en el torneo") +
        vStat("Remates", est.remates, "totales") +
        "</div>" +
        "<div class='segmented'>" + tabs + "</div>" +
        vPanel(titulo, iconoPanel, cuerpo) +
        "</div>";
}


function resultadosCopaLigaHTML() {
    if (!estadoCopaLiga.resultados) return vVacio("calendario", "Sin resultados", "La copa todavía no empezó.");
    const zonas = ["A", "B"];
    let html = "";
    for (let r = 0; r < 7; r++) {
        const filas = zonas.map(function(zona) {
            const ronda = (estadoCopaLiga.resultados[zona] || [])[r] || [];
            if (!ronda.length) return "";
            return "<div class='mini tenue' style='margin:6px 0 2px'>Zona " + zona + "</div>" +
                ronda.map(function(p) {
                    return "<div class='partido-copa'><span class='" + (p.golesLocal > p.golesVisitante ? "gana" : "pierde") + "'>" + escapar(p.local) + "</span>" +
                        "<span class='resultado-marca'>" + p.golesLocal + " - " + p.golesVisitante + "</span>" +
                        "<span class='" + (p.golesVisitante > p.golesLocal ? "gana" : "pierde") + "'>" + escapar(p.visitante) + "</span></div>";
                }).join("");
        }).join("");
        if (filas) html += "<div class='llave-ronda'><div class='llave-ronda-cab'><span>Fecha " + (r + 1) + "</span></div>" + filas + "</div>";
    }
    return html || vVacio("calendario", "Sin resultados", "Jugá una fecha de copa.");
}