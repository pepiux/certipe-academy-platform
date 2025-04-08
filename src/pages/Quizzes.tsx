
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Clock, FileQuestion, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

const Quizzes = () => {
  const [currentTab, setCurrentTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const itemsPerPage = 8;
  
  // Mock data for quizzes
  const allQuizzes = [
    {
      id: 1,
      title: "Fundamentos de la Gestión de Proyectos",
      category: "Project Management",
      questions: 50,
      timeLimit: 60, // minutes
      attempts: 0,
      difficulty: "Principiante",
      lastScore: null,
      bestScore: null,
      image: "https://placehold.co/400x80?text=Proyecto"
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
      bestScore: 84,
      image: "https://placehold.co/400x80?text=Agile"
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
      bestScore: 68,
      image: "https://placehold.co/400x80?text=Riesgos"
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
      bestScore: 92,
      image: "https://placehold.co/400x80?text=PMP"
    },
    {
      id: 5,
      title: "Comunicación en Proyectos",
      category: "Communication",
      questions: 40,
      timeLimit: 50,
      attempts: 0,
      difficulty: "Principiante",
      lastScore: null,
      bestScore: null,
      image: "https://placehold.co/400x80?text=Comunicación"
    },
    {
      id: 6,
      title: "Gestión de Costos",
      category: "Cost Management",
      questions: 35,
      timeLimit: 40,
      attempts: 1,
      difficulty: "Intermedio",
      lastScore: 78,
      bestScore: 78,
      image: "https://placehold.co/400x80?text=Costos"
    },
    {
      id: 7,
      title: "Gestión de Adquisiciones",
      category: "Procurement",
      questions: 30,
      timeLimit: 35,
      attempts: 0,
      difficulty: "Intermedio",
      lastScore: null,
      bestScore: null,
      image: "https://placehold.co/400x80?text=Adquisiciones"
    },
    {
      id: 8,
      title: "Gestión de Stakeholders",
      category: "Stakeholder Management",
      questions: 25,
      timeLimit: 30,
      attempts: 1,
      difficulty: "Principiante",
      lastScore: 92,
      bestScore: 92,
      image: "https://placehold.co/400x80?text=Stakeholders"
    },
    {
      id: 9,
      title: "Agile Leadership",
      category: "Leadership",
      questions: 20,
      timeLimit: 25,
      attempts: 0,
      difficulty: "Avanzado",
      lastScore: null,
      bestScore: null,
      image: "https://placehold.co/400x80?text=Leadership"
    },
    {
      id: 10,
      title: "Herramientas de Project Management",
      category: "Tools",
      questions: 45,
      timeLimit: 50,
      attempts: 0,
      difficulty: "Intermedio",
      lastScore: null,
      bestScore: null,
      image: "https://placehold.co/400x80?text=Tools"
    }
  ];
  
  // Filter quizzes based on the selected tab
  const filteredQuizzes = allQuizzes.filter(quiz => {
    if (currentTab === "my") return quiz.attempts > 0;
    if (currentTab === "popular") return quiz.questions > 30;
    return true; // "all" tab
  });
  
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQuizzes = filteredQuizzes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const startQuiz = (quizId: number) => {
    navigate(`/dashboard/quizzes/${quizId}`);
  };

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
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Tabs and Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <Tabs value={currentTab} onValueChange={(value) => { setCurrentTab(value); setCurrentPage(1); }} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">Todos los cuestionarios</TabsTrigger>
            <TabsTrigger value="my">Mis cuestionarios</TabsTrigger>
            <TabsTrigger value="popular">Populares</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Ordenar por:</span>
          <Select defaultValue="recent">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Más recientes</SelectItem>
              <SelectItem value="questions">Más preguntas</SelectItem>
              <SelectItem value="az">A-Z</SelectItem>
              <SelectItem value="za">Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quizzes grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentQuizzes.map((quiz) => (
          <Card key={quiz.id}>
            {/* Quiz banner */}
            <div className="h-12 overflow-hidden border-b">
              <img src={quiz.image} alt={quiz.title} className="w-full h-full object-cover" />
            </div>
            
            <CardContent className="p-5">
              <div className="flex flex-col mb-3">
                <Badge variant="outline" className={`self-start mb-2 ${getDifficultyColor(quiz.difficulty)}`}>
                  {quiz.difficulty}
                </Badge>
                <div className="text-xs text-muted-foreground">{quiz.category}</div>
              </div>
              
              <h3 className="font-semibold mb-4 line-clamp-2">{quiz.title}</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex flex-col items-start gap-1">
                  <div className="flex items-center text-muted-foreground">
                    <FileQuestion size={14} className="mr-1" />
                    <span>Preguntas</span>
                  </div>
                  <span className="font-medium">{quiz.questions}</span>
                </div>
                
                {quiz.timeLimit && (
                  <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center text-muted-foreground">
                      <Clock size={14} className="mr-1" />
                      <span>Duración</span>
                    </div>
                    <span className="font-medium">{quiz.timeLimit} minutos</span>
                  </div>
                )}
              </div>
              
              {quiz.attempts > 0 ? (
                <div className="mb-4">
                  <div className="text-xs text-muted-foreground mb-2">
                    {quiz.attempts} {quiz.attempts === 1 ? "intento" : "intentos"} realizado{quiz.attempts === 1 ? "" : "s"}
                  </div>
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
              
              <Button 
                className="w-full" 
                variant={quiz.attempts > 0 ? "outline" : "default"}
                onClick={() => startQuiz(quiz.id)}
              >
                {quiz.attempts > 0 ? "Reintentar cuestionario" : "Comenzar cuestionario"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center gap-1">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <Button
                key={number}
                variant={number === currentPage ? "default" : "outline"}
                size="icon"
                className="w-8 h-8"
                onClick={() => paginate(number)}
              >
                {number}
              </Button>
            ))}
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Quizzes;
