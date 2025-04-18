
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const COURSES = [
  { id: 1, name: "Gestión de Proyectos" },
  { id: 2, name: "Metodologías Ágiles" },
  { id: 3, name: "PRINCE2" }
];

const DAYS_FULL = {
  'Lu': 'Lunes',
  'Ma': 'Martes',
  'Mi': 'Miércoles',
  'Ju': 'Jueves',
  'Vi': 'Viernes',
  'Sa': 'Sábado',
  'Do': 'Domingo'
};

// Función para generar datos semanales
const generateWeekData = (weekOffset: number) => {
  const days = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
  return days.map(day => ({
    day,
    dayFull: DAYS_FULL[day as keyof typeof DAYS_FULL],
    hours: Number((Math.random() * 5 + 0.5).toFixed(1))
  }));
};

interface StudyHoursChartProps {
  data: Array<{ name: string; hours: number }>;
}

const StudyHoursChart = ({ data: initialData }: StudyHoursChartProps) => {
  const [selectedCourse, setSelectedCourse] = useState("1");
  const [selectedWeeks, setSelectedWeeks] = useState<string[]>(["4"]);
  const [weekData] = useState({
    "1": generateWeekData(0),
    "2": generateWeekData(1),
    "3": generateWeekData(2),
    "4": generateWeekData(3),
  });

  const lineColors = ["#3B82F6", "#8B5CF6", "#EC4899", "#10B981"];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dayFull = DAYS_FULL[label as keyof typeof DAYS_FULL];
      return (
        <div className="bg-white p-2 border rounded shadow">
          {payload.map((item: any, index: number) => (
            <div key={index} style={{ color: item.color }}>
              {`${dayFull}: ${item.value.toFixed(1)} horas`}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium">Horas de estudio diarias</h3>
          
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar curso" />
            </SelectTrigger>
            <SelectContent>
              {COURSES.map(course => (
                <SelectItem key={course.id} value={course.id.toString()}>{course.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ToggleGroup 
            type="multiple" 
            value={selectedWeeks}
            onValueChange={(value) => {
              if (value.length > 0) {
                setSelectedWeeks(value);
              }
            }}
            className="justify-start"
          >
            {[4, 3, 2, 1].map((week) => (
              <ToggleGroupItem 
                key={week} 
                value={week.toString()}
                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                Semana {week}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart margin={{ left: 0, right: 20, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="day"
                allowDuplicatedCategory={false}
                padding={{ left: 0, right: 0 }}
              />
              <YAxis 
                label={{ value: 'Horas', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {selectedWeeks.map((week) => (
                <Line 
                  key={week}
                  name={`Semana ${week}`}
                  data={weekData[week]}
                  type="monotone"
                  dataKey="hours"
                  stroke={lineColors[parseInt(week) - 1]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
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
