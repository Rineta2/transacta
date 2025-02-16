import React from 'react'

export default function TransactionSkeleton() {
    return (
        <section className='py-2 md:py-10 min-h-screen'>
            <div className="container">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className='flex flex-col gap-1.5'>
                        <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div className="h-5 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                </div>

                {/* Filter Controls Skeleton */}
                <div className="mb-6 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="h-10 w-64 bg-gray-200 rounded-xl animate-pulse"></div>
                        <div className="h-10 w-32 bg-gray-200 rounded-xl animate-pulse"></div>
                    </div>
                </div>

                {/* Transaction Cards Grid Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-4">
                            {/* Order ID and Status */}
                            <div className="flex items-center justify-between">
                                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                            </div>

                            {/* Amount */}
                            <div className="space-y-1">
                                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                            </div>

                            {/* Product Info */}
                            <div className="pt-3 border-t border-gray-100">
                                <div className="space-y-2.5">
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Payer Info */}
                            <div className="pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 bg-gray-200 rounded-full animate-pulse"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Skeleton */}
                <div className="mt-8 flex justify-center">
                    <div className="flex gap-2">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}