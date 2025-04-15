
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface CourseOverviewProps {
  description: string;
  objectives: string[];
  instructor: string;
  rating: number;
  totalReviews: number;
}

const CourseOverview = ({ 
  description, 
  objectives, 
  instructor, 
  rating, 
  totalReviews 
}: CourseOverviewProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-2">Descripción del curso</h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        
        <h3 className="font-semibold mb-2">Lo que aprenderás</h3>
        <ul className="space-y-2 mb-6">
          {objectives.map((objective, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className="text-primary mt-0.5">✓</span>
              <span>{objective}</span>
            </li>
          ))}
        </ul>
        
        <h3 className="font-semibold mb-2">Instructor</h3>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            {instructor.charAt(0)}
          </div>
          <div>
            <p className="font-medium">{instructor}</p>
            <p className="text-sm text-muted-foreground">Instructor Senior</p>
          </div>
        </div>

        <h3 className="font-semibold mb-2">Valoraciones</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm">
            {rating} ({totalReviews} reseñas)
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseOverview;
