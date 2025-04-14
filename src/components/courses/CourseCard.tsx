
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileQuestion, Clock } from "lucide-react";

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
        return "bg-green-100 text-green-800";
      case "Intermedio":
        return "bg-blue-100 text-blue-800";
      case "Avanzado":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="h-48 overflow-hidden border-b">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <CardContent className="p-5 flex flex-col flex-1">
        <div className="flex flex-col mb-3">
          <Badge variant="outline" className={`self-start mb-2 ${getLevelColor(course.level)}`}>
            {course.level}
          </Badge>
          <div className="text-xs text-muted-foreground">{course.category}</div>
        </div>
        
        <h3 className="font-semibold mb-4 line-clamp-2">{course.title}</h3>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>Por {course.instructor}</span>
            <span>•</span>
            <span>{course.students} estudiantes</span>
          </div>
          
          {course.progress > 0 && (
            <div className="mt-2 mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progreso</span>
                <span>{course.progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <Button 
            className="w-full" 
            variant={course.progress > 0 ? "outline" : "default"}
            onClick={() => course.progress > 0 ? onContinue(course.id) : onStart(course.id)}
          >
            {course.progress > 0 ? "Continuar curso" : "Iniciar curso"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
