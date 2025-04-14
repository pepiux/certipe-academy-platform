
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
    <div>
      {/* Navigation buttons at the bottom of question */}
      <div className="flex justify-between mt-4 mb-6">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstQuestion}
          className="flex items-center"
          type="button"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
        </Button>
        
        {!isLastQuestion && (
          <Button 
            onClick={onNext} 
            className="flex items-center"
            type="button"
          >
            Siguiente <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizControls;
