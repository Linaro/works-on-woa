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
    });
  },
});
