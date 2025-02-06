import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
    // Public routes that don't require authentication or verification
    publicRoutes: [
        "/api/health",
        "/api/verify",
        "/api",
        "/sign-in",
        "/sign-up",
        "/"
    ],
    async afterAuth(auth, req) {
        // Get the current path
        const url = new URL(req.url);
        const path = url.pathname;

        // Skip verification check for public routes
        if (!auth.userId || 
            path === '/api/verify' ||
            path === '/sign-in' || 
            path === '/sign-up' ||
            path === '/') {
            return;
        }

        // Get verification status from cookies
        const isVerified = req.cookies.get('isVerified')?.value;
        const userType = req.cookies.get('userType')?.value;

        // If we're on the verify page
        if (path === '/verify') {
            // If user is verified, redirect to home
            if (isVerified === 'true') {
                return NextResponse.redirect(new URL('/home', req.url));
            }
            return;
        }

        // If user is verified (from cookie), allow access
        if (isVerified === 'true') {
            return;
        }

        // If no cookie or not verified, check API
        try {
            const verifyResponse = await fetch(`${url.origin}/api/verify`, {
                headers: {
                    'Cookie': req.headers.get('cookie') || '',
                    'Authorization': `Bearer ${auth.getToken()}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await verifyResponse.json();

            // If user is not verified and not already on verify page, redirect to verify
            if (!data.data?.isVerified && path !== '/verify') {
                return NextResponse.redirect(new URL('/verify', req.url));
            }

        } catch (error) {
            console.error('Error checking verification status:', error);
            // On error, redirect to verify page as a safety measure
            if (path !== '/verify') {
                return NextResponse.redirect(new URL('/verify', req.url));
            }
        }
    }
});

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};