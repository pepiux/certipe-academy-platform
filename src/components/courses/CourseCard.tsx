
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-[160px] object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={`
            text-xs font-medium px-2 py-1 rounded 
            ${course.level === "Principiante" ? "bg-green-100 text-green-800" : 
              course.level === "Intermedio" ? "bg-blue-100 text-blue-800" : 
              "bg-purple-100 text-purple-800"}
          `}>
            {course.level}
          </span>
        </div>
      </div>
      
      <CardContent className="flex-1 flex flex-col p-4">
        <div className="text-xs text-muted-foreground mb-1">{course.category}</div>
        <h3 className="font-semibold mb-2 line-clamp-2">{course.title}</h3>
        
        <div className="text-xs text-muted-foreground mb-4">
          Por {course.instructor} • {course.students} estudiantes
        </div>
        
        {course.progress > 0 ? (
          <div className="mt-auto">
            <div className="flex justify-between text-xs mb-1">
              <span>Progreso</span>
              <span>{course.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
            <Button 
              className="w-full mt-4" 
              variant="outline"
              onClick={() => onContinue(course.id)}
            >
              Continuar
            </Button>
          </div>
        ) : (
          <Button 
            className="w-full mt-auto"
            onClick={() => onStart(course.id)}
          >
            {course.enrolled ? "Continuar curso" : "Iniciar curso"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseCard;
