
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ArrowLeft, Search, Printer, Download, ChevronRight, ArrowDown, ArrowUp } from "lucide-react";
import { Input } from "@/components/ui/input";

const ReadingLesson = () => {
  const { courseId, lessonId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const totalPages = 5;

  const lessonData = {
    id: parseInt(lessonId || "1"),
    title: "Ciclo de vida del proyecto",
    description: "Documento que detalla las diferentes fases del ciclo de vida de un proyecto y cómo se interrelacionan entre sí.",
    pdfUrl: "/sample-pdf.pdf", // This would be a real PDF in a production app
    courseId: parseInt(courseId || "1"),
    duration: "18:20",
    nextLessonId: 4,
    prevLessonId: 2
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would download the actual PDF
    console.log("Downloading PDF");
  };

  return (
    <div className="container max-w-5xl mx-auto py-6">
      <div className="flex items-center mb-6">
        <Link to={`/dashboard/courses/${courseId}`} className="flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al curso
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-2">{lessonData.title}</h1>
      <p className="text-muted-foreground mb-6">{lessonData.description}</p>
      
      <div className="bg-gray-100 rounded-lg p-3 mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <ArrowUp className="h-4 w-4 mr-1" />
            Anterior
          </Button>
          
          <div className="text-sm">
            Página {currentPage} de {totalPages}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Siguiente
            <ArrowDown className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative w-40">
            <Input
              placeholder="Buscar en documento..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          
          <Button variant="outline" size="icon" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6 border">
        <div className="aspect-[3/4] bg-white relative">
          {/* PDF content would be rendered here in a real app */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8">
              <img 
                src={`https://placehold.co/600x800?text=Página+${currentPage}+del+PDF`} 
                alt={`Página ${currentPage} del documento`}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        {lessonData.prevLessonId ? (
          <Button 
            variant="outline"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
        ) : (
          <div></div>
        )}
        
        {lessonData.nextLessonId && (
          <Button 
            onClick={() => window.location.href = `/dashboard/courses/${lessonData.courseId}/lesson/${lessonData.nextLessonId}/audio`}
          >
            Siguiente lección
          </Button>
        )}
      </div>
    </div>
  );
};

export default ReadingLesson;
