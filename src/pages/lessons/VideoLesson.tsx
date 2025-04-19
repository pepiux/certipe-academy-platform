
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
  ChevronRight,
  Subtitles
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CourseModule, Lesson } from "@/services/courseService";

const VideoLesson = () => {
  const { courseId, lessonId } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [showCourseContent, setShowCourseContent] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showCaptions, setShowCaptions] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const volumeControlRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  const courseData = {
    id: parseInt(courseId || "1"),
    title: "Fundamentos de Gestión de Proyectos",
    modules: [
      {
        id: 1,
        title: "Introducción a la Gestión de Proyectos",
        lessons: [
          { id: 1, title: "¿Qué es un proyecto?", duration: "15:30", completed: true, type: "video" as const },
          { id: 2, title: "Roles en la gestión de proyectos", duration: "22:45", completed: true, type: "video" as const },
          { id: 3, title: "Ciclo de vida del proyecto", duration: "18:20", completed: true, type: "reading" as const }
        ]
      } as CourseModule,
      {
        id: 2,
        title: "Planificación de Proyectos",
        lessons: [
          { id: 4, title: "Definición de objetivos y alcance", duration: "25:10", completed: true, type: "audio" as const },
          { id: 5, title: "Estimación de tiempos y recursos", duration: "30:15", completed: false, type: "video" as const, description: "Aprende técnicas efectivas para estimar los recursos y tiempos necesarios para completar con éxito las tareas del proyecto." },
          { id: 6, title: "Creación de cronogramas", duration: "28:40", completed: false, type: "reading" as const }
        ]
      } as CourseModule,
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
        handleLessonCompleted();
      };

      videoRef.addEventListener("timeupdate", updateProgress);
      videoRef.addEventListener("loadedmetadata", handleLoadedMetadata);
      videoRef.addEventListener("ended", handleEnded);

      videoRef.volume = volume;

      return () => {
        videoRef.removeEventListener("timeupdate", updateProgress);
        videoRef.removeEventListener("loadedmetadata", handleLoadedMetadata);
        videoRef.removeEventListener("ended", handleEnded);
      };
    }
  }, [videoRef]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isDocFullScreen = document.fullscreenElement !== null;
      setIsFullScreen(isDocFullScreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullScreen) {
        exitFullScreen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullScreen]);

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
    console.log(`Marking lesson ${lessonId} as completed`);
    
    if (lessonData.nextLessonId) {
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
    if (videoContainerRef.current) {
      if (!isFullScreen) {
        if (videoContainerRef.current.requestFullscreen) {
          videoContainerRef.current.requestFullscreen();
        } else if ((videoContainerRef.current as any).webkitRequestFullscreen) {
          (videoContainerRef.current as any).webkitRequestFullscreen();
        } else if ((videoContainerRef.current as any).mozRequestFullScreen) {
          (videoContainerRef.current as any).mozRequestFullScreen();
        } else if ((videoContainerRef.current as any).msRequestFullscreen) {
          (videoContainerRef.current as any).msRequestFullscreen();
        }
      } else {
        exitFullScreen();
      }
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
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

  const toggleCourseContent = () => {
    setShowCourseContent(!showCourseContent);
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="h-5 w-5" />;
    if (volume < 0.5) return <Volume className="h-5 w-5" />;
    if (volume < 0.8) return <Volume1 className="h-5 w-5" />;
    return <Volume2 className="h-5 w-5" />;
  };

  const isCompact = false;

  return (
    <div className="flex h-full">
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
              onClick={toggleCourseContent}
            >
              {showCourseContent ? 'Ocultar contenido' : 'Mostrar contenido'}
            </Button>
          </div>
          
          <h1 className="text-2xl font-bold mb-2 text-left">{lessonData.title}</h1>
          <p className="text-muted-foreground mb-6 text-left">{lessonData.description}</p>
          
          <div className="bg-black rounded-lg overflow-hidden shadow-lg mb-6">
            <div ref={videoContainerRef} className="relative">
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
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-white" 
                            onClick={handleRewind}
                          >
                            <Rewind className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Retroceder 10s</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-white" 
                            onClick={handlePlayPause}
                          >
                            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isPlaying ? "Pausar" : "Reproducir"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-white" 
                            onClick={handleFastForward}
                          >
                            <FastForward className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Avanzar 10s</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <div className="relative" ref={volumeControlRef}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-white" 
                              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                            >
                              {getVolumeIcon()}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Volumen</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      {showVolumeSlider && (
                        <div className="absolute bottom-12 left-0 bg-black/90 rounded p-2 flex flex-col items-center justify-center w-12">
                          <div className="h-24">
                            <Slider
                              orientation="vertical"
                              defaultValue={[volume]}
                              max={1}
                              step={0.01}
                              value={[volume]}
                              onValueChange={handleVolumeChange}
                              className="h-full"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {!isCompact && (
                      <span className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    )}

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-white" 
                            onClick={handleToggleCaptions}
                          >
                            <Subtitles className={`h-5 w-5 ${showCaptions ? 'text-primary' : 'text-white'}`} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Subtítulos</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-white" onClick={handleFullScreen}>
                            <Maximize className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Pantalla completa</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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

      {!isFullScreen && (
        <>
          {showCourseContent ? (
            <div className="w-full md:w-1/4 border-l border-border bg-background h-screen overflow-y-auto p-4 fixed right-0 top-0 bottom-0 z-10 md:relative">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-left">Contenido del curso</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleCourseContent}
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
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleCourseContent}
              className="fixed right-4 top-20 z-10 p-2 bg-background border border-border rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default VideoLesson;
