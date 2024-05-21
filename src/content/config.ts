import { defineCollection, reference, z } from "astro:content";

const games_categories = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
  }),
});

const games = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      icon: z.string().optional().default("gaming-icon-white.svg"),
      categories: z.array(reference("games_categories")),
      publisher: z.string().optional(),
      frame_rate: z.string().optional(),
      device_configuration: z.string().optional(),
      os_version: z.string().optional(),
      driver_id: z.string().optional(),
      date_tested: z.date().optional(),
      compatibility: z.enum(["perfect", "playable", "runs", "unplayable"]),
      compatibility_details: z.string().optional(),
      auto_super_resolution: z
        .object({
          compatibility: z.enum(["yes, out-of-box", "yes, opt-in", "no", "unknown"]).default("unknown"),
          fps_boost: z.string().optional().default("N/A"),
          opt_in_steps: z.array(z.string()).optional().default(["N/A"]),
        })
        .optional().default({
          compatibility: "unknown",
        }),
      link: z.string().url().optional(),
    }),
});

const user_reports_games = defineCollection({
  type: "content",
  schema: z.object({
    reporter: z.string().optional().default("Anonymous"),
    game: reference("games"),
    device_configuration: z.string().optional(),
    date_tested: z
      .date({ invalid_type_error: "Invalid date format. Must be YYYY-MM-DD" })
      .optional(),
    compatibility_details: z.string(),
    os_version: z.coerce.string().optional(),
    driver_id: z.coerce.string().optional(),
    compatibility: z.enum(["perfect", "playable", "runs", "unplayable"]),
    auto_super_resolution: z
      .object({
        compatibility: z.enum(["yes, opt-in", "no", "unknown"]),
        fps_boost: z.string().optional(),
        opt_in_steps: z.string().optional()
      })
      .optional(),
  }),
});

export const collections = {
  games_categories,
  games,
  user_reports_games,
};
