
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import courseService from "@/services/courseService";
import quizService from "@/services/quizService";
import dashboardService, { DashboardStats } from "@/services/dashboardService";

// Componentes de widgets
import StudyHoursWidget from "@/components/dashboard/StudyHoursWidget";
import CompletedQuizzesWidget from "@/components/dashboard/CompletedQuizzesWidget";
import AverageScoreWidget from "@/components/dashboard/AverageScoreWidget";
import CoursesInProgressWidget from "@/components/dashboard/CoursesInProgressWidget";

// Componentes de gráficas y actividad reciente
import StudyHoursChart from "@/components/dashboard/StudyHoursChart";
import ScoreProgressChart from "@/components/dashboard/ScoreProgressChart";
import RecentQuiz from "@/components/dashboard/RecentQuiz";
import RecentActivity from "@/components/dashboard/RecentActivity";
import DashboardCourses from "@/components/dashboard/DashboardCourses";
import DashboardQuizzes from "@/components/dashboard/DashboardQuizzes";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState({
    courses: true,
    quizzes: true,
    stats: true
  });
  const [courses, setCourses] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading.stats ? (
          // Mostrar placeholders mientras cargan los datos
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-muted/40 h-[120px] rounded-lg animate-pulse"></div>
          ))
        ) : stats ? (
          <>
            <StudyHoursWidget 
              total={stats.study_hours.total} 
              byCourse={stats.study_hours.by_course}
              byQuiz={stats.study_hours.by_quiz}
            />
            <CompletedQuizzesWidget 
              total={stats.completed_quizzes.total} 
              quizzes={stats.completed_quizzes.quizzes}
            />
            <AverageScoreWidget 
              overall={stats.average_scores.overall}
              quizzes={stats.average_scores.by_quiz}
            />
            <CoursesInProgressWidget 
              total={stats.courses_in_progress.total}
              courses={stats.courses_in_progress.courses}
            />
          </>
        ) : (
          // Mensaje de error si no hay datos
          <div className="col-span-4 text-center py-4 text-red-500">
            Error al cargar las estadísticas del dashboard
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <StudyHoursChart data={studyHoursData} />
        <ScoreProgressChart data={scoreProgressData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentQuiz quiz={recentQuiz} />
        <RecentActivity activities={recentActivities} />
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Cursos</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1 text-primary" 
            onClick={() => navigate('/dashboard/courses')}
          >
            Ver todos <ChevronRight size={16} />
          </Button>
        </div>
        
        {loading.courses ? (
          <div className="text-center py-8">Cargando cursos...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : courses.length > 0 ? (
          <DashboardCourses 
            courses={courses}
            onContinueCourse={handleContinueCourse}
          />
        ) : (
          <div className="text-center py-8">No se encontraron cursos disponibles</div>
        )}
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Cuestionarios</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1 text-primary" 
            onClick={() => navigate('/dashboard/quizzes')}
          >
            Ver todos <ChevronRight size={16} />
          </Button>
        </div>
        
        {loading.quizzes ? (
          <div className="text-center py-8">Cargando cuestionarios...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : quizzes.length > 0 ? (
          <DashboardQuizzes
            quizzes={quizzes}
            onStartQuiz={handleStartQuiz}
          />
        ) : (
          <div className="text-center py-8">No se encontraron cuestionarios disponibles</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
