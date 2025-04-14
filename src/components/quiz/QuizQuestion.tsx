
import React from 'react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Flag, SquareDashed } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertTriangle } from "lucide-react";

interface QuestionProps {
  question: any;
  currentAnswer: any;
  onSingleAnswerChange: (optionId: string) => void;
  onMultipleAnswerChange: (optionId: string, checked: boolean) => void;
  onToggleFlagged: () => void;
  timeWarning?: boolean;
}

const QuizQuestion: React.FC<QuestionProps> = ({
  question,
  currentAnswer,
  onSingleAnswerChange,
  onMultipleAnswerChange,
  onToggleFlagged,
  timeWarning
}) => {
  const renderFillBlankQuestion = () => {
    const text = question.text;
    const blankIndex = text.indexOf('___');
    const beforeBlank = text.substring(0, blankIndex);
    const afterBlank = text.substring(blankIndex + 3);

    return (
      <div className="mb-6">
        <div className="text-lg mb-4">
          {beforeBlank}
          <span className="inline-block bg-blue-100 px-4 py-1 mx-1 rounded-md min-w-24 text-center">
            {currentAnswer?.answer ? 
              question.options.find(opt => opt.id === currentAnswer.answer)?.text : 
              <SquareDashed className="inline mx-auto text-blue-400" />
            }
          </span>
          {afterBlank}
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Selecciona la palabra que completa correctamente la frase.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {question.options.map((option) => (
            <Button
              key={option.id}
              variant={currentAnswer?.answer === option.id ? "default" : "outline"}
              className={`justify-center py-6 ${
                currentAnswer?.answer === option.id ? "bg-blue-600 hover:bg-blue-700" : ""
              }`}
              onClick={() => onSingleAnswerChange(option.id)}
            >
              {option.text}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-4">
        <div className="font-medium">Pregunta {question.id}</div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`flex items-center gap-1 ${currentAnswer?.flagged ? "bg-red-50 text-red-600 hover:bg-red-100" : ""}`}
                onClick={onToggleFlagged}
              >
                <Flag size={14} />
                {currentAnswer?.flagged ? "Desmarca" : ""}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{currentAnswer?.flagged ? "Desmarcar" : "Marcar"} para revisar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {question.type === "fill-blank" ? (
        renderFillBlankQuestion()
      ) : question.type === "single" ? (
        <div>
          <div className="text-lg mb-6">{question.text}</div>
          <RadioGroup 
            value={currentAnswer?.answer || ""} 
            onValueChange={onSingleAnswerChange}
            className="space-y-3"
          >
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-accent">
                <RadioGroupItem value={option.id} id={`q${question.id}-${option.id}`} />
                <Label htmlFor={`q${question.id}-${option.id}`} className="flex-1 cursor-pointer">
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ) : (
        <div>
          <div className="text-lg mb-6">{question.text}</div>
          <div className="space-y-3">
            {question.options.map((option) => (
              <div key={option.id} className="flex items-start space-x-3 border rounded-lg p-3 hover:bg-accent">
                <Checkbox 
                  id={`q${question.id}-${option.id}`}
                  checked={(currentAnswer?.answers || []).includes(option.id)}
                  onCheckedChange={(checked) => 
                    onMultipleAnswerChange(option.id, checked as boolean)
                  }
                />
                <Label htmlFor={`q${question.id}-${option.id}`} className="flex-1 pt-0.5 cursor-pointer">
                  {option.text}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {timeWarning && (
        <div className="mt-6 flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-md">
          <AlertTriangle size={18} />
          <span className="text-sm font-medium">¡Menos de 5 minutos restantes! Por favor finaliza pronto.</span>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
