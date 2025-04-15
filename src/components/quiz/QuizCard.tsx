
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileQuestion, Clock } from "lucide-react";

interface Quiz {
  id: number;
  title: string;
  difficulty: string;
  questions: number;
  timeLimit: number;
  lastScore: number | null;
  image: string;
}

interface QuizCardProps {
  quiz: Quiz;
  onStart: (quizId: number) => void;
}

const QuizCard = ({ quiz, onStart }: QuizCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    return "bg-primary/10 text-primary border-primary/20";
  };

  const getQuizStatus = () => {
    if (quiz.lastScore === null) return "Iniciar";
    if (quiz.lastScore < 70) return "Retomar";
    return "Continuar";
  };

  return (
    <Card className="overflow-hidden flex flex-col h-[420px]">
      <div className="h-32 overflow-hidden border-b">
        <img 
          src={quiz.image} 
          alt={quiz.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <CardContent className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold mb-2 line-clamp-2">{quiz.title}</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Evaluación de conocimientos
        </p>
        
        <Badge variant="outline" className={`self-start mb-4 ${getDifficultyColor(quiz.difficulty)}`}>
          {quiz.difficulty}
        </Badge>
        
        <div className="flex-1">
          <div className="flex gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <FileQuestion size={16} className="text-muted-foreground" />
              <span>{quiz.questions} preguntas</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} className="text-muted-foreground" />
              <span>{quiz.timeLimit} minutos</span>
            </div>
          </div>
          
          {quiz.lastScore !== null && (
            <div className="mt-4">
              <div className="flex justify-between text-sm">
                <span>Última nota:</span>
                <span className={quiz.lastScore >= 70 ? "text-primary" : "text-amber-500"}>
                  {quiz.lastScore}%
                </span>
              </div>
            </div>
          )}
        </div>
        
        <Button 
          className="w-full mt-4 bg-primary hover:bg-primary/90 text-white"
          onClick={() => onStart(quiz.id)}
        >
          {getQuizStatus()}
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
