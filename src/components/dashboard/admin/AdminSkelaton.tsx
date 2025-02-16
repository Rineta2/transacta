import React from 'react'

export default function AdminSkeleton() {
    return (
        <section className="py-6 md:py-10 min-h-full">
            <div className="container">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className='flex flex-col gap-1.5'>
                        <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div className="h-5 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                    <div className="w-full md:w-auto">
                        <div className="h-11 w-full md:w-36 bg-gray-200 rounded-2xl animate-pulse"></div>
                    </div>
                </div>

                {/* Search and Filter Controls Skeleton */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <div className="h-11 w-full bg-gray-200 rounded-xl animate-pulse"></div>
                    </div>
                    <div className="w-full md:w-48">
                        <div className="h-11 w-full bg-gray-200 rounded-xl animate-pulse"></div>
                    </div>
                </div>

                {/* Table Skeleton */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        <table className="w-full min-w-[800px]">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50/50">
                                    <th className="px-6 py-4 text-left">
                                        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
                                    <tr key={index} className="hover:bg-gray-50/50 transition-colors duration-200">
                                        <td className="px-6 py-4">
                                            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-7 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <div className="h-8 w-20 bg-gray-200 rounded-xl animate-pulse"></div>
                                                <div className="h-8 w-20 bg-gray-200 rounded-xl animate-pulse"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination Skeleton */}
                <div className="mt-6">
                    <div className="flex justify-between items-center">
                        <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((index) => (
                                <div key={index} className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}