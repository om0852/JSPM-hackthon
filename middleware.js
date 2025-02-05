import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes
const publicPaths = ["/sign-in*", "/sign-up*", "/"];

const isPublic = (path) => {
  return publicPaths.find((x) =>
    path.match(new RegExp(`^${x.replace("*", ".*")}$`))
  );
};

export default async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Check auth status
  const { userId } = getAuth(req);
  
  // If not authenticated, redirect to sign-in
  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url);
    // Save the original URL as redirect URL
    signInUrl.searchParams.set('redirect_url', pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}; 