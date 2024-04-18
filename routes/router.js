import express from "express";
const router = express.Router();
//La diferencia entre const router = express(); y const router = express.Router(); radica en cómo se utiliza el objeto router.
// la primera crea una instancia de la aplicación principal de Express
//la segunda  crea un objeto Router independiente que se puede montar en la aplicación principal para manejar rutas específicas

//importacion del path e instancia de dirname para renderir el html
import path from "path";
const __dirname = import.meta.dirname;

import {
  conexionDB,
  createUser,
  readUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

import {
  createTransfer,
  readTransfer,
} from "../controllers/transferController.js";

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/index.html"));
});

//prueba de conexión a la base de datos
router.get("/conexion", conexionDB);

//create
router.post("/usuario", createUser);

//read
router.get("/usuarios", readUser);

//update
router.put("/usuario", updateUser);

//delete
router.delete("/usuario", deleteUser);

//create transferencia
router.post("/transferencia", createTransfer);

//read transferencia
router.get("/transferencias", readTransfer);

router.get("*", (req, res) => res.send("ruta no encontrada"));

export default router;
