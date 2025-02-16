import React from 'react'

import TransactionCancelledContent from '@/components/dashboard/transaction/cancelled/TransactionCancelledContent'

export async function generateMetadata() {
    return {
        title: 'Transacta | Cancelled Transactions',
        description: 'View cancelled transactions',
    }
}

export default function Cancelled() {
    return (
        <TransactionCancelledContent />
    )
}
