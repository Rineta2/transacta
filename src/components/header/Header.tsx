import React, { useState, useEffect } from 'react'

import { motion, AnimatePresence } from 'framer-motion'

import { menuItems } from '@/components/header/data/data'

import Link from "next/link"

import { IoMenu, IoClose } from "react-icons/io5"

import { usePathname } from 'next/navigation';

import { useAuth } from '@/utils/context/AuthContext';

import { IoPersonCircleOutline } from "react-icons/io5";

import { IoMdArrowDropdown } from "react-icons/io";

import Image from 'next/image';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout, getDashboardUrl } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className={`fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-100/50`}
        >
            <nav className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <span className="text-xl md:text-2xl font-bold text-gray-900 hover:opacity-80 transition-opacity">
                            Transacta
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-4">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${pathname === item.href
                                    ? 'text-indigo-600 bg-indigo-50'
                                    : 'text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Profile Menu */}
                    <div className="flex items-center gap-2">
                        {!user ? (
                            <Link
                                href="/contact"
                                className="hidden md:flex items-center px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
                            >
                                Contact Us
                            </Link>
                        ) : (
                            <>
                                {/* Desktop Profile */}
                                <div className="relative hidden md:block">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 hover:bg-gray-50 text-gray-900`}
                                    >
                                        {user.photoURL ? (
                                            <Image
                                                src={user.photoURL}
                                                alt="Profile"
                                                className="w-5 h-5 rounded-full object-cover"
                                                width={20}
                                                height={20}
                                            />
                                        ) : (
                                            <IoPersonCircleOutline className="w-5 h-5 text-gray-600" />
                                        )}
                                        <span className="text-sm font-medium max-w-[120px] truncate text-gray-700">
                                            {user.displayName}
                                        </span>
                                        <IoMdArrowDropdown className={`transition-transform duration-200 text-gray-600 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isProfileOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-gray-100 py-1"
                                            >
                                                <div className="px-4 py-3 border-b border-gray-100">
                                                    <p className="text-sm font-medium text-gray-900">{user.displayName}</p>
                                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                </div>
                                                <Link
                                                    href={getDashboardUrl(user.role)}
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                    onClick={() => setIsProfileOpen(false)}
                                                >
                                                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-100">📊</span>
                                                    Dashboard
                                                </Link>
                                                <button
                                                    onClick={async () => {
                                                        await logout();
                                                        setIsProfileOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                >
                                                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-100">🚪</span>
                                                    Logout
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Mobile Profile Button */}
                                <div className="md:hidden">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className={`p-2 rounded-full transition-all duration-200 ${isScrolled
                                            ? 'hover:bg-gray-50'
                                            : 'hover:bg-white/10'
                                            }`}
                                    >
                                        {user.photoURL ? (
                                            <Image
                                                src={user.photoURL}
                                                alt="Profile"
                                                className="w-6 h-6 rounded-full object-cover"
                                                width={24}
                                                height={24}
                                            />
                                        ) : (
                                            <IoPersonCircleOutline className={`w-6 h-6 ${isScrolled ? 'text-gray-600' : 'text-white'
                                                }`} />
                                        )}
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Hamburger Menu */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 md:hidden rounded-full hover:bg-gray-50 transition-all duration-200"
                        >
                            {isMenuOpen ? (
                                <IoClose className="w-6 h-6 text-gray-600" />
                            ) : (
                                <IoMenu className="w-6 h-6 text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {(isMenuOpen || isProfileOpen) && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden fixed left-0 right-0 top-16 bg-white/70 backdrop-blur-md border-b border-gray-100/50 shadow-lg overflow-hidden"
                        >
                            <div className="py-2 container mx-auto">
                                {isMenuOpen && menuItems.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`block px-4 py-3 text-base ${pathname === item.href
                                            ? 'text-indigo-600 bg-indigo-50'
                                            : 'text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                {!user && isMenuOpen && (
                                    <Link
                                        href="/login"
                                        className="block px-4 py-3 text-base text-indigo-600 hover:bg-gray-50"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Get Started
                                    </Link>
                                )}
                                {isProfileOpen && user && (
                                    <>
                                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                            <p className="text-base font-medium text-gray-900">{user.displayName}</p>
                                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                        </div>
                                        <Link
                                            href={getDashboardUrl(user.role)}
                                            className="flex items-center gap-3 px-4 py-3 text-base text-gray-700 hover:bg-gray-50"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-100">📊</span>
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={async () => {
                                                await logout();
                                                setIsProfileOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-base text-gray-700 hover:bg-gray-50"
                                        >
                                            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-100">🚪</span>
                                            Logout
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </motion.header>
    )
}
