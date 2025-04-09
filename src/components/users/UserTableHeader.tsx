
import React from 'react';
import { 
  TableHead, 
  TableRow, 
} from "@/components/ui/table";
import { ChevronUp, ChevronDown } from "lucide-react";

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface UserTableHeaderProps {
  sortConfig: SortConfig | null;
  handleSort: (key: string) => void;
}

const UserTableHeader = ({ sortConfig, handleSort }: UserTableHeaderProps) => {
  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4 inline ml-1" /> : 
      <ChevronDown className="h-4 w-4 inline ml-1" />;
  };

  return (
    <TableRow>
      <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
        Nombre {getSortIcon('name')}
      </TableHead>
      <TableHead className="cursor-pointer" onClick={() => handleSort('role')}>
        Rol {getSortIcon('role')}
      </TableHead>
      <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
        Estado {getSortIcon('status')}
      </TableHead>
      <TableHead className="cursor-pointer" onClick={() => handleSort('courses')}>
        Cursos {getSortIcon('courses')}
      </TableHead>
      <TableHead className="cursor-pointer" onClick={() => handleSort('lastActive')}>
        Última actividad {getSortIcon('lastActive')}
      </TableHead>
      <TableHead className="text-right">Acciones</TableHead>
    </TableRow>
  );
};

export default UserTableHeader;
