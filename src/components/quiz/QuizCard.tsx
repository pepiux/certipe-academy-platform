
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
      <div className="h-48 overflow-hidden border-b">
        <img 
          src={quiz.image} 
          alt={quiz.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <CardContent className="p-5 flex flex-col flex-1">
        <div className="flex flex-col mb-3">
          <Badge variant="outline" className={`self-start mb-2 ${getDifficultyColor(quiz.difficulty)}`}>
            {quiz.difficulty}
          </Badge>
          <div className="text-xs text-muted-foreground">{quiz.category}</div>
        </div>
        
        <h3 className="font-semibold mb-4 line-clamp-2">{quiz.title}</h3>
        
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center text-muted-foreground">
                <FileQuestion size={14} className="mr-1" />
                <span>Preguntas</span>
              </div>
              <span className="font-medium">{quiz.questions}</span>
            </div>
            
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center text-muted-foreground">
                <Clock size={14} className="mr-1" />
                <span>Duración</span>
              </div>
              <span className="font-medium">{quiz.timeLimit} minutos</span>
            </div>
          </div>
          
          {quiz.attempts > 0 ? (
            <div className="mb-4">
              <div className="text-xs text-muted-foreground mb-2">
                {quiz.attempts} {quiz.attempts === 1 ? "intento" : "intentos"} realizado{quiz.attempts === 1 ? "" : "s"}
              </div>
              {quiz.lastScore !== null && (
                <div className="flex justify-between text-sm mb-1">
                  <span>Última puntuación</span>
                  <span className={quiz.lastScore >= 80 ? "text-green-600" : "text-amber-600"}>
                    {quiz.lastScore}%
                  </span>
                </div>
              )}
              {quiz.bestScore !== null && (
                <div className="flex justify-between text-sm">
                  <span>Mejor puntuación</span>
                  <span className="text-green-600">{quiz.bestScore}%</span>
                </div>
              )}
            </div>
          ) : (
            <div className="mb-4 text-sm text-muted-foreground">
              No has intentado este cuestionario aún
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <Button 
            className="w-full bg-purple-600 hover:bg-purple-600 text-white" 
            variant={quiz.attempts > 0 ? "outline" : "default"}
            onClick={() => onStart(quiz.id)}
          >
            {quiz.attempts > 0 ? "Reintentar cuestionario" : "Comenzar cuestionario"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
