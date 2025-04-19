
import { useState, useEffect } from "react";
import { toast } from "sonner";
import courseService from "@/services/courseService";
import quizService from "@/services/quizService";
import dashboardService, { type DashboardStats as DashboardStatsType } from '@/services/dashboardService';

interface DashboardData {
  courses: any[];
  quizzes: any[];
  stats: DashboardStatsType | null;
  loading: {
    courses: boolean;
    quizzes: boolean;
    stats: boolean;
  };
  error: string | null;
}

export const useDashboardData = () => {
  const [loading, setLoading] = useState({
    courses: true,
    quizzes: true,
    stats: true
  });
  const [courses, setCourses] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStatsType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar estadísticas del dashboard
        setLoading(prev => ({ ...prev, stats: true }));
        const statsResponse = await dashboardService.getStats();
        console.log("Estadísticas del dashboard:", statsResponse);
        setStats(statsResponse);
      } catch (err: any) {
        console.error("Error al cargar las estadísticas:", err);
        toast.error("Error al cargar las estadísticas del dashboard");
        setStats(null);
        // Convertir el error a string
        setError(typeof err === 'string' ? err : err?.message || 'Error al cargar los datos');
      } finally {
        setLoading(prev => ({ ...prev, stats: false }));
      }

      try {
        // Cargar cursos
        setLoading(prev => ({ ...prev, courses: true }));
        const coursesResponse = await courseService.getCourses();
        console.log("Cursos obtenidos:", coursesResponse.data);
        
        // Formatear los datos de los cursos
        const formattedCourses = coursesResponse.data.map((course: any) => ({
          id: course.id,
          title: course.title,
          category: course.category || "Sin categoría",
          level: course.level || "General",
          instructor: course.instructor?.name || "Desconocido",
          image: course.image || "https://placehold.co/400x200?text=" + encodeURIComponent(course.title),
          progress: course.progress || 0,
          lessons: course.lessons_count || 0,
          duration: course.duration || "0 horas",
          color: "from-indigo-400 to-indigo-600"
        }));
        
        setCourses(formattedCourses);
      } catch (err: any) {
        console.error("Error al obtener los cursos:", err);
        // Convertir el error a string
        setError(typeof err === 'string' ? err : err?.message || 'Error al cargar los cursos');
        toast.error("Error al cargar los cursos");
      } finally {
        setLoading(prev => ({ ...prev, courses: false }));
      }

      try {
        // Cargar quizzes
        setLoading(prev => ({ ...prev, quizzes: true }));
        const quizzesResponse = await quizService.getQuizzes();
        console.log("Cuestionarios obtenidos:", quizzesResponse.data);
        
        // Formatear los datos de los quizzes
        const formattedQuizzes = quizzesResponse.data.map((quiz: any) => ({
          id: quiz.id,
          title: quiz.title,
          description: quiz.description || "Sin descripción",
          questions: quiz.total_questions || 0,
          duration: quiz.duration_minutes || 0,
          lastScore: quiz.last_score,
          bestScore: quiz.best_score,
          image: quiz.image || "https://placehold.co/400x100?text=" + encodeURIComponent(quiz.title),
          color: "from-blue-400 to-blue-600",
          difficulty: quiz.difficulty_level || "General",
          category: quiz.category || "Sin categoría"
        }));
        
        setQuizzes(formattedQuizzes);
      } catch (err: any) {
        console.error("Error al obtener los cuestionarios:", err);
        // Convertir el error a string
        setError(typeof err === 'string' ? err : err?.message || 'Error al cargar los cuestionarios');
        toast.error("Error al cargar los cuestionarios");
      } finally {
        setLoading(prev => ({ ...prev, quizzes: false }));
      }
    };

    fetchData();
  }, []);

  return {
    courses,
    quizzes,
    stats,
    loading,
    error
  };
};
