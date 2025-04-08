
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Courses = () => {
  // Mock data for courses
  const courses = [
    {
      id: 1,
      title: "Fundamentos de Gestión de Proyectos",
      category: "Project Management",
      level: "Principiante",
      instructor: "María García",
      students: 245,
      image: "https://placehold.co/400x200?text=Gestión+de+Proyectos",
      progress: 0
    },
    {
      id: 2,
      title: "Metodologías Ágiles y Scrum",
      category: "Agile",
      level: "Intermedio",
      instructor: "Carlos Rodríguez",
      students: 189,
      image: "https://placehold.co/400x200?text=Scrum",
      progress: 65
    },
    {
      id: 3,
      title: "Gestión de Riesgos en Proyectos",
      category: "Risk Management",
      level: "Avanzado",
      instructor: "Ana Martínez",
      students: 132,
      image: "https://placehold.co/400x200?text=Gestión+de+Riesgos",
      progress: 25
    },
    {
      id: 4,
      title: "Certificación PMP: Guía Completa",
      category: "Certification",
      level: "Avanzado",
      instructor: "Javier López",
      students: 321,
      image: "https://placehold.co/400x200?text=PMP",
      progress: 10
    }
  ];

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
          <Button variant="outline">Filtros</Button>
        </div>
      </div>

      {/* Courses grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden flex flex-col">
            <div className="relative">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-[160px] object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className="bg-background/90 text-xs font-medium px-2 py-1 rounded">
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
                  <Button className="w-full mt-4" variant="outline">
                    Continuar
                  </Button>
                </div>
              ) : (
                <Button className="w-full mt-auto">
                  Iniciar curso
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Courses;
