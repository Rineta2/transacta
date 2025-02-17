"use client";

import React from "react";

import { usePathname } from "next/navigation";

import Header from "@/components/header/Header";

import Footer from "@/components/footer/Footer";

import { Toaster } from "react-hot-toast";

import Script from "next/script";

const Pathname = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    // Check for all dashboard/admin routes
    const isAdminRoute = pathname?.includes("/super-admins") ||
        pathname?.includes("/admins") ||
        pathname?.includes("/auth") ||
        pathname?.includes("/payment") ||
        pathname?.includes("/transaction/pending") ||
        pathname?.includes("/transaction/success") || false;

    const isPaymentRoute = pathname?.includes("/payment");

    const paypalScriptUrl = `https://www.paypal.com/sdk/js` +
        `?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}` +
        `&currency=USD` +
        `&intent=capture` +
        `&components=buttons` +
        `&enable-funding=card` +
        `&disable-funding=paylater`;

    return (
        <main>
            {isPaymentRoute && (
                <Script
                    src={paypalScriptUrl}
                    strategy="afterInteractive"
                    onLoad={() => {
                        console.log('PayPal script loaded successfully');
                    }}
                    onError={(e) => {
                        console.error('PayPal script failed to load:', e);
                    }}
                />
            )}
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#333',
                        color: '#fff',
                    },
                    success: {
                        style: {
                            background: '#22c55e',
                            color: '#fff',
                        },
                    },
                    error: {
                        style: {
                            background: '#ef4444',
                            color: '#fff',
                        },
                    },
                }}
            />
            {!isAdminRoute && <Header />}
            {children}
            {!isAdminRoute && <Footer />}
        </main>
    );
};

export default Pathname;