"use client"

import React from 'react'
import { motion } from 'framer-motion'

import Link from 'next/link'

import Image from 'next/image'

import { useFetchPayments } from "@/utils/section/payment/payment"

import { useFetchTransactions } from "@/utils/section/transactions/transactions"

import SuccessNotFound from '@/components/pages/slug/PaymentNotFound'

import LoadingSpinner from '@/components/helper/payment/LoadingSpinner'

export default function SuccessContent({ orderId }: { orderId: string }) {
    const { payments, loading } = useFetchPayments()

    const { transactions, loading: loadingTransactions } = useFetchTransactions()

    if (loading || loadingTransactions) {
        return <LoadingSpinner />
    }

    if (!payments || !transactions) {
        return <SuccessNotFound />
    }

    // Find the specific transaction by orderId
    const transaction = transactions.data.find(t => t.orderId === orderId)

    if (!transaction) {
        return <SuccessNotFound />
    }

    // Find the corresponding product
    const purchasedProduct = payments.data.find(item => item.slug === transaction.productSlug)

    if (!purchasedProduct) {
        return <SuccessNotFound />
    }

    return (
        <section className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
            {/* Background pattern with wider spacing */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 opacity-[0.05]" style={{
                    backgroundImage: `linear-gradient(0deg, transparent 24%, #82b1ff 25%, #82b1ff 26%, transparent 27%, transparent 74%, #82b1ff 75%, #82b1ff 76%, transparent 77%, transparent), 
                    linear-gradient(90deg, transparent 24%, #82b1ff 25%, #82b1ff 26%, transparent 27%, transparent 74%, #82b1ff 75%, #82b1ff 76%, transparent 77%, transparent)`,
                    backgroundSize: '100px 100px'
                }}></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-7xl w-full bg-white/90 rounded-[2.5rem] shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] p-6 md:p-14 backdrop-blur-xl border border-white/20 relative z-10 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.4)]"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-center mb-12 md:mb-16"
                >
                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce shadow-lg">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4 tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Payment Successful!</h1>
                    <p className="text-gray-600 text-xl md:text-2xl">Thank you for your purchase. Here are your transaction details:</p>
                </motion.div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-14'>
                    {purchasedProduct && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            whileHover={{ scale: 1.02 }}
                            className="aspect-video relative rounded-3xl overflow-hidden shadow-2xl w-full h-full"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <Image
                                src={purchasedProduct.thumbnail}
                                alt={purchasedProduct.title}
                                width={500}
                                height={500}
                                className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                            />
                        </motion.div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className='space-y-8'
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="bg-white/50 rounded-2xl backdrop-blur-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Product Details</h2>
                                <div className="space-y-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-500">Product</span>
                                        <span className="font-medium text-gray-800 text-lg">{transaction.productTitle}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-500">Order ID</span>
                                        <span className="font-medium text-gray-800 font-mono text-lg">{transaction.orderId}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-500">Date</span>
                                        <span className="font-medium text-gray-800 text-lg">{transaction.createdAt}</span>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="bg-white/50 rounded-2xl p-6 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Payment Details</h2>
                                <div className="space-y-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-500">Amount IDR</span>
                                        <span className="font-medium text-gray-800 text-lg">Rp {Number(transaction.amountIDR).toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-500">Amount USD</span>
                                        <span className="font-medium text-gray-800 text-lg">$ {transaction.amountUSD}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-500">Payment Method</span>
                                        <span className="font-medium text-gray-800 text-lg">{transaction.paymentMethod}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-500">Email</span>
                                        <span className="font-medium text-gray-800 text-lg">{transaction.payerEmail}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            className="mt-12 text-center lg:text-left"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href="/"
                                    className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group hover:from-blue-700 hover:to-indigo-700"
                                >
                                    <span>Back to Home</span>
                                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 12h15" />
                                    </svg>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    )
} 