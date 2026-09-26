const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("node:path");
const { leerJson } = require("./archivos");

const PORT = 3000;
const rutaDatos = path.join(__dirname, "..", "datos", "mascotas.json");

async function main() {
    let mascotas;

    try {
    mascotas = await leerJson(rutaDatos);
    } catch (error) {
    console.error("No se pudo iniciar la aplicación porque no se pudo leer datos/mascotas.json:", error);
    process.exitCode = 1;
    return;
    }

const app = express();

    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "..", "views"));
    app.use(expressLayouts);
    app.set("layout", "layouts/main");
    app.use(express.static(path.join(__dirname, "..", "public")));
    app.use(express.urlencoded({ extended: false }));

    app.get("/", (req, res) => {
    res.render("inicio", { titulo: "Mascotas en adopción" });
    });

    app.get("/mascotas", (req, res) => {
    res.render("mascotas/lista", {
        titulo: "Mascotas en adopción",
        mascotas,
        });
    });

    app.get("/mascotas/nueva", (req, res) => {
    res.render("mascotas/nueva", {
        titulo: "Nueva mascota",
        error: null,
        valores: {},
    });
});

    app.get("/mascotas/:id", (req, res) => {
const id = Number(req.params.id);
const mascota = mascotas.find((elemento) => elemento.id === id);

    if (!mascota) {
        return res.status(404).render("no-encontrado", {
        titulo: "Mascota no encontrada",
        mensaje: "No existe una mascota con ese identificador.",
        });
    }

    res.render("mascotas/detalle", {
        titulo: mascota.nombre,
        mascota,
    });
    });

    app.post("/mascotas", (req, res) => {
const { nombre, especie, edad, estado, descripcion } = req.body;

const nombreLimpio = String(nombre ?? "").trim();
const especieLimpia = String(especie ?? "").trim();
const descripcionLimpia = String(descripcion ?? "").trim();
const estadoLimpio = String(estado ?? "").trim();
const edadNumerica = Number(edad);

const estadosValidos = ["En adopción", "Reservada", "Adoptada"];

    if (
        !nombreLimpio ||
        !especieLimpia ||
        !descripcionLimpia ||
        !estadoLimpio ||
        !Number.isFinite(edadNumerica) ||
        edadNumerica < 0 ||
        !estadosValidos.includes(estadoLimpio)
    ) {
    return res.status(400).render("mascotas/nueva", {
        titulo: "Nueva mascota",
        error: "Completá todos los campos con valores válidos.",
        valores: req.body,
    });
    }

const ultimoId = mascotas.reduce((maximoId, mascotaActual) => Math.max(maximoId, mascotaActual.id), 0);

    mascotas.push({
        id: ultimoId + 1,
        nombre: nombreLimpio,
        especie: especieLimpia,
        descripcion: descripcionLimpia,
        edad: edadNumerica,
        estado: estadoLimpio,
        imagen: "/img/mascota.svg",
    });

    res.redirect("/mascotas");
    });

    app.listen(PORT, () => {
    console.log(`Aplicación disponible en http://localhost:${PORT}`);
    });
}

main().catch((error) => {
console.error("Error al iniciar la aplicación:", error);
process.exitCode = 1;
});
