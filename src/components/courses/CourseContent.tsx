
// Update the course content component to align text left and improve the active item highlighting

import React from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Check, FileText, Video, FileAudio, GraduationCap } from "lucide-react";

interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed?: boolean;
  type?: 'video' | 'reading' | 'audio' | 'test';
}

interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface CourseContentProps {
  modules: Module[];
  currentLessonId?: number;
  onLessonClick?: (lessonId: number) => void;
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
  
  return (
    <Accordion 
      type="multiple" 
      defaultValue={currentModuleId ? [`module-${currentModuleId}`] : []}
      className="w-full text-left"
    >
      {modules.map((module) => (
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
            <ul className="space-y-1 pb-2">
              {module.lessons.map((lesson) => {
                const isActive = lesson.id === currentLessonId;
                return (
                  <li 
                    key={lesson.id}
                    className={cn(
                      "text-sm p-2 rounded-md flex items-start justify-between gap-2 cursor-pointer",
                      isActive ? "bg-accent/50 shadow-sm" : "hover:bg-accent/30",
                      lesson.completed && !isActive ? "text-muted-foreground" : ""
                    )}
                    onClick={() => onLessonClick?.(lesson.id)}
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">
                        <LessonIcon type={lesson.type} completed={lesson.completed} />
                      </div>
                      <span className="text-left">{lesson.title}</span>
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
      ))}
    </Accordion>
  );
};

export default CourseContent;
