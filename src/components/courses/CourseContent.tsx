
import React from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { FileText, Video, FileAudio, GraduationCap, Check } from "lucide-react";
import { Lesson, CourseModule } from '@/services/courseService';

interface CourseContentProps {
  modules: CourseModule[];
  currentLessonId?: number;
  onLessonClick?: (lessonId: number, lessonType: string) => void;
}

const LessonIcon = ({ type, completed }: { type?: string; completed?: boolean }) => {
  if (completed) {
    return <Check className="h-4 w-4 text-green-600" />;
  }
  
  switch (type) {
    case 'video':
      return <Video className="h-4 w-4 text-blue-600" />;
    case 'reading':
      return <FileText className="h-4 w-4 text-amber-600" />;
    case 'audio':
      return <FileAudio className="h-4 w-4 text-purple-600" />;
    case 'test':
      return <GraduationCap className="h-4 w-4 text-green-600" />;
    default:
      return <FileText className="h-4 w-4 text-muted-foreground" />;
  }
};

const CourseContent = ({ modules, currentLessonId, onLessonClick }: CourseContentProps) => {
  // Find the module containing the current lesson
  const currentModuleId = currentLessonId ? 
    modules.find(m => m.lessons.some(l => l.id === currentLessonId))?.id : 
    undefined;
  
  // Ordenar módulos por su orden (si existe)
  const sortedModules = [...modules].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    return 0;
  });
  
  return (
    <Accordion 
      type="multiple" 
      defaultValue={currentModuleId ? [`module-${currentModuleId}`] : [`module-${modules[0]?.id}`]}
      className="w-full text-left"
    >
      {sortedModules.map((module) => {
        // Ordenar lecciones por su orden (si existe)
        const sortedLessons = [...module.lessons].sort((a, b) => {
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
          }
          return 0;
        });
        
        return (
          <AccordionItem key={module.id} value={`module-${module.id}`} className="border-b">
            <AccordionTrigger className="py-3 text-left">
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{module.title}</span>
                <span className="text-xs text-muted-foreground mt-1">
                  {module.lessons.length} {module.lessons.length === 1 ? 'lección' : 'lecciones'}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {module.description && (
                <p className="text-sm text-muted-foreground mb-3 pl-2">{module.description}</p>
              )}
              <ul className="space-y-1 pb-2">
                {sortedLessons.map((lesson) => {
                  const isActive = lesson.id === currentLessonId;
                  return (
                    <li 
                      key={lesson.id}
                      className={cn(
                        "text-sm p-2 rounded-md flex items-start justify-between gap-2 cursor-pointer",
                        isActive ? "bg-accent/50 shadow-sm" : "hover:bg-accent/30",
                        lesson.completed && !isActive ? "text-muted-foreground" : ""
                      )}
                      onClick={() => onLessonClick?.(lesson.id, lesson.type)}
                    >
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5">
                          <LessonIcon type={lesson.type} completed={lesson.completed} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-left">{lesson.title}</span>
                          {lesson.description && (
                            <span className="text-xs text-muted-foreground">{lesson.description}</span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {lesson.duration}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default CourseContent;
