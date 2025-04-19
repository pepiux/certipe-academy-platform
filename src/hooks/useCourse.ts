
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
      setLoading(true);
      try {
        const data = await courseService.getCourse(courseId);
        
        // Si no hay módulos, creamos una estructura por defecto
        const courseData = { ...data };
        if (!courseData.modules || courseData.modules.length === 0) {
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

        setCourse(courseData);
      } catch (err) {
        console.error("Error al obtener el curso:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        toast.error("No se pudo cargar el curso. Por favor, inténtelo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  return { course, loading, error };
};
