
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface StudyHoursChartProps {
  data: Array<{ name: string; hours: number }>;
}

const StudyHoursChart = ({ data }: StudyHoursChartProps) => {
  // Asegurarse de que data es un array antes de renderizar el gráfico
  const chartData = Array.isArray(data) ? data : [];
  
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-4">Horas de estudio diarias</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="hours" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyHoursChart;
