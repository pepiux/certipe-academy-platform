
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

// Datos por defecto en caso de error
const defaultStats: DashboardStats = {
  study_hours: {
    total: 0,
    by_course: [],
    by_quiz: []
  },
  completed_quizzes: {
    total: 0,
    quizzes: []
  },
  average_scores: {
    overall: 0,
    by_quiz: []
  },
  courses_in_progress: {
    total: 0,
    courses: []
  }
};

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
      
      // Asegurarse de que todos los campos necesarios existen
      return this.validateAndNormalizeData(response);
    } catch (error) {
      console.error("Error al obtener estadísticas del dashboard:", error);
      return defaultStats;
    }
  },
  
  /**
   * Valida y normaliza los datos para asegurar que todas las propiedades existen
   */
  validateAndNormalizeData(data: any): DashboardStats {
    if (!data) return defaultStats;
    
    return {
      study_hours: {
        total: data.study_hours?.total ?? 0,
        by_course: Array.isArray(data.study_hours?.by_course) ? data.study_hours.by_course : [],
        by_quiz: Array.isArray(data.study_hours?.by_quiz) ? data.study_hours.by_quiz : []
      },
      completed_quizzes: {
        total: data.completed_quizzes?.total ?? 0,
        quizzes: Array.isArray(data.completed_quizzes?.quizzes) ? data.completed_quizzes.quizzes : []
      },
      average_scores: {
        overall: data.average_scores?.overall ?? 0,
        by_quiz: Array.isArray(data.average_scores?.by_quiz) ? data.average_scores.by_quiz : []
      },
      courses_in_progress: {
        total: data.courses_in_progress?.total ?? 0,
        courses: Array.isArray(data.courses_in_progress?.courses) ? data.courses_in_progress.courses : []
      }
    };
  }
};

export default dashboardService;
export type { DashboardStats, StudyHour, CompletedQuiz, QuizScore, CourseProgress };
