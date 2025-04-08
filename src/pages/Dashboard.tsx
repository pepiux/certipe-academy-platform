
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Clock,
  FileQuestion,
  Book,
  Award,
  ChevronRight
} from "lucide-react";

const Dashboard = () => {
  // Mock data for recent quiz
  const recentQuiz = {
    title: "PMP Project Management Knowledge Areas",
    score: 78,
    total: 100,
    correct: 39,
    incorrect: 11,
    date: "May 15, 2023",
    timeSpent: "45 minutes"
  };

  // Mock data for your quizzes
  const quizzes = [
    {
      id: 1,
      title: "PMP Project Management Knowledge Areas",
      questions: 50,
      duration: 60,
      lastScore: 78,
      bestScore: 85,
    },
    {
      id: 2,
      title: "Agile and Scrum Fundamentals",
      questions: 30,
      duration: 45,
      lastScore: 64,
      bestScore: 72,
    },
    {
      id: 3,
      title: "Risk Management in Projects",
      questions: 25,
      duration: 30,
      lastScore: 92,
      bestScore: 92,
    },
  ];
  
  // Mock data for courses
  const courses = [
    {
      id: 1,
      title: "Fundamentos de Gestión de Proyectos",
      instructor: "María García",
      progress: 65,
      image: "https://placehold.co/400x200?text=Gestión+de+Proyectos"
    },
    {
      id: 2,
      title: "Metodologías Ágiles y Scrum",
      instructor: "Carlos Rodríguez",
      progress: 30,
      image: "https://placehold.co/400x200?text=Scrum"
    },
    {
      id: 3,
      title: "Certificación PMP: Guía Completa",
      instructor: "Javier López",
      progress: 10,
      image: "https://placehold.co/400x200?text=PMP"
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Panel de control</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Horas de estudio</p>
                <h3 className="text-2xl font-bold mt-1">24.5</h3>
                <p className="text-xs text-muted-foreground mt-1">Horas de estudio</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Cuestionarios completados</p>
                <h3 className="text-2xl font-bold mt-1">18</h3>
                <p className="text-xs text-muted-foreground mt-1">Cuestionarios completados</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-lg">
                <FileQuestion className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Puntuación media</p>
                <h3 className="text-2xl font-bold mt-1">78%</h3>
                <p className="text-xs text-muted-foreground mt-1">Puntuación media</p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <Award className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Materiales de aprendizaje</p>
                <h3 className="text-2xl font-bold mt-1">12</h3>
                <p className="text-xs text-muted-foreground mt-1">Materiales de aprendizaje</p>
              </div>
              <div className="bg-amber-100 p-2 rounded-lg">
                <Book className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Quiz Results */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Último cuestionario completado</h3>
            <div className="mb-4">
              <div className="text-base font-medium mb-2">{recentQuiz.title}</div>
              <div className="flex justify-between items-center mb-2">
                <span>Puntuación general</span>
                <span className="font-medium">{recentQuiz.score}/{recentQuiz.total}</span>
              </div>
              <Progress value={recentQuiz.score} className="h-2 mb-2" />
              <div className="flex gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Correcto: {recentQuiz.correct} ({Math.round(recentQuiz.correct / (recentQuiz.correct + recentQuiz.incorrect) * 100)}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">Incorrecto: {recentQuiz.incorrect} ({Math.round(recentQuiz.incorrect / (recentQuiz.correct + recentQuiz.incorrect) * 100)}%)</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 text-sm mt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tiempo empleado</span>
                <span>{recentQuiz.timeSpent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fecha</span>
                <span>{recentQuiz.date}</span>
              </div>
            </div>
            
            <Button className="w-full mt-4" variant="outline">
              Ver detalles del cuestionario
            </Button>
          </CardContent>
        </Card>

        {/* Your Quizzes */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Tus cuestionarios</h3>
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                Ver todos <ChevronRight size={16} />
              </Button>
            </div>
            <div className="space-y-4">
              {quizzes.map((quiz) => (
                <Card key={quiz.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <h4 className="font-medium line-clamp-1">{quiz.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {quiz.questions} preguntas · {quiz.duration} minutos
                    </p>
                    <div className="flex justify-between text-sm mt-2">
                      <span>Última nota:</span>
                      <span className={quiz.lastScore >= 70 ? "text-green-600" : "text-amber-600"}>
                        {quiz.lastScore}%
                      </span>
                    </div>
                    <Button className="w-full mt-3 py-1 h-auto" size="sm">
                      Iniciar cuestionario
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Your Courses */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Tus cursos</h3>
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                Ver todos <ChevronRight size={16} />
              </Button>
            </div>
            <div className="space-y-4">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="h-24 overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-medium line-clamp-1">{course.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Instructor: {course.instructor}
                    </p>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progreso</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-1" />
                    </div>
                    <Button className="w-full mt-3 py-1 h-auto" size="sm">
                      Continuar curso
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
