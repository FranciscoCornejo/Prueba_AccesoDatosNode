import pool from "../config/db.js"; //importa db.js

//probamos la coneccion
const getDate = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log(result.rows[0].now);
    return result.rows;
  } catch (error) {
    console.error("Error al conectarse a la base de datos:", error);
    throw error;
  }
};
getDate();

const selectQuery = async () => {
  try {
    const querys = {
      text: "SELECT * FROM usuarios",
    };
    const resultado = await pool.query(querys);
    return resultado.rows;
  } catch (error) {
    return error;
  }
};

const insertQuery = async (datos) => {
  try {
    const consulta = {
      text: "INSERT INTO usuarios (nombre, balance) VALUES ($1, $2) RETURNING *",
      values: datos,
    };
    const resultado = await pool.query(consulta);
    return resultado.rows[0];
  } catch (error) {
    return error;
  }
};

const putQuery = async (datos) => {
  try {
    const consulta = {
      text: "UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3",
      values: datos,
    };
    const resultado = await pool.query(consulta);
    if (resultado.rowCount === 0) {
      throw new Error("No se encontro el usuario");
    } else {
      resultado.rows[0];
    }
  } catch (error) {
    return error;
  }
};

const deleteQuery = async (id) => {
  try {
    const consulta = {
      text: "DELETE FROM usuarios WHERE id = $1",
      values: [id],
    };
    const resultado = await pool.query(consulta);
    if (resultado.rowCount === 0) {
      throw new Error("No se encontro el usuario");
    }
  } catch (error) {
    return error;
  }
};

const insertTransferencia = async (datos) => {
  //buscamos el id del emisor
  const { emisor, receptor, monto } = datos;
  const { id: emisorId } = (
    await pool.query(`SELECT * FROM usuarios WHERE nombre = '${emisor}'`)
  ).rows[0];
  //buscamos el id del receptor
  const { id: receptorId } = (
    await pool.query(`SELECT * FROM usuarios WHERE nombre = '${receptor}'`)
  ).rows[0];
  const registerTranfer = {
    text: "INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, NOW()) RETURNING *",
    values: [emisorId, receptorId, monto],
  };
  const updateBalanceEmisor = {
    text: "UPDATE usuarios SET balance = balance - $1 WHERE nombre = $2 RETURNING *",
    values: [monto, emisor],
  };
  const updateBalanceReceptor = {
    text: "UPDATE usuarios SET balance = balance + $1 WHERE nombre = $2 RETURNING *",
    values: [monto, receptor],
  };

  try {
    await pool.query("BEGIN");
    await pool.query(registerTranfer);
    await pool.query(updateBalanceEmisor);
    await pool.query(updateBalanceReceptor);
    await pool.query("COMMIT");
    return true;
  } catch (error) {
    await pool.query("ROLLBACK");
    return error;
  }
};

const selectTransferencia = async () => {
  try {
    const consulta = {
      text: `SELECT
        e.nombre AS emisor,
        r.nombre AS receptor,
        t.monto,
        t.fecha
      FROM
        transferencias t
      JOIN
        usuarios e ON t.emisor = e.id
      JOIN
        usuarios r ON t.receptor = r.id;`,
      rowMode: "array",
    };
    const resultado = await pool.query(consulta);
    console.log(resultado.rows);
    return resultado.rows;
  } catch (error) {
    return error;
  }
};

export {
  getDate,
  selectQuery,
  insertQuery,
  putQuery,
  deleteQuery,
  insertTransferencia,
  selectTransferencia,
};

/* 

se declaran las funciones en consultas ellas se exportan al controlador
del controlador pasan a la ruta


*/
