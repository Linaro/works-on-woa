import { defineMiddleware } from "astro/middleware";
import { getSession} from 'auth-astro/server';
import { verifyWebsitePermission } from "../lib/auth";
 
export const onRequest = defineMiddleware(async(context, next)=> {
    let session = await getSession(context.request) as any;
    
    // remove authentication during prebuild so that pagefind can successfully build indexes
    if (process.env.PRE_BUILD) {
        return next()
    }

    // always allow to auth pages
    if (context.url.pathname.startsWith("/api/auth") || context.url.pathname.startsWith("/auth")) {
        return next()
    }

    // redirect to login if no session
    if (!session){
        return Response.redirect(new URL(`/auth/signin?callbackUrl=${context.url.pathname}`, context.url), 302)
    }

    // redirect to permission denied if no session token
    if (!session.access_token || !session.public_keys || !session.expires_at) {
        return Response.redirect(new URL('/auth/error?error=JWT_SESSION_ERROR', context.url), 302)
    }

    // sign out to refresh login if expired
    if (Number(session.expires_at) <= Date.now() / 1000) {
        return Response.redirect(new URL(`/auth/signout?callbackUrl=${context.url.pathname}`, context.url), 302)
    }

    // redirect to access denied if biscuit permission fails
    let hasPermission = false
    try {
        verifyWebsitePermission(session.access_token, session.public_keys, import.meta.env.SPIRE_WEBSITES_ID)
        hasPermission = true
    } catch (error) {
        console.error(error)
        return Response.redirect(new URL('/auth/access-denied', context.url), 302)
    }

    if (hasPermission) {
        return next()
    }

    // fallback to access denied
    return Response.redirect(new URL('/auth/access-denied', context.url), 302)
    
})