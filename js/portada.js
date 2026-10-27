// ============================================
// PORTADA: el escritorio como una transmisión
// ============================================

function resultadoDestacado() {
    const fecha = estadoLigas.fechaActual - 1;
    const resultados = (estadoLigas.resultados.primera || [])[fecha];
    if (!resultados || !resultados.length) return null;

    const clasico = resultados.filter(function(r) {
        return typeof clasicoDe === "function" && clasicoDe(r.localId, r.visitanteId);
    })[0];
    if (clasico) return { r: clasico, fecha: fecha, clasico: true, titulo: "CLÁSICO" };

    const ordenados = resultados.slice().sort(function(a, b) {
        return Math.abs(b.golesLocal - b.golesVisitante) - Math.abs(a.golesLocal - a.golesVisitante);
    });
    return { r: ordenados[0], fecha: fecha, clasico: false, titulo: "ÚLTIMA FECHA" };
}

function panelPortada(hero, asamblea) {
    const destacado = resultadoDestacado();
    const tabla = (estadoLigas.tablas && estadoLigas.tablas.primera) ? obtenerTablaOrdenada("primera") : [];
    const lider = tabla[0];
    const colorLider = lider ? colorClub(lider.id) : "#3ddc84";
    const goleador = (typeof tablaGoleadores === "function") ? tablaGoleadores(1)[0] : null;
    const pendientes = colaModales.length;

    const resultadoHTML = destacado
        ? "<div class='portada-partido'>" +
            "<div class='portada-eq' style='--club:" + colorClub(destacado.r.localId) + "'>" +
              "<span class='portada-eq-esc'>" + htmlEscudo(destacado.r.localId, destacado.r.local, 34) + "</span>" +
              "<span class='portada-eq-nombre'>" + escapar(destacado.r.local) + "</span></div>" +
            "<div class='portada-marca'>" + destacado.r.golesLocal + "<span>-</span>" + destacado.r.golesVisitante + "</div>" +
            "<div class='portada-eq derecha' style='--club:" + colorClub(destacado.r.visitanteId) + "'>" +
              "<span class='portada-eq-nombre'>" + escapar(destacado.r.visitante) + "</span>" +
              "<span class='portada-eq-esc'>" + htmlEscudo(destacado.r.visitanteId, destacado.r.visitante, 34) + "</span></div>" +
          "</div>"
        : "<div class='portada-sin'>Todavía no se jugó ninguna fecha.</div>";

    const podio = tabla.slice(0, 3).map(function(t, i) {
        return "<div class='portada-fila' style='--club:" + colorClub(t.id) + "'>" +
            "<span class='portada-pos'>" + (i + 1) + "</span>" +
            "<span class='portada-nombre'>" + escapar(t.nombre) + "</span>" +
            "<span class='portada-pts'>" + t.Pts + "</span></div>";
    }).join("");

    return "<section class='portada' style='--club:" + colorLider + "'>" +
        "<div class='portada-brillo'></div>" +
        "<div class='portada-cab'>" +
          "<span class='portada-liga'>LIGA PROFESIONAL · FECHA " + (estadoLigas.fechaActual + 1) + " DE " + estadoLigas.totalFechas + "</span>" +
          "<span class='portada-envivo'><span class='punto-vivo'></span> AL AIRE</span>" +
        "</div>" +
        "<div class='portada-cuerpo'>" +
          "<div class='portada-principal'>" +
            "<div class='hero-etiqueta'>" + icono("rayo", "", 14) + hero.etiqueta + "</div>" +
            "<h2 class='hero-titulo'>" + hero.titulo + "</h2>" +
            "<p class='hero-texto'>" + hero.texto + "</p>" +
            "<div class='hero-acciones'>" +
              "<button class='btn-primario' data-accion='avanzar'>" + icono("flecha", "", 18) + "Avanzar fecha</button>" +
              "<button class='btn' data-accion='avanzar-rapido'>" + icono("rayo", "", 16) + "Hasta la próxima decisión</button>" +
              "<button class='btn' data-accion='ir-pantalla' data-pantalla='consejo'>" + icono("consejo", "", 17) + "Ver el consejo</button>" +
              (pendientes ? "<button class='btn-suave' data-accion='abrir-bandeja'>" + icono("sobre", "", 17) + pendientes + " pendiente" + (pendientes > 1 ? "s" : "") + "</button>" : "") +
            "</div>" +
          "</div>" +
          "<div class='portada-lateral'>" +
            "<div class='portada-tarjeta'>" +
              "<div class='portada-tarjeta-cab'>" + (destacado ? (destacado.clasico ? "CLÁSICO" : "ÚLTIMA FECHA " + (destacado.fecha + 1)) : "SIN FÚTBOL") + "</div>" +
              resultadoHTML +
              (destacado && destacado.r.incidencia ? "<div class='portada-nota'>Polémica arbitral. El SECANUCA tomó nota.</div>" : "") +
            "</div>" +
            "<div class='portada-tarjeta'>" +
              "<div class='portada-tarjeta-cab'>PUNTERO" + (lider ? " · " + lider.Pts + " PTS" : "") + "</div>" +
              "<div class='portada-podio'>" + podio + "</div>" +
              (goleador ? "<div class='portada-nota'>Goleador: " + escapar(goleador.nombre) + " (" + goleador.goles + ")</div>" : "") +
            "</div>" +
          "</div>" +
        "</div>" +
        "<div class='hero-datos'>" +
          "<div class='hero-dato'><span>Apoyo</span><strong>" + presidente.apoyoClubes + "</strong></div>" +
          "<div class='hero-dato'><span>Prestigio</span><strong>" + presidente.prestigioInternacional + "</strong></div>" +
          "<div class='hero-dato'><span>Caja</span><strong>" + fmt.plata(presidente.dineroEnCaja) + "</strong></div>" +
          "<div class='hero-dato'><span>Asamblea</span><strong class='" + (asamblea.gana ? "pos" : "neg") + "'>" + Math.round(asamblea.proyeccion * 100) + "%</strong></div>" +
        "</div>" +
        "</section>";
}
