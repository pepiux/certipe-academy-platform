
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, Clock, Award } from "lucide-react";

interface CourseActionsProps {
  progress: number;
  lessons: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onContinue: () => void;
  onStart: () => void;
}

const CourseActions = ({
  progress,
  lessons,
  isFavorite,
  onToggleFavorite,
  onContinue,
  onStart,
}: CourseActionsProps) => {
  return (
    <Card className="sticky top-6">
      <CardContent className="p-6">
        {progress > 0 ? (
          <>
            <h3 className="font-semibold mb-3">Tu progreso</h3>
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span>{progress}% completado</span>
                <span>{Math.round(progress * lessons / 100)}/{lessons} lecciones</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <Button className="w-full mb-3" onClick={onContinue}>
              Continuar aprendiendo
            </Button>
          </>
        ) : (
          <>
            <h3 className="font-semibold mb-3">Inscríbete en este curso</h3>
            <div className="mb-6 space-y-3">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-muted-foreground" />
                <span className="text-sm">Acceso de por vida</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={16} className="text-muted-foreground" />
                <span className="text-sm">Certificado de finalización</span>
              </div>
            </div>
            <Button className="w-full mb-3" onClick={onStart}>
              Comenzar ahora
            </Button>
          </>
        )}
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
          onClick={onToggleFavorite}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          {isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseActions;
