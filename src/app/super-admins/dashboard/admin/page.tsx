import React from 'react'

import AdminContent from "@/components/dashboard/admin/AdminContent"

export async function generateMetadata() {
    return {
        title: 'Admin | Transact Admin',
        description: 'Transact Admin',
    }
}

export default function Admin() {
    return (
        <AdminContent />
    )
}
