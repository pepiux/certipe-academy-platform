
import { API_BASE_URL, defaultOptions, getAuthHeaders } from './config';
import { toast } from 'sonner';

class ApiError extends Error {
  status: number;
  data: any;
  
  constructor(message: string, status: number, data: any = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Define the interface for the apiClient object
interface ApiClient {
  get<T>(endpoint: string, customOptions?: {}): Promise<T>;
  post<T>(endpoint: string, data?: any, customOptions?: {}): Promise<T>;
  put<T>(endpoint: string, data?: any, customOptions?: {}): Promise<T>;
  delete<T>(endpoint: string, customOptions?: {}): Promise<T>;
  request<T>(method: string, endpoint: string, data?: any, customOptions?: {}): Promise<T>;
}

/**
 * Cliente para realizar peticiones HTTP a la API
 */
const apiClient: ApiClient = {
  /**
   * Realiza una petición GET
   */
  async get(endpoint, customOptions = {}) {
    return this.request('GET', endpoint, null, customOptions);
  },
  
  /**
   * Realiza una petición POST
   */
  async post(endpoint, data = null, customOptions = {}) {
    return this.request('POST', endpoint, data, customOptions);
  },
  
  /**
   * Realiza una petición PUT
   */
  async put(endpoint, data = null, customOptions = {}) {
    return this.request('PUT', endpoint, data, customOptions);
  },
  
  /**
   * Realiza una petición DELETE
   */
  async delete(endpoint, customOptions = {}) {
    return this.request('DELETE', endpoint, null, customOptions);
  },
  
  /**
   * Método genérico para realizar peticiones HTTP
   */
  async request(method, endpoint, data = null, customOptions = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Configurar las opciones de la petición
    const options = {
      ...defaultOptions,
      ...customOptions,
      method,
      headers: {
        ...defaultOptions.headers,
        ...getAuthHeaders(),
        ...(customOptions as any).headers,
      },
    };
    
    // Añadir el body si hay datos
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    try {
      const response = await fetch(url, options);
      const responseData = await response.json();
      
      // Manejar respuestas no exitosas
      if (!response.ok) {
        throw new ApiError(
          responseData.message || 'Error en la petición', 
          response.status, 
          responseData
        );
      }
      
      return responseData;
    } catch (error) {
      // Si es un error de API, ya está formateado
      if (error instanceof ApiError) {
        if (error.status === 401) {
          // Manejar error de autenticación
          toast.error('Sesión expirada. Por favor, inicie sesión nuevamente.');
          // Aquí podrías redirigir al login o actualizar el estado de autenticación
          localStorage.removeItem('auth_token');
          window.location.href = '/';
        } else {
          toast.error(error.message || 'Ha ocurrido un error');
        }
        throw error;
      }
      
      // Para otros errores (como problemas de red)
      toast.error('Error de conexión. Por favor, inténtelo de nuevo.');
      throw new ApiError(
        'Error de conexión', 
        0, 
        { originalError: error }
      );
    }
  }
};

export default apiClient;
export { ApiError };
