
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, FileQuestion, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
}

interface DashboardQuizzesProps {
  quizzes: Quiz[];
  onStartQuiz: (quizId: number) => void;
}

const DashboardQuizzes = ({ quizzes, onStartQuiz }: DashboardQuizzesProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">Tus cuestionarios</h2>
        <Button variant="ghost" size="sm" className="gap-1 text-primary" onClick={() => navigate('/dashboard/quizzes')}>
          Ver todos <ChevronRight size={16} />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="overflow-hidden quiz-card">
            <div className={`quiz-card-banner bg-gradient-to-r ${quiz.color}`}></div>
            <div className="h-32 overflow-hidden">
              <img 
                src={quiz.image} 
                alt={quiz.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h4 className="font-medium line-clamp-1">{quiz.title}</h4>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2 h-10">
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
              <div className="flex justify-between text-sm mt-2">
                <span>Última nota:</span>
                <span className={quiz.lastScore >= 70 ? "text-green-600" : "text-amber-600"}>
                  {quiz.lastScore}%
                </span>
              </div>
              <Button 
                className="w-full mt-3 py-1 h-auto bg-primary hover:bg-primary/90 text-white"
                size="sm"
                onClick={() => onStartQuiz(quiz.id)}
              >
                Iniciar cuestionario
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardQuizzes;
