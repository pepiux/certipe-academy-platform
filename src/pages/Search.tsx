
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search as SearchIcon, FileQuestion, Clock, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  category: string;
  description: string | null;
  instructor: string;
  level: string;
  image_url: string | null;
}

interface Quiz {
  id: string;
  title: string;
  category: string;
  description: string | null;
  time_limit: number;
  difficulty: string;
  questions_count: number;
  image_url: string | null;
}

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchValue, setSearchValue] = useState(query);
  const [activeTab, setActiveTab] = useState('all');
  const [courses, setCourses] = useState<Course[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    
    try {
      // Search courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .eq('status', 'published');
        
      if (coursesError) throw coursesError;
      
      // Search quizzes
      const { data: quizzesData, error: quizzesError } = await supabase
        .from('quizzes')
        .select('*')
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .eq('status', 'active');
        
      if (quizzesError) throw quizzesError;
      
      setCourses(coursesData || []);
      setQuizzes(quizzesData || []);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchValue });
    performSearch(searchValue);
  };

  const getTotalResults = () => {
    return courses.length + quizzes.length;
  };

  return (
    <div className="container py-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Resultados de búsqueda</h1>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar cursos o cuestionarios..."
              className="pl-8"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <Button type="submit">Buscar</Button>
        </div>
      </form>
      
      {query && (
        <div className="mb-4">
          <p className="text-muted-foreground">
            {loading ? 'Buscando...' : `${getTotalResults()} resultados para "${query}"`}
          </p>
        </div>
      )}
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todos ({getTotalResults()})</TabsTrigger>
          <TabsTrigger value="courses">Cursos ({courses.length})</TabsTrigger>
          <TabsTrigger value="quizzes">Cuestionarios ({quizzes.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {getTotalResults() === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {loading ? 'Buscando...' : 'No se encontraron resultados'}
            </div>
          ) : (
            <div className="space-y-8">
              {courses.length > 0 && (
                <div>
                  <h2 className="text-lg font-medium mb-4">Cursos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.slice(0, 3).map(course => (
                      <Card 
                        key={course.id} 
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => navigate(`/dashboard/courses/${course.id}`)}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{course.title}</CardTitle>
                            <Badge>{course.level}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {course.description || 'Sin descripción'}
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <BookOpen size={16} className="mr-1" />
                            {course.category}
                          </div>
                          <div className="text-sm">{course.instructor}</div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  {courses.length > 3 && (
                    <div className="mt-4 text-right">
                      <Button 
                        variant="link" 
                        onClick={() => setActiveTab('courses')}
                      >
                        Ver todos los cursos
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
              {quizzes.length > 0 && (
                <div>
                  <h2 className="text-lg font-medium mb-4">Cuestionarios</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quizzes.slice(0, 3).map(quiz => (
                      <Card 
                        key={quiz.id} 
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => navigate(`/dashboard/quizzes/${quiz.id}`)}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{quiz.title}</CardTitle>
                            <Badge>{quiz.difficulty}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {quiz.description || 'Sin descripción'}
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <FileQuestion size={16} className="mr-1" />
                            {quiz.questions_count} preguntas
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock size={16} className="mr-1" />
                            {quiz.time_limit} min
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  {quizzes.length > 3 && (
                    <div className="mt-4 text-right">
                      <Button 
                        variant="link" 
                        onClick={() => setActiveTab('quizzes')}
                      >
                        Ver todos los cuestionarios
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="courses">
          {courses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {loading ? 'Buscando cursos...' : 'No se encontraron cursos'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map(course => (
                <Card 
                  key={course.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/dashboard/courses/${course.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <Badge>{course.level}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {course.description || 'Sin descripción'}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BookOpen size={16} className="mr-1" />
                      {course.category}
                    </div>
                    <div className="text-sm">{course.instructor}</div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="quizzes">
          {quizzes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {loading ? 'Buscando cuestionarios...' : 'No se encontraron cuestionarios'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.map(quiz => (
                <Card 
                  key={quiz.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/dashboard/quizzes/${quiz.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{quiz.title}</CardTitle>
                      <Badge>{quiz.difficulty}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {quiz.description || 'Sin descripción'}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <FileQuestion size={16} className="mr-1" />
                      {quiz.questions_count} preguntas
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock size={16} className="mr-1" />
                      {quiz.time_limit} min
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Search;
