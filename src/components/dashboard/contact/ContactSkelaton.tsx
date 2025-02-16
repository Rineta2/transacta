import React from 'react'

export default function ContactSkeleton() {
    return (
        <section className='py-6 md:py-10'>
            <div className="container">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 md:mb-12">
                    <div className='space-y-2'>
                        <div className="h-8 md:h-10 w-48 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-5 w-64 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="relative w-full md:w-[300px]">
                        <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse"></div>
                    </div>
                </div>

                {/* Contact Cards Grid Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="rounded-xl p-5 border border-gray-100">
                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded-xl bg-gray-200 animate-pulse"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}