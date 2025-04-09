
import React from 'react';
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalUsers: number;
  displayedUsers: number;
  onFilterClick?: () => void;
}

const UserFilters = ({ 
  searchTerm, 
  onSearchChange,
  totalUsers,
  displayedUsers,
  onFilterClick
}: UserFiltersProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar usuarios..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="text-sm text-muted-foreground">
        Mostrando {displayedUsers} de {totalUsers} usuarios
      </div>
    </div>
  );
};

export default UserFilters;
