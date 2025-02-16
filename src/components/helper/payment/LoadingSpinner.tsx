import React from 'react'

interface LoadingSpinnerProps {
    variant?: 'success' | 'error'
}

export default function LoadingSpinner({ variant = 'success' }: LoadingSpinnerProps) {
    const colors = {
        success: {
            gradient: 'from-blue-50 to-indigo-50',
            borderBase: 'border-blue-100',
            borderSpin: 'border-blue-500',
            innerBase: 'border-indigo-100',
            innerSpin: 'border-indigo-500',
            centerGradient: 'from-blue-500 to-indigo-500',
            text: 'from-blue-600 to-indigo-600'
        },
        error: {
            gradient: 'from-red-50 to-orange-50',
            borderBase: 'border-red-100',
            borderSpin: 'border-red-500',
            innerBase: 'border-orange-100',
            innerSpin: 'border-orange-500',
            centerGradient: 'from-red-500 to-orange-500',
            text: 'from-red-600 to-orange-600'
        }
    }

    const color = colors[variant]

    return (
        <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${color.gradient}`}>
            <div className="relative flex flex-col items-center">
                {/* Outer spinning ring */}
                <div className="w-24 h-24 md:w-32 md:h-32 relative">
                    <div className={`absolute inset-0 rounded-full border-[3px] md:border-4 ${color.borderBase}`}></div>
                    <div className={`absolute inset-0 rounded-full border-[3px] md:border-4 ${color.borderSpin} border-t-transparent animate-[spin_1s_linear_infinite]`}></div>

                    {/* Inner spinning ring */}
                    <div className="absolute inset-4 md:inset-6">
                        <div className={`absolute inset-0 rounded-full border-[3px] md:border-4 ${color.innerBase}`}></div>
                        <div className={`absolute inset-0 rounded-full border-[3px] md:border-4 ${color.innerSpin} border-t-transparent animate-[spin_0.75s_linear_infinite]`}></div>
                    </div>

                    {/* Center dot */}
                    <div className={`absolute inset-[45%] bg-gradient-to-br ${color.centerGradient} rounded-full animate-pulse`}></div>
                </div>

                {/* Loading text with shimmer effect */}
                <div className="mt-8 relative">
                    <div className={`text-transparent bg-clip-text bg-gradient-to-r ${color.text} text-lg md:text-xl font-medium animate-pulse`}>
                        Loading
                        <span className="inline-block animate-bounce delay-100">.</span>
                        <span className="inline-block animate-bounce delay-200">.</span>
                        <span className="inline-block animate-bounce delay-300">.</span>
                    </div>
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.5s_infinite] -skew-x-12"></div>
                </div>
            </div>
        </div>
    )
}