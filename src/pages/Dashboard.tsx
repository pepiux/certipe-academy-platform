
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardData } from "@/hooks/useDashboardData";

// Importar datos mock adaptados para el formato correcto
import { 
  studyHoursData as mockStudyHoursData,
  scoreProgressData as mockScoreProgressData 
} from "@/utils/dashboardMockData";

// Componentes
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import DashboardCoursesSection from "@/components/dashboard/DashboardCoursesSection";
import DashboardQuizzesSection from "@/components/dashboard/DashboardQuizzesSection";

const Dashboard = () => {
  const navigate = useNavigate();
  const { courses, quizzes, stats, loading, error } = useDashboardData();

  // Transform mock data to match the required interface
  const studyHoursData = mockStudyHoursData.map(item => ({
    date: new Date().toISOString().split('T')[0], // Use today's date as a fallback
    hours: item.hours
  }));

  const scoreProgressData = mockScoreProgressData.map(item => ({
    date: new Date().toISOString().split('T')[0], // Use today's date as a fallback
    score: item.score
  }));

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
