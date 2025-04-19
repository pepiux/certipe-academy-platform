
import React, { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ArrowLeft, Search, ArrowDown, ArrowUp, Maximize, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import CourseContent from "@/components/courses/CourseContent";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CourseModule, Lesson } from "@/services/courseService";

const ReadingLesson = () => {
  const { courseId, lessonId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [showCourseContent, setShowCourseContent] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const totalPages = 5;

  // Course data
  const courseData = {
    id: parseInt(courseId || "1"),
    title: "Fundamentos de Gestión de Proyectos",
    modules: [
      {
        id: 1,
        title: "Introducción a la Gestión de Proyectos",
        lessons: [
          { id: 1, title: "¿Qué es un proyecto?", duration: "15:30", completed: true, type: "video" as const },
          { id: 2, title: "Roles en la gestión de proyectos", duration: "22:45", completed: true, type: "video" as const },
          { id: 3, title: "Ciclo de vida del proyecto", duration: "18:20", completed: true, type: "reading" as const }
        ]
      } as CourseModule,
      {
        id: 2,
        title: "Planificación de Proyectos",
        lessons: [
          { id: 4, title: "Definición de objetivos y alcance", duration: "25:10", completed: true, type: "audio" as const },
          { id: 5, title: "Estimación de tiempos y recursos", duration: "30:15", completed: false, type: "video" as const },
          { id: 6, title: "Creación de cronogramas", duration: "28:40", completed: false, type: "reading" as const }
        ]
      } as CourseModule
    ]
  };

  const lessonData = {
    id: parseInt(lessonId || "1"),
    title: "Ciclo de vida del proyecto",
    description: "Documento que detalla las diferentes fases del ciclo de vida de un proyecto y cómo se interrelacionan entre sí.",
    pdfUrl: "/sample-pdf.pdf", // This would be a real PDF in a production app
    courseId: parseInt(courseId || "1"),
    duration: "18:20",
    nextLessonId: 4,
    prevLessonId: 2
  };

  // Handle full screen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Handle Escape key for exiting full screen
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && document.fullscreenElement) {
        exitFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFullscreen = () => {
    if (pdfContainerRef.current) {
      if (!fullscreen) {
        if (pdfContainerRef.current.requestFullscreen) {
          pdfContainerRef.current.requestFullscreen();
        } else if ((pdfContainerRef.current as any).webkitRequestFullscreen) {
          (pdfContainerRef.current as any).webkitRequestFullscreen();
        } else if ((pdfContainerRef.current as any).mozRequestFullScreen) {
          (pdfContainerRef.current as any).mozRequestFullScreen();
        } else if ((pdfContainerRef.current as any).msRequestFullscreen) {
          (pdfContainerRef.current as any).msRequestFullscreen();
        }
      } else {
        exitFullscreen();
      }
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  };

  const handleLessonCompleted = () => {
    // In a real app, you would make an API call to mark the lesson as completed
    console.log(`Marking lesson ${lessonId} as completed`);
    
    // Navigate to the next lesson if available
    if (lessonData.nextLessonId) {
      // Determine the type of the next lesson
      const nextLesson = findLessonById(lessonData.nextLessonId);
      if (nextLesson) {
        window.location.href = `/dashboard/courses/${courseId}/lesson/${lessonData.nextLessonId}/${nextLesson.type}`;
      }
    }
  };

  const findLessonById = (id: number) => {
    for (const module of courseData.modules) {
      const lesson = module.lessons.find(l => l.id === id);
      if (lesson) return lesson;
    }
    return null;
  };

  const toggleCourseContent = () => {
    setShowCourseContent(!showCourseContent);
  };

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className={`flex-grow transition-all ${showCourseContent ? 'max-w-[75%]' : 'max-w-full'}`}>
        <div className="container max-w-5xl mx-auto py-6">
          <div className="flex items-center mb-6">
            <Link to={`/dashboard/courses/${courseId}`} className="flex items-center text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al curso
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-auto md:hidden"
              onClick={toggleCourseContent}
            >
              {showCourseContent ? 'Ocultar contenido' : 'Mostrar contenido'}
            </Button>
          </div>
          
          <h1 className="text-2xl font-bold mb-2 text-left">{lessonData.title}</h1>
          <p className="text-muted-foreground mb-6 text-left">{lessonData.description}</p>
          
          <div className="bg-gray-100 rounded-lg p-3 mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      <ArrowUp className="h-4 w-4 mr-1" />
                      Anterior
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Página anterior</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <div className="text-sm">
                Página {currentPage} de {totalPages}
              </div>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                      <ArrowDown className="h-4 w-4 ml-1" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Página siguiente</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative w-40">
                <Input
                  placeholder="Buscar en documento..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-8 h-8 text-sm"
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handleFullscreen}>
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Pantalla completa</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div id="pdf-container" ref={pdfContainerRef} className="bg-white rounded-lg shadow-lg overflow-hidden mb-6 border relative">
            <div className="aspect-[3/4] bg-white relative">
              {/* PDF content would be rendered here in a real app */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <img 
                    src={`https://placehold.co/600x800?text=Página+${currentPage}+del+PDF`} 
                    alt={`Página ${currentPage} del documento`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
            
            {fullscreen && (
              <div className="absolute top-4 right-4 z-10">
                <Button variant="outline" size="sm" onClick={exitFullscreen}>
                  Salir de pantalla completa
                </Button>
              </div>
            )}
            
            {fullscreen && (
              <div className="absolute bottom-4 right-4 z-10">
                <div className="flex items-center space-x-4 bg-black/30 p-2 rounded-md">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  <span className="text-white">Página {currentPage} de {totalPages}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
            {lessonData.prevLessonId ? (
              <Button 
                variant="outline"
                onClick={() => window.history.back()}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
            ) : (
              <div></div>
            )}
            
            {lessonData.nextLessonId && (
              <Button 
                onClick={() => handleLessonCompleted()}
              >
                Siguiente lección
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Course Content Sidebar - Now made toggleable */}
      {!fullscreen && (
        <>
          {showCourseContent ? (
            <div className="w-full md:w-1/4 border-l border-border bg-background h-screen overflow-y-auto p-4 fixed right-0 top-0 bottom-0 z-10 md:relative">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-left">Contenido del curso</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleCourseContent}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <CourseContent 
                modules={courseData.modules} 
                currentLessonId={parseInt(lessonId || "0")} 
                onLessonClick={(lessonId) => {
                  const lesson = findLessonById(lessonId);
                  if (lesson) {
                    window.location.href = `/dashboard/courses/${courseId}/lesson/${lessonId}/${lesson.type}`;
                  }
                }}
              />
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleCourseContent}
              className="fixed right-4 top-20 z-10 p-2 bg-background border border-border rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default ReadingLesson;
