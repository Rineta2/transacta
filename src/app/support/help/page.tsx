"use client";

import React, { useState } from 'react';

import { faqs } from '@/hooks/suport/help/data';

export default function HelpPage() {
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    return (
        <section className="min-h-screen px-10 py-12">
            <div className="container">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        Help Center
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Find answers to your questions or contact our support team
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {[
                        {
                            title: "Check Transaction Status",
                            color: "blue",
                            icon: "📊"
                        },
                        {
                            title: "Report an Issue",
                            color: "green",
                            icon: "🔔"
                        },
                        {
                            title: "Transaction Tutorial",
                            color: "purple",
                            icon: "📚"
                        }
                    ].map((action, index) => (
                        <div
                            key={index}
                            className={`bg-${action.color}-50 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}
                        >
                            <div className="text-3xl mb-4">{action.icon}</div>
                            <h3 className="font-semibold text-xl mb-3">{action.title}</h3>
                            <button className={`text-${action.color}-600 hover:text-${action.color}-700 font-medium`}>
                                View Details →
                            </button>
                        </div>
                    ))}
                </div>

                {/* FAQs */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="border rounded-xl hover:shadow-md transition-all duration-300"
                            >
                                <button
                                    className="w-full text-left p-6 focus:outline-none"
                                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold">{faq.question}</h3>
                                        <span className={`transform transition-transform duration-300 ${expandedFaq === index ? 'rotate-180' : ''}`}>
                                            ▼
                                        </span>
                                    </div>
                                    {expandedFaq === index && (
                                        <p className="text-gray-600 mt-4 animate-fadeIn">
                                            {faq.answer}
                                        </p>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Support */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-12 text-white">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-4">Need further assistance?</h2>
                        <p className="text-white/90 mb-8 text-lg">
                            Our support team is ready to help 24/7
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                                Live Chat
                            </button>
                            <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors border border-white/20">
                                Email Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}