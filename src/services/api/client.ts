import { API_BASE_URL, defaultOptions, getAuthHeaders } from './config';
import { toast } from 'sonner';
import { useMock, httpClient } from '@/services/serviceAdapter';

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
  get<T>(endpoint: string, customOptions?: Record<string, any>): Promise<T>;
  post<T>(endpoint: string, data?: any, customOptions?: Record<string, any>): Promise<T>;
  put<T>(endpoint: string, data?: any, customOptions?: Record<string, any>): Promise<T>;
  delete<T>(endpoint: string, customOptions?: Record<string, any>): Promise<T>;
  request<T>(method: string, endpoint: string, data?: any, customOptions?: Record<string, any>): Promise<T>;
}

/**
 * Cliente para realizar peticiones HTTP a la API
 */
const apiClient = {
  /**
   * Realiza una petición GET
   */
  async get(endpoint: string, customOptions = {}): Promise<any> {
    // Si estamos usando el backend PHP, usar el httpClient
    if (!useMock() && httpClient) {
      console.log('Usando httpClient para GET a:', endpoint);
      try {
        const response = await httpClient.get(endpoint);
        console.log('Respuesta de httpClient GET:', response);
        return response;
      } catch (error) {
        console.error('Error en httpClient GET:', error);
        throw error;
      }
    }
    // Si estamos en modo Mock, seguir con el flujo original
    const isMock = useMock();
    console.log(`Realizando petición GET en modo ${isMock ? 'Mock' : 'API'} a:`, endpoint);
    return this.request('GET', endpoint, null, customOptions);
  },
  
  /**
   * Realiza una petición POST
   */
  async post(endpoint: string, data = null, customOptions = {}): Promise<any> {
    // Si estamos usando el backend PHP, usar el httpClient
    if (!useMock() && httpClient) {
      console.log('Usando httpClient para POST a:', endpoint);
      try {
        const response = await httpClient.post(endpoint, data);
        console.log('Respuesta de httpClient POST:', response);
        return response;
      } catch (error) {
        console.error('Error en httpClient POST:', error);
        throw error;
      }
    }
    // Si estamos en modo Mock, seguir con el flujo original
    const isMock = useMock();
    console.log(`Realizando petición POST en modo ${isMock ? 'Mock' : 'API'} a:`, endpoint);
    return this.request('POST', endpoint, data, customOptions);
  },
  
  /**
   * Realiza una petición PUT
   */
  async put(endpoint: string, data = null, customOptions = {}): Promise<any> {
    // Si estamos usando el backend PHP, usar el httpClient
    if (!useMock() && httpClient) {
      console.log('Usando httpClient para PUT a:', endpoint);
      try {
        const response = await httpClient.put(endpoint, data);
        console.log('Respuesta de httpClient PUT:', response);
        return response;
      } catch (error) {
        console.error('Error en httpClient PUT:', error);
        throw error;
      }
    }
    return this.request('PUT', endpoint, data, customOptions);
  },
  
  /**
   * Realiza una petición DELETE
   */
  async delete(endpoint: string, customOptions = {}): Promise<any> {
    // Si estamos usando el backend PHP, usar el httpClient
    if (!useMock() && httpClient) {
      console.log('Usando httpClient para DELETE a:', endpoint);
      try {
        const response = await httpClient.delete(endpoint);
        console.log('Respuesta de httpClient DELETE:', response);
        return response;
      } catch (error) {
        console.error('Error en httpClient DELETE:', error);
        throw error;
      }
    }
    return this.request('DELETE', endpoint, null, customOptions);
  },
  
  /**
   * Método genérico para realizar peticiones HTTP
   */
  async request<T>(method: string, endpoint: string, data = null, customOptions = {}): Promise<T> {
    // Si estamos usando mock, utilizar el API_BASE_URL original
    const apiBaseUrl = useMock() ? 'http://localhost:8000/api' : API_BASE_URL;
    const url = `${apiBaseUrl}${endpoint}`;
    console.log(`Realizando petición ${method} a:`, url, 'Modo Mock:', useMock());
    
    // Configurar las opciones de la petición
    const options: RequestInit = {
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
      console.log('Enviando datos:', data);
    }
    
    try {
      console.log('Opciones de fetch:', options);
      const response = await fetch(url, options);
      
      // Log de la respuesta HTTP
      console.log('Respuesta HTTP:', response.status, response.statusText);
      
      let responseData;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        const text = await response.text();
        try {
          responseData = JSON.parse(text);
        } catch (e) {
          responseData = { message: text };
        }
      }
      
      console.log('Datos de respuesta:', responseData);
      
      // Manejar respuestas no exitosas
      if (!response.ok) {
        throw new ApiError(
          responseData.message || responseData.error || 'Error en la petición', 
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
      
      console.error('Error en la petición:', error);
      
      // Para otros errores (como problemas de red)
      toast.error('Error de conexión. Por favor, inténtelo de nuevo.');
      throw new ApiError(
        'Error de conexión', 
        0, 
        { originalError: error }
      );
    }
  }
} as ApiClient; // Type assertion to ensure apiClient conforms to ApiClient interface

export default apiClient;
export { ApiError };
