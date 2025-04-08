
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, FileQuestion, Trophy, AlertTriangle, Award, ArrowLeft } from "lucide-react";

const QuizDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Check for existing quiz results in localStorage (for demo purposes)
  const storedResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
  const quizAttempts = storedResults.filter((r: any) => r.quizId === parseInt(id || "1"));

  // Mock data for the quiz
  const quizData = {
    id: parseInt(id || "1"),
    title: "Fundamentos de la Gestión de Proyectos",
    description: "Este cuestionario evalúa tu comprensión de los principios básicos de la gestión de proyectos, metodologías, herramientas y mejores prácticas.",
    category: "Project Management",
    questions: 50,
    timeLimit: 60, // minutes
    attempts: quizAttempts.length,
    difficulty: "Principiante",
    lastScore: quizAttempts.length > 0 ? quizAttempts[0].score : null,
    bestScore: quizAttempts.length > 0 ? Math.max(...quizAttempts.map((a: any) => a.score)) : null,
    passingScore: 70,
    topics: [
      "Iniciación de proyectos",
      "Planificación de proyectos",
      "Ejecución de proyectos",
      "Monitoreo y control",
      "Cierre de proyectos"
    ],
    image: "https://placehold.co/1200x200?text=PM+Fundamentals",
    recentAttempts: quizAttempts
  };

  // Check if the quiz has been attempted
  const hasAttempts = quizData.attempts > 0;
  
  const startQuiz = () => {
    navigate(`/dashboard/quizzes/${id}/take`);
  };

  const goBack = () => {
    navigate('/dashboard/quizzes');
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="space-y-6">
      {/* Quiz Banner */}
      <div className="relative w-full h-48 rounded-lg overflow-hidden mb-6">
        <img 
          src={quizData.image} 
          alt={quizData.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute top-4 left-4 bg-black/40 hover:bg-black/60 text-white border-white/20"
            onClick={goBack}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{quizData.title}</h1>
          <div className="flex items-center gap-2 text-white/80 text-sm mt-2">
            <span className="bg-primary/80 text-white px-2 py-0.5 rounded text-xs font-medium">
              {quizData.category}
            </span>
            <span>•</span>
            <span>{quizData.difficulty}</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Quiz details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Descripción del cuestionario</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">{quizData.description}</p>
              
              <h3 className="font-medium mb-2">Temas evaluados</h3>
              <ul className="space-y-2 mb-6">
                {quizData.topics.map((topic, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Detalles</h3>
                  <div className="flex items-center gap-2">
                    <FileQuestion size={16} className="text-muted-foreground" />
                    <span className="text-sm">{quizData.questions} preguntas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-muted-foreground" />
                    <span className="text-sm">{quizData.timeLimit} minutos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy size={16} className="text-muted-foreground" />
                    <span className="text-sm">Puntuación para aprobar: {quizData.passingScore}%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Dificultad</h3>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block w-3 h-3 rounded-full ${
                      quizData.difficulty === "Principiante" ? "bg-green-500" : 
                      quizData.difficulty === "Intermedio" ? "bg-blue-500" : 
                      "bg-purple-500"
                    }`}></span>
                    <span className="text-sm">{quizData.difficulty}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {hasAttempts && (
            <Card>
              <CardHeader>
                <CardTitle>Intentos recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quizData.recentAttempts.map((attempt: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex flex-wrap justify-between items-center mb-3">
                        <div className="font-medium">{formatDate(attempt.date)}</div>
                        <div className={`font-medium ${
                          attempt.score >= quizData.passingScore ? "text-green-600" : "text-red-600"
                        }`}>
                          {attempt.score}%
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <Progress value={attempt.score} className="h-2" />
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-muted-foreground" />
                          <span>Tiempo: {attempt.timeSpent}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span>Correctas: {attempt.correctCount}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-red-600">✗</span>
                          <span>Incorrectas: {attempt.totalQuestions - attempt.correctCount}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="outline">Ver detalles</Button>
                        <Button size="sm" variant="outline">Ver respuestas</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Right column - Start quiz */}
        <div>
          <Card className="sticky top-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Comenzar cuestionario</h3>
              
              {hasAttempts ? (
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Mejor puntuación</span>
                    <span className={quizData.bestScore && quizData.bestScore >= quizData.passingScore ? "text-green-600" : "text-red-600"}>
                      {quizData.bestScore}%
                    </span>
                  </div>
                  <Progress value={quizData.bestScore || 0} className="h-2" />
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-6 text-amber-600">
                  <AlertTriangle size={16} />
                  <span className="text-sm">Aún no has realizado este cuestionario</span>
                </div>
              )}
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-muted-foreground" />
                    <span>Tiempo límite</span>
                  </div>
                  <span>{quizData.timeLimit} minutos</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <FileQuestion size={16} className="text-muted-foreground" />
                    <span>Preguntas</span>
                  </div>
                  <span>{quizData.questions} preguntas</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-muted-foreground" />
                    <span>Para aprobar</span>
                  </div>
                  <span>{quizData.passingScore}% o más</span>
                </div>
              </div>
              
              <Button 
                className="w-full"
                onClick={startQuiz}
                variant={hasAttempts ? "outline" : "default"}
              >
                {hasAttempts ? "Reintentar cuestionario" : "Comenzar cuestionario"}
              </Button>
              
              {hasAttempts && (
                <div className="text-center mt-2 text-xs text-muted-foreground">
                  {quizData.attempts} {quizData.attempts === 1 ? "intento" : "intentos"} realizado{quizData.attempts === 1 ? "" : "s"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuizDetail;
