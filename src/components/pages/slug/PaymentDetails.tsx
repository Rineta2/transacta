"use client"

import React, { useState, useEffect } from 'react'

import { Dialog, Transition } from '@headlessui/react'

import { Fragment } from 'react'

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"

import { useFetchPayments } from '@/utils/section/payment/payment'

import PaymentSkelaton from '@/components/pages/slug/PaymentSkelaton'

import ProductNotFound from '@/components/pages/slug/PaymentNotFound'

import Image from 'next/image'

import { Payment } from '@/components/pages/slug/schema/interface'

import { toast } from 'react-hot-toast'

import Link from 'next/link'

import { OnApproveData } from "@paypal/paypal-js"

export default function PaymentDetails({ slug }: { slug: string }) {
    const { payments, loading } = useFetchPayments()
    const [currentTime, setCurrentTime] = useState(new Date())
    const [isExpiredModalOpen, setIsExpiredModalOpen] = useState(false)

    const handlePaypalPayment = async (details: OnApproveData) => {
        try {
            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: details.orderID,
                    payerId: details.payerID,
                    productTitle: payment?.title,
                    productSlug: payment?.slug,
                    amountUSD: usdAmount,
                    amountIDR: payment?.priceIdr,
                    status: "COMPLETED",
                    paymentMethod: 'PayPal',
                    paymentDetails: details,
                })
            });
            const result = await response.json();
            if (!result.success) throw new Error(result.message);
        } catch (error) {
            console.error('Error processing payment:', error);
            toast.error('Payment processing failed');
        }
    };

    const getRemainingTime = (payment: Payment) => {
        const startDate = new Date(payment.date);
        const expiryDate = new Date(startDate.getTime() + (payment.expiryDays * 24 * 60 * 60 * 1000));
        const now = currentTime;

        if (now > expiryDate) {
            // Return an object with expired status and remaining time of 0
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
            timeLeft: {
                days,
                hours,
                minutes,
                seconds
            }
        };
    };

    // Add useEffect for updating the timer every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
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

    const handleExpiredPaymentClick = () => {
        setIsExpiredModalOpen(true)
    }

    return (
        <section className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center relative">
            {/* Updated Background Pattern with larger gaps */}
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

            {/* Added overlay to focus on content */}
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
                    {/* Image Container with enhanced styling */}
                    <div className="w-full aspect-square relative overflow-hidden rounded-3xl">
                        <Image
                            src={payment.thumbnail}
                            alt={payment.title}
                            width={800}
                            height={800}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Payment Details Container with enhanced styling */}
                    <div className="backdrop-blur-md bg-white/90 rounded-3xl shadow-xl p-8 lg:p-10 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                        <div className="flex flex-col gap-8">
                            {/* Title with gradient */}
                            <div className="space-y-3">
                                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent tracking-tight">
                                    {payment.title}
                                </h1>
                            </div>

                            {/* Enhanced Price Card */}
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

                            {/* Enhanced Timer */}
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 transition-all duration-300 hover:shadow-md">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <svg
                                            className={`w-5 h-5 ${payment && getRemainingTime(payment).status === 'expired'
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
                                    <span className={`text-base font-medium ${payment && getRemainingTime(payment).status === 'expired'
                                        ? 'text-red-600'
                                        : 'text-gray-700'
                                        }`}>
                                        {payment ? getRemainingTime(payment).text : 'Loading...'}
                                    </span>
                                </div>
                            </div>

                            {/* PayPal Button Container */}
                            <div className="mt-2 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-100">
                                {payment && getRemainingTime(payment).status === 'expired' ? (
                                    <button
                                        onClick={handleExpiredPaymentClick}
                                        className="w-full py-4 px-6 rounded-full bg-gray-100 text-gray-500 cursor-not-allowed font-medium text-center"
                                    >
                                        Payment Period Expired
                                    </button>
                                ) : (
                                    <PayPalScriptProvider
                                        options={{
                                            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                                            currency: "USD",
                                            intent: "capture",
                                            enableFunding: "card",
                                            disableFunding: "paylater"
                                        }}
                                    >
                                        <div className="mt-4">
                                            {payment && getRemainingTime(payment).status !== 'expired' ? (
                                                <PayPalButtons
                                                    style={{
                                                        layout: "vertical",
                                                        shape: "rect",
                                                        color: "gold"
                                                    }}
                                                    createOrder={(data, actions) => {
                                                        return actions.order.create({
                                                            intent: "CAPTURE",
                                                            application_context: {
                                                                return_url: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
                                                                cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment/cancel`
                                                            },
                                                            purchase_units: [{
                                                                amount: {
                                                                    value: usdAmount,
                                                                    currency_code: "USD"
                                                                },
                                                                description: payment.title
                                                            }]
                                                        });
                                                    }}
                                                    onApprove={async (data, actions) => {
                                                        if (!actions.order) return;
                                                        try {
                                                            const details = await actions.order.capture();
                                                            console.log('Transaction completed:', details);
                                                            if (details.status === "COMPLETED") {
                                                                toast.success('Payment successful!');
                                                                await handlePaypalPayment(data);
                                                            }
                                                        } catch (error) {
                                                            console.error('Payment failed:', error);
                                                            toast.error('Payment failed. Please try again.');
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <div className="text-red-500">
                                                    Payment period has expired
                                                </div>
                                            )}
                                        </div>
                                    </PayPalScriptProvider>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expired Payment Modal */}
            <Transition appear show={isExpiredModalOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50"
                    onClose={() => setIsExpiredModalOpen(false)}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <div className="flex flex-col items-center">
                                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 mb-4">
                                            <svg
                                                className="h-6 w-6 text-red-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>

                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900 text-center"
                                        >
                                            Payment Period Expired
                                        </Dialog.Title>

                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500 text-center">
                                                We&apos;re sorry, but the payment period for this item has expired.
                                                Please contact support if you need assistance.
                                            </p>
                                        </div>

                                        <div className="mt-6 flex gap-3">
                                            <Link
                                                href="/"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                                            >
                                                Return Home
                                            </Link>
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                                                onClick={() => setIsExpiredModalOpen(false)}
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </section>
    )
}