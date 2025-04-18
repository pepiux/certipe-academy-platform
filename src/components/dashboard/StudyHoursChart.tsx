
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COURSES = [
  { id: 1, name: "Gestión de Proyectos" },
  { id: 2, name: "Metodologías Ágiles" },
  { id: 3, name: "PRINCE2" }
];

// Función para generar datos semanales
const generateWeekData = (weekOffset: number) => {
  const days = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
  return days.map(day => ({
    name: day,
    hours: Math.random() * 5 + 0.5
  }));
};

interface StudyHoursChartProps {
  data: Array<{ name: string; hours: number }>;
}

const StudyHoursChart = ({ data: initialData }: StudyHoursChartProps) => {
  const [selectedCourse, setSelectedCourse] = useState("1");
  const [selectedWeeks] = useState<number[]>([0, 1, 2, 3]);
  const [weekData] = useState({
    0: generateWeekData(0),
    1: generateWeekData(1),
    2: generateWeekData(2),
    3: generateWeekData(3),
  });

  const lineColors = ["#3B82F6", "#8B5CF6", "#EC4899", "#10B981"];

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-2">
          <h3 className="text-lg font-medium">Horas de estudio diarias</h3>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-full md:w-[400px]">
              <SelectValue placeholder="Seleccionar curso" />
            </SelectTrigger>
            <SelectContent>
              {COURSES.map(course => (
                <SelectItem key={course.id} value={course.id.toString()}>{course.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              <YAxis label={{ value: 'Horas', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value) => [`${value} horas`]}
                labelFormatter={(label) => `${label}`}
              />
              <Legend />
              
              {selectedWeeks.map((week, index) => (
                <Line 
                  key={week}
                  name={`Semana ${week + 1}`}
                  data={weekData[week]}
                  type="monotone"
                  dataKey="hours"
                  stroke={lineColors[index % lineColors.length]}
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
