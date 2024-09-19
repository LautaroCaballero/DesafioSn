# DesafioSn

# Mi Aplicación Web

## Descripción

Este proyecto es una aplicación web para presentar y rastrear denuncias. Incluye un frontend construido con React y un backend usando Node.js con Express y SQL.

## Características

- **Formulario para Presentar Denuncias:** Los usuarios pueden enviar denuncias con detalles incluyendo nombre, DNI, información de contacto y documentos.
- **Rastreo de Denuncias:** Los usuarios pueden ver y gestionar el estado de sus denuncias.
- **Cargas de Archivos:** Permite a los usuarios subir documentos de apoyo. (En proceso)

## Tecnologías Utilizadas

- **Frontend:**
  - React
  - React Hook Form
  - Zod para validación
  - Tailwind CSS

- **Backend:**
  - Node.js
  - Express
  - SQL Server (usando el paquete `mssql`)
  - Bcrypt para hashing de contraseñas
  - Cors para gestión de CORS
  - Dotenv para manejo de variables de entorno
  - Express-fileupload para carga de archivos
  - Formidable para análisis de datos de formularios
  - Morgan para registro de solicitudes HTTP
  - Multer para manejo de carga de archivos (No implementado)
  - Basic-ftp para operaciones FTP (No implementado)

- **Almacenamiento de Archivos:**
  - FTP (para desarrollo local) (En proceso)

## Empezando

### Requisitos Previos

- Node.js
- SQL Server
- Servidor FTP (para desarrollo local) (En proceso)

### Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tuusuario/tu-repo-nombre.git
   cd tu-repo-nombre
