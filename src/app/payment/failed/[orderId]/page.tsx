import type { Metadata } from 'next';

import { collection, query, where, getDocs } from "firebase/firestore";

import { db } from "@/utils/firebase";

import FailedContent from '@/components/pages/failed/FailedContent';

type Props = {
    params: Promise<{ orderId: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    const resolvedParams = await params;
    const orderId = resolvedParams.orderId;

    try {
        const ordersRef = collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_TRANSACTIONS as string);
        const q = query(ordersRef, where("orderId", "==", orderId));
        const querySnapshot = await getDocs(q);
        const orderData = querySnapshot.docs[0]?.data();

        const title = `Payment Failed - Transacta`;
        const description = `Payment failed for ${orderData?.productTitle || 'order'} - Amount: ${orderData?.amountUSD ? `$${orderData.amountUSD}` : ''} - Order #${orderId}`;

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                type: 'website',
                siteName: 'Transacta',
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
            },
        };
    } catch {
        return {
            title: 'Payment Failed - Transacta',
            description: 'View your payment details on Transacta',
        };
    }
}

export default async function OrderSuccessPage({ params }: Props) {
    const resolvedParams = await params;
    return <FailedContent orderId={resolvedParams.orderId} />;
} 