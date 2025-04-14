
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

interface QuizControlsProps {
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
}

const QuizControls: React.FC<QuizControlsProps> = ({
  isFirstQuestion,
  isLastQuestion,
  onPrevious,
  onNext,
  onFinish
}) => {
  return (
    <div className="flex justify-between">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstQuestion}
        className="flex items-center"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
      </Button>
      
      <div className="flex gap-2">
        <Button 
          onClick={onFinish} 
          className="flex gap-2 bg-green-600 hover:bg-green-700"
        >
          <CheckCircle size={16} /> Finalizar cuestionario
        </Button>
        
        {!isLastQuestion && (
          <Button onClick={onNext} className="flex items-center">
            Siguiente <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizControls;
