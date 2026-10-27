// ============================================
// CORE: utilidades comunes de toda la app
// ============================================

// ---------- DOM ----------
const $ = function(sel, raiz) { return (raiz || document).querySelector(sel); };
const $$ = function(sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); };

function crear(tag, clases, html) {
    const n = document.createElement(tag);
    if (clases) n.className = clases;
    if (html != null) n.innerHTML = html;
    return n;
}

function pintar(contenedor, html) {
    const nodo = typeof contenedor === "string" ? $(contenedor) : contenedor;
    if (!nodo) return null;
    nodo.innerHTML = html;
    return nodo;
}

// ---------- Números ----------
function limitar(n, min, max) { return Math.max(min, Math.min(max, n)); }

function entre(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function probabilidad(p) { return Math.random() < p; }

function elegir(lista) { return lista[Math.floor(Math.random() * lista.length)]; }

function barajar(lista) {
    const copia = lista.slice();
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = copia[i]; copia[i] = copia[j]; copia[j] = tmp;
    }
    return copia;
}

function suma(lista) { return lista.reduce(function(a, b) { return a + b; }, 0); }

function promedio(lista) { return lista.length ? suma(lista) / lista.length : 0; }

// ---------- Formato ----------
const fmt = {
    num: function(n) {
        if (n == null || isNaN(n)) return "—";
        return Math.round(n).toLocaleString("es-AR");
    },
    // Millones de pesos: 11000 -> "$11.000M"
    plata: function(n, opciones) {
        const opt = opciones || {};
        if (n == null || isNaN(n)) return "—";
        const valor = Math.round(n);
        const signo = valor > 0 && opt.siempreSigno ? "+" : "";
        const abs = Math.abs(valor).toLocaleString("es-AR");
        return signo + (valor < 0 ? "-$" : "$") + abs + "M";
    },
    // Deltas con signo tipográfico: +8, −8
    delta: function(n) {
        if (!n) return "0";
        return (n > 0 ? "+" : "−") + Math.abs(Math.round(n)).toLocaleString("es-AR");
    },
    pct: function(n, decimales) {
        return (Math.round(n * Math.pow(10, decimales || 0)) / Math.pow(10, decimales || 0)) + "%";
    },
    plural: function(n, singular, plural) {
        return n === 1 ? singular : (plural || singular + "s");
    }
};

// ---------- Texto ----------
function escapar(texto) {
    return String(texto == null ? "" : texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function iniciales(nombre) {
    return String(nombre || "?")
        .split(/\s+/)
        .filter(function(p) { return p.length > 2; })
        .slice(0, 2)
        .map(function(p) { return p.charAt(0).toUpperCase(); })
        .join("");
}

// ---------- Tiempo ----------
function fechaLegible(iso) {
    try {
        const d = new Date(iso);
        return d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" }) +
            " · " + d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    } catch (e) { return "—"; }
}

// ---------- Almacenamiento ----------
const Almacen = {
    leer: function(clave) {
        try {
            const bruto = localStorage.getItem(clave);
            return bruto ? JSON.parse(bruto) : null;
        } catch (e) { return null; }
    },
    escribir: function(clave, valor) {
        try { localStorage.setItem(clave, JSON.stringify(valor)); return true; }
        catch (e) { return false; }
    },
    borrar: function(clave) {
        try { localStorage.removeItem(clave); } catch (e) {}
    },
    listar: function() {
        const claves = [];
        try {
            for (let i = 0; i < localStorage.length; i++) claves.push(localStorage.key(i));
        } catch (e) {}
        return claves;
    }
};

// ---------- Animación ----------
const reduceMovimiento = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function animarNumero(elemento, destino, formato) {
    if (!elemento) return;
    const actual = Number(elemento.dataset.valor || 0);
    elemento.dataset.valor = destino;
    if (reduceMovimiento || actual === destino) {
        elemento.textContent = (formato || fmt.num)(destino);
        return;
    }
    const desde = actual;
    const inicio = performance.now();
    const duracion = 520;
    function paso(ahora) {
        const t = Math.min((ahora - inicio) / duracion, 1);
        const suave = 1 - Math.pow(1 - t, 3);
        const valor = Math.round(desde + (destino - desde) * suave);
        elemento.textContent = (formato || fmt.num)(valor);
        if (t < 1) requestAnimationFrame(paso);
        else elemento.textContent = (formato || fmt.num)(destino);
    }
    requestAnimationFrame(paso);
}

// ---------- Iconos (SVG inline, trazo 1.8) ----------
const ICONOS = {
    casa: "M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
    consejo: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
    escudo: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    trofeo: "M8 21h8 M12 17v4 M7 4h10v5a5 5 0 0 1-10 0z M7 6H4a3 3 0 0 0 3 4 M17 6h3a3 3 0 0 1-3 4",
    copa: "M6 3h12v5a6 6 0 0 1-12 0z M6 5H3v2a3 3 0 0 0 3 3 M18 5h3v2a3 3 0 0 1-3 3 M9 21h6 M12 14v7",
    bandera: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V4s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7",
    balanza: "M12 3v18 M5 7l-3 6a3 3 0 0 0 6 0z M19 7l-3 6a3 3 0 0 0 6 0z M3 7h18 M8 21h8",
    dinero: "M2 7h20v10H2z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4 M5 10v.01 M19 14v.01",
    diario: "M4 4h13a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2z M19 8h1v12 M8 8h7 M8 12h7 M8 16h4",
    medalla: "M7 3h10l-3 7H10z M12 21a5 5 0 1 0 0-10 5 5 0 0 0 0 10z M12 16.5l.8 1.6 1.7.2-1.2 1.2.3 1.7-1.6-.8-1.6.8.3-1.7-1.2-1.2 1.7-.2z",
    ajustes: "M4 21v-7 M4 10V3 M12 21v-9 M12 8V3 M20 21v-5 M20 12V3 M2 14h4 M10 8h4 M18 16h4",
    calendario: "M3 5h18v16H3z M16 2v5 M8 2v5 M3 10h18",
    grafico: "M18 20V10 M12 20V4 M6 20v-6",
    sobre: "M22 12h-6l-2 3h-4l-2-3H2 M5 5h14l3 7v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z",
    alerta: "M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z M12 9v4 M12 17h.01",
    check: "M20 6 9 17l-5-5",
    cruz: "M18 6 6 18 M6 6l12 12",
    flecha: "M5 12h14 M12 5l7 7-7 7",
    derecha: "M9 18l6-6-6-6",
    izquierda: "M15 18l-6-6 6-6",
    arriba: "M18 15l-6-6-6 6",
    abajo: "M6 9l6 6 6-6",
    estrella: "M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z",
    reloj: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 2",
    volumen: "M11 5 6 9H2v6h4l5 4z M15.5 8.5a5 5 0 0 1 0 7 M18.5 5.5a9 9 0 0 1 0 13",
    mudo: "M11 5 6 9H2v6h4l5 4z M22 9l-6 6 M16 9l6 6",
    guardar: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8",
    recargar: "M23 4v6h-6 M1 20v-6h6 M3.5 9a9 9 0 0 1 14.9-3.4L23 10 M1 14l4.6 4.4A9 9 0 0 0 20.5 15",
    objetivo: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
    globo: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M3 12h18 M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z",
    maletin: "M4 7h16v13H4z M9 7V4h6v3 M4 12h16",
    usuario: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    mensaje: "M21 11.5a8.4 8.4 0 0 1-9 8.5 8.5 8.5 0 0 1-4-.9L3 21l1.9-5a8.5 8.5 0 0 1 8.1-12 8.4 8.4 0 0 1 8 7.5z",
    sube: "M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6",
    baja: "M23 18l-9.5-9.5-5 5L1 6 M17 18h6v-6",
    rayo: "M13 2 3 14h9l-1 8 10-12h-9z",
    candado: "M5 11h14v10H5z M8 11V7a4 4 0 0 1 8 0v4",
    info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 16v-4 M12 8h.01",
    lista: "M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01",
    cuadricula: "M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z",
    cancha: "M3 5h18v14H3z M12 5v14 M12 12a2 2 0 1 0 0-.01 M3 9h3v6H3z M21 9h-3v6h3z",
    silbato: "M3 12a5 5 0 0 1 5-5h13v4h-7a3 3 0 0 1-3 3v3a5 5 0 0 1-8-5z M9 14h-.01",
    corona: "M3 18h18l-2-9-4 4-3-6-3 6-4-4z M5 21h14",
    libro: "M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z M20 4h-3a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h4z",
    salir: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9"
};

function icono(nombre, clase, tam) {
    const d = ICONOS[nombre] || ICONOS.info;
    const tamaño = tam || 20;
    return "<svg class='ico " + (clase || "") + "' width='" + tamaño + "' height='" + tamaño +
        "' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' " +
        "stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><path d='" + d + "'/></svg>";
}

// Logo: escudo con tres estrellas y balón
function logoAFA(tam) {
    const t = tam || 40;
    return "<svg class='logo-afa' width='" + t + "' height='" + t + "' viewBox='0 0 48 48' aria-hidden='true'>" +
        "<defs><linearGradient id='lgAfa' x1='0' y1='0' x2='1' y2='1'>" +
        "<stop offset='0' stop-color='#5eead4'/><stop offset='1' stop-color='#22c55e'/></linearGradient></defs>" +
        "<path d='M24 3 42 9v14c0 11-8 19-18 22C14 42 6 34 6 23V9z' fill='url(#lgAfa)' opacity='.14' stroke='url(#lgAfa)' stroke-width='2'/>" +
        "<path d='M24 10 34 13.5v9.2c0 7-4.6 12.3-10 14.5-5.4-2.2-10-7.5-10-14.5v-9.2z' fill='none' stroke='#eafff5' stroke-width='1.2' opacity='.35'/>" +
        "<circle cx='24' cy='22' r='6' fill='none' stroke='#eafff5' stroke-width='2'/>" +
        "<path d='M24 16v3.2M20.6 24.4l3-1.2M27.4 24.4l-3-1.2' stroke='#eafff5' stroke-width='1.6' stroke-linecap='round'/>" +
        "<path d='M17 39h14' stroke='url(#lgAfa)' stroke-width='2' stroke-linecap='round'/>" +
        "</svg>";
}

// ---------- Varios ----------
function unicoId(prefijo) {
    return (prefijo || "id") + "-" + Math.random().toString(36).slice(2, 8);
}

function ahora() { return new Date().toISOString(); }
