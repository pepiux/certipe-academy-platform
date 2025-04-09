
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface RoleBadgeProps {
  role: string;
}

const RoleBadge = ({ role }: RoleBadgeProps) => {
  switch (role) {
    case 'admin':
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Admin</Badge>;
    case 'instructor':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Instructor</Badge>;
    default:
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Estudiante</Badge>;
  }
};

export default RoleBadge;
