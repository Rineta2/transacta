import React from 'react'

import TransactionCompletedContent from '@/components/dashboard/transaction/completed/TransactionCompletedContent'

export async function generateMetadata() {
    return {
        title: 'Transacta | Completed Transactions',
        description: 'View completed transactions',
    }
}

export default function Completed() {
    return (
        <TransactionCompletedContent />
    )
}
