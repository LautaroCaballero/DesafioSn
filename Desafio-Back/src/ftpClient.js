import ftp from "basic-ftp";

async function uploadFile(file) {
  const client = new ftp.Client();
  client.ftp.verbose = true; 

  try {
    await client.access({
      host: "127.0.0.1",
      port: 2121, 
      user: "lautarocaballero",
      password: "asdasd123", 
      secure: false, 
    });

    
    const serverPath = `/${file.originalname}`;
    await client.uploadFrom(file.filepath, serverPath);
    const fileUrl = `ftp://127.0.0.1/${file.originalname}`;
    return fileUrl; 
  } catch (err) {
    console.error("Error en FTP:", err);
    throw new Error("No se pudo subir el archivo al servidor FTP");
  } finally {
    client.close();
  }
}

module.exports = { uploadFile };
