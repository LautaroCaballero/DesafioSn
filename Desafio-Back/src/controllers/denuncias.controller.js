import { query } from "mssql";
import { getConnection, sql, querys } from "../database";
import multer from 'multer';
import ftpClient from '../ftpclient';
import path from 'path';
import fs from 'fs';
import { uploadFile } from '../ftpclient';

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = 'uploads/';
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir);
//     }
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });

// const upload = multer({ storage: storage });

export const getDenuncias = async (req, res) => {
  try {
    const pool = await getConnection();

    // Consultar todas las denuncias
    const result = await pool.request().query(querys.getAllDenuncias);

    // Verificar si hay denuncias
    if (result.recordset.length === 0) {
      return res.status(404).json({ msg: "No se encontraron denuncias" });
    }

    // Devolver todas las denuncias
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener denuncias:", error.message || error);
    res.status(500).json({
      msg: "Error al obtener denuncias",
      error: error.message,
    });
  }
};

export const getDenunciaByDNI = async (req, res) => {
  try {
    const { dni } = req.params;

    // Verificar si el DNI fue proporcionado
    if (!dni) {
      return res.status(400).json({ msg: "Bad request. Please provide a DNI" });
    }

    // Conectar a la base de datos
    const pool = await getConnection();

    // Consultar la denuncia por DNI
    const result = await pool
      .request()
      .input("dni", sql.VarChar, dni) // DNI es generalmente un string
      .query(querys.getDenunciaByDNI);

    // Verificar si se encontró la denuncia
    if (result.recordset.length === 0) {
      return res.status(404).json({ msg: "Denuncia not found" });
    }

    // Devolver la denuncia encontrada
    res.json(result.recordset);
  } catch (error) {
    console.error("Error:", error.message || error);
    return res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
};

export const postDenuncia = async (req, res) => {
  try {
    const { nombre, apel, dni, cel, dom, descripcion, estado = 'ABIERTO', factura, otraDocumentacion } = req.body;

    const errors = {};
    if (!nombre) errors.nombre = "El nombre es requerido.";
    if (!apel) errors.apel = "El apellido es requerido.";
    if (!dni) errors.dni = "El DNI es requerido.";
    if (!cel) errors.cel = "El celular es requerido.";
    if (!dom) errors.dom = "El domicilio es requerido.";
    if (!descripcion) errors.descripcion = "La descripción es requerida.";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ msg: "Faltan campos por completar", errors });
    }

    let ticket_url = factura || null;
    let otros_url = otraDocumentacion || null;

    const pool = await getConnection();

    await pool
      .request()
      .input("nombre", sql.VarChar(50), nombre)
      .input("apel", sql.VarChar(50), apel)
      .input("dni", sql.NChar(8), dni)
      .input("cel", sql.NChar(15), cel)
      .input("dom", sql.VarChar(50), dom)
      .input("descripcion", sql.Text, descripcion)
      .input("estado", sql.VarChar(50), estado)
      .input("ticket_url", sql.VarChar(255), ticket_url)
      .input("otros_url", sql.VarChar(255), otros_url)
      .query(querys.createNewDenuncia);

    res.json({ msg: "Denuncia creada correctamente" });
  } catch (error) {
    console.error("Error:", error.message || error);
    return res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};


export const deleteDenuncia = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Bad request. Please provide an ID" });
    }

    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id", sql.Int, id) // Id es un entero
      .query("DELETE FROM denuncias WHERE Id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ msg: "Denuncia not found" });
    }

    res.json({ msg: "Denuncia eliminada correctamente" });
  } catch (error) {
    console.error("Error:", error.message || error);
    return res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
};

export const updateDenuncia = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    // Verificar si el ID y el estado están presentes
    if (!id || !estado) {
      return res.status(400).json({ msg: "Bad request. Missing fields" });
    }

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, id) // Asegurarse de que el id sea de tipo entero
      .input("estado", sql.VarChar(50), estado) // Actualizar solo el estado
      .query(`
        UPDATE denuncias
        SET estado = @estado
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ msg: "Denuncia not found" });
    }

    res.json({ msg: "Estado actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar denuncia:", error.message || error);
    res.status(500).json({
      msg: "Error al actualizar denuncia",
      error: error.message,
    });
  }
};