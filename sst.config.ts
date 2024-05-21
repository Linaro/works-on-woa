import type { SSTConfig } from "sst";
import { AstroSite, StaticSite } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "works-on-woa",
      region: "us-east-1",
      profile: process.env.AWS_PROFILE
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      if (process.env.IS_PUBLIC) {
        const site = new StaticSite(stack, "staticSite", {
          buildCommand: "yarn build:public",
          path: "dist/",
          customDomain: {
            domainAlias: process.env.CUSTOM_DOMAIN!.replace("www.", ""),
            domainName: process.env.CUSTOM_DOMAIN!,
          },
          environment: {
            IS_PUBLIC: "true",
          }
        })
      } else {
        const site = new AstroSite(stack, "protectedSite", {
          runtime: "nodejs20.x",
          customDomain: process.env.CUSTOM_DOMAIN,
          nodejs: {
            install: [
              "@biscuit-auth/biscuit-wasm"
            ]
          },
          timeout: "30 seconds",
          environment: {
            AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID!,
            AUTH_TRUST_HOST: "true",
            AUTH_SECRET: process.env.AUTH_SECRET!,
            AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET!,
            AUTH0_ISSUER_BASE: process.env.AUTH0_ISSUER_BASE!,
            AUTH_API_URL: process.env.AUTH_API_URL!,
            NODE_OPTIONS: "--experimental-wasm-modules",
            SPIRE_WEBSITES_ID: process.env.SPIRE_WEBSITES_ID!,
            PUBLIC_KEY_URL: process.env.PUBLIC_KEY_URL!
          }
        });
        stack.addOutputs({
          url: site.url,
        });
      }
     
    });
  },
} satisfies SSTConfig;
