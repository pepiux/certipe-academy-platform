
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";

// Layouts
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import CreateCourse from "./pages/admin/CreateCourse";
import Quizzes from "./pages/Quizzes";
import QuizDetail from "./pages/QuizDetail";
import TakeQuiz from "./pages/TakeQuiz";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";

// Admin pages
import UsersManagement from "./pages/admin/UsersManagement";
import CoursesManagement from "./pages/admin/CoursesManagement";
import QuizzesManagement from "./pages/admin/QuizzesManagement";
import SystemSettings from "./pages/admin/SystemSettings";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="certipe-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Auth routes */}
            <Route path="/" element={<AuthLayout />}>
              <Route index element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Dashboard routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="courses" element={<Courses />} />
              <Route path="courses/:id" element={<CourseDetail />} />
              <Route path="quizzes" element={<Quizzes />} />
              <Route path="quizzes/:id" element={<QuizDetail />} />
              <Route path="quizzes/:id/take" element={<TakeQuiz />} />
              <Route path="profile" element={<Profile />} />
              <Route path="search" element={<Search />} />

              {/* Admin routes */}
              <Route path="admin/users" element={<UsersManagement />} />
              <Route path="admin/courses" element={<CoursesManagement />} />
              <Route path="admin/courses/create" element={<CreateCourse />} />
              <Route path="admin/quizzes" element={<QuizzesManagement />} />
              <Route path="admin/settings" element={<SystemSettings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

const AppWithAuth = () => (
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);

export default AppWithAuth;
