
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardCourses from "./DashboardCourses";

interface DashboardCoursesSectionProps {
  loading: boolean;
  error: string | null;
  courses: any[];
  onContinueCourse: (courseId: number) => void;
}

const DashboardCoursesSection = ({ 
  loading, 
  error, 
  courses, 
  onContinueCourse 
}: DashboardCoursesSectionProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">Cursos</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1 text-primary" 
          onClick={() => navigate('/dashboard/courses')}
        >
          Ver todos <ChevronRight size={16} />
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Cargando cursos...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : courses.length > 0 ? (
        <DashboardCourses 
          courses={courses}
          onContinueCourse={onContinueCourse}
        />
      ) : (
        <div className="text-center py-8">No se encontraron cursos disponibles</div>
      )}
    </div>
  );
};

export default DashboardCoursesSection;
