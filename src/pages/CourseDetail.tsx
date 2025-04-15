import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, Users, Star, Award, ChevronDown, Play, FileText, FileAudio, Heart, Check } from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [expandedModule, setExpandedModule] = useState<number | null>(1);

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
    progress: 35,
    currentLessonId: 5,
    completedLessons: 4,
    studyHours: 4.5,
    lastQuizScore: 90,
    enrollmentStatus: "enrolled",
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
          { id: 1, title: "¿Qué es un proyecto?", duration: "15:30", completed: true, type: "video" },
          { id: 2, title: "Roles en la gestión de proyectos", duration: "22:45", completed: true, type: "video" },
          { id: 3, title: "Ciclo de vida del proyecto", duration: "18:20", completed: true, type: "reading" }
        ]
      },
      {
        id: 2,
        title: "Planificación de Proyectos",
        lessons: [
          { id: 4, title: "Definición de objetivos y alcance", duration: "25:10", completed: true, type: "audio" },
          { id: 5, title: "Estimación de tiempos y recursos", duration: "30:15", completed: false, type: "video", description: "Aprende técnicas efectivas para estimar los recursos y tiempos necesarios para completar con éxito las tareas del proyecto." },
          { id: 6, title: "Creación de cronogramas", duration: "28:40", completed: false, type: "reading" }
        ]
      },
      {
        id: 3,
        title: "Seguimiento y Control",
        lessons: [
          { id: 7, title: "Indicadores de rendimiento", duration: "20:50", completed: false, type: "video" },
          { id: 8, title: "Gestión de cambios", duration: "19:30", completed: false, type: "reading" },
          { id: 9, title: "Informes de estado", duration: "16:45", completed: false, type: "audio" }
        ]
      }
    ]
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const toggleModule = (moduleId: number) => {
    if (expandedModule === moduleId) {
      setExpandedModule(null);
    } else {
      setExpandedModule(moduleId);
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'reading':
        return <FileText className="h-4 w-4 text-muted-foreground" />;
      case 'audio':
        return <FileAudio className="h-4 w-4 text-muted-foreground" />;
      case 'video':
      default:
        return <Play className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const isCurrentLesson = (lessonId: number) => {
    return lessonId === courseData.currentLessonId;
  };

  const handleContinue = () => {
    console.log("Continue learning from lesson ID:", courseData.currentLessonId);
  };

  const handleStartCourse = () => {
    console.log("Starting course:", courseData.id);
  };

  const getLessonAction = (lesson: { id: number; completed: boolean }) => {
    if (lesson.completed) {
      return (
        <Button variant="outline" size="sm" className="w-28">
          Repasar
        </Button>
      );
    }
    
    if (isCurrentLesson(lesson.id)) {
      return (
        <Button size="sm" className="w-28">
          Continuar
        </Button>
      );
    }
    
    return (
      <Button variant="ghost" size="sm" className="w-28">
        Vista previa
      </Button>
    );
  };

  return (
    <div className="space-y-6">
      <div className="relative rounded-xl overflow-hidden">
        <img 
          src={courseData.image} 
          alt={courseData.title} 
          className="w-full h-[240px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
          <div className="text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-primary/10 text-white text-xs font-medium px-2 py-1 rounded">
                {courseData.level}
              </span>
              <span className="bg-white/20 text-white text-xs font-medium px-2 py-1 rounded">
                {courseData.category}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{courseData.title}</h1>
            <div className="flex items-center gap-4 text-sm">
              <span>Por {courseData.instructor}</span>
              <div className="flex items-center gap-1">
                <BookOpen size={16} />
                <span>{courseData.lessons} lecciones</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{courseData.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Información</TabsTrigger>
              <TabsTrigger value="content">Contenido</TabsTrigger>
              <TabsTrigger value="stats">Estadísticas</TabsTrigger>
            </TabsList>
            
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
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      {courseData.instructor.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{courseData.instructor}</p>
                      <p className="text-sm text-muted-foreground">Instructor Senior</p>
                    </div>
                  </div>

                  <h3 className="font-semibold mb-2">Valoraciones</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(courseData.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm">
                      {courseData.rating} ({courseData.totalReviews} reseñas)
                    </span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="content">
              <Card>
                <CardContent className="p-0">
                  {courseData.modules.map((module) => (
                    <div key={module.id} className="border-b last:border-b-0">
                      <button
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                        onClick={() => toggleModule(module.id)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">{module.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {module.lessons.length} lecciones
                          </span>
                        </div>
                        <ChevronDown 
                          className={`h-4 w-4 transition-transform ${
                            expandedModule === module.id ? 'rotate-180' : ''
                          }`} 
                        />
                      </button>
                      <div className={`px-4 ${expandedModule === module.id ? 'block' : 'hidden'}`}>
                        {module.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className={`grid grid-cols-12 gap-4 items-center py-3 border-t ${
                              isCurrentLesson(lesson.id) ? 'bg-slate-50' : ''
                            }`}
                          >
                            <div className="col-span-5 flex items-center gap-3">
                              <div className="flex-shrink-0">
                                {getLessonIcon(lesson.type)}
                              </div>
                              <span className="text-sm font-medium">{lesson.title}</span>
                            </div>
                            <div className="col-span-2 text-center">
                              <span className="text-sm text-muted-foreground">
                                {lesson.duration}
                              </span>
                            </div>
                            <div className="col-span-3 flex justify-center">
                              {getLessonAction(lesson)}
                            </div>
                            <div className="col-span-2 flex justify-center">
                              {lesson.completed && (
                                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Check className="h-3 w-3 text-primary" />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        {isCurrentLesson(
                          module.lessons.find(l => l.id === courseData.currentLessonId)?.id || 0
                        ) && (
                          <div className="p-3 bg-slate-50 text-sm border-t">
                            <p>{
                              module.lessons.find(
                                l => l.id === courseData.currentLessonId
                              )?.description
                            }</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas del curso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progreso del contenido</span>
                        <span>{courseData.completedLessons}/{courseData.lessons} lecciones</span>
                      </div>
                      <Progress value={(courseData.completedLessons / courseData.lessons) * 100} className="h-2" />
                      <p className="text-sm text-muted-foreground mt-1">
                        Has completado el {Math.round((courseData.completedLessons / courseData.lessons) * 100)}% del curso
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock size={16} className="text-primary" />
                          <h4 className="font-medium">Tiempo de estudio</h4>
                        </div>
                        <p className="text-2xl font-bold">{courseData.studyHours} horas</p>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Award size={16} className="text-primary" />
                          <h4 className="font-medium">Último examen</h4>
                        </div>
                        <p className="text-2xl font-bold">{courseData.lastQuizScore}%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
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
                  <Button className="w-full mb-3" onClick={handleContinue}>
                    Continuar aprendiendo
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={toggleFavorite}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    {isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
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
                  <Button className="w-full mb-3" onClick={handleStartCourse}>
                    Comenzar ahora
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={toggleFavorite}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    {isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
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
