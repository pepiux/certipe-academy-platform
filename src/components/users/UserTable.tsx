
import React from 'react';
import {
  Table,
  TableBody,
  TableHeader,
} from "@/components/ui/table";
import UserTableHeader from './UserTableHeader';
import UserRow from './UserRow';
import { User } from '@/types/user';

interface UserTableProps {
  users: User[];
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  handleSort: (key: string) => void;
  formatDate: (dateString: string) => string;
  onUserAction: (action: string, userId: string, userName: string) => void;
  onUserClick: (user: User) => void;
}

const UserTable = ({ 
  users, 
  sortConfig, 
  handleSort, 
  formatDate, 
  onUserAction,
  onUserClick
}: UserTableProps) => {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <UserTableHeader 
            sortConfig={sortConfig} 
            handleSort={handleSort} 
          />
        </TableHeader>
        <TableBody>
          {users.length > 0 ? (
            users.map((user) => (
              <UserRow 
                key={user.id}
                user={user}
                formatDate={formatDate}
                onUserAction={onUserAction}
                onUserClick={onUserClick}
              />
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-8 text-muted-foreground">
                No se encontraron usuarios
              </td>
            </tr>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
