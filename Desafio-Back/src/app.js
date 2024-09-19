import express from 'express';
import config from './config';
import cors from 'cors';
import denunciasRoutes from './routes/denuncias.routes';
import usuariosRoutes from './routes/usuarios.routes';
import multer from 'multer'; 

const app = express();

app.set('port', config.port);

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas de la aplicación
app.use(denunciasRoutes);
app.use(usuariosRoutes);

export default app;