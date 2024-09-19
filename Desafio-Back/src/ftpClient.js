import ftp from "basic-ftp";

async function uploadFile(file) {
  const client = new ftp.Client();
  client.ftp.verbose = true; // Opcional: muestra más detalles en la consola

  try {
    await client.access({
      host: "127.0.0.1",
      port: 2121, // Cambia esto si usas un puerto diferente
      user: "lautarocaballero",
      password: "asdasd123", // Contraseña vacía para acceso anónimo
      secure: false, // Cambia a true si usas un servidor FTP seguro
    });

    // Subir el archivo al servidor
    const serverPath = `/${file.originalname}`;
    await client.uploadFrom(file.filepath, serverPath);
    const fileUrl = `ftp://127.0.0.1/${file.originalname}`;
    return fileUrl; // Retorna la URL para almacenarla en la base de datos
  } catch (err) {
    console.error("Error en FTP:", err);
    throw new Error("No se pudo subir el archivo al servidor FTP");
  } finally {
    client.close();
  }
}

module.exports = { uploadFile };
