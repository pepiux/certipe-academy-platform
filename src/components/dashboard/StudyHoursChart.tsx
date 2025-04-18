
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format, subWeeks, addDays, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";

// Datos de ejemplo para cursos
const COURSES = [
  { id: 1, name: "Gestión de Proyectos" },
  { id: 2, name: "Metodologías Ágiles" },
  { id: 3, name: "PRINCE2" }
];

interface StudyHoursChartProps {
  data: Array<{ name: string; hours: number }>;
}

// Función para generar datos de semana simulados
const generateWeekData = (weekOffset: number) => {
  const weekStart = startOfWeek(subWeeks(new Date(), weekOffset));
  return Array.from({ length: 7 }, (_, i) => {
    const day = addDays(weekStart, i);
    return {
      fullName: format(day, 'EEEE', { locale: es }),
      name: format(day, 'EEEEE', { locale: es }).toUpperCase(),
      date: format(day, 'yyyy-MM-dd'),
      hours: Math.random() * 5 + 0.5
    };
  });
};

const StudyHoursChart = ({ data: initialData }: StudyHoursChartProps) => {
  const [selectedCourse, setSelectedCourse] = useState("1");
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([0, 1]); // Últimas 2 semanas por defecto
  const [startDate, setStartDate] = useState<Date | undefined>(subWeeks(new Date(), 3));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [weekData, setWeekData] = useState<Record<number, any[]>>({
    0: generateWeekData(0),
    1: generateWeekData(1),
    2: generateWeekData(2),
    3: generateWeekData(3),
  });

  // Colores para las líneas
  const lineColors = ["#3B82F6", "#8B5CF6", "#EC4899", "#10B981"];

  const toggleWeekSelection = (week: number) => {
    if (selectedWeeks.includes(week)) {
      setSelectedWeeks(selectedWeeks.filter(w => w !== week));
    } else if (selectedWeeks.length < 4) {
      setSelectedWeeks([...selectedWeeks, week]);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-2">
          <h3 className="text-lg font-medium">Horas de estudio diarias</h3>
          <div className="flex flex-wrap gap-2">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar curso" />
              </SelectTrigger>
              <SelectContent>
                {COURSES.map(course => (
                  <SelectItem key={course.id} value={course.id.toString()}>{course.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    {startDate ? format(startDate, 'dd/MM/yyyy') : 'Inicio'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    {endDate ? format(endDate, 'dd/MM/yyyy') : 'Fin'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {[0, 1, 2, 3].map((week) => (
            <Button
              key={week}
              size="sm"
              variant={selectedWeeks.includes(week) ? "default" : "outline"}
              onClick={() => toggleWeekSelection(week)}
            >
              Sem {week + 1}
            </Button>
          ))}
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart margin={{ left: 0, right: 20, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                allowDuplicatedCategory={false}
                padding={{ left: 0, right: 0 }}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [`${value} horas`, `Semana ${parseInt(name) + 1}`]}
                labelFormatter={(label) => `${label}`}
              />
              <Legend />
              
              {selectedWeeks.map((week, index) => (
                <Line 
                  key={week}
                  name={`Semana ${week + 1}`}
                  data={weekData[week]}
                  type="linear"
                  dataKey="hours"
                  stroke={lineColors[index % lineColors.length]}
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyHoursChart;
