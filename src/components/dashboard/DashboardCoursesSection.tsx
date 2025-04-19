
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseCard from "@/components/courses/CourseCard";
import { Course } from '@/services/courseService';
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardCourses from "./DashboardCourses";

interface DashboardCoursesSectionProps {
  loading: boolean;
  error: Error | null;
  courses: Course[];
  onContinueCourse: (courseId: number) => void;
}

const heartIcon = <Heart className="h-5 w-5 text-brand-blue" />;

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
        <div className="text-center py-8 text-red-500">{error.message}</div>
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
