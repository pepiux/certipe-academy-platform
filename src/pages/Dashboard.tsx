import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, FileQuestion, Book, Award, ChevronRight } from "lucide-react";

import StatCard from "@/components/dashboard/StatCard";
import StudyHoursChart from "@/components/dashboard/StudyHoursChart";
import ScoreProgressChart from "@/components/dashboard/ScoreProgressChart";
import RecentQuiz from "@/components/dashboard/RecentQuiz";
import RecentActivity from "@/components/dashboard/RecentActivity";
import DashboardCourses from "@/components/dashboard/DashboardCourses";
import DashboardQuizzes from "@/components/dashboard/DashboardQuizzes";

const Dashboard = () => {
  const navigate = useNavigate();

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

  const courses = [
    {
      id: 1,
      title: "Fundamentos de Gestión de Proyectos",
      category: "Project Management",
      level: "Principiante",
      instructor: "María García",
      image: "https://placehold.co/400x200?text=Gestión+de+Proyectos",
      progress: 0,
      lessons: 12,
      duration: "8 horas",
      color: "from-indigo-400 to-indigo-600"
    },
    {
      id: 2,
      title: "Metodologías Ágiles y Scrum",
      category: "Agile",
      level: "Intermedio",
      instructor: "Carlos Rodríguez",
      image: "https://placehold.co/400x200?text=Scrum",
      progress: 65,
      lessons: 8,
      duration: "6 horas",
      color: "from-blue-400 to-blue-600"
    },
    {
      id: 3,
      title: "Gestión de Riesgos en Proyectos",
      category: "Risk Management",
      level: "Avanzado",
      instructor: "Ana Martínez",
      image: "https://placehold.co/400x200?text=Gestión+de+Riesgos",
      progress: 25,
      lessons: 10,
      duration: "7 horas",
      color: "from-emerald-400 to-emerald-600"
    },
    {
      id: 4,
      title: "Certificación PMP: Guía Completa",
      category: "Certification",
      level: "Avanzado",
      instructor: "Javier López",
      image: "https://placehold.co/400x200?text=PMP",
      progress: 10,
      lessons: 20,
      duration: "15 horas",
      color: "from-amber-400 to-amber-600"
    },
    {
      id: 5,
      title: "Introducción a PMI-ACP",
      category: "Agile",
      level: "Intermedio",
      instructor: "Laura Sánchez",
      image: "https://placehold.co/400x200?text=PMI-ACP",
      progress: 0,
      lessons: 14,
      duration: "10 horas",
      color: "from-purple-400 to-purple-600"
    },
    {
      id: 6,
      title: "Liderazgo en Equipos de Proyecto",
      category: "Leadership",
      level: "Intermedio",
      instructor: "Diego Ramírez",
      image: "https://placehold.co/400x200?text=Leadership",
      progress: 0,
      lessons: 12,
      duration: "9 horas",
      color: "from-pink-400 to-pink-600"
    }
  ];

  const quizzes = [
    {
      id: 1,
      title: "PMP Project Management Knowledge Areas",
      description: "Test your knowledge of the 10 PMI knowledge areas",
      questions: 50,
      duration: 60,
      lastScore: 78,
      bestScore: 85,
      image: "https://placehold.co/400x100?text=PMP+Knowledge+Areas",
      color: "from-purple-400 to-purple-600",
      difficulty: "Intermedio",
      category: "Project Management"
    },
    {
      id: 2,
      title: "Agile and Scrum Fundamentals",
      description: "Master the basics of Agile methodology and Scrum framework",
      questions: 30,
      duration: 45,
      lastScore: 64,
      bestScore: 72,
      image: "https://placehold.co/400x100?text=Agile+Scrum",
      color: "from-blue-400 to-blue-600",
      difficulty: "Basico",
      category: "Agile"
    },
    {
      id: 3,
      title: "Risk Management in Projects",
      description: "Identify, analyze, and respond to project risks",
      questions: 25,
      duration: 30,
      lastScore: 92,
      bestScore: 92,
      image: "https://placehold.co/400x100?text=Risk+Management",
      color: "from-emerald-400 to-emerald-600",
      difficulty: "Intermedio",
      category: "Risk Management"
    },
    {
      id: 4,
      title: "Project Stakeholder Management",
      description: "Learn to effectively manage project stakeholders",
      questions: 35,
      duration: 40,
      lastScore: 80,
      bestScore: 85,
      image: "https://placehold.co/400x100?text=Stakeholder+Management",
      color: "from-amber-400 to-amber-600",
      difficulty: "Basico",
      category: "Project Management"
    },
  ];

  const handleStartQuiz = (quizId: number) => {
    navigate(`/dashboard/quizzes/${quizId}/take`);
  };

  const handleContinueCourse = (courseId: number) => {
    navigate(`/dashboard/courses/${courseId}`);
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Panel de control</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Horas de estudio"
          value={24.5}
          subtitle="Horas de estudio"
          icon={Clock}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />
        <StatCard
          title="Cuestionarios completados"
          value={18}
          subtitle="Cuestionarios completados"
          icon={FileQuestion}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
        />
        <StatCard
          title="Puntuación media"
          value="78%"
          subtitle="Puntuación media"
          icon={Award}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />
        <StatCard
          title="Materiales de aprendizaje"
          value={12}
          subtitle="Materiales de aprendizaje"
          icon={Book}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-100"
        />
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
          <h2 className="text-xl font-medium">Tus cursos</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1 text-primary" 
            onClick={() => navigate('/dashboard/courses')}
          >
            Ver todos <ChevronRight size={16} />
          </Button>
        </div>
        
        <DashboardCourses 
          courses={courses}
          onContinueCourse={handleContinueCourse}
        />
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Tus cuestionarios</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1 text-primary" 
            onClick={() => navigate('/dashboard/quizzes')}
          >
            Ver todos <ChevronRight size={16} />
          </Button>
        </div>
        
        <DashboardQuizzes
          quizzes={quizzes}
          onStartQuiz={handleStartQuiz}
        />
      </div>
    </div>
  );
};

export default Dashboard;
