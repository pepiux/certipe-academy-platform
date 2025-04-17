
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

// Mock data for testing without backend
const mockData = {
  courses: {
    data: [
      {
        id: 1,
        title: "Introducción a la Gestión de Proyectos",
        description: "Aprende los fundamentos de la gestión de proyectos",
        image: "https://placehold.co/400x200?text=Gestión+de+Proyectos",
        lessons_count: 12,
        duration: "8 horas",
        level: "Principiante",
        progress: 35,
        instructor: {
          id: 1,
          name: "Carlos Rodríguez"
        },
        category: "Gestión",
        created_at: "2023-01-15",
        updated_at: "2023-03-22"
      },
      {
        id: 2,
        title: "Metodologías Ágiles y Scrum",
        description: "Domina las metodologías ágiles y el framework Scrum",
        image: "https://placehold.co/400x200?text=Metodologías+Ágiles",
        lessons_count: 10,
        duration: "6 horas",
        level: "Intermedio",
        progress: 75,
        instructor: {
          id: 2,
          name: "Ana Martínez"
        },
        category: "Agile",
        created_at: "2023-02-10",
        updated_at: "2023-04-18"
      },
      {
        id: 3,
        title: "Certificación PMP",
        description: "Preparación completa para el examen de certificación PMP",
        image: "https://placehold.co/400x200?text=Certificación+PMP",
        lessons_count: 20,
        duration: "15 horas",
        level: "Avanzado",
        progress: 0,
        instructor: {
          id: 3,
          name: "Javier López"
        },
        category: "Certificación",
        created_at: "2023-03-05",
        updated_at: "2023-05-12"
      }
    ],
    meta: {
      current_page: 1,
      last_page: 1,
      total: 3
    }
  },
  quizzes: {
    data: [
      {
        id: 1,
        title: "Fundamentos de Gestión de Proyectos",
        description: "Evalúa tu conocimiento sobre los conceptos básicos de la gestión de proyectos",
        course_id: 1,
        duration_minutes: 30,
        passing_score: 70,
        total_questions: 15,
        difficulty_level: "Principiante",
        is_published: true,
        last_score: 85,
        best_score: 85,
        category: "Gestión",
        created_at: "2023-02-15",
        updated_at: "2023-02-15"
      },
      {
        id: 2,
        title: "Scrum Master",
        description: "Comprueba tus conocimientos sobre el rol del Scrum Master",
        course_id: 2,
        duration_minutes: 45,
        passing_score: 80,
        total_questions: 20,
        difficulty_level: "Intermedio",
        is_published: true,
        last_score: 65,
        best_score: 78,
        category: "Agile",
        created_at: "2023-03-10",
        updated_at: "2023-03-10"
      },
      {
        id: 3,
        title: "Preparación PMP",
        description: "Simulacro de examen para la certificación PMP",
        course_id: 3,
        duration_minutes: 60,
        passing_score: 75,
        total_questions: 30,
        difficulty_level: "Avanzado",
        is_published: true,
        last_score: null,
        best_score: null,
        category: "Certificación",
        created_at: "2023-04-05",
        updated_at: "2023-04-05"
      }
    ],
    meta: {
      current_page: 1,
      last_page: 1,
      total: 3
    }
  },
  quiz_questions: {
    1: [
      {
        id: 1,
        quiz_id: 1,
        text: "¿Qué es un proyecto?",
        type: "single",
        options: [
          { id: 1, text: "Una operación continua", is_correct: false },
          { id: 2, text: "Un esfuerzo temporal que crea un resultado único", is_correct: true },
          { id: 3, text: "Un departamento dentro de una organización", is_correct: false },
          { id: 4, text: "Un proceso repetitivo", is_correct: false }
        ]
      }
    ]
  }
};

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
    
    // Si estamos en modo Mock, manejar respuestas simuladas
    if (useMock()) {
      console.log('Usando datos mock para GET a:', endpoint);
      
      // Extraer el recurso del endpoint (quizzes, courses, etc)
      const pathParts = endpoint.split('?')[0].split('/').filter(Boolean);
      const resource = pathParts[0];
      const resourceId = pathParts.length > 1 ? parseInt(pathParts[1]) : null;
      const subResource = pathParts.length > 2 ? pathParts[2] : null;
      
      console.log('Recurso solicitado:', resource, 'ID:', resourceId, 'Subrecurso:', subResource);
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Devolver datos mock según el recurso solicitado
      if (resource === 'courses') {
        if (resourceId) {
          const course = mockData.courses.data.find(c => c.id === resourceId);
          return course || { error: 'Course not found' };
        }
        return mockData.courses;
      } 
      else if (resource === 'quizzes') {
        if (resourceId) {
          if (subResource === 'questions') {
            return mockData.quiz_questions[resourceId] || [];
          }
          const quiz = mockData.quizzes.data.find(q => q.id === resourceId);
          return quiz || { error: 'Quiz not found' };
        }
        return mockData.quizzes;
      }
      
      // Si no hay datos específicos para el endpoint
      console.warn('No hay datos mock para el endpoint:', endpoint);
      return { data: [], meta: { total: 0 } };
    }
    
    // Si no estamos en modo Mock, seguir con el flujo original
    console.log(`Realizando petición GET a la API:`, endpoint);
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
    
    // Si estamos en modo Mock, simular respuestas POST
    if (useMock()) {
      console.log('Usando datos mock para POST a:', endpoint, 'con datos:', data);
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Manejar casos específicos para POST
      if (endpoint.includes('attempts')) {
        return { attemptId: 1 };
      }
      
      // Respuesta genérica para otros POST
      return { success: true, data };
    }
    
    // Si no estamos en modo Mock, seguir con el flujo original
    console.log(`Realizando petición POST a la API:`, endpoint);
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
    
    // Si estamos en modo Mock, simular respuestas PUT
    if (useMock()) {
      console.log('Usando datos mock para PUT a:', endpoint, 'con datos:', data);
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return { success: true, data };
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
    
    // Si estamos en modo Mock, simular respuestas DELETE
    if (useMock()) {
      console.log('Usando datos mock para DELETE a:', endpoint);
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return { success: true };
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
