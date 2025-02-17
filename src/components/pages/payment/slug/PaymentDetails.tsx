"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useFetchPayments } from '@/utils/section/payment/payment'
import PaymentSkelaton from '@/components/pages/slug/PaymentSkelaton'
import ProductNotFound from '@/components/pages/slug/PaymentNotFound'
import { Payment } from '@/components/pages/slug/schema/interface'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {
    CreateOrderData,
    CreateOrderActions,
    OnApproveData,
    OnApproveActions,
} from "@paypal/paypal-js/types/components/buttons";

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';

// Konfigurasi untuk production
const paypalScriptOptions = {
    clientId: PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
    // Menghapus opsi development/sandbox
    components: "buttons"
};

export default function PaymentDetails({ slug }: { slug: string }) {
    const { payments, loading } = useFetchPayments()
    const [currentTime, setCurrentTime] = useState(new Date())
    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'failed'>('pending')

    const getRemainingTime = (payment: Payment) => {
        const startDate = new Date(payment.date);
        const expiryDate = new Date(startDate.getTime() + (payment.expiryDays * 24 * 60 * 60 * 1000));
        const now = currentTime;

        if (now > expiryDate) {
            return {
                status: 'expired',
                text: 'Payment Period Has Expired',
                timeLeft: {
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0
                }
            };
        }

        const remaining = expiryDate.getTime() - now.getTime();
        const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

        return {
            status: 'active',
            text: `${days}d ${hours}h ${minutes}m ${seconds}s`,
            timeLeft: { days, hours, minutes, seconds }
        };
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        console.log('PayPal Client ID:', PAYPAL_CLIENT_ID);
        if (!PAYPAL_CLIENT_ID) {
            setPaymentStatus('failed');
        }
    }, []);

    if (loading) {
        return <PaymentSkelaton />
    }

    if (!payments) {
        return <ProductNotFound />
    }

    const payment = payments.data.find((p: { slug: string }) => p.slug === slug)

    if (!payment) {
        return <ProductNotFound />
    }

    const usdAmount = (payment.priceUsd).toFixed(2);

    const createOrder = async (_data: CreateOrderData, actions: CreateOrderActions) => {
        try {
            return actions.order.create({
                intent: "CAPTURE",
                purchase_units: [{
                    amount: {
                        value: usdAmount,
                        currency_code: "USD"
                    },
                    description: "Payment for services" // Tambahkan deskripsi untuk production
                }]
            });
        } catch (error) {
            console.error('Error creating order:', error);
            setPaymentStatus('failed');
            throw error;
        }
    };

    const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
        if (!actions.order) {
            setPaymentStatus('failed');
            return;
        }

        try {
            const order = await actions.order.capture();
            if (order.status === 'COMPLETED') {
                setPaymentStatus('completed');
                // Tambahkan logika untuk update status pembayaran di database Anda
                // misalnya memanggil API untuk update status transaksi
            }
        } catch (error) {
            console.error('Error capturing order:', error);
            setPaymentStatus('failed');
        }
    };

    const onError = (err: Record<string, unknown>) => {
        console.error('PayPal error:', err);
        setPaymentStatus('failed');
    };

    return (
        <section className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center relative">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        linear-gradient(to right, #82b1ff 1px, transparent 1px),
                        linear-gradient(to bottom, #82b1ff 1px, transparent 1px)
                    `,
                    backgroundSize: '8rem 8rem',
                    opacity: '0.15'
                }} />
            </div>

            <div className="absolute inset-0 bg-black/5 backdrop-blur-[2px]" />

            <div className="container relative z-10">
                <div className="text-end">
                    <Link
                        href={`/`}
                        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md hover:shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        Back to Home
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-8 bg-white/30 p-8 rounded-3xl backdrop-blur-md shadow-xl">
                    <div className="w-full aspect-square relative overflow-hidden rounded-3xl">
                        <Image
                            src={payment.thumbnail}
                            alt={payment.title}
                            width={800}
                            height={800}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="backdrop-blur-md bg-white/90 rounded-3xl shadow-xl p-8 lg:p-10 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                        <div className="flex flex-col gap-8">
                            <div className="space-y-3">
                                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent tracking-tight">
                                    {payment.title}
                                </h1>
                            </div>

                            <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 transition-all duration-300 hover:shadow-md border border-indigo-100/50">
                                <span className="text-lg font-medium text-gray-700">Total Amount</span>
                                <div className="text-right">
                                    <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                        Rp {payment.priceIdr.toLocaleString('id-ID')}
                                    </span>
                                    <div className="text-sm font-medium text-gray-500 mt-1">
                                        USD ${usdAmount}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 transition-all duration-300 hover:shadow-md">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <svg
                                            className={`w-5 h-5 ${getRemainingTime(payment).status === 'expired'
                                                ? 'text-red-600'
                                                : 'text-indigo-600 animate-pulse'
                                                }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <span className={`text-base font-medium ${getRemainingTime(payment).status === 'expired'
                                        ? 'text-red-600'
                                        : 'text-gray-700'
                                        }`}>
                                        {getRemainingTime(payment).text}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-8">
                                {!PAYPAL_CLIENT_ID ? (
                                    <div className="text-red-600">
                                        PayPal configuration is missing
                                    </div>
                                ) : (
                                    <PayPalScriptProvider options={paypalScriptOptions}>
                                        <PayPalButtons
                                            style={{
                                                layout: "vertical",
                                                color: "gold",
                                                shape: "rect",
                                                label: "paypal"
                                            }}
                                            createOrder={createOrder}
                                            onApprove={onApprove}
                                            onError={onError}
                                        />
                                    </PayPalScriptProvider>
                                )}

                                {paymentStatus === 'completed' && (
                                    <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
                                        <p className="font-bold">Payment completed successfully!</p>
                                        <p className="text-sm mt-1">Thank you for your payment.</p>
                                    </div>
                                )}

                                {paymentStatus === 'failed' && (
                                    <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                                        <p className="font-bold">Payment failed</p>
                                        <p className="text-sm mt-1">Please try again or contact support if the problem persists.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
