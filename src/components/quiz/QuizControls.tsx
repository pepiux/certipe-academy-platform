
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
    <div className="flex justify-between mt-6">
      <Button
        onClick={onPrevious}
        variant="outline"
        className={`flex gap-2 ${isFirstQuestion ? 'invisible' : ''}`}
        disabled={isFirstQuestion}
      >
        <ArrowLeft size={16} /> Anterior
      </Button>
      
      <div className="flex gap-2">
        {isLastQuestion ? (
          <Button 
            onClick={onFinish}
            className="flex gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle size={16} /> Finalizar
          </Button>
        ) : (
          <Button 
            onClick={onNext} 
            className="flex gap-2"
          >
            Siguiente <ArrowRight size={16} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizControls;
