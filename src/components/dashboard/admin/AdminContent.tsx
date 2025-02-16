"use client"

import { useAuth } from '@/utils/context/AuthContext';

import { Role } from '@/utils/context/schema/Auth';

import AdminSkeleton from '@/components/dashboard/admin/AdminSkelaton';

import Pagination from '@/components/helper/Pagination';

import UserTable from '@/components/dashboard/admin/components/UserTable';

import UserFormModal from '@/components/dashboard/admin/components/UserFormModal';

import DeleteConfirmationModal from '@/components/dashboard/admin/components/DeleteModal';

import { useUserManagement } from '@/components/dashboard/admin/lib/useUserManagement';

import { useUserFilters } from '@/components/dashboard/admin/lib/useUserFilter';

import { useModalControls } from '@/components/dashboard/admin/lib/useModalControls';

import FilterControls from '@/components/dashboard/admin/components/FilterControls';

export default function AdminContent() {
    const { user } = useAuth();
    const {
        users,
        isLoading,
        isSubmitting,
        deletingId,
        handleModalSubmit,
        handleDeleteUser
    } = useUserManagement();

    const {
        searchTerm,
        setSearchTerm,
        selectedRole,
        setSelectedRole,
        currentPage,
        setCurrentPage,
        pageCount,
        paginatedUsers,
        itemsPerPage,
        filteredUsers
    } = useUserFilters(users);

    const {
        showModal,
        setShowModal,
        modalMode,
        formData,
        setFormData,
        showDeleteModal,
        userToDelete,
        handleEditClick,
        handleCreateClick,
        handleDeleteClick,
        closeModals
    } = useModalControls();

    if (isLoading) return <AdminSkeleton />;
    if (!user || user.role !== Role.SUPER_ADMIN) {
        return <div>Anda tidak memiliki akses ke halaman ini</div>;
    }

    return (
        <section className="py-2 md:py-10 min-h-screen">
            <div className="container">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className='flex flex-col gap-1.5'>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">User List</h1>
                        <p className="text-sm md:text-base text-gray-500">Manage and track your user accounts</p>
                    </div>

                    <button
                        className="w-full md:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-sm transition-all duration-200 flex items-center justify-center md:justify-start gap-2 hover:shadow-indigo-100 hover:shadow-lg active:scale-95"
                        onClick={handleCreateClick}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add User
                    </button>
                </div>

                <FilterControls
                    filters={{ searchTerm, selectedRole }}
                    onFilterChange={({ searchTerm, selectedRole }) => {
                        if (searchTerm !== undefined) setSearchTerm(searchTerm);
                        if (selectedRole !== undefined) setSelectedRole(selectedRole);
                    }}
                />

                <UserTable
                    users={paginatedUsers}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    deletingId={deletingId}
                />

                <Pagination
                    pageCount={pageCount}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    totalItems={filteredUsers.length}
                    itemsPerPage={itemsPerPage}
                />

                <UserFormModal
                    showModal={showModal}
                    modalMode={modalMode}
                    formData={formData}
                    isSubmitting={isSubmitting}
                    onSubmit={() => {
                        handleModalSubmit(modalMode, formData).then(success => {
                            if (success) setShowModal(false);
                        });
                    }}
                    onClose={closeModals}
                    setFormData={setFormData}
                />

                <DeleteConfirmationModal
                    show={showDeleteModal}
                    user={userToDelete}
                    isDeleting={!!deletingId}
                    onConfirm={(uid) => {
                        handleDeleteUser(uid).then(success => {
                            if (success) closeModals();
                        });
                    }}
                    onClose={closeModals}
                />
            </div>
        </section>
    );
}
