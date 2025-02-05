import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
    publicRoutes: ["/api/health", "/api"],
    async afterAuth(auth, req) {
        // Handle after-auth logic
        if (auth.userId && !req.url.includes('/verify')) {
            try {
                const verifyResponse = await fetch(`${req.nextUrl.origin}/api/verify`, {
                    headers: {
                        'Authorization': req.headers.get('Authorization') || '',
                    }
                });
                
                const data = await verifyResponse.json();
                
                if (!data.data.isVerified) {
                    return NextResponse.redirect(new URL('/verify', req.url));
                }
            } catch (error) {
                console.error('Error checking verification:', error);
            }
        }
    }
});

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};