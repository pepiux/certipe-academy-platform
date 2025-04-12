
import { API_BASE_URL, defaultOptions, getAuthHeaders } from './config';
import { toast } from 'sonner';

// Clase para manejar errores de API
export class ApiError extends Error {
  status: number;
  data: any;
  
  constructor(message: string, status: number, data: any = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Definiendo interfaces para los métodos de la API
interface ApiClientInterface {
  get<T>(endpoint: string, customOptions?: Record<string, any>): Promise<T>;
  post<T>(endpoint: string, data?: any, customOptions?: Record<string, any>): Promise<T>;
  put<T>(endpoint: string, data?: any, customOptions?: Record<string, any>): Promise<T>;
  delete<T>(endpoint: string, customOptions?: Record<string, any>): Promise<T>;
  request<T>(method: string, endpoint: string, data?: any, customOptions?: Record<string, any>): Promise<T>;
}

/**
 * Cliente para realizar peticiones HTTP a la API
 * Compatible con Laravel y cualquier API RESTful
 */
const apiClient: ApiClientInterface = {
  /**
   * Realiza una petición GET
   */
  async get<T>(endpoint: string, customOptions = {}): Promise<T> {
    return this.request<T>('GET', endpoint, null, customOptions);
  },
  
  /**
   * Realiza una petición POST
   */
  async post<T>(endpoint: string, data: any = null, customOptions = {}): Promise<T> {
    return this.request<T>('POST', endpoint, data, customOptions);
  },
  
  /**
   * Realiza una petición PUT
   */
  async put<T>(endpoint: string, data: any = null, customOptions = {}): Promise<T> {
    return this.request<T>('PUT', endpoint, data, customOptions);
  },
  
  /**
   * Realiza una petición DELETE
   */
  async delete<T>(endpoint: string, customOptions = {}): Promise<T> {
    return this.request<T>('DELETE', endpoint, null, customOptions);
  },
  
  /**
   * Método genérico para realizar peticiones HTTP
   */
  async request<T>(
    method: string, 
    endpoint: string, 
    data: any = null, 
    customOptions: Record<string, any> = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Configurar las opciones de la petición
    const options: RequestInit = {
      ...defaultOptions,
      ...customOptions,
      method,
      headers: {
        ...defaultOptions.headers,
        ...getAuthHeaders(),
        ...(customOptions.headers || {}),
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
      
      return responseData as T;
    } catch (error) {
      // Si es un error de API, ya está formateado
      if (error instanceof ApiError) {
        if (error.status === 401) {
          // Manejar error de autenticación
          toast.error('Sesión expirada. Por favor, inicie sesión nuevamente.');
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
