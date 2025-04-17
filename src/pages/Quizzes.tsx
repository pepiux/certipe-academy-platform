
import React, { useState, useEffect } from "react";
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
import quizService from "@/services/quizService";
import { toast } from "sonner";

const Quizzes = () => {
  const [currentTab, setCurrentTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  
  const navigate = useNavigate();
  const itemsPerPage = 8;
  
  // Cargar los datos de los cuestionarios desde el backend
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Construir los parámetros de filtrado para la API
        const filters: Record<string, any> = {};
        if (searchQuery) {
          filters.search = searchQuery;
        }
        if (selectedDifficulties.length === 1) {
          filters.difficulty = selectedDifficulties[0];
        }
        if (selectedCategories.length === 1) {
          // Asumiendo que category_id podría ser requerido como número
          // Y que tendrías un mapeo de nombres a IDs
          filters.category = selectedCategories[0];
        }
        
        // Añadir paginación
        filters.page = currentPage;
        filters.per_page = itemsPerPage;
        
        // Realizar la petición
        const response = await quizService.getQuizzes(filters);
        console.log("Cuestionarios obtenidos:", response);
        
        // Formatear los datos para el componente
        const formattedQuizzes = response.data.map((quiz: any) => ({
          id: quiz.id,
          title: quiz.title,
          category: quiz.category || "Uncategorized",
          questions: quiz.total_questions || 0,
          timeLimit: quiz.duration_minutes || 30,
          attempts: quiz.attempts || 0,
          difficulty: quiz.difficulty_level || "General",
          lastScore: quiz.last_score,
          bestScore: quiz.best_score,
          image: quiz.image || `https://placehold.co/400x80?text=${encodeURIComponent(quiz.title)}`
        }));
        
        setQuizzes(formattedQuizzes);
        
        // Extraer categorías y niveles de dificultad únicos
        const uniqueCategories = [...new Set(response.data.map((q: any) => q.category).filter(Boolean))];
        const uniqueDifficulties = [...new Set(response.data.map((q: any) => q.difficulty_level).filter(Boolean))];
        
        setCategories(uniqueCategories);
        setDifficulties(uniqueDifficulties);
        
      } catch (err: any) {
        console.error("Error al obtener los cuestionarios:", err);
        setError(`Error al cargar los cuestionarios: ${err.message}`);
        toast.error("Error al cargar los cuestionarios");
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuizzes();
  }, [currentPage, searchQuery, selectedCategories, selectedDifficulties, currentTab]);
  
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
  
  // Filtrar cuestionarios basado en la pestaña actual
  const filteredQuizzes = quizzes.filter(quiz => {
    if (currentTab === "my" && quiz.attempts === 0) return false;
    if (currentTab === "popular" && quiz.questions <= 30) return false;
    
    return true;
  });
  
  const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);
  const currentQuizzes = filteredQuizzes.slice(0, itemsPerPage); // Ya paginado del backend
  
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

      {loading ? (
        <div className="text-center py-12">
          <p>Cargando cuestionarios...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          <p>{error}</p>
        </div>
      ) : currentQuizzes.length > 0 ? (
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
