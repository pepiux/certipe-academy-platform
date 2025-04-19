
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCourse } from '@/hooks/useCourse';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import CourseHeader from "@/components/courses/CourseHeader";
import CourseOverview from "@/components/courses/CourseOverview";
import CourseContent from "@/components/courses/CourseContent";
import CourseActions from "@/components/courses/CourseActions";
import { toast } from 'sonner';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  console.log("CourseDetail renderizándose con courseId de params:", courseId);
  
  // Manejar el courseId directamente como string
  const { course, loading, error } = useCourse(courseId);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (error) {
      console.error("Error al cargar el curso:", error);
      toast.error("No se pudo cargar el curso. Por favor, inténtelo de nuevo más tarde.");
    }
  }, [error]);

  console.log("Renderizando CourseDetail para el curso ID:", courseId);
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

  // Asegurarnos de que course.modules es un array para no tener errores
  const modules = Array.isArray(course.modules) ? course.modules : [];

  // Valores seguros para progress y total_lessons
  const progress = course.progress || 0;
  const totalLessons = course.total_lessons || course.lessons_count || 0;

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
              />
            </TabsContent>
            
            <TabsContent value="content" className="space-y-4">
              <CourseContent modules={modules} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <CourseActions
            progress={progress}
            lessons={totalLessons}
            onStartCourse={() => navigate(`/dashboard/courses/${course.id}/lesson/1/video`)}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
