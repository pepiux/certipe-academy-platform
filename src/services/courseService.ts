
import apiClient from './api/client';
import { useMock } from '@/services/serviceAdapter';

// Interfaces para los tipos de datos
export interface CourseModule {
  id: number;
  title: string;
  description?: string;
  order?: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed?: boolean;
  type: 'video' | 'reading' | 'audio' | 'test';
  description?: string;
  content_url?: string;
  resource_url?: string;
  thumbnail?: string;
  order?: number;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  image?: string;
  lessons_count?: number;
  duration?: string;
  level?: string;
  category?: string;
  instructor?: string | { id: number; name: string };
  modules?: CourseModule[];
  progress?: number;
  completed_lessons?: number;
  total_lessons?: number;
  created_at?: string;
  updated_at?: string;
  favorite?: boolean;
  requirements?: string[];
  what_you_will_learn?: string[];
  certification?: boolean;
  enrolled?: boolean;  // Añadimos la propiedad enrolled que faltaba
}

export interface CourseFilters {
  search?: string;
  level?: string;
  category_id?: number;
  page?: number;
  per_page?: number;
}

// Datos mock para uso local
const mockCourses: Course[] = [
  {
    id: 1,
    title: "Fundamentos de Gestión de Proyectos",
    description: "Aprende los conceptos fundamentales de la gestión de proyectos y prepárate para certificaciones profesionales.",
    image: "https://placehold.co/300x200?text=Gestion+de+Proyectos",
    lessons_count: 24,
    duration: "12 horas",
    level: "Intermedio",
    category: "Gestión de Proyectos",
    instructor: { id: 1, name: "Dr. Juan Pérez" },
    progress: 65,
    completed_lessons: 15,
    total_lessons: 24,
    favorite: true,
    enrolled: true,  // Añadimos el valor para enrolled
    requirements: ["Conocimientos básicos de administración", "Comprensión de procesos organizacionales"],
    what_you_will_learn: ["Definir objetivos y alcances de proyectos", "Crear cronogramas efectivos", "Gestionar equipos multidisciplinarios"],
    certification: true,
    modules: [
      {
        id: 1,
        title: "Introducción a la Gestión de Proyectos",
        description: "Conceptos básicos y terminología para comenzar",
        order: 1,
        lessons: [
          { 
            id: 101, 
            title: "¿Qué es la gestión de proyectos?", 
            duration: "15:30", 
            completed: true, 
            type: "video",
            description: "Introducción a los conceptos básicos",
            content_url: "/videos/intro-pm.mp4",
            thumbnail: "https://placehold.co/120x68?text=Video:Intro",
            order: 1
          },
          { 
            id: 102, 
            title: "Historia y evolución", 
            duration: "25:45", 
            completed: true, 
            type: "reading",
            description: "Desarrollo histórico de las metodologías",
            content_url: "/docs/history-pm.pdf",
            order: 2
          },
          { 
            id: 103, 
            title: "Roles en la gestión de proyectos", 
            duration: "20:15", 
            completed: false, 
            type: "audio",
            description: "Podcast sobre los diferentes roles",
            content_url: "/audio/roles-podcast.mp3",
            order: 3
          }
        ]
      },
      {
        id: 2,
        title: "Planificación de Proyectos",
        description: "Herramientas y técnicas para planificar proyectos exitosos",
        order: 2,
        lessons: [
          { 
            id: 201, 
            title: "Definición de alcance", 
            duration: "18:20", 
            completed: false, 
            type: "video",
            description: "Cómo definir correctamente el alcance",
            content_url: "/videos/scope-definition.mp4",
            thumbnail: "https://placehold.co/120x68?text=Video:Scope",
            order: 1
          },
          { 
            id: 202, 
            title: "Estructura de desglose del trabajo (WBS)", 
            duration: "22:10", 
            completed: false, 
            type: "reading",
            description: "Guía para crear un WBS efectivo",
            content_url: "/docs/wbs-guide.pdf",
            order: 2
          },
          { 
            id: 203, 
            title: "Evaluación de conocimientos - Planificación", 
            duration: "15 min", 
            completed: false, 
            type: "test",
            description: "Prueba tus conocimientos sobre planificación",
            order: 3
          }
        ]
      },
      {
        id: 3,
        title: "Ejecución y Control",
        description: "Implementación y seguimiento de proyectos",
        order: 3,
        lessons: [
          { 
            id: 301, 
            title: "Gestión de recursos", 
            duration: "24:15", 
            completed: false, 
            type: "video",
            description: "Estrategias para gestionar recursos humanos y materiales",
            content_url: "/videos/resource-management.mp4",
            order: 1
          },
          { 
            id: 302, 
            title: "Control de cambios", 
            duration: "19:40", 
            completed: false, 
            type: "video",
            description: "Procesos para gestionar cambios en el proyecto",
            content_url: "/videos/change-control.mp4",
            order: 2
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Metodologías Ágiles",
    description: "Domina las metodologías ágiles para equipos de alto rendimiento.",
    image: "https://placehold.co/300x200?text=Metodologias+Agiles",
    lessons_count: 18,
    duration: "9 horas",
    level: "Avanzado",
    category: "Metodologías Ágiles",
    instructor: { id: 2, name: "María Rodríguez" },
    progress: 30,
    completed_lessons: 5,
    total_lessons: 18,
    favorite: false,
    enrolled: true,  // Añadimos el valor para enrolled
    modules: [
      {
        id: 4,
        title: "Scrum Framework",
        description: "Principios y prácticas de Scrum",
        order: 1,
        lessons: [
          { 
            id: 401, 
            title: "Principios de Scrum", 
            duration: "22:30", 
            completed: true, 
            type: "video",
            description: "Introducción a los principios de Scrum",
            order: 1
          },
          { 
            id: 402, 
            title: "Roles en Scrum", 
            duration: "18:45", 
            completed: true, 
            type: "reading",
            description: "Descripción detallada de los roles",
            order: 2
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "PRINCE2 Framework",
    description: "Aprende el framework PRINCE2 para gestión de proyectos estructurados.",
    image: "https://placehold.co/300x200?text=PRINCE2",
    lessons_count: 20,
    duration: "15 horas",
    level: "Avanzado",
    category: "Gestión de Proyectos",
    instructor: { id: 3, name: "Antonio García" },
    progress: 15,
    completed_lessons: 3,
    total_lessons: 20,
    favorite: true,
    enrolled: true,  // Añadimos el valor para enrolled
    modules: [
      {
        id: 5,
        title: "Introducción a PRINCE2",
        order: 1,
        lessons: [
          { 
            id: 501, 
            title: "Fundamentos de PRINCE2", 
            duration: "20:15", 
            completed: true, 
            type: "video",
            order: 1
          }
        ]
      }
    ]
  }
];

// Servicio para gestionar cursos
const courseService = {
  /**
   * Obtiene todos los cursos (con opción de filtrado)
   */
  async getCourses(filters: CourseFilters = {}): Promise<{data: Course[], meta: any}> {
    // Si estamos en modo mock, seguimos el flujo original para mock
    console.log("Consultando cursos en modo: ", useMock() ? "Mock" : "Backend");
    
    try {
      if (useMock()) {
        // Simulación de filtrado para modo mock
        let filteredCourses = [...mockCourses];
        
        // Aplicar filtros si existen
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredCourses = filteredCourses.filter(course => 
            course.title.toLowerCase().includes(searchTerm) || 
            course.description.toLowerCase().includes(searchTerm)
          );
        }
        
        if (filters.level) {
          filteredCourses = filteredCourses.filter(course => 
            course.level && course.level.toLowerCase() === filters.level?.toLowerCase()
          );
        }
        
        if (filters.category_id) {
          // Asumiendo que category_id corresponde a una categoría específica
          filteredCourses = filteredCourses.filter(course => 
            course.category && course.category.includes(String(filters.category_id))
          );
        }
        
        // Simulación de paginación
        const page = filters.page || 1;
        const perPage = filters.per_page || 10;
        const start = (page - 1) * perPage;
        const end = start + perPage;
        const paginatedCourses = filteredCourses.slice(start, end);
        
        return {
          data: paginatedCourses,
          meta: {
            current_page: page,
            per_page: perPage,
            total: filteredCourses.length,
            total_pages: Math.ceil(filteredCourses.length / perPage)
          }
        };
      } else {
        // Si estamos usando backend PHP
        let endpoint = '/courses.php';
        if (Object.keys(filters).length > 0) {
          endpoint += '?' + new URLSearchParams(filters as Record<string, string>).toString();
        }
        return await apiClient.get<{data: Course[], meta: any}>(endpoint);
      }
    } catch (error) {
      console.error("Error al consultar cursos:", error);
      throw error;
    }
  },
  
  /**
   * Obtiene un curso por su ID
   */
  async getCourse(id: number | string): Promise<Course> {
    // Convertir id a número si es string
    const courseId = typeof id === 'string' ? parseInt(id, 10) : id;
    
    console.log(`Obteniendo curso con ID ${courseId} en modo: ${useMock() ? "Mock" : "Backend"}`);
    
    if (!courseId || isNaN(courseId) || courseId <= 0) {
      console.error("ID del curso inválido:", id, "parseado como:", courseId);
      throw new Error("ID del curso inválido");
    }
    
    try {
      let response: Course;
      if (useMock()) {
        console.log(`Consultando endpoint mock: /courses/${courseId}`);
        
        // Para modo mock, buscar directamente en los datos locales
        const course = mockCourses.find(c => c.id === courseId);
        
        if (!course) {
          console.error(`Curso con ID ${courseId} no encontrado en datos mock`);
          throw new Error(`Curso con ID ${courseId} no encontrado`);
        }
        
        response = course;
      } else {
        console.log(`Consultando endpoint backend: /course.php?id=${courseId}`);
        response = await apiClient.get<Course>(`/course.php?id=${courseId}`);
      }
      
      console.log("Respuesta recibida:", response);
      
      if (!response || !response.id) {
        throw new Error("El servidor no devolvió datos válidos del curso");
      }
      
      return response;
    } catch (error) {
      console.error(`Error al obtener curso con ID ${courseId}:`, error);
      throw error;
    }
  },
  
  /**
   * Crea un nuevo curso
   */
  async createCourse(courseData: Partial<Course>): Promise<Course> {
    if (useMock()) {
      // Simulación de creación en modo mock
      const newId = Math.max(...mockCourses.map(c => c.id)) + 1;
      const newCourse: Course = {
        id: newId,
        title: courseData.title || "Nuevo curso",
        description: courseData.description || "Descripción del nuevo curso", 
        image: courseData.image || "https://placehold.co/300x200?text=Nuevo+Curso",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        modules: courseData.modules || [],
        ...courseData
      };
      
      mockCourses.push(newCourse);
      return newCourse;
    } else {
      return await apiClient.post<Course>('/course_create.php', courseData);
    }
  },
  
  /**
   * Actualiza un curso existente
   */
  async updateCourse(id: number, courseData: Partial<Course>): Promise<Course> {
    if (useMock()) {
      // Simulación de actualización en modo mock
      const index = mockCourses.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error(`Curso con ID ${id} no encontrado`);
      }
      
      const updatedCourse: Course = {
        ...mockCourses[index],
        ...courseData,
        updated_at: new Date().toISOString()
      };
      
      mockCourses[index] = updatedCourse;
      return updatedCourse;
    } else {
      return await apiClient.post<Course>(`/course_update.php`, { id, ...courseData });
    }
  },
  
  /**
   * Elimina un curso
   */
  async deleteCourse(id: number): Promise<void> {
    if (useMock()) {
      // Simulación de eliminación en modo mock
      const index = mockCourses.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error(`Curso con ID ${id} no encontrado`);
      }
      
      mockCourses.splice(index, 1);
    } else {
      await apiClient.post('/course_delete.php', { id });
    }
  }
};

export default courseService;
