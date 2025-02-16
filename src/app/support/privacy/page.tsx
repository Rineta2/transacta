import React from 'react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen flex flex-col items-center">
            <div className="w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12">
                    Privacy Policy
                </h1>

                <div className="flex flex-col gap-8 md:gap-12">
                    <section className="bg-white rounded-2xl shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow flex flex-col">
                        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
                            1. Information We Collect
                        </h2>
                        <div className="flex flex-col gap-4">
                            <p className="text-gray-700">
                                To process transactions and maintain the security of your account, we collect:
                            </p>

                            <ul className="flex flex-col gap-3 pl-6 text-gray-600">
                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Identity information (ID card, selfie)
                                </li>

                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Contact information (email, phone number)
                                </li>

                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Financial information (bank account, credit card)
                                </li>

                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Transaction data
                                </li>

                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Device information and activity logs
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section className="bg-white rounded-2xl shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow flex flex-col">
                        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
                            2. Use of Information
                        </h2>
                        <div className="flex flex-col gap-4">
                            <p className="text-gray-700">
                                We use your information to:
                            </p>
                            <ul className="flex flex-col gap-3 pl-6 text-gray-600">
                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Process transactions and payments
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Verify identity
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Prevent fraud
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Comply with regulations
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Improve our services
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section className="bg-white rounded-2xl shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow flex flex-col">
                        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
                            3. Data Security
                        </h2>
                        <div className="bg-blue-50 rounded-xl p-6 flex flex-col gap-4">
                            <p className="text-gray-700">
                                We implement the highest security standards in accordance with PCI DSS and FSA regulations, including:
                            </p>
                            <ul className="flex flex-col gap-3 pl-6 text-gray-600">
                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    End-to-end encryption
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Multi-factor authentication
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    24/7 security monitoring
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Regular security audits
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section className="bg-white rounded-2xl shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow flex flex-col">
                        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
                            4. Information Sharing
                        </h2>
                        <p className="text-gray-700 mb-4">
                            We only share your information with:
                        </p>
                        <ul className="flex flex-col gap-3 pl-6 text-gray-600">
                            <li className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Partner banks for transaction processing
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Regulators as required by law
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Service providers bound by confidentiality agreements
                            </li>
                        </ul>
                    </section>

                    <section className="bg-white rounded-2xl shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow flex flex-col">
                        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
                            5. User Rights
                        </h2>
                        <p className="text-gray-700 mb-4">
                            You have the right to:
                        </p>
                        <ul className="flex flex-col gap-3 pl-6 text-gray-600">
                            <li className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Access your personal data
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Update your information
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Restrict data usage
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Delete your account
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}