import React from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardData } from "@/hooks/useDashboardData";

// Importar datos mock de utilidades
import { 
  studyHoursData, 
  scoreProgressData, 
  recentQuiz, 
  recentActivities 
} from "@/utils/dashboardMockData";

// Import components
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import DashboardRecent from "@/components/dashboard/DashboardRecent";
import DashboardCoursesSection from "@/components/dashboard/DashboardCoursesSection";
import DashboardQuizzesSection from "@/components/dashboard/DashboardQuizzesSection";

const Dashboard = () => {
  const navigate = useNavigate();
  const { courses, quizzes, stats, loading, error } = useDashboardData();

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
