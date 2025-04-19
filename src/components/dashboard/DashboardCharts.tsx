
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StudyHoursChart from "@/components/dashboard/StudyHoursChart";
import ScoreProgressChart from "@/components/dashboard/ScoreProgressChart";
import { Clock, Award } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StudyHoursData {
  date: string;
  hours: number;
}

interface ScoreProgressData {
  date: string;
  score: number;
}

interface DashboardChartsProps {
  studyHoursData: StudyHoursData[];
  scoreProgressData: ScoreProgressData[];
}

interface Course {
  id: number;
  title: string;
}

interface Quiz {
  id: number;
  title: string;
}

const DashboardCharts = ({ studyHoursData, scoreProgressData }: DashboardChartsProps) => {
  const availableCourses: Course[] = [
    { id: 1, title: "Fundamentos de Gestión de Proyectos" },
    { id: 2, title: "Metodologías Ágiles y Scrum" },
  ];

  const availableQuizzes: Quiz[] = [
    { id: 1, title: "Cuestionario de Introducción" },
    { id: 2, title: "Cuestionario de Planificación" },
  ];

  const [selectedCourse, setSelectedCourse] = useState(availableCourses[0].id.toString());
  const [selectedQuiz, setSelectedQuiz] = useState(availableQuizzes[0].id.toString());
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="h-auto">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Histórico horas estudio</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-blue-100 p-2 rounded-lg cursor-help">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  Este indicador muestra el número de horas de estudios de la última semana para el curso seleccionado. La línea base representa el umbral mínimo esperado.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="mt-2">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar curso" />
              </SelectTrigger>
              <SelectContent>
                {availableCourses.map((course) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[250px]">
            <StudyHoursChart data={studyHoursData} className="h-full" />
          </div>
        </CardContent>
      </Card>

      <Card className="h-auto">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Progreso de puntuación</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-green-100 p-2 rounded-lg cursor-help">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  Este indicador muestra los puntajes porcentuales de los últimos intentos obtenidos en el cuestionario seleccionado. La línea base representa el umbral mínimo esperado.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="mt-2">
            <Select value={selectedQuiz} onValueChange={setSelectedQuiz}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar cuestionario" />
              </SelectTrigger>
              <SelectContent>
                {availableQuizzes.map((quiz) => (
                  <SelectItem key={quiz.id} value={quiz.id.toString()}>
                    {quiz.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[250px] mt-4">
            <ScoreProgressChart data={scoreProgressData} className="h-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
