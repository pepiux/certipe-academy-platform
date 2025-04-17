
import apiClient from './api/client';
import { useMock } from '@/services/serviceAdapter';

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
    if (useMock()) {
      const queryParams = new URLSearchParams();
      
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      }
      
      const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
      return await apiClient.get<{data: Quiz[], meta: any}>(`/quizzes${query}`);
    } else {
      // Si estamos usando backend PHP
      let endpoint = '/quizzes.php';
      if (Object.keys(filters).length > 0) {
        endpoint += '?' + new URLSearchParams(filters as Record<string, string>).toString();
      }
      return await apiClient.get<{data: Quiz[], meta: any}>(endpoint);
    }
  },
  
  /**
   * Obtiene un quiz por su ID
   */
  async getQuiz(id: number): Promise<Quiz> {
    if (useMock()) {
      return await apiClient.get<Quiz>(`/quizzes/${id}`);
    } else {
      return await apiClient.get<Quiz>(`/quiz.php?id=${id}`);
    }
  },
  
  /**
   * Obtiene las preguntas de un quiz
   */
  async getQuizQuestions(id: number): Promise<Question[]> {
    if (useMock()) {
      return await apiClient.get<Question[]>(`/quizzes/${id}/questions`);
    } else {
      return await apiClient.get<Question[]>(`/quiz_questions.php?quiz_id=${id}`);
    }
  },
  
  /**
   * Inicia un nuevo intento de quiz
   */
  async startQuizAttempt(quizId: number): Promise<{attemptId: number}> {
    if (useMock()) {
      return await apiClient.post<{attemptId: number}>(`/quizzes/${quizId}/attempts`);
    } else {
      return await apiClient.post<{attemptId: number}>(`/quiz_attempt_start.php`, { quiz_id: quizId });
    }
  },
  
  /**
   * Envía las respuestas y completa un intento de quiz
   */
  async submitQuizAttempt(quizId: number, attemptId: number, answers: {question_id: number, selected_option_id: number | string}[]): Promise<QuizAttempt> {
    if (useMock()) {
      return await apiClient.post<QuizAttempt>(`/quizzes/${quizId}/attempts/${attemptId}/submit`, { answers });
    } else {
      return await apiClient.post<QuizAttempt>(`/quiz_attempt_submit.php`, { 
        quiz_id: quizId, 
        attempt_id: attemptId, 
        answers 
      });
    }
  },
  
  /**
   * Obtiene el historial de intentos de un usuario para un quiz
   */
  async getQuizAttemptHistory(quizId: number): Promise<QuizAttempt[]> {
    if (useMock()) {
      return await apiClient.get<QuizAttempt[]>(`/quizzes/${quizId}/attempts`);
    } else {
      return await apiClient.get<QuizAttempt[]>(`/quiz_attempts.php?quiz_id=${quizId}`);
    }
  }
};

export default quizService;
