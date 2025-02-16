"use client";

import { useAuth } from "@/utils/context/AuthContext";

import { Role } from "@/utils/context/schema/Auth";

import { Fragment, useEffect, useState } from "react";

import Header from "@/components/header/super-admins/Header";

export default function SuperAdminsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { hasRole, user } = useAuth();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (!user || !hasRole(Role.SUPER_ADMIN)) {
            window.location.href = '/';
            return;
        }
        setIsAuthorized(true);
    }, [hasRole, user]);

    if (!isAuthorized) {
        return null;
    }

    return (
        <Fragment>
            <div className="flex min-h-screen bg-slate-50">
                {/* Sidebar */}
                <div
                    className={`
                        fixed inset-0 lg:relative lg:inset-auto
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                        lg:translate-x-0 transition-all duration-300 ease-in-out
                        w-72 lg:w-[280px] bg-white z-30
                        border-r border-slate-200 shadow-sm
                    `}
                >
                    <Header onSidebarToggle={setIsSidebarOpen} />
                </div>

                {/* Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm lg:hidden z-20 animate-fade-in"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <div className="flex-1 relative w-full lg:w-[calc(100%-280px)]">
                    {/* Top Navigation Bar */}
                    <div className="sticky top-0 z-20 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 backdrop-blur-sm bg-white/80">
                        {/* Left side */}
                        <div className="flex items-center gap-4">
                            <button
                                className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            >
                                <svg
                                    className="w-6 h-6 text-slate-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d={isSidebarOpen
                                            ? "M6 18L18 6M6 6l12 12"
                                            : "M4 6h16M4 12h16M4 18h16"
                                        }
                                    />
                                </svg>
                            </button>
                            <div className="relative hidden sm:block">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-[300px] h-10 px-4 text-sm rounded-lg bg-slate-100 border-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                                />
                                <svg
                                    className="w-5 h-5 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Right side - Messages and Notifications */}
                        <div className="flex items-center gap-2">
                            {/* Messages */}
                            <button className="relative group">
                                <div className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200">
                                    <svg
                                        className="w-6 h-6 text-slate-600 group-hover:text-slate-800"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                        />
                                    </svg>
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                                </div>
                            </button>

                            {/* Notifications */}
                            <button className="relative group">
                                <div className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200">
                                    <svg
                                        className="w-6 h-6 text-slate-600 group-hover:text-slate-800"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                        />
                                    </svg>
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <main className="p-4">
                        {children}
                    </main>
                </div>
            </div>
        </Fragment>
    );
} 