
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, BookOpen, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface Course {
  id: number;
  title: string;
  instructor: string;
  progress: number;
  image: string;
  color: string;
  lessons: number;
  duration: string;
  category: string;
  level: string;
}

interface DashboardCoursesProps {
  courses: Course[];
  onContinueCourse: (courseId: number) => void;
}

const DashboardCourses = ({ courses, onContinueCourse }: DashboardCoursesProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((course) => (
        <Card key={course.id} className="overflow-hidden flex flex-col h-[420px]">
          <div className={`h-32 overflow-hidden`}>
            <img 
              src={course.image} 
              alt={course.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-4 flex flex-col flex-1">
            <Badge variant="outline" className="mb-2 bg-primary/10 text-primary border-primary/20 self-start">
              {course.level}
            </Badge>
            <h4 className="font-medium line-clamp-1 mt-2">{course.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {course.category}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Por {course.instructor}
            </p>
            <div className="flex flex-col gap-1 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <BookOpen size={14} />
                <span>{course.lessons} lecciones</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>{course.duration}</span>
              </div>
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
                onClick={() => onContinueCourse(course.id)}
              >
                {course.progress > 0 ? "Continuar curso" : "Iniciar curso"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardCourses;
