
import { useState, useEffect } from 'react';
import courseService, { Course, CourseModule } from '@/services/courseService';

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
        
        // Mock data de los módulos para desarrollo (esto será reemplazado por datos reales de la API)
        const courseData = { ...data };
        if (!courseData.modules) {
          courseData.modules = [
            {
              id: 1,
              title: "Introducción a la Gestión de Proyectos",
              lessons: [
                { id: 1, title: "¿Qué es un proyecto?", duration: "15:30", completed: true, type: "video" },
                { id: 2, title: "Roles en la gestión de proyectos", duration: "22:45", completed: true, type: "video" },
                { id: 3, title: "Ciclo de vida del proyecto", duration: "18:20", completed: false, type: "reading" }
              ]
            } as CourseModule,
            {
              id: 2,
              title: "Planificación de Proyectos",
              lessons: [
                { id: 4, title: "Definición de objetivos y alcance", duration: "25:10", completed: false, type: "audio" },
                { id: 5, title: "Estimación de tiempos y recursos", duration: "30:15", completed: false, type: "video" },
                { id: 6, title: "Creación de cronogramas", duration: "28:40", completed: false, type: "reading" }
              ]
            } as CourseModule
          ];
        }

        setCourse(courseData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
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
