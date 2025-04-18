
import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  Area
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, isValid, parseISO } from "date-fns";
import { es } from "date-fns/locale";

const COURSES = [
  { id: 1, name: "Gestión de Proyectos", minStudyHoursPerDay: 2.5 },
  { id: 2, name: "Metodologías Ágiles", minStudyHoursPerDay: 2.0 },
  { id: 3, name: "PRINCE2", minStudyHoursPerDay: 3.0 }
];

interface StudyHoursChartProps {
  data: Array<{ date: string; hours: number }>;
  className?: string;
}

const StudyHoursChart = ({ data, className }: StudyHoursChartProps) => {
  const [selectedCourse, setSelectedCourse] = useState("1");
  const course = COURSES.find(c => c.id === parseInt(selectedCourse)) || COURSES[0];
  
  // Transformar los datos para incluir el día de la semana
  const chartData = data.map(item => {
    let date;
    try {
      date = new Date(item.date);
    } catch (e) {
      console.error("Error parsing date:", item.date, e);
      date = new Date();
    }

    const dayOfWeek = isValid(date) ? format(date, "EEE", { locale: es }).substring(0, 2) : "??";
    const formattedDate = isValid(date) ? format(date, "dd/MM") : "??/??";
    
    return {
      ...item,
      day: dayOfWeek,
      displayDate: formattedDate,
      threshold: course.minStudyHoursPerDay
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <div className="font-medium">{data.date ? format(new Date(data.date), "EEEE d 'de' MMMM", { locale: es }) : ''}</div>
          <div>{payload[0].value.toFixed(1)} horas</div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <LineChart margin={{ left: 0, right: 20, top: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="displayDate"
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
          data={chartData}
        />
        
        <ReferenceLine
          y={course.minStudyHoursPerDay}
          stroke="#000000"
          strokeWidth={1}
        />
        
        <Line 
          type="monotone"
          dataKey="hours"
          data={chartData}
          stroke="#8B5CF6"
          strokeWidth={2}
          dot={{ r: 6, fill: "#8B5CF6" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default StudyHoursChart;
