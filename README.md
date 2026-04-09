# 🎬 PlataformaPeliculas - EliteStream Suite 2026

![Premium UI](https://img.shields.io/badge/UI-Glassmorphism-blueviolet?style=for-the-badge)
![React](https://img.shields.io/badge/React-2026-61DAFB?style=for-the-badge&logo=react)
![TMDb](https://img.shields.io/badge/Data-TMDb_API-E3B341?style=for-the-badge)
![IA](https://img.shields.io/badge/AI-Enhanced-brightgreen?style=for-the-badge)

**PlataformaPeliculas** es una solución empresarial de vanguardia para la gestión de catálogos cinematográficos. Diseñada con una estética **Cyber-Premium**, esta aplicación permite una administración centralizada de contenidos, integrando inteligencia artificial para la optimización de metadatos y sincronización en tiempo real con proveedores de datos globales.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Frontend** | React 18+, React Bootstrap, Framer Motion (Animaciones), Lucide React (Íconos) |
| **Comunicación** | Axios, TMDb API Integration |
| **Arquitectura** | Clean UI, Protected Routes, Higher Order Components |
| **Backend/Data** | JSON Server (Stateful Mocking), Custom Seeding Engine |
| **Estilos** | CSS Moderno, Glassmorphism, Responsive Cinematic Design |

---

## 🚀 ¿Cómo funciona?

El sistema opera bajo un flujo de trabajo optimizado para administradores de contenido:

1.  **Sincronización Inteligente**: Al agregar una película, el sistema consulta la API de TMDb para extraer automáticamente pósters, sinopsis y trailers en alta definición.
2.  **Asistencia por IA**: Incluye motores de generación de contenido (simulados) que ayudan a redactar reseñas y optimizar la descripción comercial de los títulos.
3.  **Gestión Centralizada**: Permite el control total (CRUD) sobre Actores, Directores, Géneros, Países y Películas, manteniendo la integridad referencial en todo momento.
4.  **Seguridad Proactiva**: Rutas protegidas que requieren validación de identidad para acceder al núcleo de la suite administrativa.

---

## 🔒 Manejo de Configuración y Seguridad

Para mantener la seguridad del proyecto y evitar la exposición de secretos:

1.  **Variables de Entorno**: No compartimos claves API ni contraseñas directamente en el código fuente. Se utiliza un sistema de `.env` (excluido en `.gitignore`) para manejar claves de TMDb y otros servicios externos.
2.  **Identidad**: El acceso está restringido a operadores autorizados.
3.  **Despliegue**: Al publicar, asegúrese de que el archivo `db.json` se maneje en un entorno con persistencia de datos (como un servicio de base de datos real o un servidor con almacenamiento persistente).

---

## 🔑 Acceso al Sistema (Demostración)

Para facilitar las pruebas de reclutamiento y portafolio, el sistema incluye una funcionalidad de **Autocompletado Progresivo** en la interfaz de inicio de sesión. 

No es necesario escribir las credenciales manualmente; simplemente haga clic en el botón **[ Autocompletar ]** dentro del formulario de Login para cargar la identidad administrativa:

- **Identificador de Operador**: *(Cargado vía Autocomplete)*
- **Llave Privada**: *(Cargada vía Autocomplete)*

> [!NOTE]
> En la interfaz física, los datos utilizados para la sincronización son:
> - **Usuario**: `adminsql`
> - **Contraseña**: `MiC0ntraseñ@Segura!`

---

## 🔧 Instalación Local

1.  **Clonar y Dependencias**:
    ```bash
    npm install
    ```
2.  **Preparar Data Real**:
    ```bash
    node seed.js
    ```
3.  **Lanzamiento en Desarrollo**:
    ```bash
    npm run dev
    ```

---

## 🎓 Autoría
**Desarrollado por Valeria Alarcón Andrade**  
*Ingeniera de Sistemas - Universidad de Nariño*  
© 2026 PlataformaPeliculas - EliteStream Suite
