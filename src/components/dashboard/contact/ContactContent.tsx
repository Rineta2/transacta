"use client"

import React, { useState, useEffect } from 'react'

import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore'

import { db } from '@/utils/firebase'

import { Contact } from '@/components/dashboard/contact/schema/interface'

import ContactSkeleton from '@/components/dashboard/contact/ContactSkelaton'

import { useAuth } from '@/utils/context/AuthContext'

import { Role } from '@/utils/context/schema/Auth'

import { formatDistance } from 'date-fns'

import { id } from 'date-fns/locale'

export default function ContactContent() {
    const [contacts, setContacts] = useState<Contact[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const { user, hasRole } = useAuth()

    useEffect(() => {
        if (!user || !hasRole(Role.SUPER_ADMIN)) {
            setIsLoading(false)
            return
        }

        const unsubscribe = onSnapshot(
            collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_CONTACTS as string),
            (snapshot) => {
                const contactsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Contact[]
                const sortedContacts = contactsData.sort((a, b) => {
                    if (!a.timestamp || !b.timestamp) return 0;
                    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                });
                setContacts(sortedContacts)
                setIsLoading(false)
            },
            (error) => {
                console.error('Firestore error:', error)
                setIsLoading(false)
            }
        )

        return () => unsubscribe()
    }, [user, hasRole])

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.message?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleDelete = async (contactId: string) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus kontak ini?')) {
            return
        }

        try {
            await deleteDoc(doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_CONTACTS as string, contactId))
        } catch (error) {
            console.error('Error deleting contact:', error)
        }
    }

    if (isLoading) return <ContactSkeleton />

    return (
        <section className='py-2 md:py-10 min-h-screen'>
            <div className="container">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 md:mb-12">
                    <div className='space-y-2'>
                        <h1 className='text-2xl md:text-4xl font-bold text-gray-800'>
                            Daftar Contact
                        </h1>
                        <p className='text-sm md:text-base text-gray-500'>
                            Dapatkan informasi dari kontak yang terhubung dengan Anda
                        </p>
                    </div>

                    <div className="relative w-full md:w-auto">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-[300px] px-4 py-3 pl-11 input input-bordered rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                            placeholder="Cari nama, email, atau pesan..."
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-5 w-5 opacity-70 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            <path
                                fillRule="evenodd"
                                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                clipRule="evenodd" />
                        </svg>
                    </div>
                </div>

                {filteredContacts.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Tidak ada kontak ditemukan</h3>
                        <p className="mt-1 text-gray-500">Coba ubah kata kunci pencarian Anda</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredContacts.map((contact) => (
                            <div
                                key={contact.id}
                                className="group rounded-xl p-5 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary/20 cursor-pointer bg-background hover:bg-primary/5"
                                onClick={() => setSelectedContact(contact)}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <span className="text-lg font-semibold text-primary">
                                            {contact.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col gap-1.5">
                                            <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                                                {contact.name}
                                            </h3>
                                            <span className="text-sm text-primary/80 hover:text-primary hover:underline truncate">
                                                {contact.email}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {contact.timestamp ? formatDistance(new Date(contact.timestamp), new Date(), {
                                                    addSuffix: true,
                                                    locale: id
                                                }) : '-'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modern Modal Design */}
                {selectedContact && (
                    <dialog className="modal modal-open">
                        <div className="modal-box dark:bg-gray-900 max-w-[95vw] md:max-w-[600px] p-0 rounded-2xl shadow-2xl transform transition-all duration-300 scale-100 opacity-100 flex flex-col gap-2">
                            {/* Header Section */}
                            <div className="p-6 border-b dark:border-gray-800">
                                <div className="flex items-start gap-4">
                                    <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl bg-primary/10 flex items-center justify-center transform transition-transform duration-300 hover:rotate-3">
                                        <span className="text-xl md:text-2xl font-semibold text-primary">
                                            {selectedContact.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                                        <h3 className="font-semibold text-xl md:text-2xl truncate text-gray-900 dark:text-white">
                                            {selectedContact.name}
                                        </h3>
                                        <a href={`mailto:${selectedContact.email}`} className="text-sm md:text-base text-primary hover:text-primary/80 hover:underline block truncate transition-colors">
                                            {selectedContact.email}
                                        </a>
                                        <p className="text-xs md:text-sm text-gray-500 mt-1 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {selectedContact.timestamp ? formatDistance(new Date(selectedContact.timestamp), new Date(), {
                                                addSuffix: true,
                                                locale: id
                                            }) : '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Message Content */}
                            <div className="p-6">
                                <div className="prose max-w-none dark:prose-invert">
                                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                        {selectedContact.message}
                                    </p>
                                </div>
                            </div>

                            {/* Actions Footer */}
                            <div className="border-t dark:border-gray-800 p-4 flex justify-end gap-3">
                                <button
                                    className="btn btn-error border-background hover:btn-error/90 transition-colors duration-300 text-white"
                                    onClick={() => {
                                        handleDelete(selectedContact.id)
                                        setSelectedContact(null)
                                    }}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Hapus
                                </button>
                                <button
                                    className="btn btn-primary border-background hover:btn-primary/90 transition-colors duration-300 text-white"
                                    onClick={() => setSelectedContact(null)}
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                        <form method="dialog" className="modal-backdrop bg-black/60 backdrop-blur-sm" onClick={() => setSelectedContact(null)}>
                            <button>close</button>
                        </form>
                    </dialog>
                )}
            </div>
        </section>
    )
}
