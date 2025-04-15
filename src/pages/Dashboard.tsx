import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, FileQuestion, Book, Award } from "lucide-react";

import StatCard from "@/components/dashboard/StatCard";
import StudyHoursChart from "@/components/dashboard/StudyHoursChart";
import ScoreProgressChart from "@/components/dashboard/ScoreProgressChart";
import RecentQuiz from "@/components/dashboard/RecentQuiz";
import RecentActivity from "@/components/dashboard/RecentActivity";
import DashboardCourses from "@/components/dashboard/DashboardCourses";
import DashboardQuizzes from "@/components/dashboard/DashboardQuizzes";

const Dashboard = () => {
  const navigate = useNavigate();

  // Mock data for charts
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

  // Mock data for recent quiz
  const recentQuiz = {
    title: "PMP Project Management Knowledge Areas",
    score: 78,
    total: 100,
    correct: 39,
    incorrect: 11,
    date: "May 15, 2023",
    timeSpent: "45 minutes"
  };

  // Mock data for quizzes and courses
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
    },
  ];
  
  const courses = [
    {
      id: 1,
      title: "Fundamentos de Gestión de Proyectos",
      instructor: "María García",
      progress: 65,
      image: "https://placehold.co/400x200?text=Gestión+de+Proyectos",
      color: "from-indigo-400 to-indigo-600",
    },
    {
      id: 2,
      title: "Metodologías Ágiles y Scrum",
      instructor: "Carlos Rodríguez",
      progress: 30,
      image: "https://placehold.co/400x200?text=Scrum",
      color: "from-sky-400 to-sky-600",
    },
    {
      id: 3,
      title: "Certificación PMP: Guía Completa",
      instructor: "Javier López",
      progress: 10,
      image: "https://placehold.co/400x200?text=PMP",
      color: "from-rose-400 to-rose-600",
    },
    {
      id: 4,
      title: "Gestión de Riesgos en Proyectos",
      instructor: "Laura Martínez",
      progress: 50,
      image: "https://placehold.co/400x200?text=Riesgos",
      color: "from-emerald-400 to-emerald-600",
    },
  ];

  const handleStartQuiz = (quizId: number) => {
    navigate(`/dashboard/quizzes/${quizId}/take`);
  };

  const handleContinueCourse = (courseId: number) => {
    navigate(`/dashboard/courses/${courseId}`);
  };

  // Mock data for recent activity
  const recentActivities = [
    {
      id: 1,
      type: 'course_progress',
      title: "Completaste el módulo 'Gestión de Stakeholders'",
      course: "Avanzado en Gestión de Proyectos",
      date: "Hace 2 días"
    },
    {
      id: 2,
      type: 'quiz_completed',
      title: "Finalizaste el cuestionario con 85%",
      course: "Metodologías Ágiles y Scrum",
      date: "Hace 5 días"
    },
    {
      id: 3,
      type: 'certificate_earned',
      title: "Obtuviste el certificado del curso",
      course: "Introducción a PRINCE2",
      date: "Hace 2 semanas"
    }
  ] as const;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Panel de control</h1>
      
      {/* Stats Cards */}
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
      
      <DashboardCourses 
        courses={courses}
        onContinueCourse={handleContinueCourse}
      />
      
      <DashboardQuizzes
        quizzes={quizzes}
        onStartQuiz={handleStartQuiz}
      />
    </div>
  );
};

export default Dashboard;
