import { z } from "zod";

export const argsSchema = z.object({
    profile: z.string(),
    region: z.string(),
    env: z.string().default("dev"),
});

export type Args = z.infer<typeof argsSchema>;
