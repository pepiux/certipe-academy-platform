
import apiClient from './api/client';
import { useMock } from '@/services/serviceAdapter';

// Interfaces para los tipos de datos
export interface CourseModule {
  id: number;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed?: boolean;
  type?: 'video' | 'reading' | 'audio' | 'test';
  description?: string;
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
}

export interface CourseFilters {
  search?: string;
  level?: string;
  category_id?: number;
  page?: number;
  per_page?: number;
}

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
        // Convertir los filtros a query string
        const queryParams = new URLSearchParams();
        
        for (const [key, value] of Object.entries(filters)) {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        }
        
        const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
        return await apiClient.get<{data: Course[], meta: any}>(`/courses${query}`);
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
  async getCourse(id: number): Promise<Course> {
    console.log(`Obteniendo curso con ID ${id} en modo: ${useMock() ? "Mock" : "Backend"}`);
    
    if (!id || isNaN(id) || id <= 0) {
      throw new Error("ID del curso inválido");
    }
    
    try {
      let response;
      if (useMock()) {
        console.log(`Consultando endpoint mock: /courses/${id}`);
        response = await apiClient.get<Course>(`/courses/${id}`);
      } else {
        console.log(`Consultando endpoint backend: /course.php?id=${id}`);
        response = await apiClient.get<Course>(`/course.php?id=${id}`);
      }
      
      console.log("Respuesta recibida:", response);
      
      if (!response || !response.id) {
        throw new Error("El servidor no devolvió datos válidos del curso");
      }
      
      return response;
    } catch (error) {
      console.error(`Error al obtener curso con ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Crea un nuevo curso
   */
  async createCourse(courseData: Partial<Course>): Promise<Course> {
    if (useMock()) {
      return await apiClient.post<Course>('/courses', courseData);
    } else {
      return await apiClient.post<Course>('/course_create.php', courseData);
    }
  },
  
  /**
   * Actualiza un curso existente
   */
  async updateCourse(id: number, courseData: Partial<Course>): Promise<Course> {
    if (useMock()) {
      return await apiClient.put<Course>(`/courses/${id}`, courseData);
    } else {
      return await apiClient.post<Course>(`/course_update.php`, { id, ...courseData });
    }
  },
  
  /**
   * Elimina un curso
   */
  async deleteCourse(id: number): Promise<void> {
    if (useMock()) {
      await apiClient.delete(`/courses/${id}`);
    } else {
      await apiClient.post('/course_delete.php', { id });
    }
  }
};

export default courseService;
