import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen } from "lucide-react";

interface Course {
  id: number;
  title: string;
  category: string;
  level: string;
  instructor: string;
  lessons: number;
  duration: string;
  image: string;
  progress: number;
  enrolled: boolean;
}

interface CourseCardProps {
  course: Course;
  onStart: (courseId: number) => void;
  onContinue: (courseId: number) => void;
}

const CourseCard = ({ course, onStart, onContinue }: CourseCardProps) => {
  const getLevelColor = (level: string) => {
    return "bg-primary/10 text-primary border-primary/20";
  };

  return (
    <Card className="overflow-hidden flex flex-col h-[420px]">
      <div className="h-32 overflow-hidden border-b">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <CardContent className="p-4 flex flex-col flex-1">
        <Badge variant="outline" className={`self-start mb-2 ${getLevelColor(course.level)}`}>
          {course.level}
        </Badge>
        <h3 className="font-semibold mb-2 line-clamp-2">{course.title}</h3>
        <div className="text-sm text-muted-foreground mb-3">{course.category}</div>
        
        <div className="flex-1">
          <div className="text-sm text-muted-foreground mb-2">
            Por {course.instructor}
          </div>
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <BookOpen size={16} />
              <span>{course.lessons} lecciones</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{course.duration}</span>
            </div>
          </div>
          
          {course.progress > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progreso</span>
                <span>{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-1" />
            </div>
          )}
        </div>
        
      <div className="flex-1 flex flex-col justify-end mt-3">
        {course.progress > 0 && (
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Progreso</span>
              <span>{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-1" />
          </div>
        )}
        <Button 
          className="w-full mt-3 bg-primary hover:bg-primary/90 text-white"
          onClick={() => onStart(course.id)}
        >
          Más detalles
        </Button>
      </div>
    </CardContent>
  </Card>
  );
};

export default CourseCard;
