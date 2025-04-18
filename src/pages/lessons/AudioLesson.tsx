
import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight,
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Settings, 
  ArrowLeft, 
  FileAudio,
  Rewind,
  FastForward,
  Volume1,
  Volume,
  Check
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
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

const AudioLesson = () => {
  const { courseId, lessonId } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [showCourseContent, setShowCourseContent] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showCaptions, setShowCaptions] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const volumeControlRef = useRef<HTMLDivElement>(null);

  // Course data
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
          { id: 4, title: "Definición de objetivos y alcance", duration: "25:10", completed: false, type: "audio" },
          { id: 5, title: "Estimación de tiempos y recursos", duration: "30:15", completed: false, type: "video" },
          { id: 6, title: "Creación de cronogramas", duration: "28:40", completed: false, type: "reading" }
        ]
      }
    ]
  };

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

      const handleEnded = () => {
        // Mark lesson as completed and navigate to next lesson
        handleLessonCompleted();
      };

      audioRef.addEventListener("timeupdate", updateProgress);
      audioRef.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioRef.addEventListener("ended", handleEnded);

      // Set initial volume
      audioRef.volume = volume;

      return () => {
        audioRef.removeEventListener("timeupdate", updateProgress);
        audioRef.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audioRef.removeEventListener("ended", handleEnded);
      };
    }
  }, [audioRef]);

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

  const handleRewind = () => {
    if (audioRef) {
      audioRef.currentTime = Math.max(0, audioRef.currentTime - 10);
    }
  };

  const handleFastForward = () => {
    if (audioRef) {
      audioRef.currentTime = Math.min(audioRef.duration, audioRef.currentTime + 10);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef) {
      audioRef.volume = newVolume;
      setIsMuted(newVolume === 0);
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

  const handlePlaybackRateChange = (rate: number) => {
    if (audioRef) {
      audioRef.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const handleToggleCaptions = () => {
    setShowCaptions(!showCaptions);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
          
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center p-8">
                <FileAudio className="h-24 w-24 text-primary/20 mb-6" />
                
                <audio
                  ref={(el) => setAudioRef(el)}
                  src={lessonData.audioUrl}
                  className="hidden"
                />
                
                {showCaptions && (
                  <div className="mb-4 p-3 bg-gray-100 rounded-md text-center max-w-md">
                    <p className="text-sm">Subtítulos de ejemplo para el audio de la lección</p>
                  </div>
                )}
                
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
                    onClick={handleRewind}
                    className="rounded-full"
                  >
                    <Rewind className="h-5 w-5" />
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
                    onClick={handleFastForward}
                    className="rounded-full"
                  >
                    <FastForward className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="flex items-center mt-6 space-x-4">
                  <div className="relative" ref={volumeControlRef}>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="rounded-full"
                      onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                    >
                      {getVolumeIcon()}
                    </Button>
                    
                    {showVolumeSlider && (
                      <div className="absolute bottom-12 left-0 w-48 bg-background border border-border rounded-md p-4">
                        <Slider
                          defaultValue={[volume]}
                          max={1}
                          step={0.01}
                          value={[volume]}
                          onValueChange={handleVolumeChange}
                        />
                      </div>
                    )}
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="rounded-full"
                      >
                        <Settings className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                      <DropdownMenuLabel>Velocidad de reproducción</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75].map((rate) => (
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
                onClick={() => handleLessonCompleted()}
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

export default AudioLesson;
