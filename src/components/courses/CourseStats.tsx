
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Award } from "lucide-react";

interface CourseStatsProps {
  completedLessons: number;
  totalLessons: number;
  studyHours: number;
  lastQuizScore: number;
}

const CourseStats = ({ 
  completedLessons, 
  totalLessons, 
  studyHours, 
  lastQuizScore 
}: CourseStatsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadísticas del curso</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progreso del contenido</span>
              <span>{completedLessons}/{totalLessons} lecciones</span>
            </div>
            <Progress value={(completedLessons / totalLessons) * 100} className="h-2" />
            <p className="text-sm text-muted-foreground mt-1">
              Has completado el {Math.round((completedLessons / totalLessons) * 100)}% del curso
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-primary" />
                <h4 className="font-medium">Tiempo de estudio</h4>
              </div>
              <p className="text-2xl font-bold">{studyHours} horas</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award size={16} className="text-primary" />
                <h4 className="font-medium">Último examen</h4>
              </div>
              <p className="text-2xl font-bold">{lastQuizScore}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseStats;
