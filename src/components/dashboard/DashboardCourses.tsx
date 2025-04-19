
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { Course } from "@/services/courseService";

interface DashboardCoursesProps {
  courses: Course[];
  loading?: boolean;
  onContinueCourse: (courseId: number) => void;
}

const DashboardCourses = ({ courses, loading = false, onContinueCourse }: DashboardCoursesProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="w-full h-40" />
            <CardContent className="p-4">
              <Skeleton className="w-3/4 h-6 mb-2" />
              <Skeleton className="w-full h-2 mb-1" />
              <div className="flex justify-between mt-4">
                <Skeleton className="w-24 h-9" />
                <Skeleton className="w-10 h-10 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((course) => (
        <Card key={course.id} className="overflow-hidden relative">
          {course.image && (
            <div className="relative h-40 overflow-hidden">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-full object-cover"
              />
              
              {course.favorite && (
                <div className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full">
                  <Heart className="h-4 w-4 text-[#0EA5E9] fill-[#0EA5E9]" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-white font-medium text-lg">{course.title}</h3>
              </div>
            </div>
          )}
          
          <CardContent className="p-4">
            <div className="mb-1">
              <div className="flex justify-between items-center text-sm text-muted-foreground mb-1">
                <span>Progreso: {course.progress || 0}%</span>
              </div>
              <Progress value={course.progress || 0} className="h-1" />
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <Button
                size="sm"
                onClick={() => onContinueCourse(course.id)}
                className="text-xs h-8"
              >
                Continuar
              </Button>
              
              <Link to={`/dashboard/courses/${course.id}`} className="text-sm text-muted-foreground hover:underline">
                Ver detalles
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardCourses;
