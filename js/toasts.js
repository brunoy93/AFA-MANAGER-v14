// ============================================
// TOASTS: notificaciones flotantes
// ============================================

const toastsActivos = [];
const MAX_TOASTS = 3;
let toastsSilenciados = false;

// En pantallas chicas los toasts duran menos para no tapar el contenido.
function duracionToast(base) {
    const esChico = window.innerWidth <= 760;
    return esChico ? Math.min(base || 2600, 2600) : (base || 3400);
}

function silenciarToasts() { toastsSilenciados = true; }
function reactivarToasts() { toastsSilenciados = false; }

const TOAST_ICONO = {
    verde: "check",
    rojo: "alerta",
    oro: "info",
    azul: "info",
    violeta: "trofeo",
    rosa: "diario"
};

function mostrarToast(mensaje, tipo, iconoNombre, duracion) {
    if (toastsSilenciados) return;

    const contenedor = document.getElementById("toast-container");
    if (!contenedor) return;

    if (toastsActivos.length >= MAX_TOASTS) {
        const viejo = toastsActivos.shift();
        if (viejo && viejo.parentNode) {
            viejo.classList.add("sale");
            setTimeout(function() { if (viejo.parentNode) viejo.parentNode.removeChild(viejo); }, 220);
        }
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.dataset.tono = tipo || "verde";
    toast.innerHTML =
        icono(iconoNombre || TOAST_ICONO[tipo] || "info", "", 17) +
        "<span class='toast-txt'>" + mensaje + "</span>";

    contenedor.appendChild(toast);
    toastsActivos.push(toast);

    if (typeof reproducirTono === "function") {
        if (tipo === "verde") reproducirTono(760, 0.06, "sine", 0.028);
        else if (tipo === "rojo") reproducirTono(280, 0.09, "triangle", 0.03);
        else if (tipo === "oro" || tipo === "azul") reproducirTono(560, 0.07, "sine", 0.025);
    }

    const cerrar = function() {
        if (!toast.parentNode) return;
        toast.classList.add("sale");
        setTimeout(function() {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
            const idx = toastsActivos.indexOf(toast);
            if (idx !== -1) toastsActivos.splice(idx, 1);
        }, 220);
    };

    setTimeout(cerrar, duracionToast(duracion));
    toast.addEventListener("click", cerrar);
}

function toastApoyo(cantidad) {
    if (!cantidad) return;
    mostrarToast("<strong>Apoyo</strong> " + fmt.delta(cantidad), cantidad > 0 ? "verde" : "rojo", cantidad > 0 ? "sube" : "baja");
}

function toastPrestigio(cantidad) {
    if (!cantidad) return;
    mostrarToast("<strong>Prestigio</strong> " + fmt.delta(cantidad), cantidad > 0 ? "verde" : "rojo", "estrella");
}

function toastDinero(cantidad) {
    if (!cantidad) return;
    mostrarToast("<strong>Caja</strong> " + (cantidad > 0 ? "+" : "") + fmt.plata(cantidad), cantidad > 0 ? "verde" : "rojo", "dinero");
}

function toastInfo(mensaje, iconoNombre) { mostrarToast(mensaje, "azul", iconoNombre || "info"); }
function toastExito(mensaje, iconoNombre) { mostrarToast(mensaje, "verde", iconoNombre || "check"); }
function toastAlerta(mensaje, iconoNombre) { mostrarToast(mensaje, "oro", iconoNombre || "alerta"); }
function toastError(mensaje, iconoNombre) { mostrarToast(mensaje, "rojo", iconoNombre || "alerta"); }
function toastLogro(mensaje, iconoNombre) { mostrarToast(mensaje, "violeta", iconoNombre || "medalla", 5200); }
function toastNoticia(mensaje, iconoNombre) { mostrarToast(mensaje, "rosa", iconoNombre || "diario", 4200); }
