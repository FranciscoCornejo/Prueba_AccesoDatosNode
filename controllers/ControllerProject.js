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

const home = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/index.html"));
};

const conexionDB = async (req, res) => {
  try {
    const fecha = await getDate();
    res.status(200).send(fecha);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const mostrarUsuarios = async (req, res) => {
  try {
    const usuarios = await selectQuery();
    res.status(200).send(usuarios);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const crearUsuario = async (req, res) => {
  try {
    const { nombre, balance } = req.body;
    const datos = [nombre, balance];
    const nuevoUsuario = await insertQuery(datos);
    res.status(200).send(nuevoUsuario);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const editarUsuario = async (req, res) => {
  try {
    const { id } = req.query;
    const { nombre, balance } = req.body;

    const datos = [nombre, balance, id];
    const editarUsuario = await putQuery(datos);
    res.status(200).send(editarUsuario);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.query;

    const deleteUser = await deleteQuery(id);
    res.status(200).send(deleteUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const crearTransferencia = async (req, res) => {
  try {
    console.log("body", req.body);
    /*  console.log('query', req.query);
        console.log('params', req.params); */
    const datos = req.body;
    console.log(datos);

    const result = await insertTransferencia(datos);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const mostrarTransferencia = async (req, res) => {
  try {
    const result = await selectTransferencia();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export {
  conexionDB,
  mostrarUsuarios,
  crearUsuario,
  editarUsuario,
  eliminarUsuario,
  crearTransferencia,
  mostrarTransferencia,
};
