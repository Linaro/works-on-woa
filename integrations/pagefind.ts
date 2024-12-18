import type { AstroIntegration } from "astro";
import { execSync } from "child_process";
import sirv from "sirv";

export default function pagefind({
  is_pre_build,
  is_public,
}: {
  is_pre_build: boolean;
  is_public: boolean;
}): AstroIntegration {
  console.log("****************", is_pre_build, is_public);
  let outDir: string;
  if (is_pre_build) return { name: "pagefind", hooks: {} };
  return {
    name: "pagefind",
    hooks: {
      "astro:config:setup": ({ config, logger }) => {
        outDir = is_public ? "./dist" : "./dist_prebuild/dist/client";
      },
      "astro:server:setup": ({ server, logger }) => {
        if (!outDir) {
          logger.warn(
            "astro-pagefind couldn't reliably determine the output directory. Search assets will not be served."
          );
          return;
        }
        logger.warn(outDir);
        const serve = sirv(outDir, {
          dev: true,
          etag: true,
        });
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith("/pagefind/")) {
            serve(req, res, next);
          } else {
            next();
          }
        });
      },
      "astro:build:done": ({ logger }) => {
        logger.warn(outDir);

        if (!outDir) {
          logger.warn(
            "astro-pagefind couldn't reliably determine the output directory. Search index will not be built."
          );
          return;
        }

        const cmd = `npx pagefind --site "${outDir}"`;
        execSync(cmd, {
          stdio: [process.stdin, process.stdout, process.stderr],
        });
      },
    },
  };
}
