# SmarthHealth

# SmartHealth 

SmartHealth es un sistema médico desarrollado bajo una arquitectura de **Monolito Modular** (Modular Monolith). El proyecto integra un frontend reactivo e interactivo con un backend desacoplado por módulos de funcionalidad, asegurando la integridad de los datos y la escalabilidad del sistema.

---

## Stack Tecnológico utilizado

### Frontend (Cliente)
* **React**: Librería principal para la construcción de la interfaz de usuario basada en componentes globales y reutilizables.
* **Redux Toolkit**: Manejo del estado global de la aplicación (Autenticación, sesiones de usuario y persistencia de estados de forma limpia).
* **Tailwind CSS**: Framework de CSS utilitario para un diseño rápido, responsivo y estilizado sin acumular archivos CSS masivos.

### Backend (Servidor)
* **Node.js & Express**: Entorno de ejecución y framework robusto para la construcción de una API REST rápida y minimalista.
* **JWT (JSON Web Tokens)**: Implementación de seguridad y manejo de sesiones mediante tokens de acceso firmados para proteger las rutas privadas.
* **CORS**: Configuración de Middleware para permitir la comunicación segura de peticiones entre el origen del cliente y el servidor.
* **Arquitectura de Monolito Modular**: Organización del código dividida en módulos autocontenidos por características de negocio (ej. `auth`, `users`). Cada módulo maneja sus propias rutas, controladores y servicios, evitando el acoplamiento directo.

### Base de Datos
* **PostgreSQL**: Sistema de gestión de bases de datos relacionales robusto para asegurar la integridad referencial y cumplir con las normas de normalización de datos.

---

## Instalación y Configuración Local

### Prerrequisitos
* Node.js (versión 18 o superior recomendada)
* Instancia de PostgreSQL corriendo localmente o en la nube

### Clonar el repositorio
```bash
git clone [https://github.com/David-Bello-Flores-dev/SmarthHealth.git](https://github.com/David-Bello-Flores-dev/SmarthHealth.git)
cd SmarthHealth
```
## Configuración de Backend

### Ir a la carpeta del servidor
```bash
cd server
```

### Instalar las dependencias
```bash
npm install
```

### Crea un archivo .env en la raíz de server/ basándose en la siguiente estructura:
```bash
PORT=5000
DATABASE_URL=postgresql://usuario:password@localhost:5432/smarthealth_db
JWT_SECRET=tu_clave_secreta_super_segura
```

### Inicia el servidor en modo de desarrollo:
```bash
npm run dev
```

## Configuración de Frontend

### Navegar a la carpeta "client"
```bash
cd client
```

### Instalar las dependencias
```bash
npm install
```

### Iniciar con vite
```bash
npm run dev
```

## Estructura del proyecto
SmartHealth/
├── client/          # Frontend en React (Vite)
│   ├── src/
│   │   ├── app/     # Configuración del Store de Redux
│   │   └── features/# Slices y lógica de estados relacionales
├── server/          # Backend en Node.js (Monolito Modular)
│   ├── src/
│   │   ├── config/  # Conexión a la Base de Datos
│   │   ├── modules/ # Módulos independientes de la aplicación (auth, etc.)
│   │   └── middleware/
└── .gitignore       # Archivo de exclusión de Git (node_modules, .env)
