"use client"

import React, { useState, useEffect } from 'react'

import { useAuth } from '@/utils/context/AuthContext'

import { useRouter } from 'next/navigation'

import logo from "@/assets/auth/logo.png"

import Image from 'next/image'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()
    const { user, login, getDashboardUrl } = useAuth()

    useEffect(() => {
        if (user) {
            const dashboardUrl = getDashboardUrl(user.role);
            router.push(dashboardUrl);
        }
    }, [user, router, getDashboardUrl])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await login(email, password)
        } catch {
            setError('Invalid email or password')
        }
    }

    return (
        <section className='min-h-screen flex flex-col items-center justify-center'>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                <div className="flex flex-col items-center justify-center">
                    <Image src={logo} alt="logo" width={500} height={500} />
                </div>

                <form onSubmit={handleSubmit} className='flex flex-col gap-6 items-center justify-center w-full'>
                    <h1 className='text-2xl font-bold'>Login Your Account</h1>
                    {error && <p className="text-red-500">{error}</p>}

                    <div className='flex flex-col gap-4 w-full'>
                        <label className="input input-bordered flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70">
                                <path
                                    d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                                <path
                                    d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                            </svg>
                            <input
                                type="text"
                                className="grow"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>

                        <label className="input input-bordered flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70">
                                <path
                                    fillRule="evenodd"
                                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                    clipRule="evenodd" />
                            </svg>
                            <input
                                type="password"
                                className="grow"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                            />
                        </label>

                        <button type="submit" className="btn btn-primary w-full">
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}
