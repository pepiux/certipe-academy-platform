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
  Label,
  Area,
} from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ScoreProgressChartProps {
  data: { date: string; score: number }[];
  className?: string;
}

const ScoreProgressChart = ({ data, className }: ScoreProgressChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => format(new Date(value), "dd/MM")}
        />
        <YAxis 
          domain={[0, 100]}
          label={{ 
            value: "Puntuación %", 
            angle: -90, 
            position: 'insideLeft',
            style: { textAnchor: 'middle' }
          }} 
        />
        <Tooltip
          formatter={(value) => [`${value}%`, 'Puntuación']}
          labelFormatter={(value) => format(new Date(value), "dd 'de' MMMM", { locale: es })}
        />
        <ReferenceLine
          y={70}
          label="Mínimo"
          stroke="#FF8C42"
          strokeDasharray="3 3"
        />
        <ReferenceLine
          y={data.length > 0 ? data[data.length - 1].score : 0}
          stroke="#82ca9d"
          strokeDasharray="3 3"
        >
          <Label value="Actual" offset={0} position="insideBottomRight" />
        </ReferenceLine>
        <Area
          type="monotone"
          dataKey="score"
          stroke="#0EA5E9"
          fill="#0EA5E9"
          fillOpacity={0.1}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ScoreProgressChart;
