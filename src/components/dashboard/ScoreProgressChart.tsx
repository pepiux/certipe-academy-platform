
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
  const chartData = data.map((item, index) => {
    let date;
    try {
      date = parseISO(item.date);
    } catch (e) {
      console.error("Error parsing date:", item.date, e);
      date = new Date();
    }

    return {
      ...item,
      intento: index + 1, // Usar número de intento como etiqueta en el eje X
      formattedDate: isValid(date) ? format(date, 'dd/MM', { locale: es }) : '??/??'
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <div className="font-medium">Intento {data.intento}</div>
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
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="intento" 
          axisLine={{stroke: '#e5e7eb'}}
          tickLine={false}
          label={{ value: 'Intentos', position: 'insideBottom', offset: -5 }}
        />
        <YAxis 
          domain={[0, 100]} 
          ticks={[0, 25, 50, 75, 100]}
          axisLine={{stroke: '#e5e7eb'}}
          tickLine={false}
          label={{ value: 'Puntaje %', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip content={<CustomTooltip />} />
        
        <ReferenceLine 
          y={MIN_PASSING_SCORE} 
          stroke="#000000" 
          strokeWidth={1} 
          strokeDasharray="3 3"
        />
        
        <Line 
          type="monotone" 
          dataKey="score" 
          stroke="#10B981" 
          strokeWidth={2}
          dot={{ r: 6, fill: "#10B981", strokeWidth: 2, stroke: "#ffffff" }}
          activeDot={{ r: 8, fill: "#10B981", strokeWidth: 2, stroke: "#ffffff" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ScoreProgressChart;
