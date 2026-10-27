// ============================================
// CHARTS: gráficos SVG sin dependencias
// ============================================

const Charts = (function() {

    function pathSuave(puntos) {
        if (puntos.length < 2) return "";
        let d = "M" + puntos[0][0].toFixed(1) + " " + puntos[0][1].toFixed(1);
        for (let i = 1; i < puntos.length; i++) {
            const p0 = puntos[i - 1];
            const p1 = puntos[i];
            const cx = (p0[0] + p1[0]) / 2;
            d += " C" + cx.toFixed(1) + " " + p0[1].toFixed(1) + " " + cx.toFixed(1) + " " + p1[1].toFixed(1) + " " + p1[0].toFixed(1) + " " + p1[1].toFixed(1);
        }
        return d;
    }

    // ---------- Sparkline ----------
    function sparkline(valores, opciones) {
        const opt = opciones || {};
        const w = opt.ancho || 240;
        const h = opt.alto || 56;
        const pad = 4;
        const color = opt.color || "#4ade80";
        const datos = (valores && valores.length ? valores : [0, 0]).slice(-24);
        const min = Math.min.apply(null, datos);
        const max = Math.max.apply(null, datos);
        const rango = (max - min) || 1;
        const puntos = datos.map(function(v, i) {
            const x = pad + (i * (w - pad * 2)) / Math.max(datos.length - 1, 1);
            const y = h - pad - ((v - min) / rango) * (h - pad * 2);
            return [x, y];
        });
        const d = pathSuave(puntos);
        const area = d + " L" + (w - pad) + " " + (h - pad) + " L" + pad + " " + (h - pad) + " Z";
        const id = unicoId("sp");
        const ultimo = puntos[puntos.length - 1];
        return "<svg class='chart-spark' viewBox='0 0 " + w + " " + h + "' preserveAspectRatio='none' role='img'>" +
            "<defs><linearGradient id='" + id + "' x1='0' y1='0' x2='0' y2='1'>" +
            "<stop offset='0' stop-color='" + color + "' stop-opacity='.32'/>" +
            "<stop offset='1' stop-color='" + color + "' stop-opacity='0'/></linearGradient></defs>" +
            "<path d='" + area + "' fill='url(#" + id + ")'/>" +
            "<path d='" + d + "' fill='none' stroke='" + color + "' stroke-width='2' stroke-linecap='round'/>" +
            "<circle cx='" + ultimo[0].toFixed(1) + "' cy='" + ultimo[1].toFixed(1) + "' r='3' fill='" + color + "'/>" +
            "</svg>";
    }

    // ---------- Gauge semicircular ----------
    function gauge(valor, opciones) {
        const opt = opciones || {};
        const v = limitar(Math.round(valor), 0, 100);
        const w = opt.ancho || 160;
        const h = opt.alto || 88;
        const r = 62;
        const cx = w / 2;
        const cy = h - 8;
        const largo = Math.PI * r;
        const color = opt.color || (v >= 65 ? "#4ade80" : v >= 40 ? "#fbbf24" : "#f87171");
        const id = unicoId("gg");
        const descripcion = opt.etiqueta || "Confianza";
        return "<div class='gauge' style='width:" + w + "px'>" +
            "<svg viewBox='0 0 " + w + " " + h + "' role='img' aria-label='" + descripcion + ": " + v + " de 100'>" +
            "<defs><linearGradient id='" + id + "' x1='0' y1='0' x2='1' y2='0'>" +
            "<stop offset='0' stop-color='#f87171'/><stop offset='.5' stop-color='#fbbf24'/><stop offset='1' stop-color='#4ade80'/>" +
            "</linearGradient></defs>" +
            "<path d='M" + (cx - r) + " " + cy + " A" + r + " " + r + " 0 0 1 " + (cx + r) + " " + cy + "' fill='none' stroke='rgba(255,255,255,.08)' stroke-width='11' stroke-linecap='round'/>" +
            "<path d='M" + (cx - r) + " " + cy + " A" + r + " " + r + " 0 0 1 " + (cx + r) + " " + cy + "' fill='none' stroke='url(#" + id + ")' stroke-width='11' stroke-linecap='round' stroke-dasharray='" + (largo * v / 100).toFixed(1) + " " + largo.toFixed(1) + "'/>" +
            "</svg>" +
            "<div class='gauge-valor' style='color:" + color + "'>" + v + "</div>" +
            (opt.etiqueta ? "<div class='gauge-label'>" + opt.etiqueta + "</div>" : "") +
            "</div>";
    }

    // ---------- Hemiciclo de asamblea ----------
    function hemiciclo(grupos, opciones) {
        // grupos: [{valor, color, nombre}] en orden izquierda -> derecha
        const opt = opciones || {};
        const w = opt.ancho || 320;
        const h = opt.alto || 176;
        const total = suma(grupos.map(function(g) { return g.valor; })) || 1;
        const filas = 5;
        const puntos = [];
        const radioMax = Math.min(w / 2 - 14, h - 18);

        for (let f = 0; f < filas; f++) {
            const radio = radioMax - f * (radioMax / (filas + 0.6));
            const n = Math.max(3, Math.round((total * (radio / radioMax)) / filas));
            for (let i = 0; i < n; i++) {
                const ang = Math.PI - (i + 0.5) * Math.PI / n;
                puntos.push({ x: w / 2 + Math.cos(ang) * radio, y: h - 12 - Math.sin(ang) * radio * 0.98, ang: ang });
            }
        }
        puntos.sort(function(a, b) { return b.ang - a.ang; });

        const asignados = [];
        let cursor = 0;
        grupos.forEach(function(g) {
            const cuantos = Math.round((g.valor / total) * puntos.length);
            for (let i = 0; i < cuantos && cursor < puntos.length; i++) {
                asignados.push({ p: puntos[cursor++], color: g.color, nombre: g.nombre });
            }
        });
        while (cursor < puntos.length) {
            asignados.push({ p: puntos[cursor++], color: "#334155", nombre: "Sin asignar" });
        }

        const r = Math.max(3, Math.min(6, 220 / Math.sqrt(puntos.length)));
        const circulos = asignados.map(function(a) {
            return "<circle cx='" + a.p.x.toFixed(1) + "' cy='" + a.p.y.toFixed(1) + "' r='" + r.toFixed(1) + "' fill='" + a.color + "' opacity='.92'><title>" + escapar(a.nombre) + "</title></circle>";
        }).join("");

        return "<svg class='chart-hemi' viewBox='0 0 " + w + " " + h + "' role='img' aria-label='Composición de la asamblea'>" + circulos + "</svg>";
    }

    // ---------- Barras horizontales ----------
    function barras(items, opciones) {
        const opt = opciones || {};
        const max = Math.max.apply(null, items.map(function(i) { return Math.abs(i.valor); }).concat([1]));
        return "<div class='barras'>" + items.map(function(item) {
            const ancho = Math.round((Math.abs(item.valor) / max) * 100);
            const color = item.color || "#4ade80";
            return "<div class='barra-fila'>" +
                "<span class='barra-label'>" + escapar(item.nombre) + "</span>" +
                "<span class='barra-pista'><span class='barra-relleno' style='width:" + ancho + "%;background:" + color + "'></span></span>" +
                "<span class='barra-valor'>" + (item.texto != null ? item.texto : fmt.num(item.valor)) + "</span>" +
                "</div>";
        }).join("") + "</div>";
    }

    // ---------- Anillo ----------
    function anillo(porcentaje, opciones) {
        const opt = opciones || {};
        const p = limitar(porcentaje, 0, 100);
        const tam = opt.tamano || 96;
        const grosor = opt.grosor || 9;
        const r = (tam - grosor) / 2;
        const c = 2 * Math.PI * r;
        const color = opt.color || "#4ade80";
        return "<div class='anillo' style='width:" + tam + "px;height:" + tam + "px'>" +
            "<svg viewBox='0 0 " + tam + " " + tam + "'>" +
            "<circle cx='" + tam / 2 + "' cy='" + tam / 2 + "' r='" + r + "' fill='none' stroke='rgba(255,255,255,.08)' stroke-width='" + grosor + "'/>" +
            "<circle cx='" + tam / 2 + "' cy='" + tam / 2 + "' r='" + r + "' fill='none' stroke='" + color + "' stroke-width='" + grosor + "' stroke-linecap='round' " +
            "stroke-dasharray='" + (c * p / 100).toFixed(1) + " " + c.toFixed(1) + "' transform='rotate(-90 " + tam / 2 + " " + tam / 2 + ")'/>" +
            "</svg><span class='anillo-valor'>" + Math.round(p) + "%</span></div>";
    }

    return { sparkline: sparkline, gauge: gauge, hemiciclo: hemiciclo, barras: barras, anillo: anillo };
})();
