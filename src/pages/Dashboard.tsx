
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import courseService from "@/services/courseService";
import quizService from "@/services/quizService";
import dashboardService, { DashboardStats as DashboardStatsType } from "@/services/dashboardService";

// Import components
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import DashboardRecent from "@/components/dashboard/DashboardRecent";
import DashboardCoursesSection from "@/components/dashboard/DashboardCoursesSection";
import DashboardQuizzesSection from "@/components/dashboard/DashboardQuizzesSection";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState({
    courses: true,
    quizzes: true,
    stats: true
  });
  const [courses, setCourses] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStatsType | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Datos para las gráficas
  const studyHoursData = [
    { name: 'Lun', hours: 2.5 },
    { name: 'Mar', hours: 1.8 },
    { name: 'Mié', hours: 3.2 },
    { name: 'Jue', hours: 2.0 },
    { name: 'Vie', hours: 2.8 },
    { name: 'Sáb', hours: 4.5 },
    { name: 'Dom', hours: 3.6 },
  ];

  const scoreProgressData = [
    { name: 'Semana 1', score: 65 },
    { name: 'Semana 2', score: 68 },
    { name: 'Semana 3', score: 72 },
    { name: 'Semana 4', score: 78 },
    { name: 'Semana 5', score: 82 },
    { name: 'Semana 6', score: 78 },
    { name: 'Semana 7', score: 85 },
  ];

  const recentQuiz = {
    title: "PMP Project Management Knowledge Areas",
    score: 78,
    total: 100,
    correct: 39,
    incorrect: 11,
    date: "May 15, 2023",
    timeSpent: "45 minutes"
  };

  const recentActivities = [
    {
      id: 1,
      type: 'course_progress' as const,
      title: "Completaste el módulo 'Gestión de Stakeholders'",
      course: "Avanzado en Gestión de Proyectos",
      date: "Hace 2 días"
    },
    {
      id: 2,
      type: 'quiz_completed' as const,
      title: "Finalizaste el cuestionario con 85%",
      course: "Metodologías Ágiles y Scrum",
      date: "Hace 5 días"
    },
    {
      id: 3,
      type: 'certificate_earned' as const,
      title: "Obtuviste el certificado del curso",
      course: "Introducción a PRINCE2",
      date: "Hace 2 semanas"
    }
  ];

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
        setStats(null); // Ensure stats is null on error
      } finally {
        setLoading(prev => ({ ...prev, stats: false }));
      }

      try {
        // Cargar cursos
        setLoading(prev => ({ ...prev, courses: true }));
        const coursesResponse = await courseService.getCourses();
        console.log("Cursos obtenidos:", coursesResponse.data);
        
        // Formatear los datos de los cursos para el componente DashboardCourses
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
          color: "from-indigo-400 to-indigo-600" // Color por defecto
        }));
        
        setCourses(formattedCourses);
      } catch (err: any) {
        console.error("Error al obtener los cursos:", err);
        setError(`Error al cargar los cursos: ${err.message}`);
        toast.error("Error al cargar los cursos");
      } finally {
        setLoading(prev => ({ ...prev, courses: false }));
      }

      try {
        // Cargar quizzes
        setLoading(prev => ({ ...prev, quizzes: true }));
        const quizzesResponse = await quizService.getQuizzes();
        console.log("Cuestionarios obtenidos:", quizzesResponse.data);
        
        // Formatear los datos de los quizzes para el componente DashboardQuizzes
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
        setError(`Error al cargar los cuestionarios: ${err.message}`);
        toast.error("Error al cargar los cuestionarios");
      } finally {
        setLoading(prev => ({ ...prev, quizzes: false }));
      }
    };

    fetchData();
  }, []);

  const handleStartQuiz = (quizId: number) => {
    navigate(`/dashboard/quizzes/${quizId}/take`);
  };

  const handleContinueCourse = (courseId: number) => {
    navigate(`/dashboard/courses/${courseId}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Panel de control</h1>
      
      <DashboardStats loading={loading.stats} stats={stats} />
      
      <DashboardCharts 
        studyHoursData={studyHoursData}
        scoreProgressData={scoreProgressData}
      />
      
      <DashboardRecent 
        recentQuiz={recentQuiz}
        recentActivities={recentActivities}
      />
      
      <DashboardCoursesSection
        loading={loading.courses}
        error={error}
        courses={courses}
        onContinueCourse={handleContinueCourse}
      />
      
      <DashboardQuizzesSection
        loading={loading.quizzes}
        error={error}
        quizzes={quizzes}
        onStartQuiz={handleStartQuiz}
      />
    </div>
  );
};

export default Dashboard;
