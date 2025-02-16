"use client"

import React, { useEffect, useState } from 'react'

import { collection, getDocs } from 'firebase/firestore'

import { db } from '@/utils/firebase'

import { Transaction } from '@/components/dashboard/transaction/schema/interface'

import TransactionSkeleton from '@/components/dashboard/transaction/TransactionSkelaton'

import { format } from 'date-fns'

import { useModal } from '@/components/helper/useModal'

import Pagination from '@/components/helper/Pagination'

export default function TransactionContent() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Add new state variables
    const [currentPage, setCurrentPage] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const itemsPerPage = 12

    // Filter transactions
    const filteredTransactions = transactions.filter((transaction) => {
        const matchesSearch = (
            transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.productTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.payerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        const matchesStatus = statusFilter === 'all' || transaction.status.toLowerCase() === statusFilter.toLowerCase()
        return matchesSearch && matchesStatus
    })

    // Pagination calculations
    const pageCount = Math.ceil(filteredTransactions.length / itemsPerPage)
    const paginatedTransactions = filteredTransactions.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    )

    // Handle page change
    const handlePageChange = (selected: number) => {
        setCurrentPage(selected)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "transactions"))
                const transactionData = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    createdAt: doc.data().createdAt.toDate(),
                }) as Transaction)
                // Sort transactions by createdAt in descending order (newest first)
                const sortedTransactions = transactionData.sort((a, b) =>
                    b.createdAt.getTime() - a.createdAt.getTime()
                )
                setTransactions(sortedTransactions)
            } catch (error) {
                console.error("Error fetching transactions:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchTransactions()
    }, [])

    useModal(isModalOpen)

    const handleViewTransaction = (transaction: Transaction) => {
        setSelectedTransaction(transaction)
        setIsModalOpen(true)
    }

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'dd MMM yyyy HH:mm:ss')
        } catch {
            return 'Invalid date'
        }
    }

    if (loading) {
        return <TransactionSkeleton />
    }

    return (
        <section className='py-2 md:py-10 min-h-screen'>
            <div className="container">
                {/* Header with improved spacing and animation */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 animate-fade-in">
                    <div className='flex flex-col gap-1.5'>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                            Transaction List
                        </h1>
                        <p className="text-sm md:text-base text-gray-600">
                            View and manage your transaction records
                        </p>
                    </div>
                </div>

                {/* Add Filter Controls */}
                <div className="mb-6 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-fit px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        >
                            <option value="all">All Status</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Responsive Grid with improved card design */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6 auto-rows-fr">
                    {paginatedTransactions.map((transaction) => (
                        <div
                            key={transaction.orderId}
                            onClick={() => handleViewTransaction(transaction)}
                            className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden 
                                     hover:shadow-lg hover:border-gray-300 transition-all duration-200 
                                     hover:-translate-y-1 cursor-pointer transform-gpu"
                        >
                            <div className="p-5 space-y-4">
                                {/* Status Badge - Improved visibility */}
                                <div className="flex items-center justify-between">
                                    <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
                                        {transaction.orderId}
                                    </h3>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium tracking-wide
                                        ${transaction.status === 'COMPLETED'
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                            : transaction.status === 'cancelled'
                                                ? 'bg-red-50 text-red-700 border border-red-200'
                                                : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                                        {transaction.status}
                                    </span>
                                </div>

                                {/* Amount with improved typography */}
                                <div className="space-y-1">
                                    <div className="text-2xl font-bold text-indigo-600">
                                        ${transaction.amountUSD}
                                    </div>
                                    <span className="text-sm text-gray-500 font-medium">
                                        IDR {transaction.amountIDR.toLocaleString()}
                                    </span>
                                </div>

                                {/* Product Info with better spacing */}
                                <div className="pt-3 border-t border-gray-100">
                                    <div className="space-y-2.5">
                                        <div className="flex items-center gap-2.5 group-hover:text-indigo-600 transition-colors">
                                            <svg
                                                className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                            <span className="text-sm text-gray-600 group-hover:text-indigo-600 transition-colors">
                                                {transaction.productTitle}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <svg
                                                className="h-5 w-5 text-gray-400"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                            <span className="text-sm text-gray-600">
                                                {transaction.paymentMethod}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payer Info with enhanced avatar */}
                                <div className="pt-3 border-t border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 
                                                      flex items-center justify-center shadow-sm">
                                            <span className="text-white font-medium">
                                                {transaction.payerEmail?.[0].toUpperCase() ?? '?'}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {transaction.payerEmail || 'No email provided'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {format(transaction.createdAt, 'dd MMM yyyy HH:mm')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Pagination */}
                {!loading && filteredTransactions.length > 0 && (
                    <Pagination
                        pageCount={pageCount}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        totalItems={filteredTransactions.length}
                        itemsPerPage={itemsPerPage}
                    />
                )}

                {/* Show empty state when no results */}
                {!loading && filteredTransactions.length === 0 && (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                        <p className="text-gray-500">Try adjusting your search or filter to find what you&apos;re looking for.</p>
                    </div>
                )}

                {/* Modal with improved transitions */}
                {isModalOpen && selectedTransaction && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 
                                  transition-opacity duration-300 ease-in-out">
                        <div className="flex items-center justify-center min-h-screen p-4">
                            <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full p-6 
                                          max-h-[90vh] overflow-y-auto transform-gpu transition-all 
                                          duration-300 ease-out scale-100 opacity-100"
                                onClick={(e) => e.stopPropagation()}>
                                {/* Modal Header - Make it sticky */}
                                <div className="sticky top-0 z-10 bg-white pb-4 border-b border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-gray-900">Transaction Details</h3>
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Modal Content - Update spacing and styling */}
                                <div className="space-y-6 mt-6">
                                    {/* Update each section's styling */}
                                    <div className="bg-gray-50/50 p-5 rounded-2xl space-y-4 border border-gray-100 hover:border-gray-200 transition-colors">
                                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
                                            Basic Information
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <div className="text-sm text-gray-500">Order ID</div>
                                                <div className="font-medium">{selectedTransaction.orderId}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">Status</div>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium inline-block
                                                    ${selectedTransaction.status === 'COMPLETED'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : selectedTransaction.status === 'cancelled'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-amber-100 text-amber-700'}`}>
                                                    {selectedTransaction.status}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">Amount USD</div>
                                                <div className="font-medium">${selectedTransaction.amountUSD}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">Amount IDR</div>
                                                <div className="font-medium">IDR {selectedTransaction.amountIDR.toLocaleString()}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">Created At</div>
                                                <div className="font-medium">
                                                    {format(selectedTransaction.createdAt, 'dd MMM yyyy HH:mm:ss')}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">Payment Method</div>
                                                <div className="font-medium">{selectedTransaction.paymentMethod}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Product Information */}
                                    <div className="bg-gray-50/50 p-5 rounded-2xl space-y-4 border border-gray-100 hover:border-gray-200 transition-colors">
                                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
                                            Product Information
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <div className="text-sm text-gray-500">Product Title</div>
                                                <div className="font-medium">{selectedTransaction.productTitle}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">Product Slug</div>
                                                <div className="font-medium">{selectedTransaction.productSlug}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* PayPal Details */}
                                    {selectedTransaction.paymentDetails && (
                                        <div className="bg-gray-50/50 p-5 rounded-2xl space-y-4 border border-gray-100 hover:border-gray-200 transition-colors">
                                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
                                                PayPal Details
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-sm text-gray-500">PayPal ID</div>
                                                    <div className="font-medium">{selectedTransaction.paymentDetails.id}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500">Intent</div>
                                                    <div className="font-medium">{selectedTransaction.paymentDetails.intent}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500">Create Time</div>
                                                    <div className="font-medium">
                                                        {formatDate(selectedTransaction.paymentDetails.create_time)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500">Update Time</div>
                                                    <div className="font-medium">
                                                        {formatDate(selectedTransaction.paymentDetails.update_time)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Payer Information */}
                                    {selectedTransaction.paymentDetails?.payer && (
                                        <div className="bg-gray-50/50 p-5 rounded-2xl space-y-4 border border-gray-100 hover:border-gray-200 transition-colors">
                                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
                                                Payer Information
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-sm text-gray-500">Full Name</div>
                                                    <div className="font-medium">
                                                        {selectedTransaction.paymentDetails.payer.name?.given_name} {selectedTransaction.paymentDetails.payer.name?.surname}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500">Email</div>
                                                    <div className="font-medium">{selectedTransaction.payerEmail}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500">Payer ID</div>
                                                    <div className="font-medium">{selectedTransaction.payerId}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500">Country Code</div>
                                                    <div className="font-medium">{selectedTransaction.paymentDetails.payer.address?.country_code}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Shipping Information */}
                                    {selectedTransaction.paymentDetails?.purchase_units?.[0]?.shipping && (
                                        <div className="bg-gray-50/50 p-5 rounded-2xl space-y-4 border border-gray-100 hover:border-gray-200 transition-colors">
                                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
                                                Shipping Information
                                            </h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <div className="text-sm text-gray-500">Full Name</div>
                                                    <div className="font-medium">
                                                        {selectedTransaction.paymentDetails.purchase_units[0].shipping.name?.full_name}
                                                    </div>
                                                </div>
                                                {selectedTransaction.paymentDetails.purchase_units[0].shipping.address && (
                                                    <>
                                                        <div>
                                                            <div className="text-sm text-gray-500">Address</div>
                                                            <div className="font-medium">
                                                                {selectedTransaction.paymentDetails.purchase_units[0].shipping.address.address_line_1}
                                                                {selectedTransaction.paymentDetails.purchase_units[0].shipping.address.address_line_2 && (
                                                                    <>, {selectedTransaction.paymentDetails.purchase_units[0].shipping.address.address_line_2}</>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm text-gray-500">City & Province</div>
                                                            <div className="font-medium">
                                                                {selectedTransaction.paymentDetails.purchase_units[0].shipping.address.admin_area_2}, {selectedTransaction.paymentDetails.purchase_units[0].shipping.address.admin_area_1}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm text-gray-500">Postal Code & Country</div>
                                                            <div className="font-medium">
                                                                {selectedTransaction.paymentDetails.purchase_units[0].shipping.address.postal_code}, {selectedTransaction.paymentDetails.purchase_units[0].shipping.address.country_code}
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Additional Information */}
                                    <div className="bg-gray-50/50 p-5 rounded-2xl space-y-4 border border-gray-100 hover:border-gray-200 transition-colors">
                                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
                                            Additional Information
                                        </h4>
                                        <div className="space-y-3">
                                            {selectedTransaction.status === 'COMPLETED' && (
                                                <div>
                                                    <div className="text-sm text-gray-500">Success URL</div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="font-medium break-all flex-1">{selectedTransaction.successUrl}</div>
                                                        <button
                                                            onClick={() => {
                                                                if (selectedTransaction.successUrl) {
                                                                    navigator.clipboard.writeText(selectedTransaction.successUrl)
                                                                }
                                                            }}
                                                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                                            title="Copy to clipboard"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            {selectedTransaction.status === 'cancelled' && (
                                                <div>
                                                    <div className="text-sm text-gray-500">Cancel URL</div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="font-medium break-all flex-1">{selectedTransaction.cancelUrl}</div>
                                                        <button
                                                            onClick={() => {
                                                                if (selectedTransaction.cancelUrl) {
                                                                    navigator.clipboard.writeText(selectedTransaction.cancelUrl)
                                                                }
                                                            }}
                                                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                                            title="Copy to clipboard"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

