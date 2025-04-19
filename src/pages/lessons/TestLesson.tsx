
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, AlertCircle, Check, X, HelpCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

interface Question {
  id: number;
  text: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

const TestLesson = () => {
  const { courseId, lessonId } = useParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean | null>(null);

  const lessonData = {
    id: parseInt(lessonId || "1"),
    title: "Evaluación de conceptos",
    description: "Comprueba tu comprensión de los conceptos fundamentales de la gestión de proyectos.",
    courseId: parseInt(courseId || "1"),
    duration: "15:00",
    nextLessonId: 10,
    prevLessonId: 8,
    questions: [
      {
        id: 1,
        text: "¿Qué es un proyecto?",
        options: [
          {
            id: "a",
            text: "Es la coordinación de personas y esfuerzos para conseguir un objetivo predefinido",
            isCorrect: false
          },
          {
            id: "b",
            text: "Es un conjunto de actividades asignadas a personas y empresas para producir un resultado de negocio",
            isCorrect: false
          },
          {
            id: "c",
            text: "Un esfuerzo temporal que se lleva a cabo para crear un producto, servicio o resultado único",
            isCorrect: true
          },
          {
            id: "d",
            text: "Es un grupo de tareas",
            isCorrect: false
          }
        ]
      },
      {
        id: 2,
        text: "¿Cuáles son las restricciones principales de un proyecto según el PMBOK?",
        options: [
          {
            id: "a",
            text: "Alcance, tiempo, costo y calidad",
            isCorrect: true
          },
          {
            id: "b",
            text: "Recursos, presupuesto y calendario",
            isCorrect: false
          },
          {
            id: "c",
            text: "Personas, procesos y tecnología",
            isCorrect: false
          },
          {
            id: "d",
            text: "Clientes, equipo y patrocinadores",
            isCorrect: false
          }
        ]
      },
      {
        id: 3,
        text: "¿Qué proceso NO forma parte del grupo de procesos de inicio?",
        options: [
          {
            id: "a",
            text: "Desarrollar el acta de constitución del proyecto",
            isCorrect: false
          },
          {
            id: "b",
            text: "Identificar a los interesados",
            isCorrect: false
          },
          {
            id: "c",
            text: "Desarrollar el plan para la dirección del proyecto",
            isCorrect: true
          },
          {
            id: "d",
            text: "Realizar el análisis de interesados",
            isCorrect: false
          }
        ]
      }
    ]
  };

  const questions: Question[] = lessonData.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setAnsweredCorrectly(null);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setAnsweredCorrectly(null);
    }
  };

  const handleSkipQuestion = () => {
    handleNextQuestion();
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer) return;
    
    const correctOption = currentQuestion.options.find(option => option.isCorrect);
    const isCorrect = correctOption?.id === selectedAnswer;
    
    setAnsweredCorrectly(isCorrect);
    setShowFeedback(true);
  };

  const getFeedbackMessage = () => {
    if (answeredCorrectly === true) {
      return "¡Correcto! Has seleccionado la respuesta adecuada.";
    } else if (answeredCorrectly === false) {
      const correctOption = currentQuestion.options.find(option => option.isCorrect);
      return `No está mal, pero no es la mejor respuesta. La opción correcta es: ${correctOption?.text}`;
    }
    return "";
  };

  return (
    <div className="container max-w-5xl mx-auto py-6">
      <div className="flex items-center mb-6">
        <Link to={`/dashboard/courses/${courseId}`} className="flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al curso
        </Link>
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{lessonData.title}</h1>
        <p className="text-muted-foreground">{lessonData.description}</p>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Pregunta {currentQuestionIndex + 1} de {questions.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-lg font-medium mb-6">
            Pregunta {currentQuestionIndex + 1}: {currentQuestion.text}
          </h2>
          
          <RadioGroup
            value={selectedAnswer || ""}
            onValueChange={setSelectedAnswer}
            className="space-y-3"
            disabled={showFeedback}
          >
            {currentQuestion.options.map((option) => (
              <div key={option.id} className={`flex items-center space-x-2 p-3 rounded-md border ${
                showFeedback && option.id === selectedAnswer && !answeredCorrectly
                  ? 'border-red-500 bg-red-50'
                  : showFeedback && option.isCorrect
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200'
              }`}>
                <RadioGroupItem
                  value={option.id}
                  id={`option-${option.id}`}
                  className="mt-0"
                />
                <Label
                  htmlFor={`option-${option.id}`}
                  className="flex-1 text-base font-normal"
                >
                  {option.text}
                </Label>
                {showFeedback && option.isCorrect && (
                  <Check className="h-5 w-5 text-green-500" />
                )}
                {showFeedback && option.id === selectedAnswer && !option.isCorrect && (
                  <X className="h-5 w-5 text-red-500" />
                )}
              </div>
            ))}
          </RadioGroup>
          
          {showFeedback && (
            <div className={`mt-4 p-4 rounded-md ${
              answeredCorrectly ? 'bg-green-50 text-green-900' : 'bg-blue-50 text-blue-900'
            }`}>
              <div className="flex items-start">
                {answeredCorrectly ? (
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                ) : (
                  <HelpCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                )}
                <p>{getFeedbackMessage()}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <div>
          <Button 
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="mr-2"
          >
            Anterior
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleSkipQuestion}
          >
            Saltar
          </Button>
        </div>
        
        <div>
          {!showFeedback ? (
            <Button 
              onClick={handleCheckAnswer}
              disabled={!selectedAnswer}
            >
              Comprobar respuesta
            </Button>
          ) : (
            <Button 
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              {currentQuestionIndex === questions.length - 1 ? "Finalizar" : "Siguiente"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestLesson;
