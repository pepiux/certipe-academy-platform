
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardQuizzes from "./DashboardQuizzes";

interface DashboardQuizzesSectionProps {
  loading: boolean;
  error: string | null;
  quizzes: any[];
  onStartQuiz: (quizId: number) => void;
}

const DashboardQuizzesSection = ({ 
  loading, 
  error, 
  quizzes, 
  onStartQuiz 
}: DashboardQuizzesSectionProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">Cuestionarios</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1 text-primary" 
          onClick={() => navigate('/dashboard/quizzes')}
        >
          Ver todos <ChevronRight size={16} />
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Cargando cuestionarios...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : quizzes.length > 0 ? (
        <DashboardQuizzes
          quizzes={quizzes}
          onStartQuiz={onStartQuiz}
        />
      ) : (
        <div className="text-center py-8">No se encontraron cuestionarios disponibles</div>
      )}
    </div>
  );
};

export default DashboardQuizzesSection;
