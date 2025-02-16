import React from 'react'

import ProfileContent from '@/components/dashboard/profile/ProfileContent'

export async function generateMetadata() {
    return {
        title: "Profile | Transacta",
        description: "Profile Pengguna",
    }
}

export default function Profile() {
    return (
        <ProfileContent />
    )
}
