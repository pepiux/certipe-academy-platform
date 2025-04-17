
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
    
    try {
      let response;
      if (useMock()) {
        response = await apiClient.get<DashboardStats>('/dashboard_stats');
      } else {
        response = await apiClient.get<DashboardStats>('/dashboard_stats.php');
      }
      
      // Ensure all required properties exist
      const safeResponse: DashboardStats = {
        study_hours: {
          total: response?.study_hours?.total || 0,
          by_course: response?.study_hours?.by_course || [],
          by_quiz: response?.study_hours?.by_quiz || [],
        },
        completed_quizzes: {
          total: response?.completed_quizzes?.total || 0,
          quizzes: response?.completed_quizzes?.quizzes || [],
        },
        average_scores: {
          overall: response?.average_scores?.overall || 0,
          by_quiz: response?.average_scores?.by_quiz || [],
        },
        courses_in_progress: {
          total: response?.courses_in_progress?.total || 0,
          courses: response?.courses_in_progress?.courses || [],
        }
      };
      
      return safeResponse;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Return a safe empty stats object
      return {
        study_hours: { total: 0, by_course: [], by_quiz: [] },
        completed_quizzes: { total: 0, quizzes: [] },
        average_scores: { overall: 0, by_quiz: [] },
        courses_in_progress: { total: 0, courses: [] },
      };
    }
  }
};

export default dashboardService;
export type { DashboardStats, StudyHour, CompletedQuiz, QuizScore, CourseProgress };
