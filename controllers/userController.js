import {
  getDate,
  insertQuery,
  selectQuery,
  updateQuery,
  deleteQuery,
} from "../querys/querys.js";

const conexionDB = async (req, res) => {
  try {
    const resultado = await getDate();
    res.json({ fecha: resultado });
  } catch (error) {
    res.status(500).send(error);
  }
};

const createUser = async (req, res) => {
  try {
    const { nombre, balance } = req.body;
    const datos = [nombre, balance];

    const resultado = await insertQuery(datos);
    res.status(201).send(resultado.rows);
  } catch (error) {
    res.status(500).send(error);
  }
};

const readUser = async (req, res) => {
  try {
    const resultado = await selectQuery();
    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.query;
    const { nombre, balance } = req.body;

    const resultado = await updateQuery(nombre, balance, id);
    res.status(201).send(resultado);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.query;
    const resultado = await deleteQuery(id);
    res.status(201).send(resultado);
  } catch (error) {
    res.status(500).send(error);
  }
};

export { conexionDB, createUser, readUser, updateUser, deleteUser };
