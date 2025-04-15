
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, Check, Eye, Play, RotateCw, FileText, FileAudio, FileVideo, ClipboardCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  type: string;
  description?: string;
}

interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface CourseContentProps {
  modules: Module[];
  currentLessonId: number;
  onLessonClick: (lessonId: number) => void;
}

const CourseContent = ({ modules, currentLessonId, onLessonClick }: CourseContentProps) => {
  const [expandedModule, setExpandedModule] = React.useState<number | null>(1);

  const toggleModule = (moduleId: number) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'reading':
        return <FileText className="h-4 w-4 text-muted-foreground" />;
      case 'audio':
        return <FileAudio className="h-4 w-4 text-muted-foreground" />;
      case 'video':
        return <FileVideo className="h-4 w-4 text-muted-foreground" />;
      case 'test':
        return <ClipboardCheck className="h-4 w-4 text-muted-foreground" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getLessonAction = (lesson: Lesson) => {
    if (lesson.completed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="w-10 h-10" onClick={() => onLessonClick(lesson.id)}>
                <RotateCw className="h-4 w-4 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Repasar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    if (lesson.id === currentLessonId) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="w-10 h-10" onClick={() => onLessonClick(lesson.id)}>
                <Play className="h-4 w-4 text-[#0EA5E9]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Continuar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="w-10 h-10" onClick={() => onLessonClick(lesson.id)}>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Previsualizar</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <Card>
      <CardContent className="p-0">
        {modules.map((module) => (
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
                  className={`grid grid-cols-12 gap-2 items-center py-3 border-t cursor-pointer hover:bg-slate-50 ${
                    lesson.id === currentLessonId ? 'bg-slate-50' : ''
                  }`}
                  onClick={() => onLessonClick(lesson.id)}
                >
                  <div className="col-span-7 flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {getLessonIcon(lesson.type)}
                    </div>
                    <span className="text-sm font-medium truncate">{lesson.title}</span>
                  </div>
                  <div className="col-span-2 text-right text-sm text-muted-foreground pr-2">
                    {lesson.duration}
                  </div>
                  <div className="col-span-2 flex justify-end">
                    {getLessonAction(lesson)}
                  </div>
                  <div className="col-span-1 flex justify-center">
                    {lesson.completed && (
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {currentLessonId === module.lessons.find(l => l.id === currentLessonId)?.id && (
                <div className="p-3 bg-slate-50 text-sm border-t">
                  <p>{module.lessons.find(l => l.id === currentLessonId)?.description}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CourseContent;
