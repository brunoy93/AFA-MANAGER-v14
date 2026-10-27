// ============================================
// ENCUESTAS: opinión pública sobre la gestión
// ============================================
// Cada ~12 fechas aparece una encuesta. Muestra % de aprobación
// y desaprobación, con motivos según el contexto.

const encuestasHistoricas = [];

function generarEncuesta() {
    let aprobacion = presidente.apoyoClubes;

    aprobacion += (presidente.prestigioInternacional - 50) * 0.3;

    if (presidente.dineroEnCaja > 15000) aprobacion += 5;
    else if (presidente.dineroEnCaja < 5000) aprobacion -= 8;

    // Ajustes por últimas decisiones
    const ultimasDecisiones = presidente.historialDecisiones.slice(-5);
    ultimasDecisiones.forEach(function(d) {
        const titulo = (d.decision || "").toLowerCase();
        if (titulo.indexOf("sad") !== -1 || titulo.indexOf("capital") !== -1) aprobacion -= 3;
        if (titulo.indexOf("igualar") !== -1 || titulo.indexOf("reparto") !== -1) aprobacion += 2;
        if (titulo.indexOf("rescate") !== -1) aprobacion -= 2;
    });

    // Ajustes por rescates
    const totalRescates = Object.values(estadoFinanzas.rescates).reduce(function(a, b) { return a + b; }, 0);
    aprobacion -= totalRescates * 2;

    // Ajustes por ranking FIFA
    const puestoRanking = obtenerRanking();
    if (puestoRanking <= 3) aprobacion += 8;
    else if (puestoRanking <= 7) aprobacion += 3;
    else if (puestoRanking >= 12) aprobacion -= 10;

    aprobacion = Math.max(5, Math.min(95, Math.round(aprobacion)));
    const desaprobacion = 100 - aprobacion;

    const motivos = [];

    if (presidente.apoyoClubes < 40) {
        motivos.push("Los clubes se sienten abandonados por la AFA.");
    } else if (presidente.apoyoClubes >= 70) {
        motivos.push("Los clubes respaldan tu gestión.");
    }

    if (presidente.prestigioInternacional >= 65) {
        motivos.push("El prestigio internacional del fútbol argentino está en alza.");
    } else if (presidente.prestigioInternacional < 40) {
        motivos.push("Preocupa el deterioro del prestigio internacional.");
    }

    if (presidente.dineroEnCaja < 5000) {
        motivos.push("Las arcas de la AFA están flacas.");
    } else if (presidente.dineroEnCaja > 15000) {
        motivos.push("La situación económica de la AFA es sólida.");
    }

    if (totalRescates >= 3) {
        motivos.push("La oposición critica los rescates a clubes 'amigos'.");
    }

    if (puestoRanking <= 3) {
        motivos.push("La Selección sigue siendo una potencia mundial.");
    } else if (puestoRanking >= 12) {
        motivos.push("El ranking FIFA de la Selección preocupa a los hinchas.");
    }

    if (motivos.length === 0) {
        motivos.push("La opinión pública está dividida sobre tu gestión.");
    }

    const encuesta = {
        anio: presidente.anioMandato,
        fecha: estadoLigas.fechaActual,
        aprobacion: aprobacion,
        desaprobacion: desaprobacion,
        motivos: motivos
    };

    encuestasHistoricas.push(encuesta);

    if (desaprobacion > 70) {
        ajustarApoyo(-3);
        agregarNoticia(
            "Azz",
            "Encuesta demoledora: " + desaprobacion + "% desaprueba tu gestión",
            "La opinión pública le da la espalda al presidente. Los clubes toman nota.",
            "critica"
        );
    } else if (aprobacion > 70) {
        ajustarApoyo(2);
        agregarNoticia(
            "TyC Sports",
            "Encuesta favorable: " + aprobacion + "% aprueba tu gestión",
            "El respaldo popular es contundente. La AFA navega en aguas tranquilas.",
            "elogio"
        );
    } else {
        agregarNoticia(
            "Olé",
            "Encuesta ajustada: " + aprobacion + "% aprueba, " + desaprobacion + "% desaprueba",
            "La opinión pública está dividida sobre la gestión del presidente de la AFA.",
            "rumor"
        );
    }

    return encuesta;
}

function obtenerUltimaEncuesta() {
    if (encuestasHistoricas.length === 0) return null;
    return encuestasHistoricas[encuestasHistoricas.length - 1];
}

function obtenerHistorialEncuestas() {
    return encuestasHistoricas.slice(-3).reverse();
}