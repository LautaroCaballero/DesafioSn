import { query } from "mssql";
import { getConnection, sql } from "../database";
import bcrypt from "bcrypt"; // Importa bcrypt

// Registrar usuario
export const registerUser = async (req, res) => {
  try {
    const { nombre, apel, dni, email, password } = req.body;

    // Validación básica
    if (!nombre || !apel || !dni || !email || !password) {
      return res.status(400).json({ msg: "Faltan campos por completar" });
    }

    const pool = await getConnection();

    // Verificar si el usuario ya existe
    const dniResult = await pool
      .request()
      .input("dni", sql.VarChar, dni)
      .query("SELECT * FROM usuarios WHERE dni = @dni");

    if (dniResult.recordset.length > 0) {
      return res
        .status(400)
        .json({ msg: "El usuario con este DNI ya está registrado" });
    }

    const emailResult = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM usuarios WHERE email = @email");

    if (emailResult.recordset.length > 0) {
      return res
        .status(400)
        .json({ msg: "El usuario con este email ya está registrado" });
    }

    const saltRounds = 10; // Número de rondas de salt, puedes ajustar según sea necesario
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Registrar el nuevo usuario
    await pool
      .request()
      .input("nombre", sql.VarChar(50), nombre)
      .input("apel", sql.VarChar(50), apel)
      .input("dni", sql.NChar(8), dni)
      .input("email", sql.VarChar(50), email)
      .input("password", sql.VarChar(255), hashedPassword) // Asegúrate de hashear la contraseña
      .query(
        "INSERT INTO usuarios (nombre, apel, dni, email, password) VALUES (@nombre, @apel, @dni, @email, @password)"
      );

    // Respuesta exitosa
    return res.status(201).json({ msg: "Usuario registrado correctamente" });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return res
      .status(500)
      .json({ msg: "Error en el servidor", error: error.message });
  }
};

// Iniciar sesión
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Faltan campos por completar" });
    }

    const pool = await getConnection();

    // Buscar usuario por email
    const result = await pool
      .request()
      .input("email", sql.VarChar(50), email)
      .query("SELECT * FROM usuarios WHERE email = @email");

    const user = result.recordset[0];

    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ msg: "Contraseña incorrecta" });
    }
    res.json({ msg: "Login exitoso", user });
  } catch (error) {
    console.error("Error al iniciar sesión:", error.message || error);
    res
      .status(500)
      .json({ msg: "Error al iniciar sesión", error: error.message });
  }
};
