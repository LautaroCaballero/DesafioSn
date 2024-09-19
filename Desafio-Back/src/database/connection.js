import sql from "mssql";

const dbSettings = {
  user: "LautaroCaballero",
  password: "asd123",
  server: "localhost",
  database: "DenunciasDB",
  port: 1500,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

export const getConnection = async () => {
  try {
    const pool = await sql.connect(dbSettings);
    return pool;
  } catch (error) {
    console.log(error);
  }
};

export {sql};
