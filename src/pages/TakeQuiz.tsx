
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Flag, ArrowLeft, ArrowRight, Save, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const TakeQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timer, setTimer] = useState({ minutes: 59, seconds: 59 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<any[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

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
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
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
              className={`flex items-center gap-1 ${answers[currentQuestion]?.flagged ? "bg-amber-50 text-amber-600 hover:bg-amber-100" : ""}`}
              onClick={toggleFlagged}
            >
              <Flag size={14} />
              {answers[currentQuestion]?.flagged ? "Desmarca" : "Marca"} para revisar
            </Button>
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
            <Button onClick={handleSubmitQuiz} className="flex gap-2 bg-green-600 hover:bg-green-700">
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
