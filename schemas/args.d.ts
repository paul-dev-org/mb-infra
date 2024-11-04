import { z } from "zod";
export declare const argsSchema: z.ZodObject<{
    profile: z.ZodString;
    region: z.ZodString;
    env: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    region: string;
    env: string;
    profile: string;
}, {
    region: string;
    profile: string;
    env?: string | undefined;
}>;
export type Args = z.infer<typeof argsSchema>;
