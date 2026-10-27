// ============================================
// OBJETIVOS: el examen anual del consejo
// ============================================

const estadoObjetivos = {
    anio: 0,
    lista: [],
    historial: []
};

function objetivosDelAnio() {
    return estadoObjetivos.lista || [];
}

function clubesRescatadosEsteAnio() {
    return (estadoFinanzas.rescatesDelAnio || 0);
}

function semifinalArgentino() {
    if (typeof historialContinentales === "undefined" || !historialContinentales.length) return false;
    const ultimo = historialContinentales[historialContinentales.length - 1];
    return !!(ultimo && (ultimo.argSemis || ultimo.argFinal || ultimo.argCampeon));
}

// -----------------------------
// CREACIÓN
// -----------------------------

function crearObjetivo(tipo) {
    const dif = Dificultad();
    const ajuste = dificultadActual === "crisis" ? 1.15 : dificultadActual === "tranquila" ? 0.88 : 1;

    if (tipo === "caja") {
        const meta = Math.round((presidente.dineroEnCaja + 1500 * ajuste) / 500) * 500;
        return {
            id: "caja", tipo: "economico", icono: "dinero",
            titulo: "Cerrar el año con " + fmt.plata(meta) + " en caja",
            desc: "El tesorero quiere aire. Si terminás por debajo, el consejo lo va a notar.",
            meta: meta,
            recompensa: { area: "economico", confianza: 9, dinero: 300 }
        };
    }

    if (tipo === "deuda") {
        return {
            id: "deuda", tipo: "economico", icono: "escudo",
            titulo: "Rescatar a 2 clubes en crisis",
            desc: "Hay clubes al borde de la quiebra. Salvarlos te compra votos en la asamblea.",
            meta: 2,
            recompensa: { area: "federal", confianza: 10, apoyo: 3 }
        };
    }

    if (tipo === "apoyo") {
        const meta = Math.min(85, Math.round(presidente.apoyoClubes + 8 * ajuste));
        return {
            id: "apoyo", tipo: "institucional", icono: "consejo",
            titulo: "Terminar con " + meta + " de apoyo de los clubes",
            desc: "La base de todo: sin clubes no hay gestión.",
            meta: meta,
            recompensa: { area: "institucional", confianza: 8, prestigio: 2 }
        };
    }

    if (tipo === "prestigio") {
        const meta = Math.min(92, Math.round(presidente.prestigioInternacional + 10 * ajuste));
        return {
            id: "prestigio", tipo: "deportivo", icono: "estrella",
            titulo: "Llevar el prestigio a " + meta,
            desc: "La AFA tiene que volver a ser respetada afuera.",
            meta: meta,
            recompensa: { area: "mediatico", confianza: 9, prestigio: 3 }
        };
    }

    if (tipo === "ranking") {
        return {
            id: "ranking", tipo: "deportivo", icono: "globo",
            titulo: "Meter a la Selección en el top 5 del ranking FIFA",
            desc: "Los amistosos y la Copa América definen el puesto.",
            meta: 5,
            recompensa: { area: "deportivo", confianza: 10, prestigio: 4 }
        };
    }

    // libertadores
    return {
        id: "libertadores", tipo: "deportivo", icono: "copa",
        titulo: "Que un club argentino llegue a semifinales de la Libertadores",
        desc: "La deuda pendiente del fútbol argentino.",
        meta: 1,
        recompensa: { area: "deportivo", confianza: 12, prestigio: 5, dinero: 600 }
    };
}

function generarObjetivosAnio() {
    const economico = probabilidad(0.6) ? "caja" : "deuda";
    const institucional = elegir(["apoyo", "deuda", "caja"].filter(function(t) { return t !== economico; }));
    const deportivo = elegir(["prestigio", "ranking", "libertadores"]);

    estadoObjetivos.anio = presidente.anioMandato;
    estadoObjetivos.lista = [economico, institucional, deportivo].map(crearObjetivo);
}

// -----------------------------
// PROGRESO
// -----------------------------

function progresoObjetivo(obj) {
    if (!obj) return 0;
    switch (obj.id) {
        case "caja":
            return limitar(presidente.dineroEnCaja / obj.meta, 0, 1);
        case "deuda":
            return limitar(clubesRescatadosEsteAnio() / obj.meta, 0, 1);
        case "apoyo":
            return limitar(presidente.apoyoClubes / obj.meta, 0, 1);
        case "prestigio":
            return limitar(presidente.prestigioInternacional / obj.meta, 0, 1);
        case "ranking": {
            const puesto = (typeof obtenerRanking === "function") ? obtenerRanking() : 10;
            return limitar((15 - puesto) / Math.max(1, 15 - obj.meta), 0, 1);
        }
        case "libertadores":
            return semifinalArgentino() ? 1 : 0;
        default:
            return 0;
    }
}

function progresoTexto(obj) {
    switch (obj.id) {
        case "caja":
            return fmt.plata(presidente.dineroEnCaja) + " / " + fmt.plata(obj.meta);
        case "deuda":
            return clubesRescatadosEsteAnio() + " / " + obj.meta + " clubes";
        case "apoyo":
            return presidente.apoyoClubes + " / " + obj.meta + " puntos";
        case "prestigio":
            return presidente.prestigioInternacional + " / " + obj.meta + " puntos";
        case "ranking":
            return "#" + ((typeof obtenerRanking === "function") ? obtenerRanking() : "—") + " (meta: top " + obj.meta + ")";
        case "libertadores":
            return semifinalArgentino() ? "Cumplido" : "Sin clubes en semis";
        default:
            return "";
    }
}

function objetivosCumplidos() {
    return estadoObjetivos.lista.filter(function(o) { return progresoObjetivo(o) >= 1; }).length;
}

// -----------------------------
// CIERRE
// -----------------------------

function evaluarObjetivos() {
    const resultados = estadoObjetivos.lista.map(function(obj) {
        const progreso = progresoObjetivo(obj);
        const cumplido = progreso >= 1;
        return { obj: obj, progreso: progreso, cumplido: cumplido };
    });

    resultados.forEach(function(r) {
        if (r.cumplido) {
            const rec = r.obj.recompensa || {};
            if (rec.confianza && rec.area) ajustarConfianzaArea(rec.area, rec.confianza, "Objetivo cumplido");
            if (rec.dinero) ajustarDinero(rec.dinero, "Premio por objetivo");
            if (rec.apoyo) ajustarApoyo(rec.apoyo, "Objetivo cumplido");
            if (rec.prestigio) ajustarPrestigio(rec.prestigio, "Objetivo cumplido");
            // Cumplir le da aire político al presidente
            ajustarApoyo(3, "Objetivo cumplido: " + r.obj.titulo);
        } else {
            const rec = r.obj.recompensa || {};
            if (rec.area) ajustarConfianzaArea(rec.area, -5, "Objetivo incumplido");
            ajustarConfianzaTodos(-1, "Objetivos flojos");
        }
    });

    estadoObjetivos.historial.push({
        anio: presidente.anioMandato,
        cumplidos: resultados.filter(function(r) { return r.cumplido; }).length,
        total: resultados.length
    });

    return resultados;
}
