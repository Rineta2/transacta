"use client"

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { dataAnnount } from '@/components/ui/annount/data/data'
import { useScrollOffset } from '@/components/helper/useScrollOffset'

export default function Annount() {
    const { offsetY, promotionsRef } = useScrollOffset()

    return (
        <section
            ref={promotionsRef}
            className='relative min-h-screen w-full flex items-center justify-start overflow-hidden py-20 lg:py-32'
        >
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl flex flex-col items-start gap-6 md:gap-8"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className='text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight'
                    >
                        {dataAnnount.title}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className='text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl'
                    >
                        {dataAnnount.description}
                    </motion.p>
                </motion.div>
            </div>

            <div
                className='absolute inset-0 z-[-1] before:absolute before:inset-0 before:bg-black/50'
                style={{ transform: `translateY(${offsetY * 0.5}px)` }}
            >
                <Image
                    src={dataAnnount.img}
                    alt='annount'
                    className='w-full h-full object-cover'
                    priority
                    quality={90}
                />
            </div>
        </section>
    )
}
