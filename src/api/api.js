import axios from 'axios';

const api = axios.create({
  // para desarrollo, cambiar a la URL de tu API
   // baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/',
 baseURL: import.meta.env.VITE_API_URL || 'https://wachapelisbackend.onrender.com',
  
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
