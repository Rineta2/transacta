'use client';

import { Fragment } from 'react';

import React from 'react';

import { motion } from 'framer-motion';

import Image from 'next/image';

import about from '@/assets/about/about.png';

export default function ProfilePage() {
    return (
        <Fragment>
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="min-h-screen flex flex-col relative overflow-hidden items-center justify-center px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-white"
            >
                <div className="container flex flex-col lg:flex-row gap-8 lg:gap-16 xl:gap-24 items-center">
                    <div className="flex-1 flex flex-col gap-6 md:gap-8">
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="backdrop-blur-xl bg-white/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)] transition-all duration-500 border border-gray-100/50 hover:border-blue-200/50"
                        >
                            <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold mb-6 md:mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Secure & Fast Transactions
                            </h2>
                            <p className="text-gray-700 text-lg xl:text-xl leading-relaxed">
                                Payment.id is a trusted digital payment platform that provides
                                various financial transaction services. With the latest encryption technology,
                                we guarantee the security of your every transaction.
                            </p>
                        </motion.div>

                        {/* Statistics */}
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="backdrop-blur-xl bg-gradient-to-br from-blue-50/90 to-purple-50/90 p-6 sm:p-8 lg:p-10 rounded-3xl shadow-lg border border-gray-100/50"
                        >
                            <h3 className="text-2xl md:text-3xl xl:text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Our Statistics
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                                <motion.div
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    className="flex-1 text-center p-8 bg-white/90 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100/50 hover:border-blue-200/50"
                                >
                                    <motion.p
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                                        className="text-5xl md:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
                                    >
                                        1M+
                                    </motion.p>
                                    <p className="text-gray-700 text-lg xl:text-xl mt-4">Active Users</p>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    className="flex-1 text-center p-6 bg-white/70 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                                >
                                    <motion.p
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.6 }}
                                        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent"
                                    >
                                        99.9%
                                    </motion.p>
                                    <p className="text-gray-600 mt-2">Uptime</p>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 relative aspect-square lg:aspect-[4/3] w-full max-w-2xl lg:max-w-none mx-auto"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-3xl" />
                        <Image
                            src={about}
                            alt="About PayEase"
                            fill
                            className="object-cover rounded-3xl hover:scale-[1.02] transition-transform duration-500"
                            priority
                        />
                    </motion.div>
                </div>
            </motion.section>

            {/* Modern connecting decorative elements */}
            <div className="relative h-32 w-full overflow-hidden">
                {/* Central line */}
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "100%" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="w-[2px] h-full mx-auto bg-gradient-to-b from-blue-400/50 via-purple-300/30 to-transparent"
                />
                {/* Decorative dots */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-400/50 blur-[2px]"
                />
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-purple-300/40 blur-[1px]"
                />
            </div>

            <section className='min-h-screen py-16'>
                <div className="container">
                    <div className='flex flex-col'>
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mt-8 backdrop-blur-xl bg-white/90 rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl border border-gray-100/50"
                        >
                            <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold mb-8 md:mb-10 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent text-center">
                                Our Features
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                                {[
                                    { title: 'Fast', icon: '⚡', desc: 'Instant transaction processing in seconds' },
                                    { title: 'Secure', icon: '🔒', desc: 'Equipped with layered security system' },
                                    { title: '24/7', icon: '🌐', desc: '24-hour customer service and support' }
                                ].map((item, index) => (
                                    <motion.div
                                        key={item.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 + (index * 0.1) }}
                                        whileHover={{ scale: 1.03, y: -5 }}
                                        className="flex flex-col items-center p-6 lg:p-8 rounded-2xl hover:bg-white/90 transition-all duration-500 border border-gray-100/50 hover:border-blue-200/50 hover:shadow-lg group"
                                    >
                                        <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-500">
                                            <span className="text-4xl xl:text-5xl">{item.icon}</span>
                                        </div>
                                        <h3 className="font-bold text-xl md:text-2xl text-gray-800 mb-3">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-600 text-center text-base lg:text-lg">{item.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col lg:flex-row gap-12 lg:gap-16 bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 mt-20 rounded-3xl p-8 lg:p-12 shadow-2xl hover:shadow-3xl transition-all duration-500"
                        >
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.7 }}
                                className="flex-1 relative aspect-square lg:aspect-[4/3]"
                            >
                                <div className="absolute inset-0 bg-black/10 rounded-3xl backdrop-blur-sm" />
                                <Image
                                    src={about}
                                    alt="Vision and Mission"
                                    fill
                                    className="object-cover rounded-3xl hover:scale-105 transition-transform duration-700"
                                    priority
                                />
                            </motion.div>

                            <div className="flex-1 space-y-10 lg:space-y-12">
                                <motion.div
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 lg:p-8 hover:bg-white/20 transition-colors duration-300"
                                >
                                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white tracking-tight">
                                        Vision
                                    </h2>
                                    <p className="text-lg sm:text-xl lg:text-2xl text-white/90 leading-relaxed">
                                        Menjadi bank digital pilihan utama masyarakat
                                    </p>
                                </motion.div>

                                <motion.div
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.9 }}
                                    className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 lg:p-8 hover:bg-white/20 transition-colors duration-300"
                                >
                                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white tracking-tight">
                                        Mission
                                    </h2>
                                    <ul className="space-y-6">
                                        {[
                                            "Memahami beragam kebutuhan nasabah dan memberikan layanan finansial yang tepat demi tercapainya kepuasan optimal bagi nasabah, dengan memanfaatkan teknologi tepat guna",
                                            "Memberikan nilai tambah bagi para pemangku kepentingan"
                                        ].map((item, index) => (
                                            <motion.li
                                                key={index}
                                                initial={{ x: 50, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 1 + (index * 0.1) }}
                                                className="flex items-start gap-4 text-white/90 text-base sm:text-lg lg:text-xl leading-relaxed"
                                            >
                                                <span className="w-6 h-6 min-w-[1.5rem] bg-white/20 rounded-full flex items-center justify-center text-sm">
                                                    {index + 1}
                                                </span>
                                                {item}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </Fragment>
    );
}