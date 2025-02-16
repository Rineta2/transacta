import React from 'react';

import { footerLinks } from '@/components/footer/data/data';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Company Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">{footerLinks.company.title}</h3>
                        <ul className="space-y-4">
                            {footerLinks.company.links.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="hover:text-white transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">{footerLinks.support.title}</h3>
                        <ul className="space-y-4">
                            {footerLinks.support.links.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="hover:text-white transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">{footerLinks.social.title}</h3>
                        <ul className="space-y-4">
                            {footerLinks.social.links.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-white transition-colors flex items-center gap-2"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <span>{link.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center">
                    <p className="text-sm">
                        © {new Date().getFullYear()} Payment.id All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
