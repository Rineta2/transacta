import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { useRouter } from 'next/navigation';

import { Role, UserAccount } from '@/utils/context/schema/Auth';

import { auth, db } from '@/utils/firebase';

import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';

import { doc, getDoc } from 'firebase/firestore';

import toast from 'react-hot-toast';

type AuthContextType = {
    user: UserAccount | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<UserAccount>;
    logout: () => Promise<void>;
    deleteAccount: () => Promise<void>;
    hasRole: (roles: string | string[]) => boolean;
    getDashboardUrl: (userRole: string) => string;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserAccount | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const getDashboardUrl = (userRole: string) => {
        switch (userRole) {
            case Role.SUPER_ADMIN:
                return `/super-admins/dashboard`;
            case Role.ADMIN:
                return `/admins/dashboard`;
            default:
                return '/';
        }
    };

    const login = async (email: string, password: string): Promise<UserAccount> => {
        try {
            if (!email || !password) {
                throw new Error('Email dan password harus diisi');
            }

            const emailString = String(email).trim();
            const userCredential = await signInWithEmailAndPassword(auth, emailString, password);

            const userDoc = await getDoc(doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string, userCredential.user.uid));
            const userData = userDoc.data() as UserAccount;

            if (!userData) {
                throw new Error('User account not found');
            }

            setUser(userData);
            toast.success(getWelcomeMessage(userData.role, userData.displayName));
            router.push(getDashboardUrl(userData.role));

            return userData;
        } catch (error) {
            if (error instanceof Error) {
                toast.error('Login gagal: ' + error.message);
                throw new Error('Login gagal: ' + error.message);
            }
            toast.error('Terjadi kesalahan saat login');
            throw new Error('Terjadi kesalahan saat login');
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            // Hapus semua cookies
            document.cookie.split(";").forEach((c) => {
                document.cookie = c
                    .replace(/^ +/, "")
                    .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
            toast.success('Anda berhasil logout');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Terjadi kesalahan saat logout');
        }
    };

    const deleteAccount = async () => {
        try {
            if (!user) {
                throw new Error('No user logged in');
            }

            const idToken = await auth.currentUser?.getIdToken();
            if (!idToken) {
                throw new Error('Failed to get authentication token');
            }

            const response = await fetch('/api/user/delete', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete account');
            }

            setUser(null);
            toast.success('Akun berhasil dihapus');
            router.push('/');
        } catch (error) {
            console.error('Delete account error:', error);
            toast.error(error instanceof Error ? error.message : 'Gagal menghapus akun');
            throw error;
        }
    };

    const hasRole = (roles: string | string[]): boolean => {
        if (!user) return false;
        if (Array.isArray(roles)) {
            return roles.includes(user.role);
        }
        return user.role === roles;
    };

    const getWelcomeMessage = (role: string, displayName: string): string => {
        switch (role) {
            case Role.SUPER_ADMIN:
                return `Selamat datang, ${displayName}!`;
            case Role.ADMIN:
                return `Selamat datang, Admin ${displayName}!`;
            default:
                return `Selamat datang, ${displayName}!`;
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userDoc = await getDoc(doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string, firebaseUser.uid));
                const userData = userDoc.data() as UserAccount;
                setUser(userData);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user,
        loading,
        login,
        logout,
        deleteAccount,
        hasRole,
        getDashboardUrl
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};