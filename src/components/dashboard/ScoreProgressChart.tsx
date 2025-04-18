
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

interface ScoreProgressChartProps {
  data: { date: string; score: number }[];
  className?: string;
}

const ScoreProgressChart = ({ data, className }: ScoreProgressChartProps) => {
  // Transform data to add attempt numbers
  const chartData = data.map((item, index) => ({
    ...item,
    attempt: index + 1,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <div className="font-medium">Intento {label}</div>
          <div>{payload[0].value}% de puntuación</div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <LineChart
        data={chartData}
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="attempt"
          label={{ value: "Intento", position: "insideBottom", dy: 10 }}
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
          content={<CustomTooltip />}
        />
        <ReferenceLine
          y={70}
          label="Mínimo"
          stroke="#8B5CF6"
          strokeDasharray="3 3"
        />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#0EA5E9"
          fill="#0EA5E9"
          fillOpacity={0.1}
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ScoreProgressChart;
