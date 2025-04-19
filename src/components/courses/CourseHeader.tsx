
import React from "react";
import { BookOpen, Clock } from "lucide-react";

interface CourseHeaderProps {
  title: string;
  description: string;
  image?: string;
  level?: string;
  category?: string;
  instructor?: string | { id: number; name: string };
  lessons?: number;
  duration?: string;
}

const CourseHeader = ({ 
  title, 
  description, 
  image = "https://placehold.co/800x450?text=Course+Banner", 
  level = "Intermedio", 
  category = "Gestión", 
  instructor = "Instructor",
  lessons = 0, 
  duration = "0h" 
}: CourseHeaderProps) => {
  // Convertir el instructor a string si es un objeto
  const instructorName = typeof instructor === 'object' ? instructor.name : instructor;

  return (
    <div className="relative rounded-xl overflow-hidden">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-[240px] object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
        <div className="text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary/10 text-white text-xs font-medium px-2 py-1 rounded">
              {level}
            </span>
            <span className="bg-white/20 text-white text-xs font-medium px-2 py-1 rounded">
              {category}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
          <div className="flex items-center gap-4 text-sm">
            <span>Por {instructorName}</span>
            <div className="flex items-center gap-1">
              <BookOpen size={16} />
              <span>{lessons} lecciones</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{duration}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
