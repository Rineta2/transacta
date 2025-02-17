import type { Metadata } from 'next'

import PaymentDetails from '@/components/pages/payment/slug/PaymentDetails'

import { generateMetadata as getPaymentMetadata } from '@/components/helper/metadata'

type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    const resolvedParams = await params
    return getPaymentMetadata({ params: { slug: resolvedParams.slug } })
}


export default async function PaymentSlug({ params }: Props) {
    const resolvedParams = await params
    return <PaymentDetails slug={resolvedParams.slug} />
}