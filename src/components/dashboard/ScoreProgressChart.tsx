
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

interface ScoreProgressChartProps {
  data: Array<{ date: string; score: number }>;
  className?: string;
}

const ScoreProgressChart = ({ data, className }: ScoreProgressChartProps) => {
  // Umbrales de puntuación
  const MIN_PASSING_SCORE = 70;
  
  // Procesar datos para el gráfico
  const chartData = data.map(item => {
    let date;
    try {
      date = parseISO(item.date);
    } catch (e) {
      console.error("Error parsing date:", item.date, e);
      date = new Date();
    }

    return {
      ...item,
      formattedDate: isValid(date) ? format(date, 'dd/MM', { locale: es }) : '??/??'
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <div className="font-medium">{format(parseISO(data.date), "d 'de' MMMM", { locale: es })}</div>
          <div>{payload[0].value}% puntuación</div>
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
          dataKey="formattedDate" 
        />
        <YAxis 
          domain={[0, 100]} 
          ticks={[0, 25, 50, 75, 100]}
        />
        <Tooltip content={<CustomTooltip />} />
        
        <ReferenceLine 
          y={MIN_PASSING_SCORE} 
          stroke="#000000" 
          strokeWidth={1} 
        />
        
        <Line 
          type="monotone" 
          dataKey="score" 
          stroke="#10B981" 
          strokeWidth={2}
          dot={{ r: 6, fill: "#10B981" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ScoreProgressChart;
