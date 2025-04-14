
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface QuizNavigationProps {
  questions: any[];
  currentPage: number;
  questionsPerPage: number;
  currentQuestion: number;
  answers: any[];
  onQuestionSelect: (index: number) => void;
  onPageChange: (page: number) => void;
}

const QuizNavigation: React.FC<QuizNavigationProps> = ({
  questions,
  currentPage,
  questionsPerPage,
  currentQuestion,
  answers,
  onQuestionSelect,
  onPageChange,
}) => {
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const currentPageQuestions = questions.slice(
    (currentPage - 1) * questionsPerPage, 
    currentPage * questionsPerPage
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">Navegación de preguntas</h3>
        <div className="text-sm text-muted-foreground">
          <span>Página {currentPage} de {totalPages}</span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-4">
        {currentPageQuestions.map((question, idx) => {
          const questionIndex = (currentPage - 1) * questionsPerPage + idx;
          const answer = answers[questionIndex];
          const isAnswered = answer?.type === "single" || answer?.type === "fill-blank"
            ? answer.answer !== null 
            : (answer?.answers && answer?.answers.length > 0);
          const isFlagged = answer?.flagged;
          const isSelected = currentQuestion === questionIndex;
          const isFillBlank = question.type === "fill-blank";

          return (
            <Button 
              key={question.id}
              className={`
                h-10 w-10 p-0 font-normal relative
                ${isSelected ? "border-2 border-primary" : ""}
                ${isAnswered ? "bg-green-100 hover:bg-green-200 text-green-800" : "bg-gray-100 hover:bg-gray-200"}
                ${isFlagged ? "ring-2 ring-red-500" : ""}
              `}
              onClick={() => onQuestionSelect(questionIndex)}
              variant="outline"
            >
              {question.id}
              {isFlagged && <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>}
              {isFillBlank && <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full"></div>}
            </Button>
          );
        })}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) onPageChange(currentPage - 1);
              }} 
              className={`${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
            />
          </PaginationItem>
          
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i} className={`${totalPages > 7 && (i > 2 && i < totalPages - 3) && i !== Math.floor(currentPage - 1) ? "hidden" : ""} ${i === 4 && currentPage > 4 ? "block" : ""}`}>
              {totalPages > 7 && i === 3 && currentPage > 5 ? (
                <PaginationEllipsis />
              ) : totalPages > 7 && i === totalPages - 4 && currentPage < totalPages - 4 ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(i + 1);
                  }}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) onPageChange(currentPage + 1);
              }}
              className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : ""}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default QuizNavigation;
