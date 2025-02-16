"use client";

import React, { useState } from 'react';

import { z } from 'zod';

import { db } from '@/utils/firebase';

import { collection, addDoc } from 'firebase/firestore';

import toast from 'react-hot-toast';

const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    category: z.string().min(1, 'Please select a category'),
    message: z.string().min(10, 'Message must be at least 10 characters')
});

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        category: '',
        message: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validate form data
            const validatedData = contactSchema.parse(formData);
            setErrors({});

            const contactsRef = collection(db, 'contacts');
            await addDoc(contactsRef, {
                ...validatedData,
                timestamp: new Date().toISOString()
            });

            setFormData({
                name: '',
                email: '',
                category: '',
                message: ''
            });

            toast.success('Message sent successfully!');
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    if (err.path) {
                        fieldErrors[err.path[0]] = err.message;
                    }
                });
                setErrors(fieldErrors);
                toast.error('Please check the form for errors.');
            } else {
                console.error('Error sending message:', error);
                toast.error('Failed to send message. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));

        // Clear the error for the field being changed
        if (errors[id]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[id];
                return newErrors;
            });
        }
    };

    return (
        <section className="min-h-screen">
            <div className="container">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        Get in Touch
                    </h1>

                    <p className="mt-4 text-lg text-gray-600">
                        We&apos;re here to help and answer any questions you might have
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 transition-all duration-200 hover:shadow-md">
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0">
                                    <div className="p-3 bg-blue-50 rounded-xl">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">24/7 Support</h3>
                                    <p className="mt-1 text-blue-600 font-medium">+62 800-123-4567</p>
                                    <p className="mt-1 text-sm text-gray-500">Available for urgent issues</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 transition-all duration-200 hover:shadow-md">
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0">
                                    <div className="p-3 bg-blue-50 rounded-xl">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Email Support</h3>
                                    <p className="mt-1 text-blue-600 font-medium">support@payease.com</p>
                                    <p className="mt-1 text-sm text-gray-500">Response within 24 hours</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        className={`mt-1 block w-full px-4 py-3 rounded-xl text-gray-900 bg-gray-50 border ${errors.name ? 'border-red-300' : 'border-gray-200'
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                                    />
                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john.doe@example.com"
                                        className={`mt-1 block w-full px-4 py-3 rounded-xl text-gray-900 bg-gray-50 border ${errors.email ? 'border-red-300' : 'border-gray-200'
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                                    />
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                        Issue Category
                                    </label>
                                    <select
                                        id="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full px-4 py-3 rounded-xl text-gray-900 bg-gray-50 border ${errors.category ? 'border-red-300' : 'border-gray-200'
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                                    >
                                        <option value="">Select category</option>
                                        <option>Failed Transaction</option>
                                        <option>Pending Funds</option>
                                        <option>Other</option>
                                    </select>
                                    {errors.category && (
                                        <p className="mt-2 text-sm text-red-600">{errors.category}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                        Issue Details
                                    </label>
                                    <textarea
                                        id="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Describe your issue"
                                        className={`mt-1 block w-full resize-none px-4 py-3 rounded-xl text-gray-900 bg-gray-50 border ${errors.message ? 'border-red-300' : 'border-gray-200'
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                                    ></textarea>
                                    {errors.message && (
                                        <p className="mt-2 text-sm text-red-600">{errors.message}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </div>
                                    ) : (
                                        'Send Message'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}