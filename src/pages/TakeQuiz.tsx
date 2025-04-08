
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Flag, ArrowLeft, ArrowRight, Save } from "lucide-react";

const TakeQuiz = () => {
  const { id } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timer, setTimer] = useState({ minutes: 59, seconds: 59 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock quiz data
  const quizData = {
    id: parseInt(id || "1"),
    title: "Fundamentos de la Gestión de Proyectos",
    timeLimit: 60, // minutes
    totalQuestions: 50,
    questions: [
      {
        id: 1,
        text: "¿Cuál de las siguientes NO es una restricción tradicional del triángulo de gestión de proyectos?",
        type: "single",
        options: [
          { id: "a", text: "Alcance" },
          { id: "b", text: "Tiempo" },
          { id: "c", text: "Costo" },
          { id: "d", text: "Recursos Humanos" }
        ],
        answer: null,
        flagged: false
      },
      {
        id: 2,
        text: "¿Cuál de estos documentos define formalmente la existencia de un proyecto y proporciona al gerente de proyecto la autoridad para usar recursos organizacionales en las actividades del proyecto?",
        type: "single",
        options: [
          { id: "a", text: "Acta de Constitución del Proyecto" },
          { id: "b", text: "Plan de Gestión del Proyecto" },
          { id: "c", text: "Declaración del Alcance" },
          { id: "d", text: "Estructura de Desglose del Trabajo (EDT)" }
        ],
        answer: null,
        flagged: false
      },
      {
        id: 3,
        text: "Seleccione las herramientas que se utilizan comúnmente en la estimación de la duración de las tareas en la gestión de proyectos:",
        type: "multiple",
        options: [
          { id: "a", text: "Estimación por tres valores (PERT)" },
          { id: "b", text: "Método de la ruta crítica" },
          { id: "c", text: "Análisis de reservas" },
          { id: "d", text: "Juicio de expertos" }
        ],
        answers: [],
        flagged: true
      },
      {
        id: 4,
        text: "¿Cuál de las siguientes NO es una técnica de resolución de conflictos en la gestión de proyectos?",
        type: "single",
        options: [
          { id: "a", text: "Evitar" },
          { id: "b", text: "Acomodar" },
          { id: "c", text: "Forzar" },
          { id: "d", text: "Delegar" }
        ],
        answer: null,
        flagged: false
      },
      {
        id: 5,
        text: "En la gestión de proyectos ágiles, ¿qué es un 'sprint'?",
        type: "single",
        options: [
          { id: "a", text: "Una reunión diaria donde el equipo reporta progreso" },
          { id: "b", text: "Un período fijo de tiempo en el que se completa trabajo específico" },
          { id: "c", text: "Una técnica para priorizar las características del producto" },
          { id: "d", text: "La fase final de un proyecto cuando se cumple el plazo" }
        ],
        answer: null,
        flagged: false
      },
    ]
  };

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
          setIsSubmitting(true);
          return { minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const handleSingleAnswerChange = (questionId: number, optionId: string) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[currentQuestion].answer = optionId;
    // In a real app, you would update your state here
  };

  const handleMultipleAnswerChange = (questionId: number, optionId: string, checked: boolean) => {
    const updatedQuestions = [...quizData.questions];
    const currentAnswers = updatedQuestions[currentQuestion].answers || [];
    
    if (checked) {
      updatedQuestions[currentQuestion].answers = [...currentAnswers, optionId];
    } else {
      updatedQuestions[currentQuestion].answers = currentAnswers.filter(id => id !== optionId);
    }
    // In a real app, you would update your state here
  };

  const toggleFlagged = () => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[currentQuestion].flagged = !updatedQuestions[currentQuestion].flagged;
    // In a real app, you would update your state here
  };

  const goToNextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuiz = () => {
    setIsSubmitting(true);
    // In a real app, you would submit the answers to your backend here
    // and redirect to a results page
  };

  const currentQuestionData = quizData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.totalQuestions) * 100;
  
  const isFirstQuestion = currentQuestion === 0;
  const isLastQuestion = currentQuestion === quizData.questions.length - 1;
  
  const getFlaggedCount = () => {
    return quizData.questions.filter(q => q.flagged).length;
  };

  const getAnsweredCount = () => {
    return quizData.questions.filter(q => {
      if (q.type === "single") return q.answer !== null;
      if (q.type === "multiple") return (q.answers && q.answers.length > 0) || false;
      return false;
    }).length;
  };

  // If submitting, show a loading state (in a real app this would redirect to results)
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
          <div>
            <h1 className="text-lg font-semibold">{quizData.title}</h1>
            <div className="flex gap-4 text-sm">
              <div className="flex gap-1 items-center">
                <span className="text-muted-foreground">Pregunta:</span>
                <span className="font-medium">{currentQuestion + 1} de {quizData.totalQuestions}</span>
              </div>
              <div className="flex gap-1 items-center">
                <span className="text-muted-foreground">Respondidas:</span>
                <span className="font-medium">{getAnsweredCount()} de {quizData.totalQuestions}</span>
              </div>
              <div className="flex gap-1 items-center">
                <Flag size={14} className="text-amber-500" />
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
            <Button
              variant="outline"
              size="sm"
              className={`flex items-center gap-1 ${currentQuestionData.flagged ? "bg-amber-50 text-amber-600 hover:bg-amber-100" : ""}`}
              onClick={toggleFlagged}
            >
              <Flag size={14} />
              {currentQuestionData.flagged ? "Desmarca" : "Marca"} para revisar
            </Button>
          </div>
          
          <div className="text-lg mb-6">{currentQuestionData.text}</div>
          
          {currentQuestionData.type === "single" ? (
            <RadioGroup 
              value={currentQuestionData.answer || ""} 
              onValueChange={(value) => handleSingleAnswerChange(currentQuestionData.id, value)}
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
                    checked={(currentQuestionData.answers || []).includes(option.id)}
                    onCheckedChange={(checked) => 
                      handleMultipleAnswerChange(currentQuestionData.id, option.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={`q${currentQuestionData.id}-${option.id}`} className="flex-1 pt-0.5 cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={goToPreviousQuestion}
          disabled={isFirstQuestion}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
        </Button>
        
        <div className="flex gap-2">
          {isLastQuestion ? (
            <Button onClick={submitQuiz} className="flex gap-2">
              <Save size={16} /> Finalizar cuestionario
            </Button>
          ) : (
            <Button onClick={goToNextQuestion}>
              Siguiente <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;
