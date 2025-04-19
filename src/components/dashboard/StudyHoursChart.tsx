
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { format, parseISO, isValid } from "date-fns";
import { es } from "date-fns/locale";

interface StudyHoursChartProps {
  data: Array<{ date: string; hours: number }>;
  className?: string;
}

const StudyHoursChart = ({ data, className }: StudyHoursChartProps) => {
  // Valor umbral diario de horas de estudio
  const MIN_STUDY_HOURS = 2.5;
  
  // Procesar datos para el gráfico
  const chartData = data.map(item => {
    let date;
    try {
      date = new Date(item.date);
    } catch (e) {
      console.error("Error parsing date:", item.date, e);
      date = new Date();
    }

    // Usar abreviaturas en español: Lu, Ma, Mi, Ju, Vi, Sa, Do
    const dayMap: Record<string, string> = {
      "lun": "Lu",
      "mar": "Ma",
      "mié": "Mi",
      "jue": "Ju",
      "vie": "Vi",
      "sáb": "Sa",
      "dom": "Do"
    };

    const fullDay = isValid(date) ? format(date, "EEE", { locale: es }).toLowerCase() : "??";
    const dayOfWeek = dayMap[fullDay] || fullDay.substring(0, 2);
    
    return {
      ...item,
      day: dayOfWeek
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
      <LineChart 
        data={chartData}
        margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="day" 
          padding={{ left: 5, right: 5 }}
        />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        
        <ReferenceLine 
          y={MIN_STUDY_HOURS} 
          stroke="#000000" 
          strokeWidth={1} 
        />
        
        <Line 
          type="monotone" 
          dataKey="hours" 
          stroke="#8B5CF6" 
          strokeWidth={2}
          dot={{ r: 6, fill: "#8B5CF6" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default StudyHoursChart;
