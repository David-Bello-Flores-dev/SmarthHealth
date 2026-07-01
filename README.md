# SmarthHealth

# SmartHealth 🏥

SmartHealth es un sistema médico desarrollado bajo una arquitectura de **Monolito Modular** (Modular Monolith). El proyecto integra un frontend reactivo e interactivo con un backend desacoplado por módulos de funcionalidad, asegurando la integridad de los datos y la escalabilidad del sistema.

---

## 🛠️ Stack Tecnológico utilizado

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

## 🚀 Instalación y Configuración Local

### Prerrequisitos
* Node.js (versión 18 o superior recomendada)
* Instancia de PostgreSQL corriendo localmente o en la nube

### 1. Clonar el repositorio
```bash
git clone [https://github.com/David-Bello-Flores-dev/SmarthHealth.git](https://github.com/David-Bello-Flores-dev/SmarthHealth.git)
cd SmarthHealth
