
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCourse } from '@/hooks/useCourse';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, BookOpen, Clock, Award } from "lucide-react";
import CourseHeader from "@/components/courses/CourseHeader";
import CourseOverview from "@/components/courses/CourseOverview";
import CourseContent from "@/components/courses/CourseContent";
import CourseActions from "@/components/courses/CourseActions";
import { toast } from 'sonner';
import { Badge } from "@/components/ui/badge";

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  console.log("CourseDetail renderizándose con ID del curso:", id);
  
  const { course, loading, error } = useCourse(id);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (error) {
      console.error("Error al cargar el curso:", error);
      toast.error("No se pudo cargar el curso. Por favor, inténtelo de nuevo más tarde.");
    }
  }, [error]);

  console.log("Renderizando CourseDetail para el curso ID:", id);
  console.log("Datos del curso:", course);
  console.log("Estado de carga:", loading);
  console.log("Error:", error);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[400px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-[150px] w-full" />
            <Skeleton className="h-[150px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="space-y-6">
        <div className="flex items-center mb-6">
          <Link to="/dashboard" className="flex items-center text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al panel de control
          </Link>
        </div>
        <div className="text-center p-8 border rounded-lg bg-background shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Curso no encontrado o ID inválido.</h2>
          <p className="text-muted-foreground mb-6">El curso que estás buscando no existe o el ID proporcionado no es válido.</p>
          <Button variant="default" onClick={() => navigate('/dashboard')}>
            Volver al panel de control
          </Button>
        </div>
      </div>
    );
  }

  const modules = Array.isArray(course.modules) ? course.modules : [];

  const progress = course.progress || 0;
  const totalLessons = course.total_lessons || course.lessons_count || 0;
  
  // Función para contar los diferentes tipos de lecciones
  const countLessonTypes = () => {
    const counts = { videos: 0, readings: 0, audios: 0, tests: 0 };
    
    modules.forEach(module => {
      module.lessons.forEach(lesson => {
        switch(lesson.type) {
          case 'video':
            counts.videos++;
            break;
          case 'reading':
            counts.readings++;
            break;
          case 'audio':
            counts.audios++;
            break;
          case 'test':
            counts.tests++;
            break;
        }
      });
    });
    
    return counts;
  };
  
  const lessonCounts = countLessonTypes();
  
  // Función para manejar la navegación a una lección específica
  const handleLessonClick = (lessonId: number, lessonType: string) => {
    // Navegar a la página correspondiente según el tipo de lección
    switch(lessonType) {
      case 'video':
        navigate(`/dashboard/courses/${course.id}/lesson/${lessonId}/video`);
        break;
      case 'reading':
        navigate(`/dashboard/courses/${course.id}/lesson/${lessonId}/reading`);
        break;
      case 'audio':
        navigate(`/dashboard/courses/${course.id}/lesson/${lessonId}/audio`);
        break;
      case 'test':
        navigate(`/dashboard/courses/${course.id}/lesson/${lessonId}/test`);
        break;
      default:
        navigate(`/dashboard/courses/${course.id}/lesson/${lessonId}/video`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Link to="/dashboard" className="flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al panel de control
        </Link>
      </div>
      
      <CourseHeader
        title={course.title}
        description={course.description}
        image={course.image}
        level={course.level}
        category={course.category}
        instructor={course.instructor}
        lessons={course.lessons_count}
        duration={course.duration}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="overview">Descripción general</TabsTrigger>
              <TabsTrigger value="content">Contenido</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <CourseOverview
                description={course.description}
                instructor={course.instructor}
                level={course.level}
                duration={course.duration}
                requirements={course.requirements}
                whatYouWillLearn={course.what_you_will_learn}
              />
              
              {/* Contenido adicional en la pestaña de descripción */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Contenido del curso</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex flex-col items-center bg-background p-3 rounded-lg border">
                    <BookOpen className="h-6 w-6 text-primary mb-1" />
                    <span className="text-sm font-medium">{totalLessons} Lecciones</span>
                  </div>
                  <div className="flex flex-col items-center bg-background p-3 rounded-lg border">
                    <Clock className="h-6 w-6 text-primary mb-1" />
                    <span className="text-sm font-medium">{course.duration}</span>
                  </div>
                  {course.certification && (
                    <div className="flex flex-col items-center bg-background p-3 rounded-lg border">
                      <Award className="h-6 w-6 text-primary mb-1" />
                      <span className="text-sm font-medium">Certificación</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Tipos de contenido:</h4>
                  <div className="flex flex-wrap gap-2">
                    {lessonCounts.videos > 0 && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-100">
                        {lessonCounts.videos} videos
                      </Badge>
                    )}
                    {lessonCounts.readings > 0 && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-600 hover:bg-amber-100">
                        {lessonCounts.readings} lecturas
                      </Badge>
                    )}
                    {lessonCounts.audios > 0 && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-600 hover:bg-purple-100">
                        {lessonCounts.audios} audios
                      </Badge>
                    )}
                    {lessonCounts.tests > 0 && (
                      <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-100">
                        {lessonCounts.tests} evaluaciones
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="space-y-4">
              <CourseContent 
                modules={modules} 
                onLessonClick={handleLessonClick}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <CourseActions
            progress={progress}
            lessons={totalLessons}
            onStartCourse={() => {
              // Encontrar la primera lección del primer módulo
              if (modules.length > 0 && modules[0].lessons.length > 0) {
                const firstLesson = modules[0].lessons[0];
                handleLessonClick(firstLesson.id, firstLesson.type);
              } else {
                toast.error("Este curso no tiene lecciones disponibles.");
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
