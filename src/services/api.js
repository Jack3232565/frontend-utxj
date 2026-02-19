import axios from 'axios';

// Creamos una instancia de Axios con la dirección de tu Backend Python
const api = axios.create({
  // Reemplaza localhost por tu nueva URL en la nube
  baseURL: 'https://backend-utxj.onrender.com', 
});

// Interceptor: Antes de cada petición, inyectamos el Token si existe
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token'); // Buscamos el token en el navegador
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;