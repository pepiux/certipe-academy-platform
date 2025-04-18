import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle } from "lucide-react";

interface TestResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
}

const TestLesson = () => {
  const [testResult, setTestResult] = useState<TestResult>({
    score: 75,
    totalQuestions: 20,
    correctAnswers: 15,
    incorrectAnswers: 5,
  });

  return (
    <div className="container mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Resultados del Test</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress 
            value={testResult.score} 
            className="h-2 mb-4"
            indicatorClassName={testResult.score >= 70 ? "bg-green-500" : "bg-red-500"}
          />
          <div className="flex justify-between mb-2">
            <span>Puntuación:</span>
            <span>{testResult.score}%</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Preguntas correctas:</span>
            <span className="flex items-center gap-1 text-green-500">
              {testResult.correctAnswers} <CheckCircle className="h-4 w-4" />
            </span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Preguntas incorrectas:</span>
            <span className="flex items-center gap-1 text-red-500">
              {testResult.incorrectAnswers} <XCircle className="h-4 w-4" />
            </span>
          </div>
          <Button>Revisar respuestas</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestLesson;
