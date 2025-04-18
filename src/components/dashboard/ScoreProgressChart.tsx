
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Datos de ejemplo para cuestionarios
const QUIZZES = [
  { id: 1, name: "PMP Project Management Knowledge Areas" },
  { id: 2, name: "Metodologías Ágiles y Scrum" },
  { id: 3, name: "Fundamentos de PRINCE2" }
];

// Función para generar intentos simulados
const generateAttemptData = (quizId: number) => {
  return Array.from({ length: 7 }, (_, i) => {
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - (i * 5));
    
    return {
      name: `Intento ${i + 1}`,
      score: Math.floor(Math.random() * 30) + 65,
      date: format(dateObj, 'dd/MM/yyyy')
    };
  }).reverse();
};

interface ScoreProgressChartProps {
  data: Array<{ name: string; score: number }>;
}

import { format } from "date-fns";
import { es } from "date-fns/locale";

const ScoreProgressChart = ({ data: initialData }: ScoreProgressChartProps) => {
  const [selectedQuiz, setSelectedQuiz] = useState("1");
  const [attemptData, setAttemptData] = useState({
    1: generateAttemptData(1),
    2: generateAttemptData(2),
    3: generateAttemptData(3),
  });

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-2">
          <h3 className="text-lg font-medium">Progreso de puntuación</h3>
          <Select value={selectedQuiz} onValueChange={setSelectedQuiz}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar cuestionario" />
            </SelectTrigger>
            <SelectContent>
              {QUIZZES.map(quiz => (
                <SelectItem key={quiz.id} value={quiz.id.toString()}>{quiz.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={attemptData[parseInt(selectedQuiz)]} 
              margin={{ left: 0, right: 20, top: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Puntuación']}
                labelFormatter={(name, payload) => {
                  if (payload && payload.length > 0 && payload[0].payload) {
                    return `${name} - ${payload[0].payload.date}`;
                  }
                  return name;
                }}
              />
              <Line 
                type="linear" 
                dataKey="score" 
                stroke="#8B5CF6" 
                strokeWidth={2} 
                dot={{ strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreProgressChart;
