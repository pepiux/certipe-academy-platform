
import apiClient from './api/client';

// Interfaces para los tipos de datos
interface Course {
  id: number;
  title: string;
  description: string;
  image?: string;
  lessons_count?: number;
  duration?: string;
  level?: string;
  instructor?: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

interface CourseFilters {
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
    // Convertir los filtros a query string
    const queryParams = new URLSearchParams();
    
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    }
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return await apiClient.get<{data: Course[], meta: any}>(`/courses${query}`);
  },
  
  /**
   * Obtiene un curso por su ID
   */
  async getCourse(id: number): Promise<Course> {
    return await apiClient.get<Course>(`/courses/${id}`);
  },
  
  /**
   * Crea un nuevo curso
   */
  async createCourse(courseData: Partial<Course>): Promise<Course> {
    return await apiClient.post<Course>('/courses', courseData);
  },
  
  /**
   * Actualiza un curso existente
   */
  async updateCourse(id: number, courseData: Partial<Course>): Promise<Course> {
    return await apiClient.put<Course>(`/courses/${id}`, courseData);
  },
  
  /**
   * Elimina un curso
   */
  async deleteCourse(id: number): Promise<void> {
    await apiClient.delete(`/courses/${id}`);
  }
};

export default courseService;
