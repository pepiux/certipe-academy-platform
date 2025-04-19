
import { useState, useEffect } from 'react';
import courseService, { Course } from '@/services/courseService';
import { toast } from 'sonner';

export interface UseCourseResult {
  course: Course | null;
  loading: boolean;
  error: Error | null;
}

export const useCourse = (courseId: string | number | undefined): UseCourseResult => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      // Si courseId es undefined o nulo, mostrar error
      if (!courseId) {
        console.error("ID del curso no definido:", courseId);
        setError(new Error("ID del curso no definido"));
        setLoading(false);
        return;
      }
      
      // Intentar convertir a número si es string
      const parsedId = typeof courseId === 'string' ? parseInt(courseId, 10) : courseId;
      
      console.log("Iniciando fetchCourse con ID parseado:", parsedId);
      
      // Validar que el ID es válido
      if (isNaN(parsedId) || parsedId <= 0) {
        console.error("ID del curso inválido:", courseId, "parseado como:", parsedId);
        setError(new Error("ID del curso inválido"));
        setLoading(false);
        return;
      }

      setLoading(true);
      setCourse(null); // Limpiar curso anterior
      setError(null); // Limpiar errores anteriores
      
      try {
        console.log("Iniciando solicitud para obtener el curso con ID:", parsedId);
        let courseData = await courseService.getCourse(parsedId);
        console.log("Datos del curso recibidos:", courseData);
        
        // Verificar que recibimos datos válidos
        if (!courseData || typeof courseData !== 'object') {
          throw new Error("Los datos del curso recibidos no son válidos");
        }
        
        // Asegurarse de que los módulos sean un array y los tipos de lecciones sean correctos
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
            }
          ];
        }
        
        // Asegurar que todas las lecciones tienen un tipo válido
        courseData.modules.forEach(module => {
          module.lessons.forEach(lesson => {
            if (!lesson.type || !['video', 'reading', 'audio', 'test'].includes(lesson.type)) {
              lesson.type = 'video';
            }
          });
        });
        
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
