/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "works-on-woa",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    new sst.aws.StaticSite("WorksOnWoA", {
      build: {
        command: "npm run build",
        output: "dist",
      },
      domain:
        $app.stage === "production"
          ? { name: "worksonwoa.com", redirects: ["www.worksonwoa.com"] }
          : $app.stage === "publish"
          ? "publish.worksonwoa.com"
          : $app.stage === "dev"
          ? "staging.worksonwoa.com"
          : undefined,
      assets: {
        fileOptions: [
          {
            files: "**",
            cacheControl: "max-age=31536000,public,immutable",
          },
          {
            files: "icons/**",
            cacheControl: "max-age=604800,public",
          },
          {
            files: "**/*.html",
            cacheControl: "max-age=0,no-cache,no-store,must-revalidate",
          },
          {
            files: ["robots.txt", "sitemap.xml"],
            cacheControl: "max-age=86400,public",
          },
        ],
      },
      edge: {
        viewerResponse: {
          injection: `
event.response.headers["strict-transport-security"] = { value: "max-age=31536000; includeSubDomains; preload" };
event.response.headers["content-security-policy"] = { value: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https:;" };
event.response.headers["x-content-type-options"] = { value: "nosniff" };
event.response.headers["x-frame-options"] = { value: "DENY" };
event.response.headers["referrer-policy"] = { value: "strict-origin-when-cross-origin" };
event.response.headers["permissions-policy"] = { value: "camera=(), microphone=(), geolocation=()" };
event.response.headers["cross-origin-opener-policy"] = { value: "same-origin" };
delete event.response.headers["server"];
          `,
        },
      },
    });
  },
});
