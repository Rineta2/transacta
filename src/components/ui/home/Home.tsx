"use client"

import React from 'react'

import Image from 'next/image'

import { useScroll, motion, useTransform } from 'framer-motion'

import img from "@/assets/home/home.png"

import { useRouter } from 'next/navigation'

export default function Home() {
    const { scrollY } = useScroll()
    const y = useTransform(scrollY, [0, 1000], [0, 400])
    const router = useRouter()

    const handleGetStarted = () => {
        router.push("/payment")
    }

    return (
        <section className='min-h-screen relative overflow-hidden bg-gradient-to-b from-black/60 via-black/40 to-black/20'>
            <motion.div
                style={{ y }}
                className='absolute top-0 left-0 w-full h-full z-[-1]'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            >
                <Image
                    src={img}
                    alt="home"
                    width={1920}
                    height={1080}
                    quality={100}
                    priority
                    className='w-full h-full object-cover filter brightness-75'
                />
            </motion.div>

            {/* Content container with glass effect */}
            <div className="container mx-auto min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 1,
                        type: "spring",
                        bounce: 0.3
                    }}
                    className="backdrop-blur-lg bg-white/10 p-8 sm:p-12 rounded-3xl shadow-2xl max-w-3xl w-full 
                        border border-white/20 hover:border-white/30 transition-all duration-500
                        hover:shadow-xl hover:shadow-white/10"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 1,
                            delay: 0.2,
                            type: "spring",
                            bounce: 0.2
                        }}
                        className='text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 text-center 
                            tracking-tight leading-tight'
                    >
                        The Simpler, safer way to <span className="bg-clip-text text-transparent 
                        bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400">pay and get paid</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 1,
                            delay: 0.4,
                            type: "spring",
                            bounce: 0.2
                        }}
                        className="text-gray-200 text-center mb-8 text-lg sm:text-xl"
                    >
                        Experience seamless transactions with our secure payment platform
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 1,
                            delay: 0.6,
                            type: "spring",
                            bounce: 0.2
                        }}
                        className="flex justify-center"
                    >
                        <button className="group w-full sm:w-auto bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 
                            text-white px-8 py-4 rounded-full font-semibold text-lg 
                            transition-all duration-300 transform hover:scale-105 
                            hover:shadow-lg hover:shadow-cyan-400/20 relative overflow-hidden"
                            onClick={handleGetStarted}
                        >
                            <span className="relative z-10">Get Started</span>
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        </button>

                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
