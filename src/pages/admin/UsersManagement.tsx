
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import UserTable from "@/components/users/UserTable";
import UserFilters from "@/components/users/UserFilters";
import AddUserDialog from "@/components/users/AddUserDialog";
import Pagination from "@/components/users/Pagination";
import { useUsers } from "@/hooks/useUsers";

const UsersManagement = () => {
  const {
    users,
    isLoading,
    isError,
    error,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    totalUsers,
    displayedUsers,
    sortConfig,
    handleSort,
    formatDate,
    refetchUsers
  } = useUsers();

  const handleUserAction = async (action: string, userId: string, userName: string) => {
    try {
      switch (action) {
        case 'edit':
          toast.info(`Editando usuario: ${userName}`);
          break;
        case 'message':
          toast.info(`Enviando mensaje a: ${userName}`);
          break;
        case 'permissions':
          toast.info(`Gestionando permisos de: ${userName}`);
          break;
        case 'activate':
          await supabase.auth.admin.updateUserById(userId, {
            user_metadata: { banned: false }
          });
          toast.success(`Usuario ${userName} activado`);
          refetchUsers();
          break;
        case 'suspend':
          await supabase.auth.admin.updateUserById(userId, {
            user_metadata: { banned: true }
          });
          toast.warning(`Usuario ${userName} suspendido`);
          refetchUsers();
          break;
        case 'delete':
          await supabase.auth.admin.deleteUser(userId);
          toast.error(`Usuario ${userName} eliminado`);
          refetchUsers();
          break;
        default:
          break;
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Cargando usuarios...</div>;
  }

  if (isError) {
    return <div className="text-red-500">Error al cargar usuarios: {error instanceof Error ? error.message : 'Error desconocido'}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex gap-2">
            <Filter size={16} /> Filtros
          </Button>
          <AddUserDialog onUserAdded={refetchUsers} />
        </div>
      </div>

      <UserFilters 
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        totalUsers={totalUsers}
        displayedUsers={displayedUsers}
      />

      <UserTable 
        users={users}
        sortConfig={sortConfig}
        handleSort={handleSort}
        formatDate={formatDate}
        onUserAction={handleUserAction}
      />

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default UsersManagement;
