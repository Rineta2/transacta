"use client"

import React from 'react'

import Link from 'next/link'

import { doc, getDoc } from 'firebase/firestore'

import { db } from '@/utils/firebase'

import { useEffect, useState } from 'react'

import { motion } from 'framer-motion'

import { TransactionData } from '@/components/pages/failed/schema/interface'

import LoadingSpinner from '@/components/helper/payment/LoadingSpinner'

export default function PaymentFailed({ orderId }: { orderId: string }) {
    const [transaction, setTransaction] = useState<TransactionData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const transactionsRef = doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_TRANSACTIONS as string, orderId as string)
                const transactionDoc = await getDoc(transactionsRef)

                if (transactionDoc.exists()) {
                    setTransaction(transactionDoc.data() as TransactionData)
                }

                setLoading(false)
            } catch (error) {
                console.error("Error fetching transaction:", error)
                setLoading(false)
            }
        }

        if (orderId) {
            fetchTransaction()
        }
    }, [orderId])

    if (loading) {
        return <LoadingSpinner variant="error" />
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative bg-background overflow-hidden">
            {/* Simple modern line pattern background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0"
                    style={{
                        backgroundImage: `
                            linear-gradient(90deg, rgba(255,0,0,0.1) 1px, transparent 1px),
                            linear-gradient(0deg, rgba(255,0,0,0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px',
                        backgroundPosition: 'center'
                    }}
                />
            </div>

            <motion.div
                className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] w-full max-w-5xl mx-auto overflow-hidden relative z-10 border border-white/20"
                initial={{ y: 50, scale: 0.9 }}
                animate={{ y: 0, scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Left Column - Failed Icon */}
                    <motion.div
                        className="relative h-[300px] md:h-full md:min-h-[500px] bg-gradient-to-br from-red-500/10 to-orange-500/10 flex items-center justify-center"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
                        <svg
                            className="h-32 w-32 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </motion.div>

                    {/* Right Column - Content */}
                    <div className="flex flex-col justify-center p-8 md:p-12 bg-gradient-to-br from-transparent to-white/5">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-title">
                            Payment Failed
                        </h1>

                        {transaction && (
                            <div className="mb-6">
                                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 mb-4 border border-white/10">
                                    <h3 className="font-semibold text-text mb-4">Transaction Details</h3>
                                    <div className="space-y-3">
                                        <p className="text-sm text-text/80">
                                            <span className="font-medium">Order ID:</span> {orderId}
                                        </p>
                                        <p className="text-sm text-text/80">
                                            <span className="font-medium">Product:</span> {transaction.productTitle}
                                        </p>
                                        <p className="text-sm text-text/80">
                                            <span className="font-medium">Amount:</span> Rp {transaction.amountIDR.toLocaleString('id-ID')}
                                        </p>
                                        <p className="text-sm text-text/80">
                                            <span className="font-medium">Status:</span>{' '}
                                            <span className="text-red-500 font-medium">{transaction.status}</span>
                                        </p>
                                        <p className="text-sm text-text/80">
                                            <span className="font-medium">Date:</span>{' '}
                                            {transaction.createdAt?.toDate().toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <p className="text-text mb-8 text-lg leading-relaxed">
                            {transaction
                                ? "Your payment was not successful. Please try again or contact support if you continue to experience issues."
                                : "We couldn't find the transaction details. Please try again or contact support if you continue to experience issues."}
                        </p>

                        <div className="space-y-4">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link href="/" className="group relative px-8 py-3 w-full inline-block text-center">
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg" />
                                    <span className="relative text-white font-semibold">
                                        Return to Home
                                    </span>
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link href="/contact" className="group relative px-8 py-3 w-full inline-block text-center">
                                    <div className="absolute inset-0 bg-white/10 border border-red-500 rounded-lg" />
                                    <span className="relative text-red-500 font-semibold">
                                        Contact Support
                                    </span>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
} 