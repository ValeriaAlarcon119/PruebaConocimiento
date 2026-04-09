# 🎬 PlataformaPeliculas: EliteStream Pro v2.0

![Expertise](https://img.shields.io/badge/Status-Deployment--Ready-brightgreen?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?style=for-the-badge&logo=react)
![Theme](https://img.shields.io/badge/Design-Elite--Visionary-F5C518?style=for-the-badge)
![Deploy](https://img.shields.io/badge/Host-Netlify-00AD9F?style=for-the-badge&logo=netlify)

### 🌟 Visión General
**PlataformaPeliculas** es una solución integral de gestión cinematográfica diseñada para entornos de alto rendimiento. No es solo un catálogo, es un ecosistema de metadatos que centraliza información de películas, actores, directores y taxonomías geográficas con una interfaz ultra-premium basada en principios de diseño cinematográfico moderno.

---

### 🚀 Stack Tecnológico de Vanguardia

#### 💻 Frontend (The Core)
*   **React 18 & Hooks**: Arquitectura basada en componentes funcionales y estado distribuido.
*   **Framer Motion**: Motor de animaciones físicas y cascading effects para una experiencia inmersiva.
*   **React-Parallax-Tilt**: Proporciona interactividad 3D táctil y visual a las tarjetas de películas (efecto de inclinación dinámica).
*   **React-Fast-Marquee**: Implementación de un ticker de noticias global "EliteStream Global Network" en la cabecera.
*   **Canvas-Confetti**: Sistema de celebración visual que dispara confeti al completar tareas administrativas exitosas.
*   **React-Bootstrap**: Sistema de grillas y componentes base con personalización total CSS3.
*   **Lucide React & React-Icons**: Iconografía vectorial escalable de alta definición.
*   **SimpleParallax**: Efectos de profundidad visual en las portadas de contenido.

#### 🧠 Data & Services
*   **Axios**: Gestión de peticiones asíncronas optimizada con intercepción de tokens.
*   **TMDb Intelligence Interface**: Conexión dinámica con la API de *The Movie Database* para la recuperación de:
    *   Biografías multi-idioma con fallback automático.
    *   Metadatos de producción (Birthday, Place of Birth, Popularity).
    *   Media Assets (Profile portraits, Film posters).
*   **My JSON Server**: Persistencia de datos en la nube sincronizada con el repositorio de GitHub.

#### 🎨 Design System: "EliteStream Dark"
*   **Glassmorphism**: Transparencias con desenfoque Gaussiano (backdrop-filter) para una interfaz limpia.
*   **Brutal Typography**: Uso de `Bebas Neue` y `Inter` para jerarquías visuales potentes.
*   **Responsive Engine**: Adaptación total a dispositivos móviles y resoluciones ultra-wide.

---

### 🛡️ Seguridad y Control de Acceso
El sistema implementa un flujo de autenticación robusto:
1.  **Protección de Rutas**: Los módulos administrativos están sellados mediante `ProtectedRoute`.
2.  **Gestión de Tokens**: Uso de persistencia en `localStorage` con validación de caducidad.
3.  **Demo Mode**: Botón de autocompletado para evaluación rápida sin comprometer credenciales reales.
    *   *Usuario*: `adminsql`
    *   *Clave*: `MiC0ntraseñ@Segura!`

---

### 📂 Estructura del Ecosistema
```bash
/src
  ├── components/    # Infraestructura de UI (Auth, Layout, SEO)
  ├── pages/         # Módulos de gestión (Películas, Elenco, Taxonomías)
  ├── services/      # Lógica de conexión API y adaptadores de datos
  └── App.css        # Definición del Design System EliteStream
```

---

### ⚙️ Guía de Instalación Local
Si deseas clonar esta arquitectura en tu entorno local:

1.  **Clonación**:
    ```bash
    git clone https://github.com/ValeriaAlarcon119/PruebaConocimiento.git
    cd GestionPeliculas
    ```
2.  **Dependencias**:
    ```bash
    npm install
    ```
3.  **Lanzamiento Dual (Frontend + Backend Local)**:
    ```bash
    npm run dev
    ```

---

### 🌐 Despliegue en Producción (Netlify)
El proyecto está optimizado para Netlify. En el entorno de producción, el sistema detecta automáticamente la ausencia del servidor local y se conecta a la instancia de **My JSON Server**, permitiendo una operatividad del 100% sin necesidad de configurar un backend Node.js dedicado.

---

*Desarrollado con pasión para la excelencia cinematográfica. 2026.*
