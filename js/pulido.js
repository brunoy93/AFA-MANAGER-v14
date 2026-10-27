// ============================================
// PULIDO: errores, ajustes, guía y novedades
// ============================================

const VERSION_APP = "13.0";
const CLAVE_GUIA = "afa_manager_guia_v1";

const ERRORES_APP = [];

function registrarErrorApp(mensaje, origen) {
    ERRORES_APP.push({ mensaje: String(mensaje).slice(0, 200), origen: origen || "", fecha: Date.now() });
    if (ERRORES_APP.length > 30) ERRORES_APP.shift();
    try {
        if (typeof toastError === "function") toastError("Algo falló. La partida sigue: " + String(mensaje).slice(0, 80));
    } catch (e) {}
}

function iniciarPulido() {
    window.addEventListener("error", function(e) {
        registrarErrorApp(e.message || "Error", e.filename || "");
    });
    window.addEventListener("unhandledrejection", function(e) {
        registrarErrorApp((e.reason && e.reason.message) || "Promesa rechazada", "promise");
    });

    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape") {
            const modal = document.querySelector("#capa-modales .modal");
            if (modal) {
                const cerrable = !modal.querySelector(".modal-cerrar[disabled]");
                if (cerrable && modal.id !== "intro" && modal.id !== "premios" && modal.id !== "cierre") {
                    if (typeof UI !== "undefined") UI.cerrar(modal.id.replace("modal-", ""));
                    return;
                }
            }
            // Los modales obligatorios no se cierran con Escape
        }
    });

    try {
        if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            if (typeof reduceMovimiento !== "undefined") reduceMovimiento = true;
        }
    } catch (e) {}
}

function pesoGuardado() {
    try {
        const texto = JSON.stringify(serializarPartida());
        return { bytes: texto.length, kb: Math.round(texto.length / 1024) };
    } catch (e) {
        return { bytes: 0, kb: 0 };
    }
}

function optimizarGuardado() {
    try {
        if (typeof incidenciasHistoricas !== "undefined" && incidenciasHistoricas.length > 250) {
            incidenciasHistoricas.splice(0, incidenciasHistoricas.length - 250);
        }
        if (typeof estadoSecanuca !== "undefined" && estadoSecanuca.eventos.length > 80) {
            estadoSecanuca.eventos.splice(0, estadoSecanuca.eventos.length - 80);
        }
        if (presidente.cambios && presidente.cambios.length > 40) {
            presidente.cambios.splice(0, presidente.cambios.length - 40);
        }
        if (typeof estadoStreaming !== "undefined" && estadoStreaming.clips.length > 20) {
            estadoStreaming.clips.splice(0, estadoStreaming.clips.length - 20);
        }
        guardarPartida();
        return pesoGuardado();
    } catch (e) {
        registrarErrorApp(e.message, "optimizar");
        return pesoGuardado();
    }
}

function abrirGuia() {
    UI.modal({
        id: "guia",
        eyebrow: "Guía rápida",
        titulo: "Cómo se juega, en cinco pasos",
        ancho: "ancho",
        cerrable: true,
        cuerpo:
            "<div class='guia'>" +
            "<div class='guia-paso'><span>1</span><div><strong>Avanzá la fecha</strong><p>Cada fecha se juegan las tres divisiones, la Copa y las eliminatorias. Vas a ver los resultados en pantalla.</p></div></div>" +
            "<div class='guia-paso'><span>2</span><div><strong>Resolvé la bandeja</strong><p>Las decisiones, ofertas de pases y pedidos de dirigentes llegan a la bandeja. Elegí una opción y seguí.</p></div></div>" +
            "<div class='guia-paso'><span>3</span><div><strong>Cuidá el apoyo</strong><p>El apoyo de los clubes decide la asamblea de fin de año. Rescatar clubes, cumplir objetivos y las campañas lo suben.</p></div></div>" +
            "<div class='guia-paso'><span>4</span><div><strong>Mirá la plata</strong><p>La caja paga sueldos, VAR, rescates y operativos. Los gastos de estructura crecen con la caja: no acumules de más.</p></div></div>" +
            "<div class='guia-paso'><span>5</span><div><strong>Llegá al año 4</strong><p>Al final de cada año la asamblea vota. Necesitás superar el umbral (47% en dificultad real) para seguir.</p></div></div>" +
            "</div>",
        pie: [
            { texto: "Ver ayuda completa", accion: "abrir-ayuda", tipo: "fantasma" },
            { texto: "Entendido", accion: "cerrar-modal", datos: { id: "guia" }, tipo: "primario" }
        ]
    });
    try { Almacen.escribir(CLAVE_GUIA, true); } catch (e) {}
}

function abrirNovedades() {
    UI.modal({
        id: "novedades",
        eyebrow: "Versión " + VERSION_APP,
        titulo: "Qué hay de nuevo",
        ancho: "ancho",
        cerrable: true,
        cuerpo:
            "<div class='novedades'>" +
            "<div class='novedad'><strong>Balance político</strong><p>El apoyo se sostiene, rescatar suma y la asamblea se entiende: proyección desglosada y umbral visible.</p></div>" +
            "<div class='novedad'><strong>Más transparencia</strong><p>Panel de “por qué cambió el apoyo”, alertas tempranas y recordatorio de campaña.</p></div>" +
            "<div class='novedad'><strong>Datos y árbitros</strong><p>Estadísticas de partido, cuotas, coeficiente, H2H, legajos arbitrales y veeduría.</p></div>" +
            "<div class='novedad'><strong>Pulido general</strong><p>Guía rápida, ajustes completos, captura de errores amable y guardado más liviano.</p></div>" +
            "</div>",
        pie: [{ texto: "Cerrar", accion: "cerrar-modal", datos: { id: "novedades" }, tipo: "primario" }]
    });
}

function toggleSonidoApp() {
    if (typeof sonidoActivo !== "undefined") {
        sonidoActivo = !sonidoActivo;
        if (typeof guardarPartida === "function") guardarPartida();
    }
    refrescar();
}

function toggleFechaVivoApp() {
    presidente.fechaVivoModo = (presidente.fechaVivoModo === "nunca") ? "siempre" : "nunca";
    guardarPartida();
    refrescar();
}

function toggleReduccionApp() {
    if (typeof reduceMovimiento !== "undefined") reduceMovimiento = !reduceMovimiento;
    document.documentElement.classList.toggle("sin-movimiento", typeof reduceMovimiento !== "undefined" && reduceMovimiento);
    refrescar();
}
