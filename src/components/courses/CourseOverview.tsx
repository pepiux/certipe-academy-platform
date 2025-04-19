
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, BookOpen, BarChart } from "lucide-react";

interface CourseOverviewProps {
  description: string;
  instructor?: string | { id: number; name: string };
  level?: string;
  duration?: string;
}

const CourseOverview = ({ description, instructor = "Instructor", level = "Intermedio", duration = "0h" }: CourseOverviewProps) => {
  // Convertir el instructor a string si es un objeto
  const instructorName = typeof instructor === 'object' ? instructor.name : instructor;
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Sobre este curso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <User className="text-primary h-5 w-5" />
              <div>
                <p className="text-xs text-muted-foreground">Instructor</p>
                <p className="font-medium">{instructorName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BarChart className="text-primary h-5 w-5" />
              <div>
                <p className="text-xs text-muted-foreground">Nivel</p>
                <p className="font-medium">{level}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="text-primary h-5 w-5" />
              <div>
                <p className="text-xs text-muted-foreground">Duración</p>
                <p className="font-medium">{duration}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseOverview;
