// ============================================
// EL DOCUMENTAL: tu mandato, contado
// ============================================

function balanceDeGestion() {
    const decisiones = (presidente.historialDecisiones || []);
    const rescates = (estadoFinanzas.rescates ? Object.keys(estadoFinanzas.rescates).reduce(function(a, k) { return a + estadoFinanzas.rescates[k]; }, 0) : 0);
    const operativos = (estadoOperativo.historial || []).length;
    const escandalos = (presidente.escandalosDesignacion || 0) + (estadoSecanuca.eventos.filter(function(e) { return e.tipo === "escandalo"; }).length);
    const titulos = (estadoHistorial.temporadas || []).filter(function(t) { return t.campeon; }).length;
    const copas = (estadoCopaArgentina.historial || []).length;
    const secanucaTop = (typeof clubMasFavorecidoSecanuca === "function") ? clubMasFavorecidoSecanuca() : null;

    return {
        decisiones: decisiones.length,
        rescates: rescates,
        operativos: operativos,
        escandalos: escandalos,
        titulos: titulos,
        copas: copas,
        secanucaTop: secanucaTop
    };
}

function veredictoGestion(balance) {
    const puntos = puntajeLegado();
    const rango = rangoLegado(puntos);
    let perfil = "El administrador";
    if (balance.operativos >= 3) perfil = "El operador";
    else if (balance.escandalos >= 3) perfil = "El presidente bajo sospecha";
    else if (balance.rescates >= 4 && puntos < 750) perfil = "El padrino de los clubes";
    else if (puntos >= 1050) perfil = "El estadista";
    else if (puntos >= 750) perfil = "El constructor";
    else if (puntos < 450) perfil = "El sobreviviente";
    return { puntos: puntos, rango: rango, perfil: perfil };
}

function capitulosDelMandato() {
    const temporadas = estadoHistorial.temporadas || [];
    if (temporadas.length) {
        return temporadas.map(function(t) {
            return {
                titulo: "Año " + t.anio,
                campeon: t.campeon,
                copa: t.copaArgentina,
                goleador: t.goleador,
                apoyo: t.apoyo,
                caja: t.caja,
                texto: t.campeon + " se quedó con el torneo. " +
                    (t.copaArgentina && t.copaArgentina !== "—" ? t.copaArgentina + " ganó la Copa Argentina. " : "") +
                    "El goleador fue " + t.goleador + ". Terminaste con " + t.apoyo + " de apoyo y " + fmt.plata(t.caja) + " en caja."
            };
        });
    }
    return [{ titulo: "Año " + presidente.anioMandato, texto: "El mandato terminó antes de cerrar una temporada completa." }];
}

function abrirDocumental() {
    const balance = balanceDeGestion();
    const veredicto = veredictoGestion(balance);
    const capitulos = capitulosDelMandato();

    const capitulosHTML = capitulos.map(function(c, i) {
        return "<div class='doc-capitulo'>" +
            "<div class='doc-num'>" + (i + 1) + "</div>" +
            "<div class='crecer'>" +
            "<div class='doc-titulo'>" + escapar(c.titulo) + "</div>" +
            "<p class='doc-texto'>" + escapar(c.texto) + "</p>" +
            "</div></div>";
    }).join("");

    const numeros = [
        { k: "Decisiones", v: balance.decisiones },
        { k: "Rescates", v: balance.rescates },
        { k: "Operativos", v: balance.operativos },
        { k: "Escándalos", v: balance.escandalos },
        { k: "Títulos", v: balance.titulos },
        { k: "Copas", v: balance.copas }
    ].map(function(n) {
        return "<div class='legado-dato'><span>" + n.k + "</span><strong>" + n.v + "</strong></div>";
    }).join("");

    UI.cerrar("legado");
    UI.modal({
        id: "documental",
        eyebrow: "El documental",
        titulo: "AFA MANAGER: " + veredicto.perfil,
        sub: "Una gestión de " + presidente.anioMandato + " año" + (presidente.anioMandato > 1 ? "s" : "") + " contada en capítulos.",
        ancho: "ancho",
        cerrable: true,
        cuerpo:
            "<div class='doc'>" +
            "<div class='doc-apertura'>" + icono("camara", "", 22) +
            "<p class='doc-voz'>\"Arrancó con " + presidente.apoyoClubes + " de apoyo y una caja que no alcanzaba para los sueldos. Terminó como " +
            veredicto.rango.nombre + ".\"</p></div>" +
            capitulosHTML +
            "<div class='doc-balance'>" +
            "<div class='doc-sub'>El balance</div>" +
            "<div class='legado-datos'>" + numeros + "</div>" +
            (typeof desgloseLegado === "function" ? "<div style='margin-top:10px'>" +
                desgloseLegado().map(function(d) {
                    return "<div class='metrica-fila'><span>" + escapar(d.nombre) + "</span><strong class='" + (d.valor >= 0 ? "pos" : "neg") + "'>" + d.valor + "</strong></div>";
                }).join("") + "</div>" : "") +
            (balance.secanucaTop ? "<p class='mini tenue' style='margin-top:10px'>El SECANUCA cerró con " + escapar(balance.secanucaTop.nombre) + " en la cima del índice de poder (" + balance.secanucaTop.indice + ").</p>" : "") +
            "</div>" +
            "<div class='doc-veredicto'>" +
            "<div class='legado-puntos'><span>" + veredicto.puntos + "</span><small>puntos de legado</small></div>" +
            "<div class='legado-rango' style='color:" + veredicto.rango.color + "'>" + veredicto.rango.nombre + "</div>" +
            "<p class='tenue centro'>" + veredicto.rango.desc + "</p>" +
            "</div></div>",
        pie: [
            { texto: "Ver logros", accion: "ir-legado", tipo: "fantasma" },
            { texto: "Nueva partida", accion: "reiniciar-partida", tipo: "primario" }
        ]
    });
}
