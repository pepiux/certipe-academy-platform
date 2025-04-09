
import React from 'react';

interface UserStatusBadgeProps {
  status: string;
}

const UserStatusBadge = ({ status }: UserStatusBadgeProps) => {
  switch (status) {
    case 'active':
      return (
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span>Activo</span>
        </div>
      );
    case 'inactive':
      return (
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-gray-400"></div>
          <span>Inactivo</span>
        </div>
      );
    case 'suspended':
      return (
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-500"></div>
          <span>Suspendido</span>
        </div>
      );
    default:
      return null;
  }
};

export default UserStatusBadge;
