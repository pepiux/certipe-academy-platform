
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Clock, FileQuestion } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Quizzes = () => {
  // Mock data for quizzes
  const quizzes = [
    {
      id: 1,
      title: "Fundamentos de la Gestión de Proyectos",
      category: "Project Management",
      questions: 50,
      timeLimit: 60, // minutes
      attempts: 0,
      difficulty: "Principiante",
      lastScore: null,
      bestScore: null
    },
    {
      id: 2,
      title: "Metodologías Ágiles y Scrum",
      category: "Agile",
      questions: 30,
      timeLimit: 45,
      attempts: 2,
      difficulty: "Intermedio",
      lastScore: 72,
      bestScore: 84
    },
    {
      id: 3,
      title: "Gestión de Riesgos en Proyectos",
      category: "Risk Management",
      questions: 25,
      timeLimit: 30,
      attempts: 1,
      difficulty: "Avanzado",
      lastScore: 68,
      bestScore: 68
    },
    {
      id: 4,
      title: "Certificación PMP: Práctica Oficial",
      category: "Certification",
      questions: 100,
      timeLimit: 120,
      attempts: 3,
      difficulty: "Avanzado",
      lastScore: 85,
      bestScore: 92
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Principiante":
        return "bg-green-100 text-green-800";
      case "Intermedio":
        return "bg-blue-100 text-blue-800";
      case "Avanzado":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Cuestionarios</h1>
        
        {/* Search and filters */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar cuestionarios..."
              className="w-full pl-8 min-w-[200px]"
            />
          </div>
          <Button variant="outline">Filtros</Button>
        </div>
      </div>

      {/* Quizzes grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {quizzes.map((quiz) => (
          <Card key={quiz.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-3">
                <Badge variant="outline" className={`${getDifficultyColor(quiz.difficulty)}`}>
                  {quiz.difficulty}
                </Badge>
                <div className="text-xs text-muted-foreground">{quiz.category}</div>
              </div>
              
              <h3 className="font-semibold mb-4 line-clamp-2">{quiz.title}</h3>
              
              <div className="flex items-center justify-between mb-4 text-sm">
                <div className="flex items-center gap-1">
                  <FileQuestion size={16} className="text-muted-foreground" />
                  <span>{quiz.questions} preguntas</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} className="text-muted-foreground" />
                  <span>{quiz.timeLimit} minutos</span>
                </div>
              </div>
              
              {quiz.attempts > 0 ? (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Última puntuación</span>
                    <span className={quiz.lastScore && quiz.lastScore >= 80 ? "text-green-600" : "text-amber-600"}>
                      {quiz.lastScore}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Mejor puntuación</span>
                    <span className="text-green-600">{quiz.bestScore}%</span>
                  </div>
                </div>
              ) : (
                <div className="mb-4 text-sm text-muted-foreground">
                  No has intentado este cuestionario aún
                </div>
              )}
              
              <Button className="w-full">
                {quiz.attempts > 0 ? "Reintentar cuestionario" : "Comenzar cuestionario"}
              </Button>
              
              {quiz.attempts > 0 && (
                <div className="text-center mt-2 text-xs text-muted-foreground">
                  {quiz.attempts} {quiz.attempts === 1 ? "intento" : "intentos"} realizado{quiz.attempts === 1 ? "" : "s"}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Quizzes;
