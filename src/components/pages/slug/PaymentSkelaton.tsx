import React from 'react'

export default function PaymentSkelaton() {
    return (
        <section className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center relative">
            {/* Background Pattern Skeleton */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gray-100 opacity-15" />
            </div>

            <div className="container relative z-10">
                {/* Back Button Skeleton */}
                <div className="text-end">
                    <div className="inline-flex items-center gap-2 bg-gray-200 animate-pulse p-3 rounded-lg w-32 h-12" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-8 bg-white/30 p-8 rounded-3xl">
                    {/* Image Skeleton */}
                    <div className="w-full aspect-square relative overflow-hidden rounded-3xl bg-gray-200 animate-pulse" />

                    {/* Payment Details Skeleton */}
                    <div className="backdrop-blur-md bg-white/90 rounded-3xl p-8 lg:p-10 border border-gray-100">
                        <div className="flex flex-col gap-8">
                            {/* Title Skeleton */}
                            <div className="space-y-3">
                                <div className="h-10 w-3/4 bg-gray-200 animate-pulse rounded-lg" />
                            </div>

                            {/* Price Card Skeleton */}
                            <div className="rounded-2xl bg-gray-100 p-6">
                                <div className="flex items-center justify-between">
                                    <div className="h-6 w-28 bg-gray-200 animate-pulse rounded" />
                                    <div className="space-y-2">
                                        <div className="h-8 w-40 bg-gray-200 animate-pulse rounded" />
                                        <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                                    </div>
                                </div>
                            </div>

                            {/* Timer Skeleton */}
                            <div className="bg-gray-100 rounded-xl p-5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-200 animate-pulse rounded-lg h-9 w-9" />
                                    <div className="h-5 w-32 bg-gray-200 animate-pulse rounded" />
                                </div>
                            </div>

                            {/* PayPal Button Skeleton */}
                            <div className="mt-2 p-4 rounded-xl bg-white/50">
                                <div className="h-12 w-full bg-gray-200 animate-pulse rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}