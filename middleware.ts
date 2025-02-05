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
        "/api",
        "/sign-in",
        "/sign-up",
        "/"
    ],
    async afterAuth(auth, req) {
        // Get the current path
        const url = new URL(req.url);
        const path = url.pathname;

        // Skip verification check for public routes and verify page
        if (!auth.userId || 
            path.startsWith('/api') || 
            path === '/verify' || 
            path === '/sign-in' || 
            path === '/sign-up') {
            return;
        }

        // Check verification status for authenticated users
        try {
            const verifyResponse = await fetch(`${url.origin}/api/verify`, {
                headers: {
                    'Authorization': `Bearer ${auth.sessionId}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!verifyResponse.ok) {
                throw new Error('Failed to check verification status');
            }

            const data = await verifyResponse.json();

            // If user is not verified and not already on verify page, redirect to verify
            if (!data.data.isVerified && path !== '/verify') {
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