
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseHeader from "@/components/courses/CourseHeader";
import CourseOverview from "@/components/courses/CourseOverview";
import CourseContent from "@/components/courses/CourseContent";
import CourseStats from "@/components/courses/CourseStats";
import CourseActions from "@/components/courses/CourseActions";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

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
          { id: 9, title: "Evaluación de conceptos", duration: "15:00", completed: false, type: "test" }
        ]
      }
    ]
  };

  const handleContinue = () => {
    console.log('Continue learning from lesson ID:', courseData.currentLessonId);
    const currentModule = courseData.modules.find(module => 
      module.lessons.some(lesson => lesson.id === courseData.currentLessonId)
    );
    
    if (currentModule) {
      const currentLesson = currentModule.lessons.find(lesson => lesson.id === courseData.currentLessonId);
      if (currentLesson) {
        navigateToLesson(currentLesson.id);
      }
    }
  };

  const handleStartCourse = () => {
    if (courseData.modules[0]?.lessons[0]?.id) {
      navigateToLesson(courseData.modules[0].lessons[0].id);
    }
  };

  const navigateToLesson = (lessonId: number) => {
    const lesson = findLessonById(lessonId);
    if (lesson) {
      const route = `/dashboard/courses/${courseData.id}/lesson/${lessonId}/${lesson.type}`;
      console.log(`Navigating to: ${route}`);
      navigate(route);
    }
  };

  const findLessonById = (lessonId: number) => {
    for (const module of courseData.modules) {
      const lesson = module.lessons.find(l => l.id === lessonId);
      if (lesson) return lesson;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <CourseHeader
        image={courseData.image}
        title={courseData.title}
        level={courseData.level}
        category={courseData.category}
        instructor={courseData.instructor}
        lessons={courseData.lessons}
        duration={courseData.duration}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Información</TabsTrigger>
              <TabsTrigger value="content">Contenido</TabsTrigger>
              <TabsTrigger value="stats">Estadísticas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <CourseOverview
                description={courseData.description}
                objectives={courseData.objectives}
                instructor={courseData.instructor}
                rating={courseData.rating}
                totalReviews={courseData.totalReviews}
              />
            </TabsContent>
            
            <TabsContent value="content">
              <CourseContent
                modules={courseData.modules}
                currentLessonId={courseData.currentLessonId}
                onLessonClick={navigateToLesson}
              />
            </TabsContent>
            
            <TabsContent value="stats">
              <CourseStats
                completedLessons={courseData.completedLessons}
                totalLessons={courseData.lessons}
                studyHours={courseData.studyHours}
                lastQuizScore={courseData.lastQuizScore}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <CourseActions
            progress={courseData.progress}
            lessons={courseData.lessons}
            isFavorite={isFavorite}
            onToggleFavorite={() => setIsFavorite(!isFavorite)}
            onContinue={handleContinue}
            onStart={handleStartCourse}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
