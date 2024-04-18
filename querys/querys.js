import pool from "../config/db.js";

//probamos la coneccion
const getDate = async () => {
  try {
    const resultado = await pool.query("SELECT NOW()");
    console.log(resultado.rows[0].now);
    return resultado.rows;
  } catch (error) {
    console.error("Error al conectarse a la base de datos:", error);
    throw error;
  }
};
getDate();

//create
const insertQuery = async (datos) => {
  try {
    const consulta = {
      text: "INSERT INTO usuarios (nombre,balance) VALUES ($1, $2) RETURNING *",
      values: datos,
    };

    const resultado = await pool.query(consulta);
    console.log(resultado.rows);
    return resultado.rows;
  } catch (error) {
    console.log(error);
  }
};

//read
const selectQuery = async () => {
  try {
    const consulta = {
      text: "SELECT * FROM usuarios",
    };
    const resultado = await pool.query(consulta);
    console.log(resultado.rows);
    return resultado.rows;
  } catch (error) {
    console.log(error);
  }
};

const updateQuery = async (nombre, balance, id) => {
  try {
    const consulta = {
      text: "UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3 RETURNING *",
      values: [nombre, balance, id],
    };
    const resultado = await pool.query(consulta);
    //validacion de cambio
    if (resultado.rowCount === 0) {
      throw new Error("No se edito el usuario");
    } else {
      resultado.rows[0];
    }
    console.log(resultado.rows);
    return resultado.rows;
  } catch (error) {
    console.log(error);
  }
};

const deleteQuery = async (id) => {
  try {
    const consulta = {
      text: "DELETE FROM usuarios WHERE id = $1 RETURNING *",
      values: [id],
    };
    const resultado = await pool.query(consulta);
    //validacion de deleteo
    if (resultado.rowCount === 0) {
      throw new Error("No se elimino el usuario");
    } else {
      resultado.rows[0];
    }
    return resultado.rows[0];
  } catch (error) {
    console.log(error);
  }
};

const insertTransfer = async (datos) => {
  const [emisor, receptor, monto] = datos;

  //id:emisorID le pone a id el nombre emisorId
  const { id: emisorId } = (
    await pool.query(`SELECT * FROM usuarios WHERE nombre = '${emisor}'`)
  ).rows[0];

  //buscamos el id del receptor
  const { id: receptorId } = (
    await pool.query(`SELECT * FROM usuarios WHERE nombre = '${receptor}'`)
  ).rows[0];

  const crearTransferencia = {
    text: "INSERT INTO transferencias (emisor,receptor,monto,fecha) VALUES ($1,$2,$3,now()) RETURNING *",
    values: [emisorId, receptorId, monto],
  };

  const actualizarEmisor = {
    text: `UPDATE usuarios SET balance = balance - $1 WHERE nombre = $2 RETURNING *`,
    values: [monto, emisor],
  };
  const actualizarReceptor = {
    text: `UPDATE usuarios SET balance = balance + $1 WHERE nombre = $2 RETURNING *`,
    values: [monto, receptor],
  };
  try {
    await pool.query("BEGIN");
    await pool.query(actualizarEmisor);
    await pool.query(actualizarReceptor);
    const resultado = await pool.query(crearTransferencia);
    await pool.query("COMMIT");
    console.log(resultado.rows);
    return true;
  } catch (error) {
    await pool.query("ROLLBACK");
    return error;
  }
};

const selectTransfer = async () => {
  try {
    const getTransferencias = {
      text: `SELECT e.nombre 
      AS emisor,
      r.nombre AS receptor,
      t.monto,
      t.fecha
    FROM transferencias t
    JOIN usuarios e ON t.emisor = e.id
    JOIN usuarios r ON t.receptor = r.id;`,
      rowMode: "array",
    };

    const resultado = await pool.query(getTransferencias);
    console.log(resultado.rows);
    return resultado.rows;
  } catch (error) {
    console.log(error);
  }
};

export {
  getDate,
  insertQuery,
  selectQuery,
  updateQuery,
  deleteQuery,
  insertTransfer,
  selectTransfer,
};
