import { z } from "zod";

const appSchema = z.object({
    name: z.string(),
    healthCheckEndpoint: z.string(),
    dockerImagePath: z.string(),
    port: z.number(),
    cpu: z.number().default(256),
    memory: z.number().default(512),
    minCapacity: z.number().default(1),
    maxCapacity: z.number().default(5),
    parameterStoreSecrets: z.array(z.string()).optional(),
});

const vpcSchema = z.object({
    noOfAzs: z.number().default(2),
    createNatGateway: z.boolean().default(true),
    noOfNatGateways: z.number().default(1),
});

const domainSchema = z.object({
    name: z.string(),
});

const s3Schema = z.object({
    bucketName: z.string(),
    public: z.boolean(),
    usedBy: z.array(z.string()),
});

const sqsSchema = z.object({
    queueName: z.string(),
    fifo: z.boolean(),
    usedBy: z.array(z.string()),
});

const stageSchema = z.object({
    dev: z
        .object({
            account: z.string(),
            region: z.string(),
        })
        .optional(),
    stg: z
        .object({
            account: z.string(),
            region: z.string(),
        })
        .optional(),
    prd: z
        .object({
            account: z.string(),
            region: z.string(),
        })
        .optional(),
    qa: z
        .object({
            account: z.string(),
            region: z.string(),
        })
        .optional(),
});

const projectSchema = z.object({
    name: z.string(),
    stages: stageSchema.default({
        dev: {
            account: "123456789012",
            region: "us-west-2",
        },
    }),
});

export const infraConfigSchema = z.object({
    project: projectSchema,
    vpc: vpcSchema.default({}),
    apps: z.array(appSchema),
    services: z
        .object({
            domain: domainSchema.optional(),
            s3: z.array(s3Schema).optional(),
            sqs: z.array(sqsSchema).optional(),
        })
        .optional(),
});

export type InfraConfig = z.infer<typeof infraConfigSchema>;
export type ProjectConfig = z.infer<typeof projectSchema>;
export type AppConfig = z.infer<typeof appSchema>;
export type VpcConfig = z.infer<typeof vpcSchema>;
export type DomainConfig = z.infer<typeof domainSchema>;
export type S3Config = z.infer<typeof s3Schema>;
export type SqsConfig = z.infer<typeof sqsSchema>;
