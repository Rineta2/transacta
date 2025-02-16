import React from 'react'

import ContactContent from "@/components/dashboard/contact/ContactContent"

export async function metadata() {
    return {
        title: 'Transacta | Dashboard Contact',
        description: 'Dashboard Contact page',
    }
}

export default function Contact() {
    return (
        <ContactContent />
    )
}
