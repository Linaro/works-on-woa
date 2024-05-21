export const prerender = false
import { Auth } from '@auth/core'
import authConfig from "../../../auth.config.ts"
import { parseString } from 'set-cookie-parser'

const actions = [
    'providers',
    'session',
    'csrf',
    'signin',
    'signout',
    'callback',
    'verify-request',
    'error',
]

function AstroAuthHandler(prefix, options) {
    return async ({ cookies, request, redirect }) => {
        const url = new URL(request.url)
        const action = url.pathname.slice(prefix.length + 1).split('/')[0]

        if (!actions.includes(action) || !url.pathname.startsWith(prefix + '/')) return

        const res = await Auth(request, options)
        if (['callback', 'signin', 'signout'].includes(action)) {
            // Properly handle multiple Set-Cookie headers (they can't be concatenated in one)
            res.headers.getSetCookie().forEach((cookie) => {
                const { name, value, ...options } = parseString(cookie)
                // Astro's typings are more explicit than @types/set-cookie-parser for sameSite
                cookies.set(name, value, options)
            })
            try {
                res.headers.delete('Set-Cookie')
            } catch (error) {
                const mutableHeaders = new Headers(res.headers)
                console.log(res)
                mutableHeaders.delete('Set-Cookie')
                return new Response(res.body, {
                    status: res.status,
                    headers: mutableHeaders
                })
            }
        }
        return res
    }
}

export function AstroAuth(options) {
    // @ts-ignore
    const { AUTH_SECRET, AUTH_TRUST_HOST, VERCEL, NODE_ENV } = import.meta.env

    options.secret ??= AUTH_SECRET
    options.trustHost ??= !!(AUTH_TRUST_HOST ?? VERCEL ?? NODE_ENV !== 'production')

    const { prefix = '/api/auth', ...authOptions } = options

    const handler = AstroAuthHandler(prefix, authOptions)
    return {
        async GET(context) {
            return await handler(context)
        },
        async POST(context) {
            return await handler(context)
        },
    }
}


export const { GET, POST } = AstroAuth(authConfig)