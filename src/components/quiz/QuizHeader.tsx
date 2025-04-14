
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Clock, Flag } from "lucide-react";

interface QuizHeaderProps {
  title: string;
  currentQuestion: number;
  totalQuestions: number;
  answeredCount: number;
  flaggedCount: number;
  timer: { minutes: number; seconds: number };
}

const QuizHeader = ({
  title,
  currentQuestion,
  totalQuestions,
  answeredCount,
  flaggedCount,
  timer
}: QuizHeaderProps) => {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="sticky top-0 z-10 bg-background py-2 border-b">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold">{title}</h1>
          <div className="flex gap-4 text-sm items-center">
            <div className="flex gap-1 items-center">
              <span className="text-muted-foreground">Pregunta:</span>
              <span className="font-medium">{currentQuestion + 1} de {totalQuestions}</span>
            </div>
            <div className="flex gap-1 items-center">
              <span className="text-muted-foreground">Respondidas:</span>
              <span className="font-medium">{answeredCount} de {totalQuestions}</span>
            </div>
            <div className="flex gap-1 items-center">
              <Flag size={14} className="text-red-500" />
              <span className="font-medium">{flaggedCount} marcadas</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className={`flex items-center gap-1 font-bold text-lg ${
            timer.minutes < 5 ? "text-red-500" : ""
          }`}>
            <Clock size={18} />
            <span>
              {String(timer.minutes).padStart(2, '0')}:{String(timer.seconds).padStart(2, '0')}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Tiempo restante
          </div>
        </div>
      </div>
      
      <Progress value={progress} className="h-1 mt-2" />
    </div>
  );
};

export default QuizHeader;
