import React from 'react'

import TransactionContent from "@/components/dashboard/transaction/TransactionContent"

export async function generateMetadata() {
    return {
        title: "Transacta | Daftar Transaction",
        description: "Daftar Transaction",
    }
}

export default function Transaction() {
    return (
        <TransactionContent />
    )
}
