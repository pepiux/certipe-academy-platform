
import apiClient from './api/client';
import { useMock } from '@/services/serviceAdapter';

// Interfaces para los tipos de datos
interface StudyHour {
  id: number;
  title: string;
  hours: number;
  completed_date: string | null;
}

interface CompletedQuiz {
  id: number;
  title: string;
  completed_date: string;
  score: number;
}

interface QuizAttempt {
  date: string;
  score: number;
}

interface QuizScore {
  id: number;
  title: string;
  avg_score: number;
  attempts: QuizAttempt[];
}

interface CourseProgress {
  id: number;
  title: string;
  progress: number;
  duration_hours: number;
}

interface DashboardStats {
  study_hours: {
    total: number;
    by_course: StudyHour[];
    by_quiz: StudyHour[];
  };
  completed_quizzes: {
    total: number;
    quizzes: CompletedQuiz[];
  };
  average_scores: {
    overall: number;
    by_quiz: QuizScore[];
  };
  courses_in_progress: {
    total: number;
    courses: CourseProgress[];
  };
}

// Servicio para estadísticas del dashboard
const dashboardService = {
  /**
   * Obtiene todas las estadísticas del dashboard para el usuario actual
   */
  async getStats(): Promise<DashboardStats> {
    console.log("Obteniendo estadísticas del dashboard en modo: ", useMock() ? "Mock" : "Backend");
    
    if (useMock()) {
      return await apiClient.get<DashboardStats>('/dashboard_stats');
    } else {
      return await apiClient.get<DashboardStats>('/dashboard_stats.php');
    }
  }
};

export default dashboardService;
export type { DashboardStats, StudyHour, CompletedQuiz, QuizScore, CourseProgress };
