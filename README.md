# Sistema de Gestión de Peliculas - Frontend

Este es el frontend de la aplicación de gestión de películas, desarrollado con React. La aplicación permite a los usuarios gestionar información sobre películas, directores, géneros, países y actores.

## Despliegue

La aplicación está desplegada y disponible en la siguiente URL:

- **URL de la aplicación:** [https://valeriaalarcon119.github.io/PruebaConocimiento/](https://valeriaalarcon119.github.io/PruebaConocimiento/)

### Notas sobre el Despliegue

- **Validación de Credenciales:** Al intentar iniciar sesión, si las credenciales son incorrectas, se mostrará un mensaje de error. Asegúrate de usar el usuario `adminsql` y la contraseña `MiC0ntraseñ@Segura!`.
- **Paciencia con el Servidor:** Ten en cuenta que los servicios gratuitos de Azure pueden experimentar caídas ocasionales. Sin embargo, el backend ya está funcionando y se puede acceder a las rutas.

## Requisitos

- Node.js (versión 14 o superior)
- npm (incluido con Node.js)
- Backend de la aplicación (API REST)

## Configuración para Pruebas Locales

Si deseas ejecutar la aplicación en tu entorno local, sigue estos pasos:

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/ValeriaAlarcon119/PruebaConocimiento
   cd frontend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar las variables de entorno:
   Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:
   ```
   REACT_APP_API_URL=http://localhost:5248/api
   ```

4. Iniciar la aplicación:
   ```bash
   npm start
   ```

La aplicación estará disponible en `http://localhost:3000`.

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   └── Login.js
│   │   └── Layout/
│   │       └── Navbar.js
│   ├── pages/
│   │   ├── Welcome.js
│   │   ├── Directores.js
│   │   ├── Generos.js
│   │   ├── Paises.js
│   │   ├── Actores.js
│   │   └── Peliculas.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   └── index.js
```

## Características

- Autenticación de usuarios
- Gestión de directores
- Gestión de géneros
- Gestión de países
- Gestión de actores
- Gestión de películas
  - Vista previa de videos de YouTube
  - Selección múltiple de actores
  - Validación de campos obligatorios

## Tecnologías Utilizadas

- React
- React Router
- Axios
- Bootstrap
- Material UI
- Formik
- Yup
- React Toastify

## Buenas Prácticas Implementadas

- Componentes reutilizables
- Manejo de estado con hooks
- Validación de formularios
- Manejo de errores
- Interfaz responsiva
- Código limpio y organizado

## Scripts Disponibles

- `npm start`: Inicia la aplicación en modo desarrollo
- `npm test`: Ejecuta las pruebas
- `npm run build`: Crea la versión de producción
- `npm run eject`: Expone la configuración de Create React App




## Descripción

Este proyecto es un frontend para la gestión de películas, donde los usuarios pueden crear, editar y eliminar películas y directores. La aplicación está construida con React y utiliza React Router para la navegación entre diferentes vistas.

## Rutas

A continuación se describen las rutas principales de la aplicación:

- **`/login`**: Ruta para iniciar sesión. Los usuarios deben ingresar sus credenciales para acceder a la aplicación.
  
- **`/peliculas`**: Ruta principal donde se muestran todas las películas. Desde aquí, los usuarios pueden:
  - **Ver detalles** de una película al hacer doble clic en la tarjeta de la película o haciendo clic en el botón "Ver Más".
  - **Crear una nueva película** haciendo clic en el botón "Nueva Película".
  - **Editar una película** haciendo clic en el ícono de editar en la tarjeta de la película.
  - **Eliminar una película** haciendo clic en el ícono de eliminar en la tarjeta de la película.

- **`/directores`**: Ruta para gestionar directores. Los usuarios pueden agregar, editar y eliminar directores.

## Creación y Edición de Directores

Para crear un nuevo director:

1. Navega a la ruta `/directores`.
2. Haz clic en el botón "Nuevo Director".
3. Completa el formulario con el nombre y apellido del director.
4. Haz clic en "Guardar" para agregar el director a la lista.

Para editar un director existente:

1. Navega a la ruta `/directores`.
2. Haz clic en el ícono de editar junto al director que deseas modificar.
3. Realiza los cambios necesarios en el formulario.
4. Haz clic en "Guardar" para actualizar la información del director.

## Creación y Edición de Películas

Para crear una nueva película:

1. Navega a la ruta `/peliculas`.
2. Haz clic en el botón "Nueva Película".
3. Completa el formulario con la información de la película, incluyendo:
   - Título
   - Reseña
   - URL de la portada (ver sección de imágenes a continuación)
   - Código del tráiler de YouTube
   - Género, país y director
4. Haz clic en "Guardar" para agregar la película a la lista.

Para editar una película existente:

1. Navega a la ruta `/peliculas`.
2. Haz clic en el ícono de editar en la tarjeta de la película que deseas modificar.
3. Realiza los cambios necesarios en el formulario.
4. Haz clic en "Guardar" para actualizar la información de la película.

## Visualización de Detalles de Películas

Para ver los detalles de una película:

1. Navega a la ruta `/peliculas`.
2. Haz doble clic en la tarjeta de la película o haz clic en el botón "Ver Más".
3. Se abrirá un modal que mostrará la información detallada de la película, incluyendo la imagen, reseña, tráiler, director, género, país y actores.

## Inserción de Imágenes

Para la inserción de imágenes en las películas:

- Actualmente, se debe proporcionar la URL de la imagen de la portada. Puedes usar cualquier enlace de imagen válido.
- Para pruebas, puedes usar la siguiente URL de imagen de portada: 
  - `"/images/portada1.jpg"`,`"/images/portada2.jpg"`,`"/images/portada3.jpg"`,`"/images/portada4.jpg"`.
