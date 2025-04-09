
export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  status: string;
  courses?: number;
  completedCourses?: number | null;
  lastActive: string;
  [key: string]: any;
}
