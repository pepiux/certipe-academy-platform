
import { useState } from "react";
import ExpandableWidget from "./ExpandableWidget";
import { Award } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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

interface AverageScoreWidgetProps {
  overall: number;
  quizzes: QuizScore[];
}

const AverageScoreWidget = ({ overall, quizzes }: AverageScoreWidgetProps) => {
  const [selectedQuizId, setSelectedQuizId] = useState<string>(quizzes.length > 0 ? quizzes[0].id.toString() : "");
  
  const selectedQuiz = quizzes.find(quiz => quiz.id.toString() === selectedQuizId);
  
  return (
    <ExpandableWidget
      title="Puntuación media"
      value={`${overall}%`}
      subtitle="Puntuación media"
      icon={Award}
      iconColor="text-green-600"
      iconBgColor="bg-green-100"
    >
      {quizzes.length > 0 ? (
        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="quiz-select" className="text-sm font-medium">
              Seleccionar cuestionario:
            </label>
            <Select 
              value={selectedQuizId} 
              onValueChange={setSelectedQuizId}
            >
              <SelectTrigger id="quiz-select" className="w-full">
                <SelectValue placeholder="Seleccionar cuestionario" />
              </SelectTrigger>
              <SelectContent>
                {quizzes.map((quiz) => (
                  <SelectItem key={quiz.id} value={quiz.id.toString()}>
                    {quiz.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedQuiz && (
            <div className="mt-3">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Media del cuestionario:</span>
                <span className="text-sm font-medium">
                  {selectedQuiz.avg_score.toFixed(1)}%
                </span>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Historial de intentos:</h4>
                <ul className="space-y-1">
                  {selectedQuiz.attempts.map((attempt, index) => (
                    <li key={index} className="flex justify-between text-sm">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(attempt.date), 'dd/MM/yyyy', { locale: es })}
                      </span>
                      <span className={`${attempt.score >= 70 ? 'text-green-600' : 'text-amber-600'}`}>
                        {attempt.score}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-2 text-muted-foreground text-sm">
          No hay datos de cuestionarios disponibles
        </div>
      )}
    </ExpandableWidget>
  );
};

export default AverageScoreWidget;
