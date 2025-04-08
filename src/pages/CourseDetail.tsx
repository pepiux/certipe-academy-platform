
import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, Users, Star, Award } from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams();
  
  // This would be fetched from an API in a real application
  const courseData = {
    id: parseInt(id || "1"),
    title: "Fundamentos de Gestión de Proyectos",
    description: "Este curso completo te llevará a través de todos los aspectos fundamentales de la gestión de proyectos. Aprenderás las metodologías más utilizadas, herramientas esenciales y mejores prácticas para gestionar proyectos de manera eficiente.",
    instructor: "María García",
    level: "Principiante",
    category: "Project Management",
    students: 245,
    rating: 4.8,
    totalReviews: 128,
    duration: "12 horas",
    lessons: 24,
    progress: 0,
    image: "https://placehold.co/800x400?text=Gestión+de+Proyectos",
    objectives: [
      "Comprender los principios fundamentales de la gestión de proyectos",
      "Dominar las metodologías tradicionales y ágiles",
      "Crear planes de proyecto efectivos y gestionar recursos",
      "Identificar y mitigar riesgos en los proyectos",
      "Aplicar herramientas y técnicas para el seguimiento y control de proyectos"
    ],
    modules: [
      {
        id: 1,
        title: "Introducción a la Gestión de Proyectos",
        lessons: [
          { id: 1, title: "¿Qué es un proyecto?", duration: "15:30", completed: false },
          { id: 2, title: "Roles en la gestión de proyectos", duration: "22:45", completed: false },
          { id: 3, title: "Ciclo de vida del proyecto", duration: "18:20", completed: false }
        ]
      },
      {
        id: 2,
        title: "Planificación de Proyectos",
        lessons: [
          { id: 4, title: "Definición de objetivos y alcance", duration: "25:10", completed: false },
          { id: 5, title: "Estimación de tiempos y recursos", duration: "30:15", completed: false },
          { id: 6, title: "Creación de cronogramas", duration: "28:40", completed: false }
        ]
      },
      {
        id: 3,
        title: "Seguimiento y Control",
        lessons: [
          { id: 7, title: "Indicadores de rendimiento", duration: "20:50", completed: false },
          { id: 8, title: "Gestión de cambios", duration: "19:30", completed: false },
          { id: 9, title: "Informes de estado", duration: "16:45", completed: false }
        ]
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="relative rounded-xl overflow-hidden">
        <img 
          src={courseData.image} 
          alt={courseData.title} 
          className="w-full h-[240px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
          <div className="text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-primary text-white text-xs font-medium px-2 py-1 rounded">
                {courseData.category}
              </span>
              <span className="bg-white/20 text-white text-xs font-medium px-2 py-1 rounded">
                {courseData.level}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{courseData.title}</h1>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{courseData.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen size={16} />
                <span>{courseData.lessons} lecciones</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={16} />
                <span>{courseData.students} estudiantes</span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                <span>{courseData.rating} ({courseData.totalReviews} reseñas)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side - Course content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="content">
            <TabsList className="mb-4">
              <TabsTrigger value="content">Contenido</TabsTrigger>
              <TabsTrigger value="overview">Información</TabsTrigger>
              <TabsTrigger value="reviews">Reseñas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-4">
              {courseData.modules.map((module) => (
                <Card key={module.id}>
                  <CardHeader className="py-3">
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="py-0">
                    {module.lessons.map((lesson) => (
                      <div 
                        key={lesson.id} 
                        className="flex items-center justify-between py-3 border-t"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center border ${lesson.completed ? 'bg-primary border-primary text-primary-foreground' : 'border-gray-300'}`}>
                            {lesson.completed && <span className="text-xs">✓</span>}
                          </div>
                          <div>
                            <p className={`text-sm ${lesson.completed ? 'text-muted-foreground line-through' : ''}`}>
                              {lesson.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {lesson.duration}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Ver
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="overview">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Descripción del curso</h3>
                  <p className="text-muted-foreground mb-6">{courseData.description}</p>
                  
                  <h3 className="font-semibold mb-2">Lo que aprenderás</h3>
                  <ul className="space-y-2 mb-6">
                    {courseData.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <h3 className="font-semibold mb-2">Instructor</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      {courseData.instructor.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{courseData.instructor}</p>
                      <p className="text-sm text-muted-foreground">Instructor Senior</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center p-8">
                    <h3 className="font-semibold mb-2">Reseñas del curso</h3>
                    <p className="text-muted-foreground">
                      Esta es una versión de demostración. Las reseñas estarán disponibles próximamente.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right side - Course actions */}
        <div>
          <Card className="sticky top-6">
            <CardContent className="p-6">
              {courseData.progress > 0 ? (
                <>
                  <h3 className="font-semibold mb-3">Tu progreso</h3>
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{courseData.progress}% completado</span>
                      <span>{Math.round(courseData.progress * courseData.lessons / 100)}/{courseData.lessons} lecciones</span>
                    </div>
                    <Progress value={courseData.progress} className="h-2" />
                  </div>
                  <Button className="w-full mb-3">
                    Continuar aprendiendo
                  </Button>
                  <Button variant="outline" className="w-full">
                    Ver material descargable
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="font-semibold mb-3">Inscríbete en este curso</h3>
                  <div className="mb-6 space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-muted-foreground" />
                      <span className="text-sm">Acceso de por vida</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award size={16} className="text-muted-foreground" />
                      <span className="text-sm">Certificado de finalización</span>
                    </div>
                  </div>
                  <Button className="w-full mb-3">
                    Comenzar ahora
                  </Button>
                  <Button variant="outline" className="w-full">
                    Añadir a favoritos
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
