
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
        duration_hours: 8,
        level: "Principiante",
        progress: 35,
        completed_date: null,
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
        duration_hours: 6,
        level: "Intermedio",
        progress: 75,
        completed_date: "2023-05-10",
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
        duration_hours: 15,
        level: "Avanzado",
        progress: 0,
        completed_date: null,
        instructor: {
          id: 3,
          name: "Javier López"
        },
        category: "Certificación",
        created_at: "2023-03-05",
        updated_at: "2023-05-12"
      },
      {
        id: 4,
        title: "Curso de PHP 1",
        description: "Fundamentos de programación con PHP",
        image: "https://placehold.co/400x200?text=PHP+Básico",
        lessons_count: 15,
        duration: "10.5 horas",
        duration_hours: 10.5,
        level: "Principiante",
        progress: 100,
        completed_date: "2023-04-15",
        instructor: {
          id: 2,
          name: "Ana Martínez"
        },
        category: "Desarrollo",
        created_at: "2023-01-20",
        updated_at: "2023-04-15"
      },
      {
        id: 5,
        title: "Curso de PHP 2",
        description: "Desarrollo avanzado con PHP y MySQL",
        image: "https://placehold.co/400x200?text=PHP+Avanzado",
        lessons_count: 25,
        duration: "20 horas",
        duration_hours: 20,
        level: "Avanzado",
        progress: 100,
        completed_date: "2023-06-20",
        instructor: {
          id: 2,
          name: "Ana Martínez"
        },
        category: "Desarrollo",
        created_at: "2023-02-15",
        updated_at: "2023-06-20"
      }
    ],
    meta: {
      current_page: 1,
      last_page: 1,
      total: 5
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
        duration_hours: 0.5,
        passing_score: 70,
        total_questions: 15,
        difficulty_level: "Principiante",
        is_published: true,
        last_score: 85,
        best_score: 85,
        completed: true,
        completed_date: "2023-03-10",
        attempts_history: [
          { date: "2023-03-10", score: 85 },
          { date: "2023-02-20", score: 72 }
        ],
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
        duration_hours: 0.75,
        passing_score: 80,
        total_questions: 20,
        difficulty_level: "Intermedio",
        is_published: true,
        last_score: 65,
        best_score: 78,
        completed: false,
        completed_date: null,
        attempts_history: [
          { date: "2023-04-25", score: 65 },
          { date: "2023-03-15", score: 78 },
          { date: "2023-02-28", score: 60 }
        ],
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
        duration_hours: 1,
        passing_score: 75,
        total_questions: 30,
        difficulty_level: "Avanzado",
        is_published: true,
        last_score: null,
        best_score: null,
        completed: false,
        completed_date: null,
        attempts_history: [],
        category: "Certificación",
        created_at: "2023-04-05",
        updated_at: "2023-04-05"
      },
      {
        id: 4,
        title: "PHP Básico",
        description: "Evalúa tus conocimientos de PHP básico",
        course_id: 4,
        duration_minutes: 35,
        duration_hours: 0.58,
        passing_score: 70,
        total_questions: 18,
        difficulty_level: "Principiante",
        is_published: true,
        last_score: 92,
        best_score: 92,
        completed: true,
        completed_date: "2023-04-25",
        attempts_history: [
          { date: "2023-04-25", score: 92 }
        ],
        category: "Desarrollo",
        created_at: "2023-03-15",
        updated_at: "2023-03-15"
      },
      {
        id: 5,
        title: "PHP Avanzado y MySQL",
        description: "Evalúa tus conocimientos de PHP avanzado y MySQL",
        course_id: 5,
        duration_minutes: 60,
        duration_hours: 1,
        passing_score: 75,
        total_questions: 25,
        difficulty_level: "Avanzado",
        is_published: true,
        last_score: 88,
        best_score: 88,
        completed: true,
        completed_date: "2023-07-05",
        attempts_history: [
          { date: "2023-07-05", score: 88 },
          { date: "2023-06-30", score: 76 }
        ],
        category: "Desarrollo",
        created_at: "2023-05-20",
        updated_at: "2023-05-20"
      },
      {
        id: 6,
        title: "JavaScript Fundamentals",
        description: "Test your knowledge of JavaScript basics",
        course_id: null,
        duration_minutes: 45,
        duration_hours: 0.75,
        passing_score: 70,
        total_questions: 20,
        difficulty_level: "Principiante",
        is_published: true,
        last_score: 82,
        best_score: 82,
        completed: true,
        completed_date: "2023-05-15",
        attempts_history: [
          { date: "2023-05-15", score: 82 }
        ],
        category: "Desarrollo",
        created_at: "2023-04-01",
        updated_at: "2023-04-01"
      }
    ],
    meta: {
      current_page: 1,
      last_page: 1,
      total: 6
    }
  },
  dashboard_stats: {
    study_hours: {
      total: 35.5,
      by_course: [
        { id: 4, title: "Curso de PHP 1", hours: 10.5, completed_date: "2023-04-15" },
        { id: 5, title: "Curso de PHP 2", hours: 20, completed_date: "2023-06-20" },
      ],
      by_quiz: [
        { id: 1, title: "Fundamentos de Gestión de Proyectos", hours: 0.5, completed_date: "2023-03-10" },
        { id: 4, title: "PHP Básico", hours: 0.58, completed_date: "2023-04-25" },
        { id: 5, title: "PHP Avanzado y MySQL", hours: 1, completed_date: "2023-07-05" },
        { id: 6, title: "JavaScript Fundamentals", hours: 0.75, completed_date: "2023-05-15" }
      ]
    },
    completed_quizzes: {
      total: 4,
      quizzes: [
        { id: 1, title: "Fundamentos de Gestión de Proyectos", completed_date: "2023-03-10", score: 85 },
        { id: 4, title: "PHP Básico", completed_date: "2023-04-25", score: 92 },
        { id: 5, title: "PHP Avanzado y MySQL", completed_date: "2023-07-05", score: 88 },
        { id: 6, title: "JavaScript Fundamentals", completed_date: "2023-05-15", score: 82 }
      ]
    },
    average_scores: {
      overall: 78,
      by_quiz: [
        { 
          id: 1, 
          title: "Fundamentos de Gestión de Proyectos", 
          avg_score: 78.5,
          attempts: [
            { date: "2023-03-10", score: 85 },
            { date: "2023-02-20", score: 72 }
          ]
        },
        { 
          id: 2, 
          title: "Scrum Master", 
          avg_score: 67.7,
          attempts: [
            { date: "2023-04-25", score: 65 },
            { date: "2023-03-15", score: 78 },
            { date: "2023-02-28", score: 60 }
          ]
        },
        { 
          id: 4, 
          title: "PHP Básico", 
          avg_score: 92,
          attempts: [
            { date: "2023-04-25", score: 92 }
          ] 
        },
        { 
          id: 5, 
          title: "PHP Avanzado y MySQL", 
          avg_score: 82,
          attempts: [
            { date: "2023-07-05", score: 88 },
            { date: "2023-06-30", score: 76 }
          ]
        },
        { 
          id: 6, 
          title: "JavaScript Fundamentals", 
          avg_score: 82,
          attempts: [
            { date: "2023-05-15", score: 82 }
          ] 
        }
      ]
    },
    courses_in_progress: {
      total: 2,
      courses: [
        { id: 1, title: "Introducción a la Gestión de Proyectos", progress: 35, duration_hours: 8 },
        { id: 2, title: "Metodologías Ágiles y Scrum", progress: 75, duration_hours: 6 }
      ]
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
