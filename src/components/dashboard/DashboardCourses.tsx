
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Course {
  id: number;
  title: string;
  instructor: string;
  progress: number;
  image: string;
  color: string;
}

interface DashboardCoursesProps {
  courses: Course[];
  onContinueCourse: (courseId: number) => void;
}

const DashboardCourses = ({ courses, onContinueCourse }: DashboardCoursesProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">Tus cursos</h2>
        <Button variant="ghost" size="sm" className="gap-1 text-primary" onClick={() => navigate('/dashboard/courses')}>
          Ver todos <ChevronRight size={16} />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden quiz-card">
            <div className={`quiz-card-banner bg-gradient-to-r ${course.color}`}></div>
            <div className="h-32 overflow-hidden">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h4 className="font-medium line-clamp-1">{course.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Instructor: {course.instructor}
              </p>
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progreso</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-1" />
              </div>
              <Button 
                className="w-full mt-3 py-1 h-auto bg-primary hover:bg-primary/90 text-white"
                size="sm"
                onClick={() => onContinueCourse(course.id)}
              >
                {course.progress > 0 ? "Continuar curso" : "Iniciar curso"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardCourses;
