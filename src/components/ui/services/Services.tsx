"use client"

import React from 'react'

import { motion } from 'framer-motion'

import { servicesData } from '@/components/ui/services/data/data'

import Image from 'next/image'

export default function Services() {
    return (
        <section>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="heading flex items-center justify-center text-center mb-24"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 max-w-3xl leading-tight">
                        Payment.id is for everyone who pays or get paid
                    </h1>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {servicesData.map((item, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            key={index}
                            className="card bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="mb-6">
                                <Image
                                    src={item.img}
                                    alt={item.title}
                                    width={100}
                                    height={100}
                                    className="mx-auto"
                                />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                                {item.title}
                            </h2>
                            <p className="text-gray-600 text-center leading-relaxed">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
