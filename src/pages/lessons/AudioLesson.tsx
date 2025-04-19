
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Play, Pause, Volume2, VolumeX, Settings, ArrowLeft, FileAudio } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

const AudioLesson = () => {
  const { courseId, lessonId } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  const lessonData = {
    id: parseInt(lessonId || "1"),
    title: "Definición de objetivos y alcance",
    description: "Aprende a definir correctamente los objetivos y el alcance de tu proyecto para asegurar su éxito.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    courseId: parseInt(courseId || "1"),
    duration: "25:10",
    nextLessonId: 5,
    prevLessonId: 3
  };

  useEffect(() => {
    if (audioRef) {
      const updateProgress = () => {
        const currentProgress = (audioRef.currentTime / audioRef.duration) * 100;
        setCurrentTime(audioRef.currentTime);
        setProgress(currentProgress);
      };

      const handleLoadedMetadata = () => {
        setDuration(audioRef.duration);
      };

      audioRef.addEventListener("timeupdate", updateProgress);
      audioRef.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        audioRef.removeEventListener("timeupdate", updateProgress);
        audioRef.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, [audioRef]);

  const handlePlayPause = () => {
    if (audioRef) {
      if (isPlaying) {
        audioRef.pause();
      } else {
        audioRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (audioRef) {
      audioRef.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / progressBar.offsetWidth;
      audioRef.currentTime = pos * audioRef.duration;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center p-8">
            <FileAudio className="h-24 w-24 text-primary/20 mb-6" />
            
            <audio
              ref={(el) => setAudioRef(el)}
              src={lessonData.audioUrl}
              className="hidden"
            />
            
            <div className="w-full mb-4">
              <div 
                className="w-full h-2 bg-gray-200 rounded-full cursor-pointer"
                onClick={handleProgressClick}
              >
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
              
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleMuteToggle}
                className="rounded-full"
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              
              <Button 
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={handlePlayPause}
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              
              <Button 
                variant="outline" 
                size="icon"
                className="rounded-full"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
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
            onClick={() => window.location.href = `/dashboard/courses/${lessonData.courseId}/lesson/${lessonData.nextLessonId}/video`}
          >
            Siguiente lección
          </Button>
        )}
      </div>
    </div>
  );
};

export default AudioLesson;
