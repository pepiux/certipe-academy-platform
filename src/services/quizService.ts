
import apiClient from './api/client';

// Interfaces para los tipos de datos
interface Question {
  id: number;
  quiz_id: number;
  text: string;
  type: "single" | "multiple" | "fill-blank";
  options: {
    id: number;
    text: string;
    is_correct: boolean;
  }[];
  blank_word?: string; // Palabra correcta para completar la frase
  blank_options?: string[]; // Opciones para completar el espacio en blanco
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  course_id?: number;
  duration_minutes: number;
  passing_score: number;
  total_questions: number;
  difficulty_level: string;
  is_published: boolean;
  questions?: Question[];
  created_at: string;
  updated_at: string;
}

interface QuizAttempt {
  id: number;
  quiz_id: number;
  user_id: number;
  score: number;
  passed: boolean;
  completed_at?: string;
  answers: {
    question_id: number;
    selected_option_id: number | string;
  }[];
}

// Servicio para gestionar quizzes
const quizService = {
  /**
   * Obtiene todos los quizzes
   */
  async getQuizzes(filters: Record<string, any> = {}): Promise<{data: Quiz[], meta: any}> {
    const queryParams = new URLSearchParams();
    
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    }
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return await apiClient.get<{data: Quiz[], meta: any}>(`/quizzes${query}`);
  },
  
  /**
   * Obtiene un quiz por su ID
   */
  async getQuiz(id: number): Promise<Quiz> {
    return await apiClient.get<Quiz>(`/quizzes/${id}`);
  },
  
  /**
   * Obtiene las preguntas de un quiz
   */
  async getQuizQuestions(id: number): Promise<Question[]> {
    return await apiClient.get<Question[]>(`/quizzes/${id}/questions`);
  },
  
  /**
   * Inicia un nuevo intento de quiz
   */
  async startQuizAttempt(quizId: number): Promise<{attemptId: number}> {
    return await apiClient.post<{attemptId: number}>(`/quizzes/${quizId}/attempts`);
  },
  
  /**
   * Envía las respuestas y completa un intento de quiz
   */
  async submitQuizAttempt(quizId: number, attemptId: number, answers: {question_id: number, selected_option_id: number | string}[]): Promise<QuizAttempt> {
    return await apiClient.post<QuizAttempt>(`/quizzes/${quizId}/attempts/${attemptId}/submit`, { answers });
  },
  
  /**
   * Obtiene el historial de intentos de un usuario para un quiz
   */
  async getQuizAttemptHistory(quizId: number): Promise<QuizAttempt[]> {
    return await apiClient.get<QuizAttempt[]>(`/quizzes/${quizId}/attempts`);
  }
};

export default quizService;
