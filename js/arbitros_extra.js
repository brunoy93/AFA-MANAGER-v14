// ============================================
// ÁRBITROS: legajo, historial y herramientas
// ============================================

function partidosDirigidosPor(idArbitro) {
    const resultados = estadoLigas.resultados.primera || [];
    const lista = [];
    resultados.forEach(function(fechaRes, fecha) {
        if (!fechaRes) return;
        fechaRes.forEach(function(r, idx) {
            const clave = clavePartido("primera", fecha, idx);
            if (designacionesPorFecha[clave] === Number(idArbitro)) {
                lista.push({ fecha: fecha, idx: idx, resultado: r });
            }
        });
    });
    return lista;
}

function estadisticasArbitro(idArbitro) {
    const partidos = partidosDirigidosPor(idArbitro);
    const incidencias = incidenciasHistoricas.filter(function(i) { return i.arbitroId === Number(idArbitro); });
    let amarillas = 0;
    let rojas = 0;
    let penales = 0;
    partidos.forEach(function(p) {
        const s = p.resultado.stats;
        if (s) { amarillas += (s.amarillasLocal || 0) + (s.amarillasVisitante || 0); rojas += (s.rojasLocal || 0) + (s.rojasVisitante || 0); }
    });
    incidencias.forEach(function(i) { if (i.tipo === "penal") penales++; });
    return {
        partidos: partidos.length,
        incidencias: incidencias.length,
        penales: penales,
        amarillas: amarillas,
        rojas: rojas,
        promedioAmarillas: partidos.length ? Math.round((amarillas / partidos.length) * 10) / 10 : 0,
        historial: partidos.slice(-6).reverse()
    };
}

function capacitarArbitro(id) {
    const arbitro = buscarArbitroPorId(id);
    if (!arbitro) return { ok: false, motivo: "No existe." };
    const costo = 400;
    if (presidente.dineroEnCaja < costo) return { ok: false, motivo: "No hay caja." };
    ajustarDinero(-costo, "Capacitación arbitral");
    arbitro.nivel = Math.min(95, arbitro.nivel + 5);
    arbitro.capacitado = true;
    ajustarPrestigio(2, "Capacitación arbitral");
    agregarNoticia("Azz", "La AFA capacitó a " + arbitro.nombre, "El árbitro subió de nivel tras el curso de la casa. Los clubes, atentos.", "rumor");
    return { ok: true, nivel: arbitro.nivel };
}

function ascenderArbitro(id) {
    const arbitro = buscarArbitroPorId(id);
    if (!arbitro) return { ok: false };
    arbitro.nivel = Math.min(95, arbitro.nivel + 2);
    ajustarPrestigio(1, "Ascenso arbitral");
    agregarNoticia("TyC Sports", "Ascendieron a " + arbitro.nombre, "La terna lo premió por su temporada.", "elogio");
    return { ok: true };
}

// Veedor: protege un partido de presiones externas
const estadoVeedores = { porPartido: {} };

function reiniciarVeedores() {
    estadoVeedores.porPartido = {};
}

function abrirVeedor() {
    const fecha = estadoLigas.fechaActual;
    const partidos = estadoLigas.calendarios.primera ? estadoLigas.calendarios.primera[fecha] : null;
    if (!partidos) { toastInfo("No hay partidos para veedorear."); return; }
    if (presidente.dineroEnCaja < 200) { toastError("No hay caja para el operativo de veeduría."); return; }

    const opciones = partidos.slice(0, 5).map(function(p, idx) {
        return "<button class='opcion' data-accion='asignar-veedor' data-idx='" + idx + "'>" +
            "<span class='opcion-marca'>" + icono("ojo", "", 13) + "</span>" +
            "<span class='opcion-cuerpo'><span class='opcion-titulo'>" + escapar(EQUIPOS[p.local].nombre) + " vs " + escapar(EQUIPOS[p.visitante].nombre) + "</span>" +
            "<span class='opcion-resumen'>$200M · baja la chance de error arbitral</span></span></button>";
    }).join("");

    UI.modal({
        id: "veedor",
        eyebrow: "Veeduría",
        titulo: "Mandá un veedor",
        sub: "Un veedor de la casa vigila el partido. Menos errores, más prestigio.",
        ancho: "ancho",
        cerrable: true,
        cuerpo: "<div class='opciones'>" + opciones + "</div>"
    });
}

function asignarVeedor(idx) {
    const fecha = estadoLigas.fechaActual;
    const clave = clavePartido("primera", fecha, Number(idx));
    estadoVeedores.porPartido[clave] = { fecha: fecha, idx: Number(idx) };
    ajustarDinero(-200, "Veeduría");
    ajustarPrestigio(1, "Veeduría");
    UI.cerrar("veedor");
    toastInfo("Veedor asignado. El partido queda bajo la lupa.", "ojo");
    guardarPartida();
    refrescar();
}

function tieneVeedor(ligaId, fecha, idx) {
    return !!estadoVeedores.porPartido[clavePartido(ligaId, fecha, idx)];
}

// -----------------------------
// HISTORIAL ARBITRAL (para la vista)
// -----------------------------

function historialArbitralHTML() {
    const fecha = estadoLigas.fechaActual - 1;
    const resultados = (estadoLigas.resultados.primera || [])[fecha];
    if (!resultados) return vVacio("calendario", "Sin partidos dirigidos", "Jugá una fecha.");

    return resultados.slice(0, 8).map(function(r, idx) {
        const clave = clavePartido("primera", fecha, idx);
        const idRef = designacionesPorFecha[clave];
        const ref = idRef ? buscarArbitroPorId(idRef) : null;
        const amarillas = r.stats ? (r.stats.amarillasLocal + r.stats.amarillasVisitante) : 0;
        return "<div class='lista-item" + (ref ? " clicable" : "") + "' " + (ref ? "data-accion='arbitro' data-id='" + ref.id + "'" : "") + ">" +
            "<span class='lista-avatar'>" + icono("balanza", "tenue", 15) + "</span>" +
            "<span class='lista-cuerpo'><span class='lista-titulo'>" + escapar(r.local) + " " + r.golesLocal + " - " + r.golesVisitante + " " + escapar(r.visitante) + "</span>" +
            "<span class='lista-sub'>" + (ref ? escapar(ref.nombre) : "sin árbitro") + " · " + amarillas + " amarillas</span></span>" +
            (r.incidencia ? "<span class='tag rojo'>polémica</span>" : "") + "</div>";
    }).join("");
}

function sancionesArbitralesHTML() {
    const sancionados = ARBITROS_PRIMERA.filter(function(a) { return a.sancionado; });
    if (!sancionados.length) return "<p class='mini tenue'>Ningún árbitro sancionado.</p>";
    return sancionados.map(function(a) {
        return "<div class='lista-item clicable' data-accion='arbitro' data-id='" + a.id + "'>" +
            "<span class='lista-avatar'>" + icono("alerta", "tenue", 15) + "</span>" +
            "<span class='lista-cuerpo'><span class='lista-titulo'>" + escapar(a.nombre) + "</span>" +
            "<span class='lista-sub'>" + a.fechasSancion + " fechas" + (a.castigo === "federal" ? " · mandado al Federal" : "") + "</span></span></div>";
    }).join("");
}
