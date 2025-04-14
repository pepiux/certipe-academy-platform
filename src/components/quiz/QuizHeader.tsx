
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
  image?: string;
}

const QuizHeader = ({
  title,
  currentQuestion,
  totalQuestions,
  answeredCount,
  flaggedCount,
  timer,
  image = "/lovable-uploads/b761c811-0b60-4434-88b4-df3b248ef7ca.png"
}: QuizHeaderProps) => {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="sticky top-0 z-10 bg-background">
      <div className="relative w-full h-48 bg-gradient-to-r from-purple-900 to-purple-700 overflow-hidden mb-4">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover opacity-80 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
          <div className="absolute bottom-0 p-6">
            <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
            <div className="flex gap-4 text-sm items-center text-white/90">
              <div className="flex gap-1 items-center">
                <span>Pregunta: {currentQuestion + 1} de {totalQuestions}</span>
              </div>
              <div className="flex gap-1 items-center">
                <span>Respondidas: {answeredCount} de {totalQuestions}</span>
              </div>
              <div className="flex gap-1 items-center">
                <Flag size={14} className="text-red-400" />
                <span>{flaggedCount} marcadas</span>
              </div>
            </div>
          </div>
          
          <div className="absolute top-4 right-4">
            <div className={`flex items-center gap-1 font-bold text-lg ${
              timer.minutes < 5 ? "text-red-400" : "text-white"
            }`}>
              <Clock size={18} />
              <span>
                {String(timer.minutes).padStart(2, '0')}:{String(timer.seconds).padStart(2, '0')}
              </span>
            </div>
            <div className="text-xs text-white/80 text-right">
              Tiempo restante
            </div>
          </div>
        </div>
      </div>
      
      <Progress value={progress} className="h-1" />
    </div>
  );
};

export default QuizHeader;
