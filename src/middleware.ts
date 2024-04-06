import { NextResponse} from "next/server";
import type {  NextRequest } from "next/server"
import { getIronSession } from "iron-session/edge";
import { sessionOptions } from "./utils/session";
import { ratelimit } from "./server/redis";
const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: NextRequest,res:NextResponse) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") || // exclude Next.js internals
    pathname.startsWith("/api") || //  exclude all API routes
    pathname.startsWith("/static") || // exclude static files
    pathname.startsWith('/auth') ||
    pathname.startsWith('/verify')||
    pathname.startsWith('/blocked')||
    PUBLIC_FILE.test(pathname) // exclude all files in the public folder

  )
    return NextResponse.next();


    const session = await getIronSession(req, res, sessionOptions);
  
    const { user } = session;
  
    if(!user)return NextResponse.redirect(new URL('/auth/sign-in', req.url))
  

    const {success} = await ratelimit.limit(`mw_${user.sessionId}`)

    return success
    ? NextResponse.next()
    : NextResponse.redirect(new URL("/blocked", req.url));
}