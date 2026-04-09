import axios from 'axios';

// Cambiamos la URL de Azure por la de tu JSON Server local
// URL dinámica: Localhost para desarrollo, My JSON Server para producción en Netlify
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5248' 
    : 'https://my-json-server.typicode.com/ValeriaAlarcon119/PruebaConocimiento';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: false
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401 && !window.location.hash.includes('/login')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Redirección relativa al login
                window.location.hash = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;