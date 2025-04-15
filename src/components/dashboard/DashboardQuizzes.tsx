
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, FileQuestion, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface Quiz {
  id: number;
  title: string;
  description: string;
  questions: number;
  duration: number;
  lastScore: number;
  bestScore: number;
  image: string;
  color: string;
  difficulty: string;
  category: string;
}

interface DashboardQuizzesProps {
  quizzes: Quiz[];
  onStartQuiz: (quizId: number) => void;
}

const DashboardQuizzes = ({ quizzes, onStartQuiz }: DashboardQuizzesProps) => {
  const navigate = useNavigate();

  const getQuizStatus = (score: number | null) => {
    if (score === null) return "Iniciar";
    if (score < 70) return "Retomar";
    return "Continuar";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {quizzes.map((quiz) => (
        <Card key={quiz.id} className="overflow-hidden flex flex-col h-[420px]">
          <div className="h-32 overflow-hidden">
            <img 
              src={quiz.image} 
              alt={quiz.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-4 flex flex-col flex-1">
            <div className="mb-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {quiz.difficulty}
              </Badge>
              <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">
                {quiz.category}
              </Badge>
            </div>
            <h4 className="font-medium line-clamp-1 mt-2">{quiz.title}</h4>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {quiz.description}
            </p>
            <div className="flex gap-3 mt-2">
              <div className="flex items-center gap-1 text-xs">
                <FileQuestion size={14} className="text-muted-foreground" />
                <span>{quiz.questions} preguntas</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <Clock size={14} className="text-muted-foreground" />
                <span>{quiz.duration} minutos</span>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-end mt-3">
              {quiz.lastScore !== null && (
                <div className="flex justify-between text-sm mb-3">
                  <span>Última nota:</span>
                  <span className={quiz.lastScore >= 70 ? "text-green-600" : "text-amber-600"}>
                    {quiz.lastScore}%
                  </span>
                </div>
              )}
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white"
                onClick={() => onStartQuiz(quiz.id)}
              >
                {getQuizStatus(quiz.lastScore)}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardQuizzes;
