import axios from 'axios';

// URL dinámica: Localhost para desarrollo, My JSON Server para producción
const IS_LOCAL = window.location.hostname === 'localhost';
const BASE_URL = IS_LOCAL 
    ? 'http://localhost:5248' 
    : 'https://my-json-server.typicode.com/ValeriaAlarcon119/PruebaConocimiento';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// --- MOTOR DE PERSISTENCIA HÍBRIDA ELITESTREAM (HYBRID PERSISTENCE ENGINE) ---
// En producción, My JSON Server es de solo lectura. 
// Este motor permite que las acciones de Crear, Editar y Eliminar funcionen localmente
// guardando los cambios en el LocalStorage del navegador.

const getStoredData = (key) => {
    const data = localStorage.getItem(`ELITE_${key}`);
    return data ? JSON.parse(data) : null;
};

const saveToStore = (key, data) => {
    localStorage.setItem(`ELITE_${key}`, JSON.stringify(data));
};

const api = {
    get: async (url) => {
        const key = url.split('/')[1]; // Get base key (e.g., 'peliculas' from '/peliculas/1')
        
        try {
            if (!IS_LOCAL) {
                const localData = getStoredData(key);
                if (localData) return { data: localData };
            }
            const response = await axiosInstance.get(url);
            // Si es la primera vez en web, inicializamos el store local con los datos de Typicode
            if (!IS_LOCAL && !getStoredData(key)) {
                saveToStore(key, response.data);
            }
            return response;
        } catch (error) {
            console.warn(`Backend unreachable for GET ${url}, attempting LocalStorage fallback.`);
            const localData = getStoredData(key);
            if (localData) return { data: localData };
            throw error;
        }
    },

    post: async (url, data) => {
        const key = url.replace('/', '');
        try {
            if (IS_LOCAL) {
                const res = await axiosInstance.post(url, data);
                return res;
            }
        } catch (error) {
            console.warn("Backend fail on POST, using LocalStorage.");
        }
        
        const currentData = getStoredData(key) || [];
        const newItem = { ...data, id: Date.now() };
        const updated = [...currentData, newItem];
        saveToStore(key, updated);
        return { data: newItem };
    },

    put: async (url, data) => {
        const parts = url.split('/');
        const key = parts[1];
        const id = parts[2];

        try {
            if (IS_LOCAL) {
                const res = await axiosInstance.put(url, data);
                return res;
            }
        } catch (error) {
            console.warn("Backend fail on PUT, using LocalStorage.");
        }

        const currentData = getStoredData(key) || [];
        const updated = currentData.map(item => item.id == id ? { ...item, ...data } : item);
        saveToStore(key, updated);
        return { data: { ...data, id } };
    },

    delete: async (url) => {
        const parts = url.split('/');
        const key = parts[1];
        const id = parts[2];

        try {
            if (IS_LOCAL) {
                const res = await axiosInstance.delete(url);
                return res;
            }
        } catch (error) {
            console.warn("Backend fail on DELETE, using LocalStorage.");
        }

        const currentData = getStoredData(key) || [];
        const updated = currentData.filter(item => item.id != id);
        saveToStore(key, updated);
        return { data: { success: true } };
    }
};

export default api;