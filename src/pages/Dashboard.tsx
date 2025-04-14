import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  FileQuestion,
  Book,
  Award,
  ChevronRight
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();

  // Mock data for charts
  const studyHoursData = [
    { name: 'Lun', hours: 2.5 },
    { name: 'Mar', hours: 1.8 },
    { name: 'Mié', hours: 3.2 },
    { name: 'Jue', hours: 2.0 },
    { name: 'Vie', hours: 2.8 },
    { name: 'Sáb', hours: 4.5 },
    { name: 'Dom', hours: 3.6 },
  ];

  const scoreProgressData = [
    { name: 'Semana 1', score: 65 },
    { name: 'Semana 2', score: 68 },
    { name: 'Semana 3', score: 72 },
    { name: 'Semana 4', score: 78 },
    { name: 'Semana 5', score: 82 },
    { name: 'Semana 6', score: 78 },
    { name: 'Semana 7', score: 85 },
  ];

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

  // Mock data for quizzes
  const quizzes = [
    {
      id: 1,
      title: "PMP Project Management Knowledge Areas",
      description: "Test your knowledge of the 10 PMI knowledge areas",
      questions: 50,
      duration: 60,
      lastScore: 78,
      bestScore: 85,
      image: "https://placehold.co/400x100?text=PMP+Knowledge+Areas",
      color: "from-purple-400 to-purple-600",
    },
    {
      id: 2,
      title: "Agile and Scrum Fundamentals",
      description: "Master the basics of Agile methodology and Scrum framework",
      questions: 30,
      duration: 45,
      lastScore: 64,
      bestScore: 72,
      image: "https://placehold.co/400x100?text=Agile+Scrum",
      color: "from-blue-400 to-blue-600",
    },
    {
      id: 3,
      title: "Risk Management in Projects",
      description: "Identify, analyze, and respond to project risks",
      questions: 25,
      duration: 30,
      lastScore: 92,
      bestScore: 92,
      image: "https://placehold.co/400x100?text=Risk+Management",
      color: "from-emerald-400 to-emerald-600",
    },
    {
      id: 4,
      title: "Project Stakeholder Management",
      description: "Learn to effectively manage project stakeholders",
      questions: 35,
      duration: 40,
      lastScore: 80,
      bestScore: 85,
      image: "https://placehold.co/400x100?text=Stakeholder+Management",
      color: "from-amber-400 to-amber-600",
    },
  ];
  
  // Mock data for courses
  const courses = [
    {
      id: 1,
      title: "Fundamentos de Gestión de Proyectos",
      instructor: "María García",
      progress: 65,
      image: "https://placehold.co/400x200?text=Gestión+de+Proyectos",
      color: "from-indigo-400 to-indigo-600",
    },
    {
      id: 2,
      title: "Metodologías Ágiles y Scrum",
      instructor: "Carlos Rodríguez",
      progress: 30,
      image: "https://placehold.co/400x200?text=Scrum",
      color: "from-sky-400 to-sky-600",
    },
    {
      id: 3,
      title: "Certificación PMP: Guía Completa",
      instructor: "Javier López",
      progress: 10,
      image: "https://placehold.co/400x200?text=PMP",
      color: "from-rose-400 to-rose-600",
    },
    {
      id: 4,
      title: "Gestión de Riesgos en Proyectos",
      instructor: "Laura Martínez",
      progress: 50,
      image: "https://placehold.co/400x200?text=Riesgos",
      color: "from-emerald-400 to-emerald-600",
    },
  ];

  const handleStartQuiz = (quizId: number) => {
    navigate(`/dashboard/quizzes/${quizId}/take`);
  };

  const handleContinueCourse = (courseId: number) => {
    navigate(`/dashboard/courses/${courseId}`);
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Study Hours Chart */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Horas de estudio diarias</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={studyHoursData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="hours" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Score Progress Chart */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Progreso de puntuación</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#8B5CF6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quiz Results */}
      <Card className="mb-6">
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
          
          <Button className="w-full mt-4" variant="outline" onClick={() => navigate(`/dashboard/quizzes/1`)}>
            Ver detalles del cuestionario
          </Button>
        </CardContent>
      </Card>

      {/* Your Courses Section - Moved up before Quizzes */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Tus cursos</h2>
          <Button variant="ghost" size="sm" className="gap-1 text-primary" onClick={() => navigate('/dashboard/courses')}>
            Ver todos <ChevronRight size={16} />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden quiz-card">
              <div className={`quiz-card-banner bg-gradient-to-r from-purple-700 to-purple-500`}></div>
              <div className="h-32 overflow-hidden">
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
                <Button 
                  className="w-full mt-3 py-1 h-auto bg-purple-600 hover:bg-purple-600 text-white" 
                  size="sm"
                  onClick={() => handleContinueCourse(course.id)}
                >
                  {course.progress > 0 ? "Continuar curso" : "Iniciar curso"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Your Quizzes Section - Moved down after Courses */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Tus cuestionarios</h2>
          <Button variant="ghost" size="sm" className="gap-1 text-primary" onClick={() => navigate('/dashboard/quizzes')}>
            Ver todos <ChevronRight size={16} />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="overflow-hidden quiz-card">
              <div className={`quiz-card-banner bg-gradient-to-r from-purple-700 to-purple-500`}></div>
              <div className="h-24 overflow-hidden">
                <img 
                  src={quiz.image} 
                  alt={quiz.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h4 className="font-medium line-clamp-1">{quiz.title}</h4>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2 h-10">
                  {quiz.description}
                </p>
                <div className="flex gap-3 mt-2">
                  <div className="flex items-center gap-1 text-xs">
                    <FileQuestion size={14} className="text-muted-foreground" />
                    <span>{quiz.questions} preguntas</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Clock size={14} className="text-muted-foreground" />
                    <span>{quiz.duration} minutos</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span>Última nota:</span>
                  <span className={quiz.lastScore >= 70 ? "text-green-600" : "text-amber-600"}>
                    {quiz.lastScore}%
                  </span>
                </div>
                <Button 
                  className="w-full mt-3 py-1 h-auto bg-purple-600 hover:bg-purple-600 text-white" 
                  size="sm"
                  onClick={() => handleStartQuiz(quiz.id)}
                >
                  Iniciar cuestionario
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
