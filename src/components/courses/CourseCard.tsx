
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Course {
  id: number;
  title: string;
  category: string;
  level: string;
  instructor: string;
  students: number;
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
    switch (level) {
      case "Principiante":
        return "bg-primary/10 text-primary border-primary/20";
      case "Intermedio":
        return "bg-primary/10 text-primary border-primary/20";
      case "Avanzado":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
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
        <h3 className="font-semibold mb-2 line-clamp-2">{course.title}</h3>
        <div className="text-sm text-muted-foreground mb-3">{course.category}</div>
        
        <Badge variant="outline" className={`self-start mb-4 ${getLevelColor(course.level)}`}>
          {course.level}
        </Badge>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Por {course.instructor}</span>
            <span>•</span>
            <span>{course.students} estudiantes</span>
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
        
        <Button 
          className="w-full mt-4 bg-primary hover:bg-primary/90 text-white"
          onClick={() => course.progress > 0 ? onContinue(course.id) : onStart(course.id)}
        >
          {course.progress > 0 ? "Continuar curso" : "Iniciar curso"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
