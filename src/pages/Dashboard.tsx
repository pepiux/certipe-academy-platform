import React from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardData } from "@/hooks/useDashboardData";

// Import components
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import DashboardRecent from "@/components/dashboard/DashboardRecent";
import DashboardCoursesSection from "@/components/dashboard/DashboardCoursesSection";
import DashboardQuizzesSection from "@/components/dashboard/DashboardQuizzesSection";

const Dashboard = () => {
  const navigate = useNavigate();
  const { courses, quizzes, stats, loading, error } = useDashboardData();

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
