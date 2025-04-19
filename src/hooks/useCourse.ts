
import { useState, useEffect } from 'react';
import courseService, { Course, CourseModule } from '@/services/courseService';
import { toast } from 'sonner';

export interface UseCourseResult {
  course: Course | null;
  loading: boolean;
  error: Error | null;
}

export const useCourse = (courseId: number): UseCourseResult => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId || isNaN(courseId) || courseId <= 0) {
        console.error("ID del curso inválido:", courseId);
        setError(new Error("ID del curso inválido"));
        setLoading(false);
        return;
      }

      setLoading(true);
      setCourse(null); // Limpiar curso anterior
      setError(null); // Limpiar errores anteriores
      
      try {
        console.log("Iniciando solicitud para obtener el curso con ID:", courseId);
        const data = await courseService.getCourse(courseId);
        console.log("Datos del curso recibidos:", data);
        
        // Verificar que recibimos datos válidos
        if (!data || typeof data !== 'object') {
          throw new Error("Los datos del curso recibidos no son válidos");
        }
        
        // Si no hay módulos, creamos una estructura por defecto
        const courseData = { ...data };
        if (!courseData.modules || !Array.isArray(courseData.modules) || courseData.modules.length === 0) {
          console.log("Creando estructura de módulos por defecto para el curso");
          courseData.modules = [
            {
              id: 1,
              title: "Introducción",
              lessons: [
                { 
                  id: 1, 
                  title: "¿Qué es este curso?", 
                  duration: "15:30", 
                  completed: courseData.progress ? courseData.progress > 0 : false, 
                  type: "video" 
                }
              ]
            } as CourseModule
          ];
        }

        console.log("Curso procesado con éxito:", courseData);
        setCourse(courseData);
      } catch (err) {
        console.error("Error al obtener el curso:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        toast.error("No se pudo cargar el curso. Por favor, inténtelo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    console.log("useEffect se ejecuta con courseId:", courseId);
    fetchCourse();
  }, [courseId]);

  return { course, loading, error };
};
