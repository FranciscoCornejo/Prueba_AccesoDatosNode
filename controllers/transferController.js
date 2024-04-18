import { insertTransfer, selectTransfer } from "../querys/querys.js";

const createTransfer = async (req, res) => {
  try {
    const { emisor, receptor, monto } = req.body;
    const datos = [emisor, receptor, monto];
    const resultado = await insertTransfer(datos);
    res.status(201).send(resultado);
  } catch (error) {
    res.status(500).send(error);
  }
};

const readTransfer = async (req, res) => {
  try {
    const resultado = await selectTransfer();
    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).send(error);
  }
};

export { createTransfer, readTransfer };
