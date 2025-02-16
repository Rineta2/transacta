import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

import { Role } from '@/utils/context/schema/Auth';

// Paths that don't require authentication
const publicPaths = ['/auth'];

// Role-based path mapping
const rolePathMap = {
    [Role.SUPER_ADMIN]: ['/super-admins'],
    [Role.ADMIN]: ['/admins'],
};

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public paths
    if (publicPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // Check for authentication token and user role
    const token = request.cookies.get('auth-token');
    const userRole = request.cookies.get('user-role')?.value;

    // If no token or role, redirect to auth page instead of home
    if (!token || !userRole) {
        return NextResponse.redirect(new URL('/auth', request.url));
    }

    // Check role-based access
    const allowedPaths = rolePathMap[userRole as unknown as Role] || [];
    const hasAccess = allowedPaths.some(path => pathname.startsWith(path));

    // If no access, redirect to home page
    if (!hasAccess) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|public).*)',
    ],
};