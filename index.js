//configuracion del servidor
import express from "express";
const app = express();
const port = process.env.port || 3000;

import path from "path"; //front
const __dirname = import.meta.dirname; //front
import router from "./routes/router.js";

//midlewares
app.use(express.static(path.join(__dirname, "assets"))); //carpeta publica front
app.use(express.json()); //permite que las solicitudes post envien archivos json como objetos respuesta y desestructurarlos
app.use(express.urlencoded({ extended: false })); //analiza los datos y los hace accesibles en req.body.
app.use("/", router);

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto http://localhost:${port}`);
});
