import express from "express";
const router = express.Router();
//La diferencia entre const router = express(); y const router = express.Router(); radica en cómo se utiliza el objeto router.
// la primera crea una instancia de la aplicación principal de Express
//la segunda  crea un objeto Router independiente que se puede montar en la aplicación principal para manejar rutas específicas

import path from "path";
const __dirname = import.meta.dirname;

import {
  getDate,
  selectQuery,
  insertQuery,
  putQuery,
  deleteQuery,
  insertTransferencia,
  selectTransferencia,
} from "../querys/querys.js"; //importa querys.js

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/index.html"));
});

//prueba de conexión a la base de datos
router.get("/", async (req, res) => {
  const conexion = await getDate();
  res.json(conexion);
});

//read
router.post("/usuario", selectQuery);

//create
router.get("/usuarios", insertQuery);

//update
router.put("/usuario", putQuery);

//delete
router.delete("/usuario", deleteQuery);

//create transferencia
router.post("/transferencia", insertTransferencia);

//read transferencia
router.get("/transferencias", selectTransferencia);

router.get("*", (req, res) => res.send("ruta no encontrada"));

export default router;
