import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, AlertCircle, Check, X, HelpCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import CourseContent from "@/components/courses/CourseContent";

interface Question {
  id: number;
  text: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation?: string;
}

interface TestResult {
  answers: Record<number, string>;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
}

const TestLesson = () => {
  const { courseId, lessonId } = useParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [completed, setCompleted] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [showCourseContent, setShowCourseContent] = useState(true);
  const [previouslyCompleted, setPreviouslyCompleted] = useState(false);

  const courseData = {
    id: parseInt(courseId || "1"),
    title: "Fundamentos de Gestión de Proyectos",
    modules: [
      {
        id: 1,
        title: "Introducción a la Gestión de Proyectos",
        lessons: [
          { id: 1, title: "¿Qué es un proyecto?", duration: "15:30", completed: true, type: "video" },
          { id: 2, title: "Roles en la gestión de proyectos", duration: "22:45", completed: true, type: "video" },
          { id: 3, title: "Ciclo de vida del proyecto", duration: "18:20", completed: true, type: "reading" }
        ]
      },
      {
        id: 2,
        title: "Planificación de Proyectos",
        lessons: [
          { id: 4, title: "Definición de objetivos y alcance", duration: "25:10", completed: false, type: "audio" },
          { id: 5, title: "Estimación de tiempos y recursos", duration: "30:15", completed: false, type: "video" },
          { id: 6, title: "Creación de cronogramas", duration: "28:40", completed: false, type: "reading" }
        ]
      },
      {
        id: 3,
        title: "Seguimiento y Control",
        lessons: [
          { id: 7, title: "Indicadores de rendimiento", duration: "20:50", completed: false, type: "video" },
          { id: 8, title: "Gestión de cambios", duration: "19:30", completed: false, type: "reading" },
          { id: 9, title: "Evaluación de conceptos", duration: "15:00", completed: false, type: "test" }
        ]
      }
    ]
  };

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
        ],
        explanation: "Un proyecto es un esfuerzo temporal que se lleva a cabo para crear un producto, servicio o resultado único. La naturaleza temporal de los proyectos indica que tienen un principio y un final definidos."
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
        ],
        explanation: "Las restricciones principales de un proyecto según el PMBOK (Project Management Body of Knowledge) son el alcance, tiempo, costo y calidad. Estas restricciones están interconectadas, lo que significa que un cambio en una afectará a las demás."
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
        ],
        explanation: "Desarrollar el plan para la dirección del proyecto NO forma parte del grupo de procesos de inicio, sino del grupo de procesos de planificación. Los procesos de inicio incluyen desarrollar el acta de constitución del proyecto e identificar a los interesados."
      }
    ]
  };

  const questions: Question[] = lessonData.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleNextQuestion = () => {
    // Save current answer
    if (selectedAnswer) {
      setUserAnswers({
        ...userAnswers,
        [currentQuestion.id]: selectedAnswer
      });
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(userAnswers[questions[currentQuestionIndex + 1].id] || null);
      setShowFeedback(false);
      setAnsweredCorrectly(null);
    } else {
      // All questions answered - calculate results
      completeTest();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      // Save current answer
      if (selectedAnswer) {
        setUserAnswers({
          ...userAnswers,
          [currentQuestion.id]: selectedAnswer
        });
      }
      
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(userAnswers[questions[currentQuestionIndex - 1].id] || null);
      setShowFeedback(false);
      setAnsweredCorrectly(null);
    }
  };

  const completeTest = () => {
    // Save final answer if present
    const finalAnswers = selectedAnswer 
      ? { ...userAnswers, [currentQuestion.id]: selectedAnswer } 
      : userAnswers;
      
    // Calculate score
    let correctCount = 0;
    questions.forEach(question => {
      const userAnswer = finalAnswers[question.id];
      const correctOption = question.options.find(option => option.isCorrect);
      
      if (userAnswer && correctOption && userAnswer === correctOption.id) {
        correctCount++;
      }
    });
    
    const score = Math.round((correctCount / questions.length) * 100);
    
    // Set test result
    setTestResult({
      answers: finalAnswers,
      score,
      totalQuestions: questions.length,
      correctAnswers: correctCount
    });
    
    setCompleted(true);
    
    // In a real app, this is where you'd send the result to the backend
    console.log('Test completed with score:', score);
  };

  const handleFinishTest = () => {
    completeTest();
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setUserAnswers({});
    setCompleted(false);
    setTestResult(null);
    setShowFeedback(false);
    setAnsweredCorrectly(null);
  };
  
  const findLessonById = (id: number) => {
    for (const module of courseData.modules) {
      const lesson = module.lessons.find(l => l.id === id);
      if (lesson) return lesson;
    }
    return null;
  };

  const toggleCourseContent = () => {
    setShowCourseContent(!showCourseContent);
  };

  const getCorrectAnswer = (question: Question) => {
    return question.options.find(option => option.isCorrect);
  };

  // If the test is completed, render results page
  if (completed && testResult) {
    return (
      <div className="flex h-full">
        <div className={`flex-grow transition-all ${showCourseContent ? 'max-w-[75%]' : 'max-w-full'}`}>
          <div className="container max-w-5xl mx-auto py-6">
            <div className="flex items-center mb-6">
              <Link to={`/dashboard/courses/${courseId}`} className="flex items-center text-sm text-muted-foreground hover:text-primary">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al curso
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto md:hidden"
                onClick={toggleCourseContent}
              >
                {showCourseContent ? 'Ocultar contenido' : 'Mostrar contenido'}
              </Button>
            </div>
            
            <div className="mb-6 text-left">
              <h1 className="text-2xl font-bold mb-2">{lessonData.title} - Resultados</h1>
              <p className="text-muted-foreground">Revisión de tus respuestas al cuestionario</p>
            </div>
            
            {/* Results summary */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">
                    Puntuación: {testResult.score}%
                  </h2>
                  <p>
                    Has respondido correctamente {testResult.correctAnswers} de {testResult.totalQuestions} preguntas
                  </p>
                </div>
                
                <Progress 
                  value={testResult.score} 
                  className={`h-2 mb-4 ${testResult.score >= 70 ? "bg-green-500" : "bg-red-500"}`}
                />
              </CardContent>
            </Card>
            
            {/* Questions review */}
            <div className="space-y-8 mb-8">
              {questions.map((question, index) => {
                const userAnswer = testResult.answers[question.id];
                const correctAnswer = getCorrectAnswer(question);
                const isCorrect = userAnswer === correctAnswer?.id;
                
                return (
                  <Card key={question.id} className="overflow-hidden">
                    <div className={`h-1 ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-medium mb-4">
                        Pregunta {index + 1}: {question.text}
                      </h3>
                      
                      <div className="space-y-3">
                        {question.options.map((option) => (
                          <div 
                            key={option.id} 
                            className={`flex items-center space-x-2 p-3 rounded-md border ${
                              option.id === userAnswer && !option.isCorrect
                                ? 'border-red-500 bg-red-50'
                                : option.isCorrect
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200'
                            }`}
                          >
                            <div className="w-5">
                              {option.id === userAnswer && (
                                <div className="h-3 w-3 rounded-full bg-blue-500" />
                              )}
                            </div>
                            <span className="flex-1 text-base font-normal">
                              {option.text}
                            </span>
                            {option.isCorrect && (
                              <Check className="h-5 w-5 text-green-500" />
                            )}
                            {option.id === userAnswer && !option.isCorrect && (
                              <X className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {question.explanation && (
                        <div className={`mt-4 p-4 bg-blue-50 text-blue-900 rounded-md`}>
                          <div className="flex items-start">
                            <HelpCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                            <p>{question.explanation}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline"
                onClick={() => window.history.back()}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Volver al curso
              </Button>
              
              <Button onClick={handleRestart}>
                Retomar evaluación
              </Button>
            </div>
          </div>
        </div>
        
        {/* Course Content Sidebar */}
        {showCourseContent ? (
          <div className="w-full md:w-1/4 border-l border-border bg-background h-screen overflow-y-auto p-4 fixed right-0 top-0 bottom-0 z-10 md:relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-left">Contenido del curso</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleCourseContent}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <CourseContent 
              modules={courseData.modules} 
              currentLessonId={parseInt(lessonId || "0")} 
              onLessonClick={(lessonId) => {
                const lesson = findLessonById(lessonId);
                if (lesson) {
                  window.location.href = `/dashboard/courses/${courseId}/lesson/${lessonId}/${lesson.type}`;
                }
              }}
            />
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={toggleCourseContent}
            className="fixed right-4 top-20 z-10 p-2 bg-background border border-border rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className={`flex-grow transition-all ${showCourseContent ? 'max-w-[75%]' : 'max-w-full'}`}>
        <div className="container max-w-5xl mx-auto py-6">
          <div className="flex items-center mb-6">
            <Link to={`/dashboard/courses/${courseId}`} className="flex items-center text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al curso
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-auto md:hidden"
              onClick={toggleCourseContent}
            >
              {showCourseContent ? 'Ocultar contenido' : 'Mostrar contenido'}
            </Button>
          </div>
          
          <div className="mb-6 text-left">
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
              <h2 className="text-lg font-medium mb-6 text-left">
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
                    showFeedback && option.id === selectedAnswer && !option.isCorrect
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
              
              {showFeedback && currentQuestion.explanation && (
                <div className={`mt-4 p-4 rounded-md bg-blue-50 text-blue-900`}>
                  <div className="flex items-start">
                    <HelpCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>{currentQuestion.explanation}</p>
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
            </div>
            
            <div>
              {currentQuestionIndex === questions.length - 1 ? (
                <Button 
                  onClick={handleFinishTest}
                  disabled={!selectedAnswer}
                >
                  Terminar
                </Button>
              ) : (
                <Button 
                  onClick={handleNextQuestion}
                >
                  Siguiente
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Content Sidebar */}
      {showCourseContent ? (
        <div className="w-full md:w-1/4 border-l border-border bg-background h-screen overflow-y-auto p-4 fixed right-0 top-0 bottom-0 z-10 md:relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-left">Contenido del curso</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleCourseContent}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <CourseContent 
            modules={courseData.modules} 
            currentLessonId={parseInt(lessonId || "0")} 
            onLessonClick={(lessonId) => {
              const lesson = findLessonById(lessonId);
              if (lesson) {
                window.location.href = `/dashboard/courses/${courseId}/lesson/${lessonId}/${lesson.type}`;
              }
            }}
          />
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={toggleCourseContent}
          className="fixed right-4 top-20 z-10 p-2 bg-background border border-border rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default TestLesson;
