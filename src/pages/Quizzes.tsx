import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import QuizCard from "@/components/quiz/QuizCard";

const Quizzes = () => {
  const [currentTab, setCurrentTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const navigate = useNavigate();
  const itemsPerPage = 8;
  
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
  
  const categories = [...new Set(allQuizzes.map(quiz => quiz.category))];
  const difficulties = [...new Set(allQuizzes.map(quiz => quiz.difficulty))];
  
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };
  
  const handleDifficultyToggle = (difficulty: string) => {
    setSelectedDifficulties(prev => 
      prev.includes(difficulty) 
        ? prev.filter(d => d !== difficulty) 
        : [...prev, difficulty]
    );
  };
  
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedDifficulties([]);
  };
  
  const filteredQuizzes = allQuizzes.filter(quiz => {
    if (currentTab === "my" && quiz.attempts === 0) return false;
    if (currentTab === "popular" && quiz.questions <= 30) return false;
    
    if (searchQuery && !quiz.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    if (selectedCategories.length > 0 && !selectedCategories.includes(quiz.category)) return false;
    
    if (selectedDifficulties.length > 0 && !selectedDifficulties.includes(quiz.difficulty)) return false;
    
    return true;
  });
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQuizzes = filteredQuizzes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const startQuiz = (quizId: number) => {
    navigate(`/dashboard/quizzes/${quizId}`);
  };
  
  const handleApplyFilters = () => {
    setCurrentPage(1);
    setFiltersOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Cuestionarios</h1>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 w-full sm:w-[350px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar cuestionarios..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
                {(selectedCategories.length > 0 || selectedDifficulties.length > 0) && (
                  <span className="ml-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
                    {selectedCategories.length + selectedDifficulties.length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
                <SheetDescription>
                  Filtrar cuestionarios por categoría y dificultad
                </SheetDescription>
              </SheetHeader>
              <div className="py-6">
                <h3 className="font-medium mb-3">Categorías</h3>
                <div className="space-y-3">
                  {categories.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${category}`} 
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <Label htmlFor={`category-${category}`}>{category}</Label>
                    </div>
                  ))}
                </div>
                
                <h3 className="font-medium mb-3 mt-6">Dificultad</h3>
                <div className="space-y-3">
                  {difficulties.map(difficulty => (
                    <div key={difficulty} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`difficulty-${difficulty}`}
                        checked={selectedDifficulties.includes(difficulty)}
                        onCheckedChange={() => handleDifficultyToggle(difficulty)}
                      />
                      <Label htmlFor={`difficulty-${difficulty}`}>{difficulty}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline" onClick={resetFilters}>Restablecer</Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button onClick={handleApplyFilters}>Aplicar filtros</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

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

      {currentQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentQuizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              onStart={startQuiz}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron cuestionarios</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-start mt-8">
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
