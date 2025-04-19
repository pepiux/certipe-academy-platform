
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Play, Pause, Volume2, VolumeX, Maximize, Settings, ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

const VideoLesson = () => {
  const { courseId, lessonId } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

  const lessonData = {
    id: parseInt(lessonId || "1"),
    title: "Estimación de tiempos y recursos",
    description: "Aprende técnicas efectivas para estimar los recursos y tiempos necesarios para completar con éxito las tareas del proyecto.",
    videoUrl: "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
    courseId: parseInt(courseId || "1"),
    duration: "30:15",
    nextLessonId: 6,
    prevLessonId: 4
  };

  useEffect(() => {
    if (videoRef) {
      const updateProgress = () => {
        const currentProgress = (videoRef.currentTime / videoRef.duration) * 100;
        setCurrentTime(videoRef.currentTime);
        setProgress(currentProgress);
      };

      const handleLoadedMetadata = () => {
        setDuration(videoRef.duration);
      };

      videoRef.addEventListener("timeupdate", updateProgress);
      videoRef.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        videoRef.removeEventListener("timeupdate", updateProgress);
        videoRef.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, [videoRef]);

  const handlePlayPause = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef) {
      videoRef.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / progressBar.offsetWidth;
      videoRef.currentTime = pos * videoRef.duration;
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
      
      <div className="bg-black rounded-lg overflow-hidden shadow-lg mb-6">
        <div className="relative">
          <video
            ref={(el) => setVideoRef(el)}
            className="w-full aspect-video"
            poster="https://placehold.co/800x450?text=Video+Lesson"
            src={lessonData.videoUrl}
          />
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div 
              className="w-full h-2 bg-gray-700 rounded-full mb-4 cursor-pointer"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-primary rounded-full" 
                style={{ width: `${progress}%` }} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white" 
                  onClick={handlePlayPause}
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white" 
                  onClick={handleMuteToggle}
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                
                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="text-white">
                  <Settings className="h-5 w-5" />
                </Button>
                
                <Button variant="ghost" size="icon" className="text-white">
                  <Maximize className="h-5 w-5" />
                </Button>
              </div>
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
            onClick={() => window.location.href = `/dashboard/courses/${lessonData.courseId}/lesson/${lessonData.nextLessonId}/reading`}
          >
            Siguiente lección
          </Button>
        )}
      </div>
    </div>
  );
};

export default VideoLesson;
