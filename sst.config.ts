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
          ? "worksonwoa.com"
          : $app.stage === "publish"
          ? "publish.worksonwoa.com"
          : undefined,
    });
  },
});
