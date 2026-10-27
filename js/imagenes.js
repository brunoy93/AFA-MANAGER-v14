// ============================================
// IMÁGENES: escudos, banderas, fotos y logos
// ============================================
// Los clubes con PNG usan la foto. El resto recibe un escudo SVG
// generado con sus colores, así no hay 73 pedidos 404.

const ESCUDOS_CON_FOTO = {
    1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 1,
    11: 1, 12: 1, 13: 1, 14: 1, 15: 1, 16: 1, 17: 1, 18: 1, 19: 1, 20: 1,
    21: 1, 22: 1, 23: 1, 24: 1, 25: 1, 26: 1, 27: 1, 28: 1, 29: 1, 30: 1
};

// Colores de camiseta (primario / secundario) para clubes conocidos.
const COLORES_CLUB = {
    1: ["#e11d2e", "#ffffff"], 2: ["#0b2d6b", "#f2c200"], 3: ["#5aa9e6", "#ffffff"],
    4: ["#d21f2c", "#ffffff"], 5: ["#1b3a8c", "#c8102e"], 6: ["#d0202a", "#ffffff"],
    7: ["#ffffff", "#1b4a9c"], 8: ["#123a7a", "#f5c518"], 9: ["#c8102e", "#111111"],
    10: ["#ffffff", "#d01020"], 11: ["#1c3f94", "#ffffff"], 12: ["#ffffff", "#1b4a9c"],
    13: ["#7a1020", "#ffffff"], 14: ["#c8102e", "#ffffff"], 15: ["#0f7a3d", "#ffffff"],
    16: ["#1b3a8c", "#c8102e"], 17: ["#c8102e", "#ffffff"], 18: ["#5aa9e6", "#ffffff"],
    19: ["#ffffff", "#5b3a1a"], 20: ["#5aa9e6", "#ffffff"], 21: ["#0f7a3d", "#f5c518"],
    22: ["#c8102e", "#ffffff"], 23: ["#0f7a3d", "#ffffff"], 24: ["#1b4a9c", "#ffffff"],
    25: ["#111111", "#ffffff"], 26: ["#0f7a3d", "#ffffff"], 27: ["#ffffff", "#111111"],
    28: ["#c8102e", "#ffffff"], 29: ["#0f7a3d", "#ffffff"], 30: ["#111111", "#f5c518"],
    31: ["#0f7a3d", "#ffffff"], 32: ["#c8102e", "#111111"], 33: ["#1b4a9c", "#ffffff"],
    38: ["#1b4a9c", "#ffffff"], 43: ["#c8102e", "#ffffff"], 46: ["#ffffff", "#1b3a8c"],
    54: ["#ffffff", "#0f7a3d"], 58: ["#c8102e", "#111111"], 63: ["#c8102e", "#ffffff"],
    69: ["#0f7a3d", "#ffffff"], 76: ["#c8102e", "#111111"], 96: ["#1b4a9c", "#ffffff"]
};

const PALETA_CLUB = [
    ["#c8102e", "#ffffff"], ["#1b4a9c", "#ffffff"], ["#0f7a3d", "#ffffff"],
    ["#f5c518", "#111111"], ["#7a1020", "#ffffff"], ["#111111", "#f5c518"],
    ["#5aa9e6", "#ffffff"], ["#e06a1b", "#111111"], ["#6b21a8", "#ffffff"],
    ["#0e7490", "#ffffff"], ["#ffffff", "#1b4a9c"], ["#4d7c0f", "#ffffff"]
];

function colorPorNombre(nombre) {
    let hash = 0;
    const str = String(nombre || "");
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash;
    }
    return PALETA_CLUB[Math.abs(hash) % PALETA_CLUB.length][0];
}

function normalizarNombre(nombre) {
    return String(nombre || "")
        .toLowerCase()
        .trim()
        .replace(/ /g, "_")
        .replace(/[áàäâã]/g, "a")
        .replace(/[èéëê]/g, "e")
        .replace(/[íìïî]/g, "i")
        .replace(/[óòöôõ]/g, "o")
        .replace(/[úùüû]/g, "u")
        .replace(/ñ/g, "n")
        .replace(/ç/g, "c")
        .replace(/[^a-z0-9_]/g, "");
}

function coloresClub(id, nombre) {
    if (COLORES_CLUB[id]) return COLORES_CLUB[id];
    let hash = 0;
    const str = String(nombre || id);
    for (let i = 0; i < str.length; i++) { hash = ((hash << 5) - hash) + str.charCodeAt(i); hash = hash & hash; }
    return PALETA_CLUB[Math.abs(hash) % PALETA_CLUB.length];
}

// ---------- Escudo SVG generado ----------
function escudoSVG(id, nombre, tam) {
    const t = tam || 32;
    const col = coloresClub(id, nombre);
    const c1 = col[0];
    const c2 = col[1];
    const ini = iniciales(nombre) || "?";
    const clip = "esc" + id + "_" + Math.random().toString(36).slice(2, 6);
    return "<svg viewBox='0 0 64 64' width='" + t + "' height='" + t + "' role='img' aria-label='" + escapar(nombre) + "'>" +
        "<defs><clipPath id='" + clip + "'><path d='M32 3 59 12v19c0 16-12 27-27 30C17 58 5 47 5 31V12z'/></clipPath></defs>" +
        "<path d='M32 3 59 12v19c0 16-12 27-27 30C17 58 5 47 5 31V12z' fill='" + c1 + "'/>" +
        "<g clip-path='url(#" + clip + ")'>" +
        "<rect x='32' y='0' width='32' height='64' fill='" + c2 + "'/>" +
        "<rect x='0' y='26' width='64' height='8' fill='" + c1 + "' opacity='.85'/>" +
        "</g>" +
        "<path d='M32 3 59 12v19c0 16-12 27-27 30C17 58 5 47 5 31V12z' fill='none' stroke='rgba(0,0,0,.55)' stroke-width='2'/>" +
        "<path d='M32 7 55 14.6V31c0 13.4-9.8 22.6-23 25.6C18.8 53.6 9 44.4 9 31V14.6z' fill='none' stroke='rgba(255,255,255,.35)' stroke-width='1.2'/>" +
        "<circle cx='32' cy='30' r='13' fill='rgba(6,12,10,.55)'/>" +
        "<text x='32' y='35.5' text-anchor='middle' font-family='Barlow Condensed, Arial Narrow, sans-serif' font-size='15' font-weight='800' fill='#ffffff' letter-spacing='.5'>" + escapar(ini) + "</text>" +
        "</svg>";
}

// ---------- Escudo ----------
function htmlEscudo(idEquipo, nombreEquipo, tamaño) {
    const tam = tamaño || 32;
    const svg = "<span class='escudo-svg'>" + escudoSVG(idEquipo, nombreEquipo, tam) + "</span>";
    // El SVG se dibuja siempre; la foto se superpone si existe y carga.
    const foto = ESCUDOS_CON_FOTO[idEquipo]
        ? "<img class='escudo-foto' src='img/escudos/" + idEquipo + ".png' alt='" + escapar(nombreEquipo) + "' " +
          "loading='lazy' onload=\"this.parentElement.classList.add('con-foto')\" onerror=\"this.remove()\">"
        : "";
    return "<span class='escudo' style='width:" + tam + "px;height:" + tam + "px'>" + svg + foto + "</span>";
}

function htmlEscudoEquipo(equipo, tamaño) {
    if (!equipo) return htmlEscudo(0, "?", tamaño);
    return htmlEscudo(equipo.id, equipo.nombre, tamaño);
}

// ---------- Bandera ----------
function htmlBandera(nombrePais, tamaño) {
    const tam = tamaño || 24;
    const alto = Math.round(tam * 0.68);
    const archivo = normalizarNombre(nombrePais);
    return "<span class='bandera' style='width:" + tam + "px;height:" + alto + "px'>" +
        "<img src='img/banderas/" + archivo + ".png' alt='" + escapar(nombrePais) + "' width='" + tam + "' height='" + alto + "' loading='lazy' " +
        "onerror=\"this.style.display='none';this.parentElement.classList.add('bandera-sin');this.parentElement.textContent='" + escapar(String(nombrePais).slice(0, 3).toUpperCase()) + "'\">" +
        "</span>";
}

// ---------- Foto de DT ----------
function htmlFotoDT(idDT, nombreDT, tamaño) {
    const tam = tamaño || 60;
    const color = coloresClub(0, nombreDT)[0];
    return "<span class='foto-dt' style='width:" + tam + "px;height:" + tam + "px;background:" + color + "'>" +
        "<span class='foto-dt-ini'>" + escapar(iniciales(nombreDT)) + "</span>" +
        "<img src='img/dts/" + idDT + ".png' alt='" + escapar(nombreDT) + "' width='" + tam + "' height='" + tam + "' loading='lazy' " +
        "onerror=\"this.style.display='none'\">" +
        "</span>";
}

// ---------- Logo de sponsor ----------
function htmlLogoSponsor(idSponsor, nombreSponsor, tamaño) {
    const tam = tamaño || 56;
    return "<span class='logo-sponsor' style='width:" + tam + "px;height:" + tam + "px'>" +
        "<img src='img/sponsors/" + idSponsor + ".png' alt='" + escapar(nombreSponsor) + "' width='" + tam + "' height='" + tam + "' loading='lazy' " +
        "onerror=\"this.style.display='none';this.parentElement.classList.add('sin-logo')\">" +
        "</span>";
}

// ---------- Icono genérico ----------
function htmlIcono(nombre, tamaño, colorFondo) {
    const tam = tamaño || 32;
    return "<span class='icono-circulo' style='width:" + tam + "px;height:" + tam + "px;background:" + (colorFondo || "rgba(61,220,132,.12)") + "'>" +
        icono(nombre, "", Math.round(tam * 0.55)) + "</span>";
}
