
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Clock, Flag, ArrowLeft, ArrowRight, Save, AlertTriangle, CheckCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

const TakeQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timer, setTimer] = useState({ minutes: 59, seconds: 59 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<any[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 25;

  // Mock quiz data
  const quizData = {
    id: parseInt(id || "1"),
    title: "Fundamentos de la Gestión de Proyectos",
    timeLimit: 60, // minutes
    totalQuestions: 75,
    questions: Array.from({ length: 75 }, (_, i) => ({
      id: i + 1,
      text: `Pregunta ${i + 1}: Esta es una pregunta de ejemplo para el cuestionario sobre fundamentos de gestión de proyectos`,
      type: i % 5 === 0 ? "multiple" : "single",
      options: [
        { id: "a", text: `Opción A para la pregunta ${i + 1}` },
        { id: "b", text: `Opción B para la pregunta ${i + 1}` },
        { id: "c", text: `Opción C para la pregunta ${i + 1}` },
        { id: "d", text: `Opción D para la pregunta ${i + 1}` }
      ],
      answer: null,
      answers: [],
      flagged: false
    }))
  };

  // Initialize answers state from quiz questions
  useEffect(() => {
    if (!isInitialized && quizData.questions) {
      const initialAnswers = quizData.questions.map(q => {
        if (q.type === "single") {
          return { questionId: q.id, answer: q.answer, type: "single", flagged: q.flagged };
        } else {
          return { questionId: q.id, answers: q.answers || [], type: "multiple", flagged: q.flagged };
        }
      });
      setAnswers(initialAnswers);
      setIsInitialized(true);
    }
  }, [quizData, isInitialized]);

  // Initialize the timer
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer.seconds > 0) {
          return { ...prevTimer, seconds: prevTimer.seconds - 1 };
        } else if (prevTimer.minutes > 0) {
          return { minutes: prevTimer.minutes - 1, seconds: 59 };
        } else {
          clearInterval(timerInterval);
          // Auto-submit when time expires
          toast.warning("¡El tiempo ha expirado! Tu cuestionario será enviado automáticamente.");
          setIsSubmitting(true);
          setTimeout(() => {
            handleSubmitQuiz();
          }, 2000);
          return { minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const handleSingleAnswerChange = (optionId: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion].answer = optionId;
    setAnswers(updatedAnswers);
  };

  const handleMultipleAnswerChange = (optionId: string, checked: boolean) => {
    const updatedAnswers = [...answers];
    const currentAnswers = updatedAnswers[currentQuestion].answers || [];
    
    if (checked) {
      updatedAnswers[currentQuestion].answers = [...currentAnswers, optionId];
    } else {
      updatedAnswers[currentQuestion].answers = currentAnswers.filter((id: string) => id !== optionId);
    }
    setAnswers(updatedAnswers);
  };

  const toggleFlagged = () => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion].flagged = !updatedAnswers[currentQuestion].flagged;
    setAnswers(updatedAnswers);
  };

  const goToNextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      // Update page if necessary
      const nextPage = Math.floor(currentQuestion / questionsPerPage) + 1;
      if (nextPage !== currentPage) {
        setCurrentPage(nextPage);
      }
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      // Update page if necessary
      const prevPage = Math.floor((currentQuestion - 1) / questionsPerPage) + 1;
      if (prevPage !== currentPage) {
        setCurrentPage(prevPage);
      }
    }
  };

  const goToQuestion = (questionIndex: number) => {
    setCurrentQuestion(questionIndex);
  };

  const handleFinishClick = () => {
    setShowFinishDialog(true);
  };

  const handleCancelFinish = () => {
    setShowFinishDialog(false);
  };

  const handleConfirmFinish = () => {
    setShowFinishDialog(false);
    handleSubmitQuiz();
  };

  const handleSubmitQuiz = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Calculate score based on correct answers (in a real app this would be done on the server)
      const correctCount = Math.floor(Math.random() * (quizData.questions.length + 1)); // For demo purposes
      const score = Math.round((correctCount / quizData.questions.length) * 100);
      
      // Save result to local storage for demo purposes
      const result = {
        quizId: quizData.id,
        score,
        correctCount,
        totalQuestions: quizData.questions.length,
        date: new Date().toISOString(),
        timeSpent: `${59 - timer.minutes}:${59 - timer.seconds}`
      };
      
      const storedResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
      localStorage.setItem('quizResults', JSON.stringify([...storedResults, result]));
      
      toast.success("¡Cuestionario completado!");
      
      // Navigate to quiz detail page
      navigate(`/dashboard/quizzes/${quizData.id}`);
    }, 2000);
  };

  const currentQuestionData = quizData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.totalQuestions) * 100;
  
  const isFirstQuestion = currentQuestion === 0;
  const isLastQuestion = currentQuestion === quizData.questions.length - 1;
  
  const getFlaggedCount = () => {
    return answers.filter(a => a.flagged).length;
  };

  const getAnsweredCount = () => {
    return answers.filter(a => {
      if (a.type === "single") return a.answer !== null;
      if (a.type === "multiple") return (a.answers && a.answers.length > 0);
      return false;
    }).length;
  };

  // Calculate pagination
  const totalPages = Math.ceil(quizData.totalQuestions / questionsPerPage);
  const currentPageQuestions = quizData.questions.slice(
    (currentPage - 1) * questionsPerPage, 
    currentPage * questionsPerPage
  );

  // If submitting, show a loading state
  if (isSubmitting) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-bold mb-4">Enviando respuestas...</h2>
            <Progress value={100} className="h-2 mb-4" />
            <p className="text-muted-foreground mb-4">
              Por favor espera mientras procesamos tus respuestas...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quiz header with timer and progress */}
      <div className="sticky top-0 z-10 bg-background py-2 border-b">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold">{quizData.title}</h1>
            <div className="flex gap-4 text-sm items-center">
              <div className="flex gap-1 items-center">
                <span className="text-muted-foreground">Pregunta:</span>
                <span className="font-medium">{currentQuestion + 1} de {quizData.totalQuestions}</span>
              </div>
              <div className="flex gap-1 items-center">
                <span className="text-muted-foreground">Respondidas:</span>
                <span className="font-medium">{getAnsweredCount()} de {quizData.totalQuestions}</span>
              </div>
              <div className="flex gap-1 items-center">
                <Flag size={14} className="text-red-500" />
                <span className="font-medium">{getFlaggedCount()} marcadas</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className={`flex items-center gap-1 font-bold text-lg ${
              timer.minutes < 5 ? "text-red-500" : ""
            }`}>
              <Clock size={18} />
              <span>{String(timer.minutes).padStart(2, '0')}:{String(timer.seconds).padStart(2, '0')}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Tiempo restante
            </div>
          </div>
        </div>
        
        <Progress value={progress} className="h-1 mt-2" />
      </div>

      {/* Question content */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="font-medium">Pregunta {currentQuestion + 1}</div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex items-center gap-1 ${answers[currentQuestion]?.flagged ? "bg-red-50 text-red-600 hover:bg-red-100" : ""}`}
                    onClick={toggleFlagged}
                  >
                    <Flag size={14} />
                    {answers[currentQuestion]?.flagged ? "Desmarca" : ""}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{answers[currentQuestion]?.flagged ? "Desmarcar" : "Marcar"} para revisar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="text-lg mb-6">{currentQuestionData.text}</div>
          
          {currentQuestionData.type === "single" ? (
            <RadioGroup 
              value={answers[currentQuestion]?.answer || ""} 
              onValueChange={(value) => handleSingleAnswerChange(value)}
              className="space-y-3"
            >
              {currentQuestionData.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-accent">
                  <RadioGroupItem value={option.id} id={`q${currentQuestionData.id}-${option.id}`} />
                  <Label htmlFor={`q${currentQuestionData.id}-${option.id}`} className="flex-1 cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="space-y-3">
              {currentQuestionData.options.map((option) => (
                <div key={option.id} className="flex items-start space-x-3 border rounded-lg p-3 hover:bg-accent">
                  <Checkbox 
                    id={`q${currentQuestionData.id}-${option.id}`}
                    checked={(answers[currentQuestion]?.answers || []).includes(option.id)}
                    onCheckedChange={(checked) => 
                      handleMultipleAnswerChange(option.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={`q${currentQuestionData.id}-${option.id}`} className="flex-1 pt-0.5 cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </div>
          )}
          
          {timer.minutes < 5 && (
            <div className="mt-6 flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-md">
              <AlertTriangle size={18} />
              <span className="text-sm font-medium">¡Menos de 5 minutos restantes! Por favor finaliza pronto.</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Question navigation grid */}
      <Card>
        <CardContent className="p-4">
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
              const isAnswered = answer?.type === "single" 
                ? answer.answer !== null 
                : (answer?.answers && answer?.answers.length > 0);
              const isFlagged = answer?.flagged;
              const isSelected = currentQuestion === questionIndex;

              return (
                <Button 
                  key={question.id}
                  className={`
                    h-10 w-10 p-0 font-normal
                    ${isSelected ? "border-2 border-primary" : ""}
                    ${isAnswered ? "bg-green-100 hover:bg-green-200 text-green-800" : "bg-gray-100 hover:bg-gray-200"}
                    ${isFlagged ? "ring-2 ring-red-500" : ""}
                  `}
                  onClick={() => goToQuestion(questionIndex)}
                  variant="outline"
                >
                  {question.id}
                  {isFlagged && <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>}
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
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
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
                        setCurrentPage(i + 1);
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
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                  className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : ""}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={goToPreviousQuestion}
          disabled={isFirstQuestion}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
        </Button>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleFinishClick} 
            className="flex gap-2 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle size={16} /> Finalizar cuestionario
          </Button>
          
          {!isLastQuestion && (
            <Button onClick={goToNextQuestion} className="flex items-center">
              Siguiente <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
        <DialogContent>
          <DialogTitle>Finalizar cuestionario</DialogTitle>
          <DialogDescription>
            <p className="mb-4">¿Estás seguro de que deseas finalizar este cuestionario?</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total de preguntas</span>
                  <span className="font-medium">{quizData.totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Respondidas</span>
                  <span className="font-medium">{getAnsweredCount()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sin responder</span>
                  <span className="font-medium">{quizData.totalQuestions - getAnsweredCount()}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Preguntas marcadas</span>
                  <span className="font-medium">{getFlaggedCount()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tiempo restante</span>
                  <span className="font-medium">{String(timer.minutes).padStart(2, '0')}:{String(timer.seconds).padStart(2, '0')}</span>
                </div>
              </div>
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelFinish}>Cancelar</Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleConfirmFinish}>
              Confirmar y finalizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TakeQuiz;
