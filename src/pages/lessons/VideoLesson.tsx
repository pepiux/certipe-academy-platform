
import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings, 
  ArrowLeft, 
  Rewind, 
  FastForward,
  Volume1,
  Volume,
  Check,
  ChevronRight
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import CourseContent from "@/components/courses/CourseContent"; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";

const VideoLesson = () => {
  const { courseId, lessonId } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [showCourseContent, setShowCourseContent] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showCaptions, setShowCaptions] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const volumeControlRef = useRef<HTMLDivElement>(null);

  // Course and lesson data
  const courseData = {
    id: parseInt(courseId || "1"),
    title: "Fundamentos de Gestión de Proyectos",
    modules: [
      {
        id: 1,
        title: "Introducción a la Gestión de Proyectos",
        lessons: [
          { id: 1, title: "¿Qué es un proyecto?", duration: "15:30", completed: true, type: "video" },
          { id: 2, title: "Roles en la gestión de proyectos", duration: "22:45", completed: true, type: "video" },
          { id: 3, title: "Ciclo de vida del proyecto", duration: "18:20", completed: true, type: "reading" }
        ]
      },
      {
        id: 2,
        title: "Planificación de Proyectos",
        lessons: [
          { id: 4, title: "Definición de objetivos y alcance", duration: "25:10", completed: true, type: "audio" },
          { id: 5, title: "Estimación de tiempos y recursos", duration: "30:15", completed: false, type: "video", description: "Aprende técnicas efectivas para estimar los recursos y tiempos necesarios para completar con éxito las tareas del proyecto." },
          { id: 6, title: "Creación de cronogramas", duration: "28:40", completed: false, type: "reading" }
        ]
      },
    ],
  };

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

      const handleEnded = () => {
        // Mark lesson as completed and navigate to next lesson
        handleLessonCompleted();
      };

      videoRef.addEventListener("timeupdate", updateProgress);
      videoRef.addEventListener("loadedmetadata", handleLoadedMetadata);
      videoRef.addEventListener("ended", handleEnded);

      // Set initial volume
      videoRef.volume = volume;

      return () => {
        videoRef.removeEventListener("timeupdate", updateProgress);
        videoRef.removeEventListener("loadedmetadata", handleLoadedMetadata);
        videoRef.removeEventListener("ended", handleEnded);
      };
    }
  }, [videoRef]);

  // Handle click outside volume slider
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (volumeControlRef.current && !volumeControlRef.current.contains(event.target as Node)) {
        setShowVolumeSlider(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [volumeControlRef]);

  const handleLessonCompleted = () => {
    // In a real app, you would make an API call to mark the lesson as completed
    console.log(`Marking lesson ${lessonId} as completed`);
    
    // Navigate to the next lesson if available
    if (lessonData.nextLessonId) {
      // Determine the type of the next lesson
      const nextLesson = findLessonById(lessonData.nextLessonId);
      if (nextLesson) {
        window.location.href = `/dashboard/courses/${courseId}/lesson/${lessonData.nextLessonId}/${nextLesson.type}`;
      }
    }
  };

  const findLessonById = (id: number) => {
    for (const module of courseData.modules) {
      const lesson = module.lessons.find(l => l.id === id);
      if (lesson) return lesson;
    }
    return null;
  };

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

  const handleRewind = () => {
    if (videoRef) {
      videoRef.currentTime = Math.max(0, videoRef.currentTime - 10);
    }
  };

  const handleFastForward = () => {
    if (videoRef) {
      videoRef.currentTime = Math.min(videoRef.duration, videoRef.currentTime + 10);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (videoRef) {
      videoRef.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const handleFullScreen = () => {
    if (videoRef) {
      if (videoRef.requestFullscreen) {
        videoRef.requestFullscreen();
      }
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

  const handlePlaybackRateChange = (rate: number) => {
    if (videoRef) {
      videoRef.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const handleToggleCaptions = () => {
    setShowCaptions(!showCaptions);
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="h-5 w-5" />;
    if (volume < 0.5) return <Volume className="h-5 w-5" />;
    if (volume < 0.8) return <Volume1 className="h-5 w-5" />;
    return <Volume2 className="h-5 w-5" />;
  };

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className={`flex-grow transition-all ${showCourseContent ? 'max-w-[75%]' : 'max-w-full'}`}>
        <div className="container max-w-5xl mx-auto py-6">
          <div className="flex items-center mb-6">
            <Link to={`/dashboard/courses/${courseId}`} className="flex items-center text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al curso
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-auto md:hidden"
              onClick={() => setShowCourseContent(!showCourseContent)}
            >
              {showCourseContent ? 'Ocultar contenido' : 'Mostrar contenido'}
            </Button>
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
              
              {showCaptions && (
                <div className="absolute bottom-16 left-0 right-0 text-center">
                  <div className="bg-black/70 text-white p-2 mx-auto max-w-lg">
                    Subtítulos de ejemplo para el video de la lección
                  </div>
                </div>
              )}
              
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
                  <div className="flex items-center space-x-3">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white" 
                      onClick={handleRewind}
                    >
                      <Rewind className="h-5 w-5" />
                    </Button>
                    
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
                      onClick={handleFastForward}
                    >
                      <FastForward className="h-5 w-5" />
                    </Button>
                    
                    <div className="relative" ref={volumeControlRef}>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white" 
                        onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                      >
                        {getVolumeIcon()}
                      </Button>
                      
                      {showVolumeSlider && (
                        <div className="absolute bottom-10 left-0 w-24 h-36 bg-black/90 rounded p-4 flex flex-col items-center justify-center">
                          <Slider
                            orientation="vertical"
                            defaultValue={[volume]}
                            max={1}
                            step={0.01}
                            className="h-24"
                            value={[volume]}
                            onValueChange={handleVolumeChange}
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-white mt-2" 
                            onClick={handleMuteToggle}
                          >
                            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <span className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white">
                          <Settings className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Velocidad de reproducción</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                            <DropdownMenuItem 
                              key={rate} 
                              onClick={() => handlePlaybackRateChange(rate)}
                              className="flex justify-between"
                            >
                              {rate === 1 ? 'Normal' : `${rate}x`}
                              {playbackRate === rate && <Check className="h-4 w-4" />}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleToggleCaptions} className="flex justify-between">
                          Subtítulos
                          {showCaptions && <Check className="h-4 w-4" />}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <Button variant="ghost" size="icon" className="text-white" onClick={handleFullScreen}>
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
                onClick={() => {
                  // Mark current lesson as completed and navigate to next lesson
                  handleLessonCompleted();
                }}
              >
                Siguiente lección
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Course Content Sidebar */}
      {showCourseContent && (
        <div className="w-full md:w-1/4 border-l border-border bg-background h-screen overflow-y-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Contenido del curso</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowCourseContent(false)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <CourseContent 
            modules={courseData.modules} 
            currentLessonId={parseInt(lessonId || "0")} 
            onLessonClick={(lessonId) => {
              const lesson = findLessonById(lessonId);
              if (lesson) {
                window.location.href = `/dashboard/courses/${courseId}/lesson/${lessonId}/${lesson.type}`;
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default VideoLesson;
