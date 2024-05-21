// auth.config.ts
import { defineConfig } from "auth-astro";
import {
  verifyBiscuitUser,
  parseBiscuitMetadata,
  type Bwks,
} from "./src/lib/auth";

const {
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_ISSUER_BASE,
  AUTH_API_URL,
  SPIRE_WEBSITES_ID,
  PUBLIC_KEY_URL,
} = import.meta.env;

const isDev = import.meta.env.DEV;
const WEBSITE_URL = import.meta.env.SITE;

function getPublicKeys() {
  return fetch(`${PUBLIC_KEY_URL}`, {
    cache: "no-store",
  });
}

async function afterToken(accessToken: string) {
  // fetch biscuit public keys
  const res = await getPublicKeys();
  const public_keys = await res.json();

  if (!res.ok || !public_keys) {
    console.error(public_keys);
    throw new Error("failed to fetch public keys");
  }

  // verify biscuit and extract metadata
  const auth = verifyBiscuitUser(accessToken, public_keys, SPIRE_WEBSITES_ID);

  const metadata = parseBiscuitMetadata(auth);
  if (!metadata) {
    throw new Error("error extracting biscuit metadata");
  }

  const [id, first_name, surname] = metadata;

  return {
    profile: {
      id,
      first_name,
      surname,
    },
    public_keys,
  };
}

export default defineConfig({
  providers: [
    {
      id: "spire",
      name: "spire",
      type: "oidc",
      clientId: AUTH0_CLIENT_ID,
      clientSecret: AUTH0_CLIENT_SECRET,
      checks: ["pkce", "state"],
      authorization: {
        url: `${AUTH_API_URL}/oauth/authorize`,
        params: {
          scope: "openid email offline_access profile",
          client_id: AUTH0_CLIENT_ID,
          response_type: "code",
        },
      },
      issuer: AUTH0_ISSUER_BASE,
      jwks_endpoint: AUTH0_ISSUER_BASE + ".well-known/jwks.json",
      client: {
        token_endpoint_auth_method: "client_secret_post",
      },
      token: {
        url: `${AUTH_API_URL}/oauth/token`,
        params: {
          scope: "openid email offline_access profile",
          response_type: "code",
          client_id: AUTH0_CLIENT_ID,
        },
        httpOptions: {
          timeout: 30000,
        },
      },
      profile: (profile: any) => {
        return {
          id: profile.sub,
          ...profile,
        };
      },
    },
  ],
  callbacks: {
    async session({ session, token }: any) {
      session.profile = token.profile;
      session.access_token = token.access_token;
      session.public_keys = token.public_keys;
      session.expires_at = token.expires_at;
      return session;
    },
    async jwt({ account, token }) {
      // this is only run after sign in
      if (account) {
        try {
          const { profile, public_keys } = await afterToken(
            account.access_token!
          );
          return {
            access_token: account.access_token,
            // refresh_token: account.refresh_token,
            expires_at: account.expires_at,
            public_keys,
            profile,
          };
        } catch (error) {
          console.error(error);
          throw new Error("AccessDenied");
        }
      }

      // if not sign in and token is valid, return as is
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
});

declare module "@auth/core" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    profile: any;
  }
}
declare module "@auth/core" {
  interface JWT {
    access_token: string;
    expires_at: number;
    // refresh_token: string;
    public_keys: Bwks[];
    profile: {
      id: string;
      first_name: string;
      surname: string;
    };
    error?: "RefreshAccessTokenError" | "BiscuitPublicKeysError";
  }
}
