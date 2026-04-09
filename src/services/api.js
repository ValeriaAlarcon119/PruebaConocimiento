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
        const key = url.replace('/', '');
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
    },

    post: async (url, data) => {
        if (IS_LOCAL) return axiosInstance.post(url, data);
        
        const key = url.replace('/', '');
        const currentData = getStoredData(key) || [];
        const newItem = { ...data, id: Date.now() };
        const updated = [...currentData, newItem];
        saveToStore(key, updated);
        return { data: newItem };
    },

    put: async (url, data) => {
        if (IS_LOCAL) return axiosInstance.put(url, data);

        const parts = url.split('/');
        const key = parts[1];
        const id = parseInt(parts[2]);
        const currentData = getStoredData(key) || [];
        const updated = currentData.map(item => item.id == id ? { ...item, ...data } : item);
        saveToStore(key, updated);
        return { data: { ...data, id } };
    },

    delete: async (url) => {
        if (IS_LOCAL) return axiosInstance.delete(url);

        const parts = url.split('/');
        const key = parts[1];
        const id = parseInt(parts[2]);
        const currentData = getStoredData(key) || [];
        const updated = currentData.filter(item => item.id != id);
        saveToStore(key, updated);
        return { data: { success: true } };
    }
};

export default api;