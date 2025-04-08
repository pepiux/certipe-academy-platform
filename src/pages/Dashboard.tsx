
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  FileQuestion,
  Book,
  Award
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const Dashboard = () => {
  // Mock data for study progress chart
  const chartData = [
    { name: "Lun", hours: 2.5 },
    { name: "Mar", hours: 3.8 },
    { name: "Mié", hours: 1.2 },
    { name: "Jue", hours: 4.3 },
    { name: "Vie", hours: 3.0 },
    { name: "Sáb", hours: 5.5 },
    { name: "Dom", hours: 3.2 },
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

  // Mock data for your quizzes
  const yourQuizzes = [
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

      {/* Study Progress Chart */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Rendimiento reciente</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Quiz Results */}
        <Card className="lg:col-span-3">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Last PMP Practice Test</h3>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span>Puntuación general</span>
                <span className="font-medium">{recentQuiz.score}/{recentQuiz.total}</span>
              </div>
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
          </CardContent>
        </Card>

        {/* Your Quizzes */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Tus cuestionarios</h3>
            <div className="space-y-6">
              {yourQuizzes.map((quiz) => (
                <div key={quiz.id} className="space-y-2">
                  <h4 className="font-medium">{quiz.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {quiz.questions} questions · {quiz.duration} minutes
                  </p>
                  <div className="flex justify-between text-sm">
                    <span>Last Score:</span>
                    <span className={quiz.lastScore >= 70 ? "text-green-600" : "text-amber-600"}>
                      {quiz.lastScore}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Best Score:</span>
                    <span className="text-green-600">
                      {quiz.bestScore}%
                    </span>
                  </div>
                  <button className="w-full px-4 py-2 text-center text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors">
                    Start Quiz
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
