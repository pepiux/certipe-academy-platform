import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
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
import CourseCard from "@/components/courses/CourseCard";
import { Course } from "@/services/courseService";

const Courses = () => {
  const [currentTab, setCurrentTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const coursesPerPage = 8;
  const navigate = useNavigate();
  
  const allCourses: Course[] = [
    {
      id: 1,
      title: "Fundamentos de Gestión de Proyectos",
      description: "Aprende los conceptos fundamentales de la gestión de proyectos y prepárate para certificaciones profesionales.",
      category: "Project Management",
      level: "Principiante",
      instructor: "María García",
      image: "https://placehold.co/400x200?text=Gestión+de+Proyectos",
      progress: 0,
      enrolled: false,
      lessons_count: 12,
      duration: "8 horas",
      favorite: false,
      modules: []
    },
    {
      id: 2,
      title: "Metodologías Ágiles y Scrum",
      description: "Domina las metodologías ágiles para equipos de alto rendimiento y desarrollo iterativo.",
      category: "Agile",
      level: "Intermedio",
      instructor: "Carlos Rodríguez",
      image: "https://placehold.co/400x200?text=Scrum",
      progress: 65,
      enrolled: true,
      lessons_count: 8,
      duration: "6 horas",
      favorite: true,
      modules: []
    },
    {
      id: 3,
      title: "Gestión de Riesgos en Proyectos",
      description: "Identifica, analiza y mitiga los riesgos en tus proyectos de forma efectiva.",
      category: "Risk Management",
      level: "Avanzado",
      instructor: "Ana Martínez",
      image: "https://placehold.co/400x200?text=Gestión+de+Riesgos",
      progress: 25,
      enrolled: true,
      lessons_count: 10,
      duration: "7 horas",
      favorite: false,
      modules: []
    },
    {
      id: 4,
      title: "Certificación PMP: Guía Completa",
      description: "Prepárate para obtener tu certificación PMP con esta guía completa y actualizada.",
      category: "Certification",
      level: "Avanzado",
      instructor: "Javier López",
      image: "https://placehold.co/400x200?text=PMP",
      progress: 10,
      enrolled: true,
      lessons_count: 20,
      duration: "15 horas",
      favorite: true,
      modules: []
    },
    {
      id: 5,
      title: "Introducción a PMI-ACP",
      description: "Conoce los fundamentos de la certificación PMI-ACP y cómo aplicarla en tus proyectos ágiles.",
      category: "Agile",
      level: "Intermedio",
      instructor: "Laura Sánchez",
      image: "https://placehold.co/400x200?text=PMI-ACP",
      progress: 0,
      enrolled: false,
      lessons_count: 14,
      duration: "10 horas",
      favorite: false,
      modules: []
    },
    {
      id: 6,
      title: "Liderazgo en Equipos de Proyecto",
      description: "Desarrolla tus habilidades de liderazgo y gestiona equipos de proyecto de alto rendimiento.",
      category: "Leadership",
      level: "Intermedio",
      instructor: "Diego Ramírez",
      image: "https://placehold.co/400x200?text=Leadership",
      progress: 0,
      enrolled: false,
      lessons_count: 12,
      duration: "9 horas",
      favorite: false,
      modules: []
    },
    {
      id: 7,
      title: "MS Project Avanzado",
      description: "Domina las funciones avanzadas de MS Project y optimiza la gestión de tus proyectos.",
      category: "Tools",
      level: "Avanzado",
      instructor: "Gabriela Torres",
      image: "https://placehold.co/400x200?text=MS+Project",
      progress: 0,
      enrolled: false,
      lessons_count: 15,
      duration: "12 horas",
      favorite: false,
      modules: []
    },
    {
      id: 8,
      title: "Comunicación Efectiva en Proyectos",
      description: "Mejora tus habilidades de comunicación y facilita la colaboración en tus proyectos.",
      category: "Soft Skills",
      level: "Principiante",
      instructor: "Fernando Morales",
      image: "https://placehold.co/400x200?text=Comunicación",
      progress: 0,
      enrolled: false,
      lessons_count: 8,
      duration: "5 horas",
      favorite: false,
      modules: []
    },
    {
      id: 9,
      title: "Análisis de Negocio para Proyectos",
      description: "Aprende a realizar un análisis de negocio efectivo para la planificación de tus proyectos.",
      category: "Business Analysis",
      level: "Intermedio",
      instructor: "Carla Vega",
      image: "https://placehold.co/400x200?text=Business+Analysis",
      progress: 0,
      enrolled: false,
      lessons_count: 10,
      duration: "8 horas",
      favorite: false,
      modules: []
    },
    {
      id: 10,
      title: "Gestión de Beneficios en Proyectos",
      description: "Maximiza el valor de tus proyectos mediante una gestión de beneficios efectiva.",
      category: "Benefits Management",
      level: "Avanzado",
      instructor: "Ricardo Fuentes",
      image: "https://placehold.co/400x200?text=Benefits+Management",
      progress: 0,
      enrolled: false,
      lessons_count: 12,
      duration: "9 horas",
      favorite: false,
      modules: []
    },
    {
      id: 11,
      title: "Kanban para la Gestión de Proyectos",
      description: "Implementa Kanban en tus proyectos y mejora la eficiencia de tu equipo.",
      category: "Agile",
      level: "Principiante",
      instructor: "Sofía Mendoza",
      image: "https://placehold.co/400x200?text=Kanban",
      progress: 0,
      enrolled: false,
      lessons_count: 6,
      duration: "4 horas",
      favorite: false,
      modules: []
    },
    {
      id: 12,
      title: "Prince2 Foundation",
      description: "Obtén una base sólida en la metodología Prince2 con este curso introductorio.",
      category: "Methodology",
      level: "Principiante",
      instructor: "Pablo Herrera",
      image: "https://placehold.co/400x200?text=Prince2",
      progress: 0,
      enrolled: false,
      lessons_count: 14,
      duration: "10 horas",
      favorite: false,
      modules: []
    }
  ];
  
  const categories = [...new Set(allCourses.map(course => course.category))];
  const levels = [...new Set(allCourses.map(course => course.level))];
  
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };
  
  const handleLevelToggle = (level: string) => {
    setSelectedLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level) 
        : [...prev, level]
    );
  };
  
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedLevels([]);
  };
  
  const filteredCourses = allCourses.filter(course => {
    if (currentTab === "my" && !course.enrolled) return false;
    if (currentTab === "favorites" && !course.favorite) return false;
    
    if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    if (selectedCategories.length > 0 && !selectedCategories.includes(course.category || '')) return false;
    
    if (selectedLevels.length > 0 && !selectedLevels.includes(course.level || '')) return false;
    
    return true;
  });
  
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const startCourse = (courseId: number) => {
    navigate(`/dashboard/courses/${courseId}`);
  };

  const continueCourse = (courseId: number) => {
    navigate(`/dashboard/courses/${courseId}`);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Cursos</h1>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 w-full sm:w-[350px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar cursos..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <Tabs value={currentTab} onValueChange={(value) => { setCurrentTab(value); setCurrentPage(1); }} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">Todos los cursos</TabsTrigger>
            <TabsTrigger value="my">Mis cursos</TabsTrigger>
            <TabsTrigger value="favorites">Favoritos</TabsTrigger>
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
              <SelectItem value="popular">Más populares</SelectItem>
              <SelectItem value="az">A-Z</SelectItem>
              <SelectItem value="za">Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {currentCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onStart={startCourse}
              onContinue={continueCourse}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron cursos</p>
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

export default Courses;
