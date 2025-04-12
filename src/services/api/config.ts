
// Configuración base para las peticiones API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Opciones por defecto para fetch
const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Función para incluir el token de autenticación en las cabeceras si existe
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export { API_BASE_URL, defaultOptions, getAuthHeaders };
