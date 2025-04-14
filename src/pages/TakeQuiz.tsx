
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"; // Importación del componente Progress
import { toast } from "sonner";
import QuizHeader from "@/components/quiz/QuizHeader";
import QuizQuestion from "@/components/quiz/QuizQuestion";
import QuizNavigation from "@/components/quiz/QuizNavigation";
import QuizControls from "@/components/quiz/QuizControls";

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

  const quizData = {
    id: parseInt(id || "1"),
    title: "Fundamentos de la Gestión de Proyectos",
    timeLimit: 60, // minutes
    totalQuestions: 78,
    questions: [
      ...Array.from({ length: 70 }, (_, i) => ({
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
      })),
      {
        id: 71,
        text: "Un ___ se enfoca en la tarea, mientras que un líder se preocupa por las personas.",
        type: "fill-blank",
        options: [
          { id: "a", text: "resultado" },
          { id: "b", text: "equipo" },
          { id: "c", text: "proyecto" },
          { id: "d", text: "jefe" }
        ],
        answer: null,
        answers: [],
        flagged: false,
        blankWord: "jefe"
      },
      {
        id: 72,
        text: "El ___ es el proceso de identificación, análisis, planificación de respuestas y control de los posibles eventos inciertos en un proyecto.",
        type: "fill-blank",
        options: [
          { id: "a", text: "control de cambios" },
          { id: "b", text: "plan de comunicación" },
          { id: "c", text: "análisis de recursos" },
          { id: "d", text: "gestión de riesgos" }
        ],
        answer: null,
        answers: [],
        flagged: false,
        blankWord: "gestión de riesgos"
      },
      {
        id: 73,
        text: "En la metodología ___, los proyectos se dividen en iteraciones cortas llamadas sprints.",
        type: "fill-blank",
        options: [
          { id: "a", text: "Cascada" },
          { id: "b", text: "Scrum" },
          { id: "c", text: "Kanban" },
          { id: "d", text: "PRINCE2" }
        ],
        answer: null,
        answers: [],
        flagged: false,
        blankWord: "Scrum"
      },
      {
        id: 74,
        text: "La ___ del proyecto debe incluir una declaración de alcance, los entregables, los supuestos y las restricciones del proyecto.",
        type: "fill-blank",
        options: [
          { id: "a", text: "acta de constitución" },
          { id: "b", text: "estructura de desglose" },
          { id: "c", text: "matriz RACI" },
          { id: "d", text: "línea base" }
        ],
        answer: null,
        answers: [],
        flagged: false,
        blankWord: "acta de constitución"
      },
      {
        id: 75,
        text: "El ___ es una herramienta visual que muestra la secuencia de actividades y sus dependencias en un proyecto.",
        type: "fill-blank",
        options: [
          { id: "a", text: "diagrama de Gantt" },
          { id: "b", text: "diagrama de flujo" },
          { id: "c", text: "diagrama de red" },
          { id: "d", text: "organigrama" }
        ],
        answer: null,
        answers: [],
        flagged: false,
        blankWord: "diagrama de red"
      },
      {
        id: 76,
        text: "La ___ es la técnica de estimar la duración o el costo de una actividad o proyecto utilizando datos históricos de actividades o proyectos similares.",
        type: "fill-blank",
        options: [
          { id: "a", text: "estimación paramétrica" },
          { id: "b", text: "estimación análoga" },
          { id: "c", text: "estimación por tres valores" },
          { id: "d", text: "estimación ascendente" }
        ],
        answer: null,
        answers: [],
        flagged: false,
        blankWord: "estimación análoga"
      },
      {
        id: 77,
        text: "La técnica de ___ ayuda a identificar las causas raíz de los problemas en un proyecto.",
        type: "fill-blank",
        options: [
          { id: "a", text: "análisis FODA" },
          { id: "b", text: "los cinco por qué" },
          { id: "c", text: "diagrama de Pareto" },
          { id: "d", text: "análisis de tendencias" }
        ],
        answer: null,
        answers: [],
        flagged: false,
        blankWord: "los cinco por qué"
      },
      {
        id: 78,
        text: "La ___ es la cantidad de tiempo que una actividad puede retrasarse sin afectar la fecha de finalización del proyecto.",
        type: "fill-blank",
        options: [
          { id: "a", text: "holgura total" },
          { id: "b", text: "holgura libre" },
          { id: "c", text: "ruta crítica" },
          { id: "d", text: "línea base del cronograma" }
        ],
        answer: null,
        answers: [],
        flagged: false,
        blankWord: "holgura total"
      }
    ]
  };

  useEffect(() => {
    if (!isInitialized && quizData.questions) {
      const initialAnswers = quizData.questions.map(q => {
        if (q.type === "single") {
          return { questionId: q.id, answer: q.answer, type: "single", flagged: q.flagged };
        } else if (q.type === "multiple") {
          return { questionId: q.id, answers: q.answers || [], type: "multiple", flagged: q.flagged };
        } else if (q.type === "fill-blank") {
          return { questionId: q.id, answer: q.answer, type: "fill-blank", flagged: q.flagged };
        }
        return { questionId: q.id, answer: null, type: q.type, flagged: q.flagged };
      });
      setAnswers(initialAnswers);
      setIsInitialized(true);
    }
  }, [quizData, isInitialized]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer.seconds > 0) {
          return { ...prevTimer, seconds: prevTimer.seconds - 1 };
        } else if (prevTimer.minutes > 0) {
          return { minutes: prevTimer.minutes - 1, seconds: 59 };
        } else {
          clearInterval(timerInterval);
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
      const nextPage = Math.floor(currentQuestion / questionsPerPage) + 1;
      if (nextPage !== currentPage) {
        setCurrentPage(nextPage);
      }
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
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
    
    setTimeout(() => {
      const correctCount = Math.floor(Math.random() * (quizData.questions.length + 1));
      const score = Math.round((correctCount / quizData.questions.length) * 100);
      
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
      
      navigate(`/dashboard/quizzes/${quizData.id}`);
    }, 2000);
  };

  const currentQuestionData = quizData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.totalQuestions) * 100;
  
  const isFirstQuestion = currentQuestion === 0;
  const isLastQuestion = currentQuestion === quizData.questions.length - 1;
  
  const getFlaggedCount = () => answers.filter(a => a.flagged).length;

  const getAnsweredCount = () => {
    return answers.filter(a => {
      if (a.type === "single" || a.type === "fill-blank") return a.answer !== null;
      if (a.type === "multiple") return (a.answers && a.answers.length > 0);
      return false;
    }).length;
  };

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
      <QuizHeader 
        title={quizData.title}
        currentQuestion={currentQuestion}
        totalQuestions={quizData.totalQuestions}
        answeredCount={getAnsweredCount()}
        flaggedCount={getFlaggedCount()}
        timer={timer}
      />

      <Card>
        <CardContent className="p-6">
          <QuizQuestion
            question={currentQuestionData}
            currentAnswer={answers[currentQuestion]}
            onSingleAnswerChange={handleSingleAnswerChange}
            onMultipleAnswerChange={handleMultipleAnswerChange}
            onToggleFlagged={toggleFlagged}
            timeWarning={timer.minutes < 5}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <QuizNavigation
            questions={quizData.questions}
            currentPage={currentPage}
            questionsPerPage={questionsPerPage}
            currentQuestion={currentQuestion}
            answers={answers}
            onQuestionSelect={goToQuestion}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      <QuizControls
        isFirstQuestion={isFirstQuestion}
        isLastQuestion={isLastQuestion}
        onPrevious={goToPreviousQuestion}
        onNext={goToNextQuestion}
        onFinish={handleFinishClick}
      />

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
