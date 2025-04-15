
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

interface RecentQuizProps {
  quiz: {
    title: string;
    score: number;
    total: number;
    correct: number;
    incorrect: number;
    date: string;
    timeSpent: string;
  };
}

const RecentQuiz = ({ quiz }: RecentQuizProps) => {
  const navigate = useNavigate();

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Último cuestionario completado</h3>
        <div className="mb-4">
          <div className="text-base font-medium mb-2">{quiz.title}</div>
          <div className="flex justify-between items-center mb-2">
            <span>Puntuación general</span>
            <span className="font-medium">{quiz.score}/{quiz.total}</span>
          </div>
          <Progress value={quiz.score} className="h-2 mb-2" />
          <div className="flex gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm">Correcto: {quiz.correct} ({Math.round(quiz.correct / (quiz.correct + quiz.incorrect) * 100)}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm">Incorrecto: {quiz.incorrect} ({Math.round(quiz.incorrect / (quiz.correct + quiz.incorrect) * 100)}%)</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2 text-sm mt-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tiempo empleado</span>
            <span>{quiz.timeSpent}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fecha</span>
            <span>{quiz.date}</span>
          </div>
        </div>
        
        <Button className="w-full mt-4" variant="outline" onClick={() => navigate(`/dashboard/quizzes/1`)}>
          Ver detalles del cuestionario
        </Button>
      </CardContent>
    </Card>
  );
};

export default RecentQuiz;
