
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, Video, FileText, FileAudio, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Course } from "@/services/courseService";

interface CourseCardProps {
  course: Course;
  onStart?: (courseId: number) => void;
  onContinue?: (courseId: number) => void;
}

const CourseCard = ({ course, onStart, onContinue }: CourseCardProps) => {
  const navigate = useNavigate();
  
  const getLevelColor = (level: string = 'General') => {
    switch(level.toLowerCase()) {
      case 'básico':
      case 'principiante':
      case 'básico':
        return "bg-green-100 text-green-700 border-green-200";
      case 'intermedio':
        return "bg-blue-100 text-blue-700 border-blue-200";
      case 'avanzado':
        return "bg-amber-100 text-amber-700 border-amber-200";
      case 'experto':
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };
  
  const handleMoreDetails = () => {
    if (!course.id) {
      console.error("Error: ID del curso no disponible", course);
      return;
    }
    
    // Asegurar que el ID del curso sea un número
    const courseId = typeof course.id === 'string' ? parseInt(course.id) : course.id;
    
    console.log(`Navegando al detalle del curso con ID ${courseId}`);
    navigate(`/dashboard/courses/${courseId}`);
  };

  // Función para obtener los contadores de tipos de lecciones
  const getLessonTypeCounts = () => {
    if (!course.modules) return { videos: 0, readings: 0, audios: 0, tests: 0 };
    
    const counts = { videos: 0, readings: 0, audios: 0, tests: 0 };
    
    course.modules.forEach(module => {
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
  
  const lessonCounts = getLessonTypeCounts();
  const totalLessons = course.lessons_count || course.total_lessons || 0;
  const instructorName = typeof course.instructor === 'string' ? course.instructor : course.instructor?.name || 'Instructor';

  return (
    <Card className="overflow-hidden flex flex-col h-[460px]">
      <div className="h-32 overflow-hidden border-b relative">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-full object-cover"
        />
        {course.favorite && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-white/90">Favorito</Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4 flex flex-col flex-1">
        <Badge variant="outline" className={`self-start mb-2 ${getLevelColor(course.level)}`}>
          {course.level || 'General'}
        </Badge>
        <h3 className="font-semibold mb-2 line-clamp-2">{course.title}</h3>
        <div className="text-sm text-muted-foreground mb-3">{course.category}</div>
        
        <div className="flex-1">
          <div className="text-sm text-muted-foreground mb-2">
            Por {instructorName}
          </div>
          
          <div className="flex flex-col gap-3 text-sm text-muted-foreground mt-3">
            <div className="grid grid-cols-2 gap-2">
              {lessonCounts.videos > 0 && (
                <div className="flex items-center gap-1">
                  <Video size={14} className="text-blue-500" />
                  <span>{lessonCounts.videos} videos</span>
                </div>
              )}
              {lessonCounts.readings > 0 && (
                <div className="flex items-center gap-1">
                  <FileText size={14} className="text-amber-500" />
                  <span>{lessonCounts.readings} lecturas</span>
                </div>
              )}
              {lessonCounts.audios > 0 && (
                <div className="flex items-center gap-1">
                  <FileAudio size={14} className="text-purple-500" />
                  <span>{lessonCounts.audios} audios</span>
                </div>
              )}
              {lessonCounts.tests > 0 && (
                <div className="flex items-center gap-1">
                  <GraduationCap size={14} className="text-green-500" />
                  <span>{lessonCounts.tests} tests</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <BookOpen size={16} />
              <span>{totalLessons} lecciones</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{course.duration}</span>
            </div>
          </div>
          
          {course.progress !== undefined && course.progress > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progreso</span>
                <span>{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-1" />
            </div>
          )}
        </div>
        
        <Button 
          className="w-full mt-3 bg-primary hover:bg-primary/90 text-white"
          onClick={handleMoreDetails}
        >
          Más detalles
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
