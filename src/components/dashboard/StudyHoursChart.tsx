
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Area
} from "recharts";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const COURSES = [
  { id: 1, name: "Gestión de Proyectos", minStudyHoursPerDay: 2.5 },
  { id: 2, name: "Metodologías Ágiles", minStudyHoursPerDay: 2.0 },
  { id: 3, name: "PRINCE2", minStudyHoursPerDay: 3.0 }
];

const generateWeekData = (courseId: number) => {
  const days = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
  const course = COURSES.find(c => c.id === courseId) || COURSES[0];
  
  return days.map((day, index) => {
    const date = subDays(new Date(), 6 - index);
    return {
      day,
      date: format(date, "EEEE d 'de' MMMM", { locale: es }),
      hours: Number((Math.random() * 5 + 0.5).toFixed(1)),
      threshold: course.minStudyHoursPerDay
    };
  });
};

interface StudyHoursChartProps {
  data: Array<{ name: string; hours: number }>;
}

const StudyHoursChart = ({ data: initialData }: StudyHoursChartProps) => {
  const [selectedCourse, setSelectedCourse] = useState("1");

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <div className="font-medium">{data.date}</div>
          <div>{payload[0].value.toFixed(1)} horas</div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium">Histórico horas estudio</h3>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-sm">
                  Este indicador muestra el numero de horas de estudios de la última semana para el curso seleccionado. La linea base representa el umbral minimo esperado.
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
          
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar curso" />
            </SelectTrigger>
            <SelectContent>
              {COURSES.map(course => (
                <SelectItem key={course.id} value={course.id.toString()}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart margin={{ left: 0, right: 20, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="day"
                allowDuplicatedCategory={false}
              />
              <YAxis 
                label={{ value: 'Horas', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Area
                type="monotone"
                dataKey="threshold"
                stroke="none"
                fill="#f0f0f0"
                data={generateWeekData(parseInt(selectedCourse))}
              />
              
              <ReferenceLine
                y={COURSES.find(c => c.id === parseInt(selectedCourse))?.minStudyHoursPerDay || 2.0}
                stroke="#000000"
                strokeWidth={1}
              />
              
              <Line 
                type="monotone"
                dataKey="hours"
                data={generateWeekData(parseInt(selectedCourse))}
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ r: 6, fill: "#8B5CF6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyHoursChart;
