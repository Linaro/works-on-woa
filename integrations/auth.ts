import type { AstroIntegration } from 'astro'
import { virtualConfigModule, type AstroAuthConfig } from 'auth-astro/src/config'


export default (config: AstroAuthConfig = {}): AstroIntegration => ({
    name: 'astro-auth',
    hooks: {
        'astro:config:setup': async ({
            config: astroConfig,
            injectRoute,
            injectScript,
            updateConfig,
            addMiddleware,
            logger,
        }) => {
            if (astroConfig.output === 'static')
                throw new Error(
                    'auth-astro requires server-side rendering. Please set output to "server" & install an adapter. See https://docs.astro.build/en/guides/deploy/#adding-an-adapter-for-ssr'
                )

            updateConfig({
                vite: {
                    plugins: [virtualConfigModule(config.configFile) as any],
                    optimizeDeps: { exclude: ['auth:config'] },
                },
            })

            config.prefix ??= '/api/auth'

            if (config.injectEndpoints !== false) {
                injectRoute({
                    pattern: '/api/[...auth]',
                    entrypoint: './src/auth_routes/api/[...auth].js',
                    
                });

                ["access-denied", "error", "index", "signin", "signout"].forEach((route: string) => {
                    injectRoute({
                        pattern: `/auth/${route == "index" ? "" : route}`,
                        entrypoint: `./src/auth_routes/auth/${route}.astro`,
                    })
                })
                addMiddleware({
                    entrypoint: process.cwd() + '/src/auth_routes/middleware',
                    order: 'pre'
                });
            }

            if (!astroConfig.adapter) {
                logger.error('No Adapter found, please make sure you provide one in your Astro config')
            }
            const edge = false

            if (
                (!edge && globalThis.process && process.versions.node < '19.0.0') ||
                (process.env.NODE_ENV === 'development' && edge)
            ) {
                injectScript(
                    'page-ssr',
                    `import crypto from "node:crypto";
if (!globalThis.crypto) globalThis.crypto = crypto;
if (typeof globalThis.crypto.subtle === "undefined") globalThis.crypto.subtle = crypto.webcrypto.subtle;
if (typeof globalThis.crypto.randomUUID === "undefined") globalThis.crypto.randomUUID = crypto.randomUUID;
`
                )
            }
        },
    },
})