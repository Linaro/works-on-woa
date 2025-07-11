import type { SSTConfig } from "sst";
import { AstroSite, Api, Function } from "sst/constructs";
import type { SsrDomainProps } from "sst/constructs/SsrSite.js";

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
      // if (process.env.IS_PUBLIC === "true") {
      let cd: SsrDomainProps | string | undefined;
      if (process.env.CUSTOM_DOMAIN?.startsWith("www")) {
        cd = {
          domainAlias: process.env.CUSTOM_DOMAIN.replace("www.", ""),
          domainName: process.env.CUSTOM_DOMAIN,
          hostedZone: process.env.HOSTED_ZONE,
        };
      } else {
        cd = process.env.CUSTOM_DOMAIN;
      }
      const site = new AstroSite(stack, "staticSite", {
        customDomain: cd,
        environment: {
          IS_PUBLIC: "true",
          PUBLIC_API_HOST: process.env.PUBLIC_API_HOST!,
          PUBLIC_APPLICATION_API_ENDPOINT: process.env.PUBLIC_APPLICATION_API_ENDPOINT!,
          PUBLIC_GAME_API_ENDPOINT: process.env.PUBLIC_GAME_API_ENDPOINT!,
        },
        cdk: {
          distribution: {
            defaultRootObject: "index.html",
          }
        }
      });
      stack.addOutputs({
        url: site.url,
      });
      // } else {
      //   const site = new AstroSite(stack, "protectedSite", {
      //     runtime: "nodejs20.x",
      //     customDomain: process.env.CUSTOM_DOMAIN,
      //     nodejs: {
      //       install: [
      //         "@biscuit-auth/biscuit-wasm"
      //       ]
      //     },
      //     timeout: "30 seconds",
      //     environment: {
      //       AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID!,
      //       AUTH_TRUST_HOST: "true",
      //       AUTH_SECRET: process.env.AUTH_SECRET!,
      //       AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET!,
      //       AUTH0_ISSUER_BASE: process.env.AUTH0_ISSUER_BASE!,
      //       AUTH_API_URL: process.env.AUTH_API_URL!,
      //       NODE_OPTIONS: "--experimental-wasm-modules",
      //       SPIRE_WEBSITES_ID: process.env.SPIRE_WEBSITES_ID!,
      //       PUBLIC_KEY_URL: process.env.PUBLIC_KEY_URL!
      //     }
      //   });
      //   stack.addOutputs({
      //     url: site.url,
      //   });
      // }

      const lambdaEnvVars = {
        GITHUB_APP_ID: process.env.GITHUB_APP_ID!,
        GITHUB_APP_INSTALLATION_ID: process.env.GITHUB_APP_INSTALLATION_ID!,
        GITHUB_APP_PK_BASE64: process.env.GITHUB_APP_PK_BASE64!,
        GITHUB_OWNER: process.env.GITHUB_OWNER!,
        GITHUB_REPO: process.env.GITHUB_REPO!,
        GITHUB_BASE_BRANCH: process.env.GITHUB_BASE_BRANCH!,
        RECAPTCHA_VERIFY_URL: process.env.RECAPTCHA_VERIFY_URL!,
        RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY!,
      };

      const appFormFunction = new Function(stack, "ProcessAppFormSubmissions", {
        handler: "aws-lambdas/AppForm/index.handler",
        runtime: "nodejs20.x",
        memorySize: 256,
        environment: lambdaEnvVars,
      });

      const gameFormFunction = new Function(stack, "ProcessGameFormSubmissions", {
        handler: "aws-lambdas/GameForm/index.handler",
        runtime: "nodejs20.x",
        memorySize: 256,
        environment: lambdaEnvVars,
      });

      const api = new Api(stack, "Api", {
        routes: {
          "POST /process-app-form-submissions": appFormFunction,
          "POST /process-game-form-submissions": gameFormFunction,
        },
      });

      stack.addOutputs({
        AppFormFunctionArn: appFormFunction.functionArn,
        GameFormFunctionArn: gameFormFunction.functionArn,
        ApiEndpoint: api.url,
      });
    });
  },
} satisfies SSTConfig;