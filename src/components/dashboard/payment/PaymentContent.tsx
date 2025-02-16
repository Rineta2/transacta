"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react'

import { toast } from 'react-hot-toast'

import { format } from 'date-fns'

import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, writeBatch } from 'firebase/firestore'

import { db } from '@/utils/firebase'

import { Payment, SystemConfig } from '@/components/dashboard/payment/schema/interface'

import PaymentSkeleton from '@/components/dashboard/payment/PaymentSkelaton'

import { useAuth } from '@/utils/context/AuthContext';

import imagekitInstance from '@/utils/imageKit'

import { compressImage } from '@/components/helper/imageCompression'

import Image from 'next/image'

import Pagination from '@/components/helper/Pagination'

import { debounce } from 'lodash'

export default function PaymentContent() {
    const { user } = useAuth();

    const [payments, setPayments] = useState<Payment[]>([])

    const [isLoading, setIsLoading] = useState(true)

    const [isModalOpen, setIsModalOpen] = useState(false)

    const [isSaving, setIsSaving] = useState(false)

    const [isUploading, setIsUploading] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        priceIdr: '',
        priceUsd: '',
        isPublished: false,
        date: new Date().toISOString(),
        slug: '',
        expiryDays: 0,
        createdAt: new Date().toISOString(),
        author: {
            displayName: user?.displayName || '',
            role: user?.role || '',
            photoURL: user?.photoURL || ''
        },
        thumbnail: '',
        description: '',
    })

    const [editingPayment, setEditingPayment] = useState<string | null>(null)

    // Add new state for view modal
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

    // Add new state for delete confirmation modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null)

    // Add new state for delete loading
    const [isDeleting, setIsDeleting] = useState(false)

    // Add pagination states
    const [currentPage, setCurrentPage] = useState(0)
    const itemsPerPage = 10 // Adjust this value as needed

    // Add new states for search and filter
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all') // 'all', 'active', 'inactive', 'expired'
    const [sortBy, setSortBy] = useState('date') // 'date', 'title', 'price'
    const [sortOrder, setSortOrder] = useState('desc') // 'asc', 'desc'

    // Move isPaymentExpired to the top
    const isPaymentExpired = useCallback((payment: Payment) => {
        const startDate = new Date(payment.date);
        const expiryDate = new Date(startDate.getTime() + payment.expiryDays * 24 * 60 * 60 * 1000);
        return new Date() > expiryDate;
    }, []);

    // Add filtered and sorted payments calculation
    const filteredAndSortedPayments = useMemo(() => {
        let filtered = [...payments]

        // Apply search
        if (searchTerm) {
            filtered = filtered.filter(payment =>
                payment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.description?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Apply status filter
        if (filterStatus !== 'all') {
            filtered = filtered.filter(payment => {
                const isExpired = isPaymentExpired(payment)
                switch (filterStatus) {
                    case 'active':
                        return payment.isPublished && !isExpired
                    case 'inactive':
                        return !payment.isPublished && !isExpired
                    case 'expired':
                        return isExpired
                    default:
                        return true
                }
            })
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'title':
                    return sortOrder === 'asc'
                        ? a.title.localeCompare(b.title)
                        : b.title.localeCompare(a.title)
                case 'price':
                    return sortOrder === 'asc'
                        ? a.priceUsd - b.priceUsd
                        : b.priceUsd - a.priceUsd
                default: // date
                    return sortOrder === 'asc'
                        ? new Date(a.date).getTime() - new Date(b.date).getTime()
                        : new Date(b.date).getTime() - new Date(a.date).getTime()
            }
        })

        return filtered
    }, [payments, searchTerm, filterStatus, sortBy, sortOrder, isPaymentExpired])

    // Calculate pagination values from filtered results
    const offset = currentPage * itemsPerPage
    const pageCount = Math.ceil(filteredAndSortedPayments.length / itemsPerPage)
    const currentPayments = filteredAndSortedPayments.slice(offset, offset + itemsPerPage)

    // Update search handler with proper dependencies
    const handleSearch = useCallback((value: string) => {
        setSearchTerm(value)
        setCurrentPage(0) // Reset to first page when searching
    }, []) // Empty dependency array since it only uses setState functions

    // Add debounced search handler
    const debouncedSearch = useMemo(
        () => debounce(handleSearch, 300),
        [handleSearch]
    )

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            debouncedSearch.cancel()
        }
    }, [debouncedSearch])

    // Add state for current time that updates every second
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update conversion rate to more accurate value
    const conversionRate = 0.000064; // 1 IDR = 0.000064 USD (adjust this value based on current exchange rate)

    // Then declare fetchPayments
    const fetchPayments = useCallback(async () => {
        const querySnapshot = await getDocs(collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_PAYMENTS as string))
        const paymentsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Payment[]

        // Check and update expired payments
        for (const payment of paymentsData) {
            const isExpired = isPaymentExpired(payment)
            if (isExpired && payment.isPublished) {
                await updateDoc(doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_PAYMENTS as string, payment.id), {
                    isPublished: false
                })
                payment.isPublished = false
            }
        }

        const sortedPayments = paymentsData.sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )

        setPayments(sortedPayments)
        setIsLoading(false)
    }, [isPaymentExpired])

    // Add function to handle system config
    const updateExpiryDays = useCallback(async () => {
        try {
            // Get system config from Firestore
            const configRef = collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_SYSTEM_CONFIG as string);
            const configSnapshot = await getDocs(configRef);
            const configDoc = configSnapshot.docs[0];
            const today = new Date().toISOString().split('T')[0];

            const currentConfig = configDoc?.data() as SystemConfig | undefined;

            // Only update if it hasn't been updated today
            if (!currentConfig || currentConfig.lastExpiryUpdate !== today) {
                const querySnapshot = await getDocs(collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_PAYMENTS as string));
                const batch = writeBatch(db);
                let hasUpdates = false;

                querySnapshot.docs.forEach((document) => {
                    const payment = document.data() as Payment;
                    const startDate = new Date(payment.date);
                    const currentDate = new Date();

                    const daysElapsed = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

                    if (daysElapsed > 0 && payment.expiryDays > 0) {
                        const newExpiryDays = Math.max(0, payment.expiryDays - 1);

                        const docRef = doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_PAYMENTS as string, document.id);

                        // Check if expiryDays is 0 or will become 0
                        if (newExpiryDays === 0) {
                            batch.update(docRef, {
                                expiryDays: 0,
                                isPublished: false // Force set to false when expired
                            });
                        } else {
                            batch.update(docRef, {
                                expiryDays: newExpiryDays
                            });
                        }
                        hasUpdates = true;
                    } else if (payment.expiryDays === 0 && payment.isPublished) {
                        // Additional check for any payments with 0 expiryDays that are still published
                        const docRef = doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_PAYMENTS as string, document.id);
                        batch.update(docRef, {
                            isPublished: false
                        });
                        hasUpdates = true;
                    }
                });

                // Update or create system config
                if (configDoc) {
                    batch.update(doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_SYSTEM_CONFIG as string, configDoc.id), {
                        lastExpiryUpdate: today
                    });
                } else {
                    const newConfigRef = doc(collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_SYSTEM_CONFIG as string));
                    batch.set(newConfigRef, {
                        lastExpiryUpdate: today
                    });
                }

                if (hasUpdates) {
                    await batch.commit();
                    await fetchPayments();
                }
            }
        } catch (error) {
            console.error('Error updating expiry days:', error);
            toast.error('Failed to update expiry days');
        }
    }, [fetchPayments]);

    // Modify useEffect to use Firestore check
    useEffect(() => {
        const checkAndScheduleUpdate = async () => {
            try {
                const configRef = collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_SYSTEM_CONFIG as string);
                const configSnapshot = await getDocs(configRef);
                const configDoc = configSnapshot.docs[0];
                const today = new Date().toISOString().split('T')[0];

                const currentConfig = configDoc?.data() as SystemConfig | undefined;

                if (!currentConfig || currentConfig.lastExpiryUpdate !== today) {
                    await updateExpiryDays();
                }

                // Calculate time until next midnight
                const now = new Date();
                const tomorrow = new Date(now);
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(0, 0, 0, 0);
                const timeUntilMidnight = tomorrow.getTime() - now.getTime();

                // Set initial timeout to run at midnight
                const initialTimeout = setTimeout(() => {
                    updateExpiryDays();

                    // Then set up daily interval
                    const dailyInterval = setInterval(updateExpiryDays, 24 * 60 * 60 * 1000);

                    // Cleanup interval on unmount
                    return () => clearInterval(dailyInterval);
                }, timeUntilMidnight);

                // Cleanup timeout on unmount
                return () => clearTimeout(initialTimeout);
            } catch (error) {
                console.error('Error checking system config:', error);
                toast.error('Failed to check system configuration');
            }
        };

        checkAndScheduleUpdate();
    }, [updateExpiryDays]);

    // Update useEffects
    useEffect(() => {
        fetchPayments()
    }, [fetchPayments])

    // Update getRemainingTime to use the current time from state
    const getRemainingTime = useCallback((payment: Payment) => {
        const startDate = new Date(payment.date);
        const expiryDate = new Date(startDate.getTime() + payment.expiryDays * 24 * 60 * 60 * 1000);
        const now = currentTime;

        if (now > expiryDate) {
            return 'Expired';
        }

        const remaining = expiryDate.getTime() - now.getTime();
        const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

        if (days > 0) {
            return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else {
            return `${hours}h ${minutes}m ${seconds}s`;
        }
    }, [currentTime]);

    // Add useEffect for updating the timer every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Cleanup on unmount
        return () => clearInterval(timer);
    }, []);

    // Add useEffect to handle body scrolling
    useEffect(() => {
        // When any modal is open, prevent body scrolling
        if (isModalOpen || isViewModalOpen || isDeleteModalOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        // Cleanup function to reset body scrolling when component unmounts
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isModalOpen, isViewModalOpen, isDeleteModalOpen])

    if (isLoading) {
        return <PaymentSkeleton />
    }

    // Edit payment
    const handleEdit = (payment: Payment) => {
        setEditingPayment(payment.id)
        setFormData({
            title: payment.title,
            priceIdr: (payment.priceIdr || 0).toString(),
            priceUsd: (payment.priceUsd || 0).toString(),
            isPublished: payment.isPublished,
            date: new Date(payment.date).toISOString(),
            slug: payment.slug,
            expiryDays: payment.expiryDays,
            createdAt: payment.createdAt,
            author: {
                displayName: payment.author.displayName,
                role: payment.author.role,
                photoURL: payment.author.photoURL || ''
            },
            thumbnail: payment.thumbnail,
            description: payment.description || '',
        })
        setIsModalOpen(true)
    }

    // Add function to generate slug from title
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphen
            .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    }

    // Add image upload handler
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            // Compress the image
            const compressedFile = await compressImage(file)

            // Convert to base64
            const reader = new FileReader()
            reader.readAsDataURL(compressedFile)
            reader.onloadend = async () => {
                const base64data = reader.result as string

                // Upload to ImageKit
                const upload = await imagekitInstance.upload({
                    file: base64data,
                    fileName: `payment-${Date.now()}`,
                    folder: '/payments'
                })

                setFormData(prev => ({
                    ...prev,
                    thumbnail: upload.url
                }))
                toast.success('Image uploaded successfully')
            }
        } catch (error) {
            console.error('Error uploading image:', error)
            toast.error('Failed to upload image')
        } finally {
            setIsUploading(false)
        }
    }

    // Update handlePriceIdrChange function
    const handlePriceIdrChange = (value: string) => {
        // Remove non-numeric characters
        const numericValue = value.replace(/\D/g, '');

        // Convert to numbers for calculation
        const idrAmount = numericValue ? parseInt(numericValue) : 0;
        const usdAmount = (idrAmount * conversionRate);

        setFormData(prev => ({
            ...prev,
            priceIdr: formatPrice(numericValue),
            // Store USD value as string with full number
            priceUsd: usdAmount.toString()
        }));
    };

    // Update handleSubmit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            const paymentData = {
                ...formData,
                // Convert IDR string to number by removing non-numeric chars
                priceIdr: Number(formData.priceIdr.replace(/\D/g, '')),
                // Convert USD string to number with proper decimal places
                priceUsd: Number(parseFloat(formData.priceUsd).toFixed(2)),
                date: new Date(formData.date).toISOString(),
                slug: generateSlug(formData.title),
                expiryDays: Number(formData.expiryDays) || 0,
                author: {
                    displayName: user?.displayName || '',
                    role: user?.role || '',
                    photoURL: user?.photoURL || ''
                },
                thumbnail: formData.thumbnail,
            }

            if (editingPayment) {
                await updateDoc(doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_PAYMENTS as string, editingPayment), paymentData)
                toast.success('Payment updated successfully')
            } else {
                await addDoc(collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_PAYMENTS as string), {
                    ...paymentData,
                    createdAt: new Date().toISOString()
                })
                toast.success('Payment added successfully')
            }

            setIsModalOpen(false)
            setFormData({
                title: '',
                priceIdr: '',
                priceUsd: '',
                isPublished: false,
                date: new Date().toISOString(),
                slug: '',
                expiryDays: 0,
                createdAt: new Date().toISOString(),
                author: {
                    displayName: user?.displayName || '',
                    role: user?.role || '',
                    photoURL: user?.photoURL || ''
                },
                thumbnail: '',
                description: '',
            })
            setEditingPayment(null)
            fetchPayments()
        } catch (error) {
            console.error("Error saving payment:", error)
            toast.error('Failed to save payment')
        } finally {
            setIsSaving(false)
        }
    }

    // Tambahkan fungsi untuk memformat input price
    const formatPrice = (value: string) => {
        // Hapus semua karakter non-digit
        const number = value.replace(/\D/g, '')
        // Format angka dengan pemisah ribuan
        return number ? Number(number).toLocaleString('id-ID') : ''
    }

    // Update deletePayment to handle confirmation
    const handleDeleteClick = (id: string) => {
        setPaymentToDelete(id)
        setIsDeleteModalOpen(true)
    }

    // Update confirmDelete to handle loading state
    const confirmDelete = async () => {
        if (!paymentToDelete) return
        setIsDeleting(true)

        try {
            await deleteDoc(doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_PAYMENTS as string, paymentToDelete))
            toast.success('Payment deleted successfully')
            fetchPayments()
        } catch (error) {
            console.error("Error deleting payment:", error)
            toast.error('Failed to delete payment')
        } finally {
            setIsDeleting(false)
            setIsDeleteModalOpen(false)
            setPaymentToDelete(null)
        }
    }

    // Add function to handle view button click
    const handleView = (payment: Payment) => {
        setSelectedPayment(payment)
        setIsViewModalOpen(true)
    }

    // Add this function to reset form
    const resetForm = () => {
        setFormData({
            title: '',
            priceIdr: '',
            priceUsd: '',
            isPublished: false,
            date: new Date().toISOString(),
            slug: '',
            expiryDays: 0,
            createdAt: new Date().toISOString(),
            author: {
                displayName: user?.displayName || '',
                role: user?.role || '',
                photoURL: user?.photoURL || ''
            },
            thumbnail: '',
            description: '',
        })
        setEditingPayment(null)
    }

    return (
        <section className="py-2 md:py-10 min-h-screen">
            <div className="container">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className='flex flex-col gap-1.5'>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Payment List</h1>
                        <p className="text-sm md:text-base text-gray-500">Manage and track your payment records</p>
                    </div>

                    <button
                        className="w-full md:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-sm transition-all duration-200 flex items-center justify-center md:justify-start gap-2 hover:shadow-indigo-100 hover:shadow-lg active:scale-95"
                        onClick={() => {
                            resetForm()
                            setIsModalOpen(true)
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Payment
                    </button>
                </div>

                {/* Search and Filters */}
                <div className="mb-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search Input - Updated to use debouncedSearch */}
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Search payments..."
                                onChange={(e) => debouncedSearch(e.target.value)}
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <select
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={filterStatus}
                                onChange={(e) => {
                                    setFilterStatus(e.target.value)
                                    setCurrentPage(0)
                                }}
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="expired">Expired</option>
                            </select>
                        </div>

                        {/* Sort By */}
                        <div>
                            <select
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={sortBy}
                                onChange={(e) => {
                                    setSortBy(e.target.value)
                                    setCurrentPage(0)
                                }}
                            >
                                <option value="date">Sort by Date</option>
                                <option value="title">Sort by Title</option>
                                <option value="price">Sort by Price</option>
                            </select>
                        </div>

                        {/* Sort Order */}
                        <button
                            className="flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                            onClick={() => setSortOrder(current => current === 'asc' ? 'desc' : 'asc')}
                        >
                            {sortOrder === 'asc' ? (
                                <div className="flex items-center gap-2">
                                    <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-700">Ascending</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-700">Descending</span>
                                </div>
                            )}
                        </button>
                    </div>

                    {/* Results Summary */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        {filterStatus !== 'all' && (
                            <button
                                onClick={() => setFilterStatus('all')}
                                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
                            >
                                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Clear filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Replace table with card grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
                    {currentPayments.map((payment) => (
                        <div key={payment.id}
                            className="group bg-white rounded-3xl shadow-sm border border-gray-200/80 overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Card Image with Gradient Overlay */}
                            <div className="relative w-full aspect-[4/2.5]">
                                {payment.thumbnail ? (
                                    <>
                                        <Image
                                            src={payment.thumbnail}
                                            alt={payment.title}
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            fill
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                    </>
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            className="h-12 w-12 text-gray-400 group-hover:scale-110 transition-transform duration-300"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Card Content with Modern Styling */}
                            <div className="p-5 space-y-4">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors duration-200">
                                        {payment.title}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">
                                            ${payment.priceUsd.toLocaleString()}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            (Rp {payment.priceIdr.toLocaleString()})
                                        </span>
                                    </div>
                                </div>

                                {/* Status and Time with Modern Badges */}
                                <div className="flex items-center justify-between">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200
                                        ${isPaymentExpired(payment)
                                            ? 'bg-gray-100 text-gray-700 group-hover:bg-gray-200'
                                            : payment.isPublished
                                                ? 'bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200'
                                                : 'bg-red-100 text-red-700 group-hover:bg-red-200'
                                        }`}>
                                        {isPaymentExpired(payment)
                                            ? 'Expired'
                                            : payment.isPublished
                                                ? 'Active'
                                                : 'Inactive'}
                                    </span>
                                    <span className="text-sm text-gray-600 font-medium bg-gray-100/80 px-2 py-1 rounded-lg">
                                        {getRemainingTime(payment)}
                                    </span>
                                </div>

                                {/* Author Info with Modern Design */}
                                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                    {payment.author.photoURL ? (
                                        <Image
                                            src={payment.author.photoURL}
                                            alt={payment.author.displayName}
                                            width={36}
                                            height={36}
                                            className="rounded-full object-cover shadow-sm group-hover:scale-110 transition-transform duration-200"
                                        />
                                    ) : (
                                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center shadow-sm">
                                            <span className="text-indigo-600 font-medium group-hover:scale-110 transition-transform duration-200">
                                                {payment.author.displayName?.[0]?.toUpperCase() || '?'}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors duration-200">
                                            {payment.author.displayName}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {format(new Date(payment.date), 'dd MMM yyyy')}
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons with Modern Styling */}
                                <div className="grid grid-cols-3 gap-2 pt-4">
                                    <button
                                        onClick={() => handleView(payment)}
                                        className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all duration-200 hover:shadow-md hover:shadow-indigo-100 active:scale-95"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleEdit(payment)}
                                        className="px-4 py-2 text-sm font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all duration-200 hover:shadow-md hover:shadow-amber-100 active:scale-95"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(payment.id)}
                                        className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 hover:shadow-md hover:shadow-red-100 active:scale-95"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Replace the existing pagination with the new component */}
                {payments.length > 0 && (
                    <Pagination
                        pageCount={pageCount}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        totalItems={payments.length}
                        itemsPerPage={itemsPerPage}
                    />
                )}

                {/* View Modal - Update the outer div styles */}
                {isViewModalOpen && selectedPayment && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-hidden">
                        <div className="flex items-center justify-center min-h-screen p-4">
                            <div className="bg-white rounded-3xl shadow-xl max-w-6xl w-full p-6 max-h-[90vh] overflow-y-auto">
                                {/* Modal Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">Payment Details</h3>
                                    <button
                                        onClick={() => setIsViewModalOpen(false)}
                                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Content Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Left Column - Basic Info */}
                                    <div className="space-y-6">
                                        {/* Thumbnail */}
                                        {selectedPayment.thumbnail && (
                                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100">
                                                <Image
                                                    src={selectedPayment.thumbnail}
                                                    alt={selectedPayment.title}
                                                    className="object-cover"
                                                    fill
                                                />
                                            </div>
                                        )}

                                        {/* Title & Price Card */}
                                        <div className="bg-gray-50 p-4 rounded-2xl space-y-4">
                                            <div>
                                                <div className="text-sm text-gray-500 mb-1">Title</div>
                                                <div className="text-lg font-semibold text-gray-900">{selectedPayment.title}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500 mb-1">Price</div>
                                                <div className="text-2xl font-bold text-indigo-600">
                                                    ${selectedPayment.priceUsd.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="bg-gray-50 p-4 rounded-2xl">
                                            <div className="text-sm text-gray-500 mb-2">Description</div>
                                            <div className="text-gray-700 whitespace-pre-wrap">
                                                {selectedPayment.description || 'No description provided'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Details */}
                                    <div className="space-y-6">
                                        {/* Status Card */}
                                        <div className="bg-gray-50 p-4 rounded-2xl">
                                            <div className="text-sm text-gray-500 mb-3">Status</div>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full ${isPaymentExpired(selectedPayment)
                                                    ? 'bg-gray-400'
                                                    : selectedPayment.isPublished
                                                        ? 'bg-green-400'
                                                        : 'bg-red-400'
                                                    }`} />
                                                <span className={`font-medium ${isPaymentExpired(selectedPayment)
                                                    ? 'text-gray-700'
                                                    : selectedPayment.isPublished
                                                        ? 'text-green-700'
                                                        : 'text-red-700'
                                                    }`}>
                                                    {isPaymentExpired(selectedPayment)
                                                        ? 'Expired'
                                                        : selectedPayment.isPublished
                                                            ? 'Active'
                                                            : 'Inactive'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Date & Duration */}
                                        <div className="bg-gray-50 p-4 rounded-2xl space-y-4">
                                            <div>
                                                <div className="text-sm text-gray-500 mb-1">Start Date</div>
                                                <div className="font-medium text-gray-900">
                                                    {format(new Date(selectedPayment.date), 'dd MMMM yyyy')}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500 mb-1">Duration</div>
                                                <div className="font-medium text-gray-900">
                                                    {selectedPayment.expiryDays} {selectedPayment.expiryDays === 1 ? 'day' : 'days'}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500 mb-1">Time Remaining</div>
                                                <div className="font-medium text-gray-900">
                                                    {getRemainingTime(selectedPayment)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Author Info */}
                                        <div className="bg-gray-50 p-4 rounded-2xl">
                                            <div className="text-sm text-gray-500 mb-3">Author</div>
                                            <div className="flex items-center gap-3">
                                                {selectedPayment.author.photoURL ? (
                                                    <Image
                                                        src={selectedPayment.author.photoURL}
                                                        alt={selectedPayment.author.displayName}
                                                        width={40}
                                                        height={40}
                                                        className="rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                        <span className="text-indigo-600 font-medium text-lg">
                                                            {selectedPayment.author.displayName?.[0]?.toUpperCase() || '?'}
                                                        </span>
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {selectedPayment.author.displayName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {selectedPayment.author.role}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Payment URL */}
                                        <div className="bg-gray-50 p-4 rounded-2xl">
                                            <div className="text-sm text-gray-500 mb-2">Payment URL</div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={`${process.env.NEXT_PUBLIC_PAYMENT_URL}/${selectedPayment.slug}`}
                                                    className="flex-1 bg-white px-3 py-2 rounded-xl text-sm text-gray-600 border border-gray-200"
                                                />
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_PAYMENT_URL}/${selectedPayment.slug}`)
                                                        toast.success('URL copied to clipboard!')
                                                    }}
                                                    className="p-2 hover:bg-white rounded-xl transition-colors duration-200 text-gray-500 hover:text-gray-700"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 002 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit/Add Modal - Update the outer div styles */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-hidden">
                        <div className="flex items-center justify-center min-h-screen p-4">
                            <div className="bg-white rounded-3xl shadow-xl max-w-5xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto">
                                {/* Modal Header */}
                                <div className="flex items-center justify-between mb-8">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            {editingPayment ? 'Edit Payment' : 'Add New Payment'}
                                        </h3>
                                        <p className="text-sm text-gray-500">Fill in the information below to {editingPayment ? 'update' : 'create'} your payment</p>
                                    </div>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Left Column */}
                                        <div className="space-y-8">
                                            {/* Basic Information Section */}
                                            <div className="bg-gray-50/50 p-6 rounded-2xl space-y-6 border border-gray-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                    <h4 className="font-semibold text-gray-900">Basic Information</h4>
                                                </div>

                                                <div className="space-y-5">
                                                    <div className="form-control">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                                                        <input
                                                            type="text"
                                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                                            value={formData.title}
                                                            onChange={(e) => setFormData({
                                                                ...formData,
                                                                title: e.target.value,
                                                                slug: generateSlug(e.target.value)
                                                            })}
                                                            placeholder="Enter payment title"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="form-control">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">URL Slug</label>
                                                        <div className="relative">
                                                            <input
                                                                type="text"
                                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 pr-10 cursor-not-allowed"
                                                                value={formData.slug}
                                                                disabled
                                                            />
                                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="form-control">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                                                        <textarea
                                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px] resize-y transition-all duration-200"
                                                            value={formData.description}
                                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                            placeholder="Enter payment description..."
                                                        />
                                                    </div>
                                                </div>

                                                {/* Payment Details Section */}
                                                <div className="bg-gray-50/50 p-6 rounded-2xl space-y-6 border border-gray-100">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="p-2 bg-emerald-100 rounded-lg">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </div>
                                                        <h4 className="font-semibold text-gray-900">Payment Details</h4>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-5">
                                                        <div className="form-control">
                                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (IDR)</label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <span className="text-gray-500">Rp</span>
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                                                    value={formData.priceIdr}
                                                                    onChange={(e) => handlePriceIdrChange(e.target.value)}
                                                                    placeholder="0"
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="form-control">
                                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (USD)</label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <span className="text-gray-500">$</span>
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 cursor-not-allowed"
                                                                    value={formData.priceUsd}
                                                                    readOnly
                                                                    placeholder="0.00"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="form-control">
                                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                                                            <select
                                                                className={`w-full px-4 py-2.5 rounded-xl border appearance-none bg-white transition-all duration-200
                                                                    ${formData.isPublished
                                                                        ? 'text-emerald-700 border-emerald-200 bg-emerald-50/50'
                                                                        : 'text-red-700 border-red-200 bg-red-50/50'}`}
                                                                value={formData.isPublished ? "true" : "false"}
                                                                onChange={(e) => setFormData({ ...formData, isPublished: e.target.value === "true" })}
                                                            >
                                                                <option value="true">Active</option>
                                                                <option value="false">Inactive</option>
                                                            </select>
                                                        </div>

                                                        <div className="form-control">
                                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Date</label>
                                                            <input
                                                                type="date"
                                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                                                value={formData.date.split('T')[0]}
                                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                                required
                                                            />
                                                        </div>

                                                        <div className="form-control">
                                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry (days)</label>
                                                            <input
                                                                type="text"
                                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                                                value={formData.expiryDays || ''}
                                                                placeholder="Enter days"
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    if (value === '' || /^\d+$/.test(value)) {
                                                                        const numberValue = value ? parseInt(value) : 0;
                                                                        setFormData({ ...formData, expiryDays: numberValue });
                                                                    }
                                                                }}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column */}
                                        <div className="space-y-8">
                                            {/* Author Information */}
                                            <div className="bg-gray-50/50 p-6 rounded-2xl space-y-6 border border-gray-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="p-2 bg-purple-100 rounded-lg">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                    <h4 className="font-semibold text-gray-900">Author Information</h4>
                                                </div>

                                                <div className="p-4 rounded-xl bg-white border border-gray-200">
                                                    <div className="flex items-center gap-3">
                                                        {formData.author.photoURL ? (
                                                            <Image
                                                                src={formData.author.photoURL}
                                                                alt={formData.author.displayName}
                                                                width={40}
                                                                height={40}
                                                                className="rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                                <span className="text-indigo-600 font-medium text-lg">
                                                                    {formData.author.displayName?.[0]?.toUpperCase() || '?'}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="font-medium text-gray-900">{formData.author.displayName}</div>
                                                            <div className="text-sm text-gray-500">{formData.author.role}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Thumbnail Section */}
                                            <div className="bg-gray-50/50 p-6 rounded-2xl space-y-6 border border-gray-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="p-2 bg-orange-100 rounded-lg">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <h4 className="font-semibold text-gray-900">Thumbnail</h4>
                                                </div>

                                                <div className="space-y-4">
                                                    {formData.thumbnail && (
                                                        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                                            <Image
                                                                src={formData.thumbnail}
                                                                alt="Thumbnail preview"
                                                                className="object-cover"
                                                                fill
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormData(prev => ({ ...prev, thumbnail: '' }))}
                                                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center justify-center w-full">
                                                        <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-xl border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                {isUploading ? (
                                                                    <div className="flex items-center gap-2 text-gray-500">
                                                                        <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                                        </svg>
                                                                        <span>Uploading...</span>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                                        </svg>
                                                                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                                                    </>
                                                                )}
                                                            </div>
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                onChange={handleImageUpload}
                                                                accept="image/*"
                                                                disabled={isUploading}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Actions */}
                                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                                        <button
                                            type="button"
                                            className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:shadow-md font-medium"
                                            onClick={() => setIsModalOpen(false)}
                                            disabled={isSaving}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-all duration-200 disabled:opacity-50 hover:shadow-indigo-100 hover:shadow-lg font-medium flex items-center gap-2"
                                            disabled={isSaving}
                                        >
                                            {isSaving ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    <span>Saving Changes...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span>Save Changes</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Update Delete Confirmation Modal - Update the outer div styles */}
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-hidden">
                        <div className="flex items-center justify-center min-h-screen p-4">
                            <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-4 md:p-8">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Delete</h3>
                                <p className="text-gray-600 mb-6">Are you sure you want to delete this payment? This action cannot be undone.</p>
                                <div className="flex justify-end gap-2">
                                    <button
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                                        onClick={confirmDelete}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Deleting...
                                            </>
                                        ) : 'Delete'}
                                    </button>
                                    <button
                                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                        onClick={() => {
                                            setIsDeleteModalOpen(false)
                                            setPaymentToDelete(null)
                                        }}
                                        disabled={isDeleting}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
