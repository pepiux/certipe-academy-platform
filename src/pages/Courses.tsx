
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Courses = () => {
  const [currentTab, setCurrentTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8;
  
  // Mock data for courses
  const allCourses = [
    {
      id: 1,
      title: "Fundamentos de Gestión de Proyectos",
      category: "Project Management",
      level: "Principiante",
      instructor: "María García",
      students: 245,
      image: "https://placehold.co/400x200?text=Gestión+de+Proyectos",
      progress: 0,
      enrolled: false
    },
    {
      id: 2,
      title: "Metodologías Ágiles y Scrum",
      category: "Agile",
      level: "Intermedio",
      instructor: "Carlos Rodríguez",
      students: 189,
      image: "https://placehold.co/400x200?text=Scrum",
      progress: 65,
      enrolled: true
    },
    {
      id: 3,
      title: "Gestión de Riesgos en Proyectos",
      category: "Risk Management",
      level: "Avanzado",
      instructor: "Ana Martínez",
      students: 132,
      image: "https://placehold.co/400x200?text=Gestión+de+Riesgos",
      progress: 25,
      enrolled: true
    },
    {
      id: 4,
      title: "Certificación PMP: Guía Completa",
      category: "Certification",
      level: "Avanzado",
      instructor: "Javier López",
      students: 321,
      image: "https://placehold.co/400x200?text=PMP",
      progress: 10,
      enrolled: true
    },
    {
      id: 5,
      title: "Introducción a PMI-ACP",
      category: "Agile",
      level: "Intermedio",
      instructor: "Laura Sánchez",
      students: 176,
      image: "https://placehold.co/400x200?text=PMI-ACP",
      progress: 0,
      enrolled: false
    },
    {
      id: 6,
      title: "Liderazgo en Equipos de Proyecto",
      category: "Leadership",
      level: "Intermedio",
      instructor: "Diego Ramírez",
      students: 210,
      image: "https://placehold.co/400x200?text=Leadership",
      progress: 0,
      enrolled: false
    },
    {
      id: 7,
      title: "MS Project Avanzado",
      category: "Tools",
      level: "Avanzado",
      instructor: "Gabriela Torres",
      students: 150,
      image: "https://placehold.co/400x200?text=MS+Project",
      progress: 0,
      enrolled: false
    },
    {
      id: 8,
      title: "Comunicación Efectiva en Proyectos",
      category: "Soft Skills",
      level: "Principiante",
      instructor: "Fernando Morales",
      students: 198,
      image: "https://placehold.co/400x200?text=Comunicación",
      progress: 0,
      enrolled: false
    },
    {
      id: 9,
      title: "Análisis de Negocio para Proyectos",
      category: "Business Analysis",
      level: "Intermedio",
      instructor: "Carla Vega",
      students: 165,
      image: "https://placehold.co/400x200?text=Business+Analysis",
      progress: 0,
      enrolled: false
    },
    {
      id: 10,
      title: "Gestión de Beneficios en Proyectos",
      category: "Benefits Management",
      level: "Avanzado",
      instructor: "Ricardo Fuentes",
      students: 142,
      image: "https://placehold.co/400x200?text=Benefits+Management",
      progress: 0,
      enrolled: false
    },
    {
      id: 11,
      title: "Kanban para la Gestión de Proyectos",
      category: "Agile",
      level: "Principiante",
      instructor: "Sofía Mendoza",
      students: 178,
      image: "https://placehold.co/400x200?text=Kanban",
      progress: 0,
      enrolled: false
    },
    {
      id: 12,
      title: "Prince2 Foundation",
      category: "Methodology",
      level: "Principiante",
      instructor: "Pablo Herrera",
      students: 220,
      image: "https://placehold.co/400x200?text=Prince2",
      progress: 0,
      enrolled: false
    }
  ];
  
  // Filter courses based on the selected tab
  const filteredCourses = allCourses.filter(course => {
    if (currentTab === "my") return course.enrolled;
    if (currentTab === "popular") return course.students > 200;
    return true; // "all" tab
  });
  
  // Pagination logic
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const startCourse = (courseId: number) => {
    console.log(`Starting course with ID: ${courseId}`);
    // In a real app, you would navigate to the course page
  };

  const continueCourse = (courseId: number) => {
    console.log(`Continuing course with ID: ${courseId}`);
    // In a real app, you would navigate to the last viewed lesson
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Cursos</h1>
        
        {/* Search and filters */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar cursos..."
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
            <TabsTrigger value="all">Todos los cursos</TabsTrigger>
            <TabsTrigger value="my">Mis cursos</TabsTrigger>
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
              <SelectItem value="popular">Más populares</SelectItem>
              <SelectItem value="az">A-Z</SelectItem>
              <SelectItem value="za">Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Courses grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden flex flex-col">
            <div className="relative">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-[160px] object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className={`
                  text-xs font-medium px-2 py-1 rounded 
                  ${course.level === "Principiante" ? "bg-green-100 text-green-800" : 
                    course.level === "Intermedio" ? "bg-blue-100 text-blue-800" : 
                    "bg-purple-100 text-purple-800"}
                `}>
                  {course.level}
                </span>
              </div>
            </div>
            
            <CardContent className="flex-1 flex flex-col p-4">
              <div className="text-xs text-muted-foreground mb-1">{course.category}</div>
              <h3 className="font-semibold mb-2 line-clamp-2">{course.title}</h3>
              
              <div className="text-xs text-muted-foreground mb-4">
                Por {course.instructor} • {course.students} estudiantes
              </div>
              
              {course.progress > 0 ? (
                <div className="mt-auto">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progreso</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    variant="outline"
                    onClick={() => continueCourse(course.id)}
                  >
                    Continuar
                  </Button>
                </div>
              ) : (
                <Button 
                  className="w-full mt-auto"
                  onClick={() => startCourse(course.id)}
                >
                  {course.enrolled ? "Continuar curso" : "Iniciar curso"}
                </Button>
              )}
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

export default Courses;
