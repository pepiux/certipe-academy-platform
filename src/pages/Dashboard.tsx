
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardData } from "@/hooks/useDashboardData";

// Importar datos mock adaptados para el formato correcto
import { 
  studyHoursData as mockStudyHoursData,
  scoreProgressData as mockScoreProgressData,
  coursesData as mockCoursesData
} from "@/utils/dashboardMockData";

// Componentes
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import DashboardCoursesSection from "@/components/dashboard/DashboardCoursesSection";
import DashboardQuizzesSection from "@/components/dashboard/DashboardQuizzesSection";

const Dashboard = () => {
  const navigate = useNavigate();
  const { courses, quizzes, stats, loading, error } = useDashboardData();

  // Use mock data
  const studyHoursData = mockStudyHoursData;
  const scoreProgressData = mockScoreProgressData;
  
  // Enhanced courses with favorite flag
  const enhancedCourses = courses.map(course => {
    const mockData = mockCoursesData.find(c => c.id === course.id);
    return {
      ...course,
      favorite: mockData?.favorite || false
    };
  });

  const handleStartQuiz = (quizId: number) => {
    navigate(`/dashboard/quizzes/${quizId}/take`);
  };

  const handleContinueCourse = (courseId: number) => {
    navigate(`/dashboard/courses/${courseId}`);
  };

  // Asegurarnos que error siempre sea una cadena de texto
  const errorMessage = error || null;

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
        error={errorMessage}
        courses={enhancedCourses}
        onContinueCourse={handleContinueCourse}
      />
      
      <DashboardQuizzesSection
        loading={loading.quizzes}
        error={errorMessage}
        quizzes={quizzes}
        onStartQuiz={handleStartQuiz}
      />
    </div>
  );
};

export default Dashboard;
