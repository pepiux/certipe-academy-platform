
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, FileQuestion } from "lucide-react";

interface Quiz {
  id: number;
  title: string;
  category: string;
  difficulty: string;
  questions: number;
  timeLimit: number;
  attempts: number;
  lastScore: number | null;
  bestScore: number | null;
  image: string;
}

interface QuizCardProps {
  quiz: Quiz;
  onStart: (quizId: number) => void;
}

const QuizCard = ({ quiz, onStart }: QuizCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Principiante":
        return "bg-green-100 text-green-800";
      case "Intermedio":
        return "bg-blue-100 text-blue-800";
      case "Avanzado":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="quiz-card-banner"></div>
      <div className="h-32 overflow-hidden border-b">
        <img 
          src={quiz.image} 
          alt={quiz.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="flex flex-col mb-3">
          <Badge variant="outline" className={`self-start mb-2 ${getDifficultyColor(quiz.difficulty)}`}>
            {quiz.difficulty}
          </Badge>
          <div className="text-xs text-muted-foreground">{quiz.category}</div>
        </div>
        
        <h3 className="font-semibold mb-4 line-clamp-2">{quiz.title}</h3>
        
        <div className="flex-1">
          <div className="flex gap-3 mt-2">
            <div className="flex items-center gap-1 text-xs">
              <FileQuestion size={14} className="text-muted-foreground" />
              <span>{quiz.questions} preguntas</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Clock size={14} className="text-muted-foreground" />
              <span>{quiz.timeLimit} minutos</span>
            </div>
          </div>
          
          {quiz.lastScore !== null && (
            <div className="flex justify-between text-sm mt-2">
              <span>Última nota:</span>
              <span className={quiz.lastScore >= 70 ? "text-green-600" : "text-amber-600"}>
                {quiz.lastScore}%
              </span>
            </div>
          )}
        </div>
        
        <Button 
          className="w-full mt-3 py-1 h-auto bg-[#00B4FF] hover:bg-[#00B4FF] text-white" 
          size="sm"
          onClick={() => onStart(quiz.id)}
        >
          Iniciar cuestionario
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
