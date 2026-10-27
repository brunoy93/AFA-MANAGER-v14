// ============================================
// CONSEJO EXTRA: reglamento y mesa chica
// ============================================

function reglamentoActual() {
    if (!presidente.reglamento) {
        presidente.reglamento = { descensos: 3, metodo: "tabla", varObligatorio: false };
    }
    return presidente.reglamento;
}

function abrirReglamento() {
    const r = reglamentoActual();
    const puede = (presidente.reunionReglamento || 0) !== presidente.anioMandato;

    const fila = function(titulo, valor, opciones) {
        return "<div class='regla'>" +
            "<div class='crecer'><strong>" + titulo + "</strong><div class='mini tenue'>Actual: " + valor + "</div></div>" +
            "<div class='fila wrap' style='gap:6px'>" + opciones + "</div></div>";
    };

    const boton = function(regla, valor, texto, activo) {
        return "<button class='seg " + (activo ? "activo" : "") + "' data-accion='cambiar-regla' data-regla='" + regla + "' data-valor='" + valor + "'>" + texto + "</button>";
    };

    UI.modal({
        id: "reglamento",
        eyebrow: "Boletín oficial",
        titulo: "El reglamento del torneo",
        sub: puede ? "Una reunión por año. Lo que decidas queda firme toda la temporada." : "Ya usaste la reunión de este año.",
        ancho: "ancho",
        cerrable: true,
        cuerpo:
            fila("Descensos de Primera", r.descensos + " por temporada",
                boton("descensos", 2, "2", r.descensos === 2) + boton("descensos", 3, "3", r.descensos === 3)) +
            fila("Método de descenso", r.metodo === "promedios" ? "Promedios" : "Tabla",
                boton("metodo", "tabla", "Tabla", r.metodo === "tabla") + boton("metodo", "promedios", "Promedios", r.metodo === "promedios")) +
            fila("VAR obligatorio", r.varObligatorio ? "Sí (cuesta $800M por año)" : "No",
                boton("var", "si", "Sí", r.varObligatorio) + boton("var", "no", "No", !r.varObligatorio)) +
            (puede ? "" : "<p class='mini tenue'>Volvé el año que viene.</p>")
    });
}

function cambiarRegla(regla, valor) {
    if ((presidente.reunionReglamento || 0) === presidente.anioMandato) {
        toastAlerta("La reunión de este año ya se hizo.");
        return;
    }
    const r = reglamentoActual();

    if (regla === "descensos") {
        const n = Number(valor);
        if (n === r.descensos) return;
        r.descensos = n;
        if (n === 2) { ajustarApoyo(5, "Menos descensos"); ajustarPrestigio(-3, "Menos descensos"); }
        else { ajustarApoyo(-4, "Más descensos"); ajustarPrestigio(2, "Más descensos"); }
    } else if (regla === "metodo") {
        if (valor === r.metodo) return;
        r.metodo = valor;
        if (valor === "promedios") { ajustarApoyo(2, "Descenso por promedios"); ajustarPrestigio(-1, "Descenso por promedios"); }
        else { ajustarApoyo(-2, "Descenso por tabla"); ajustarPrestigio(2, "Descenso por tabla"); }
    } else if (regla === "var") {
        const si = valor === "si";
        if (si === r.varObligatorio) return;
        if (si && presidente.dineroEnCaja < 800) { toastError("No hay caja para el VAR."); return; }
        r.varObligatorio = si;
        if (si) { ajustarDinero(-800, "VAR obligatorio"); ajustarPrestigio(3, "VAR obligatorio"); }
        else { ajustarPrestigio(-2, "Sin VAR obligatorio"); }
    }

    presidente.reunionReglamento = presidente.anioMandato;
    UI.cerrar("reglamento");
    toastExito("Reglamento actualizado", "libro");
    guardarPartida();
    refrescar();
}

// -----------------------------
// MESA CHICA
// -----------------------------

function puedeMesaChica() {
    return estadoLigas.fechaActual - (presidente.ultimaMesaChica || -6) >= 6;
}

function abrirMesaChica() {
    if (!puedeMesaChica()) {
        toastAlerta("La mesa chica se reúne cada seis fechas.");
        return;
    }
    const dirigentes = estadoDirigentes.lista.slice(0, 3);
    if (dirigentes.length < 3) { toastInfo("No hay dirigentes para la mesa chica."); return; }

    const opciones = dirigentes.map(function(d) {
        return "<button class='opcion' data-accion='mesa-chica' data-id='" + d.id + "'>" +
            "<span class='opcion-marca'>" + iniciales(d.nombre) + "</span>" +
            "<span class='opcion-cuerpo'><span class='opcion-titulo'>" + escapar(d.nombre) + " · " + escapar(d.club) + "</span>" +
            "<span class='opcion-resumen'>Lealtad " + d.lealtad + " · darle el gusto suma 8</span></span></button>";
    }).join("");

    UI.modal({
        id: "mesa-chica",
        eyebrow: "Mesa chica",
        titulo: "Tres dirigentes, un café",
        sub: "Podés quedar bien con uno, con dos o con ninguno. El que quede afuera se acuerda.",
        ancho: "ancho",
        cerrable: true,
        cuerpo: "<div class='opciones'>" + opciones + "</div>" +
            "<p class='mini tenue' style='margin-top:10px'>Si los atendés a todos, la caja sufre: $300M por cabeza.</p>"
    });
}

function resolverMesaChica(idDirigente) {
    const d = estadoDirigentes.lista.find(function(x) { return x.id === idDirigente; });
    if (!d) return;
    if (presidente.dineroEnCaja < 300) { toastError("No hay caja para la mesa chica."); return; }

    ajustarDinero(-300, "Mesa chica");
    if (typeof ajustarLealtadDirigente === "function") ajustarLealtadDirigente(d.id, 8, "Mesa chica");
    estadoDirigentes.lista.forEach(function(x) {
        if (x.id !== d.id && typeof ajustarLealtadDirigente === "function") ajustarLealtadDirigente(x.id, -3, "Quedó afuera de la mesa");
    });
    presidente.ultimaMesaChica = estadoLigas.fechaActual;
    UI.cerrar("mesa-chica");
    toastInfo(d.nombre + " salió conforme. Los otros no.", "usuario");
    guardarPartida();
    refrescar();
}
