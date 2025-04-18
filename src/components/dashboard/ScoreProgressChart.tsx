
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Datos de ejemplo para cuestionarios
const QUIZZES = [
  { id: 1, name: "PMP Project Management Knowledge Areas", minScore: 70 },
  { id: 2, name: "Metodologías Ágiles y Scrum", minScore: 75 },
  { id: 3, name: "Fundamentos de PRINCE2", minScore: 80 }
];

// Función para generar intentos simulados ordenados
const generateAttemptData = (quizId: number) => {
  return Array.from({ length: 7 }, (_, i) => ({
    name: `${i + 1}`,
    score: Math.floor(Math.random() * 30) + 65,
    date: format(new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000), 'dd/MM/yyyy')
  }));
};

interface ScoreProgressChartProps {
  data: Array<{ name: string; score: number }>;
}

import { format } from "date-fns";
import { es } from "date-fns/locale";

const ScoreProgressChart = ({ data: initialData }: ScoreProgressChartProps) => {
  const [selectedQuiz, setSelectedQuiz] = useState("1");
  const [quizData] = useState({
    1: { attempts: generateAttemptData(1), minScore: 70 },
    2: { attempts: generateAttemptData(2), minScore: 75 },
    3: { attempts: generateAttemptData(3), minScore: 80 },
  });

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-2">
          <h3 className="text-lg font-medium">Progreso de puntuación</h3>
          <Select value={selectedQuiz} onValueChange={setSelectedQuiz}>
            <SelectTrigger className="w-full md:w-[400px]">
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
            <LineChart margin={{ left: 0, right: 20, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                label={{ value: 'Intentos', position: 'bottom' }}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value, name) => [`${value}%`, 'Puntuación']}
                labelFormatter={(name) => `Intento ${name}`}
              />
              
              {/* Línea base del puntaje mínimo */}
              <ReferenceLine
                y={quizData[parseInt(selectedQuiz)].minScore}
                stroke="#000000"
                strokeWidth={1}
                label={{ value: 'Puntaje mínimo', position: 'right' }}
              />
              
              <Line 
                type="monotone"
                dataKey="score"
                data={quizData[parseInt(selectedQuiz)].attempts}
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ r: 6, fill: "#8B5CF6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreProgressChart;
