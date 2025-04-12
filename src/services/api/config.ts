
// Configuración base para las peticiones API
// Al estar en el mismo dominio, no necesitamos especificar la URL completa
const API_BASE_URL = '/api';

// Opciones por defecto para fetch
const defaultOptions: {
  headers: Record<string, string>;
} = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Función para incluir el token de autenticación en las cabeceras si existe
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export { API_BASE_URL, defaultOptions, getAuthHeaders };
