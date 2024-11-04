"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.infraConfigSchema = void 0;
const zod_1 = require("zod");
const appSchema = zod_1.z.object({
    name: zod_1.z.string(),
    healthCheckEndpoint: zod_1.z.string(),
    dockerImagePath: zod_1.z.string(),
    port: zod_1.z.number(),
    cpu: zod_1.z.number().default(256),
    memory: zod_1.z.number().default(512),
    minCapacity: zod_1.z.number().default(1),
    maxCapacity: zod_1.z.number().default(5),
    parameterStoreSecrets: zod_1.z.array(zod_1.z.string()).optional(),
});
const vpcSchema = zod_1.z.object({
    noOfAzs: zod_1.z.number().default(2),
    createNatGateway: zod_1.z.boolean().default(true),
    noOfNatGateways: zod_1.z.number().default(1),
});
const domainSchema = zod_1.z.object({
    name: zod_1.z.string(),
});
const s3Schema = zod_1.z.object({
    bucketName: zod_1.z.string(),
    public: zod_1.z.boolean(),
    usedBy: zod_1.z.array(zod_1.z.string()),
});
const sqsSchema = zod_1.z.object({
    queueName: zod_1.z.string(),
    fifo: zod_1.z.boolean(),
    usedBy: zod_1.z.array(zod_1.z.string()),
});
const stageSchema = zod_1.z.object({
    dev: zod_1.z
        .object({
        account: zod_1.z.string(),
        region: zod_1.z.string(),
    })
        .optional(),
    stg: zod_1.z
        .object({
        account: zod_1.z.string(),
        region: zod_1.z.string(),
    })
        .optional(),
    prd: zod_1.z
        .object({
        account: zod_1.z.string(),
        region: zod_1.z.string(),
    })
        .optional(),
    qa: zod_1.z
        .object({
        account: zod_1.z.string(),
        region: zod_1.z.string(),
    })
        .optional(),
});
const projectSchema = zod_1.z.object({
    name: zod_1.z.string(),
    stages: stageSchema.default({
        dev: {
            account: "123456789012",
            region: "us-west-2",
        },
    }),
});
exports.infraConfigSchema = zod_1.z.object({
    // project: projectSchema,
    vpc: vpcSchema.default({}),
    apps: zod_1.z.array(appSchema),
    services: zod_1.z
        .object({
        domain: domainSchema.optional(),
        s3: zod_1.z.array(s3Schema).optional(),
        sqs: zod_1.z.array(sqsSchema).optional(),
    })
        .optional(),
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mcmEuY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW5mcmEuY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZCQUF3QjtBQUV4QixNQUFNLFNBQVMsR0FBRyxPQUFDLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLElBQUksRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFO0lBQ2hCLG1CQUFtQixFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7SUFDL0IsZUFBZSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7SUFDM0IsSUFBSSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7SUFDaEIsR0FBRyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO0lBQzVCLE1BQU0sRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztJQUMvQixXQUFXLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDbEMsV0FBVyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ2xDLHFCQUFxQixFQUFFLE9BQUMsQ0FBQyxLQUFLLENBQUMsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFO0NBQ3hELENBQUMsQ0FBQztBQUVILE1BQU0sU0FBUyxHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDdkIsT0FBTyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQzlCLGdCQUFnQixFQUFFLE9BQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQzNDLGVBQWUsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztDQUN6QyxDQUFDLENBQUM7QUFFSCxNQUFNLFlBQVksR0FBRyxPQUFDLENBQUMsTUFBTSxDQUFDO0lBQzFCLElBQUksRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFO0NBQ25CLENBQUMsQ0FBQztBQUVILE1BQU0sUUFBUSxHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDdEIsVUFBVSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7SUFDdEIsTUFBTSxFQUFFLE9BQUMsQ0FBQyxPQUFPLEVBQUU7SUFDbkIsTUFBTSxFQUFFLE9BQUMsQ0FBQyxLQUFLLENBQUMsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0NBQzlCLENBQUMsQ0FBQztBQUVILE1BQU0sU0FBUyxHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDdkIsU0FBUyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7SUFDckIsSUFBSSxFQUFFLE9BQUMsQ0FBQyxPQUFPLEVBQUU7SUFDakIsTUFBTSxFQUFFLE9BQUMsQ0FBQyxLQUFLLENBQUMsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0NBQzlCLENBQUMsQ0FBQztBQUVILE1BQU0sV0FBVyxHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDekIsR0FBRyxFQUFFLE9BQUM7U0FDRCxNQUFNLENBQUM7UUFDSixPQUFPLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtRQUNuQixNQUFNLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtLQUNyQixDQUFDO1NBQ0QsUUFBUSxFQUFFO0lBQ2YsR0FBRyxFQUFFLE9BQUM7U0FDRCxNQUFNLENBQUM7UUFDSixPQUFPLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtRQUNuQixNQUFNLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtLQUNyQixDQUFDO1NBQ0QsUUFBUSxFQUFFO0lBQ2YsR0FBRyxFQUFFLE9BQUM7U0FDRCxNQUFNLENBQUM7UUFDSixPQUFPLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtRQUNuQixNQUFNLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtLQUNyQixDQUFDO1NBQ0QsUUFBUSxFQUFFO0lBQ2YsRUFBRSxFQUFFLE9BQUM7U0FDQSxNQUFNLENBQUM7UUFDSixPQUFPLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtRQUNuQixNQUFNLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtLQUNyQixDQUFDO1NBQ0QsUUFBUSxFQUFFO0NBQ2xCLENBQUMsQ0FBQztBQUVILE1BQU0sYUFBYSxHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDM0IsSUFBSSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7SUFDaEIsTUFBTSxFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUM7UUFDeEIsR0FBRyxFQUFFO1lBQ0QsT0FBTyxFQUFFLGNBQWM7WUFDdkIsTUFBTSxFQUFFLFdBQVc7U0FDdEI7S0FDSixDQUFDO0NBQ0wsQ0FBQyxDQUFDO0FBRVUsUUFBQSxpQkFBaUIsR0FBRyxPQUFDLENBQUMsTUFBTSxDQUFDO0lBQ3RDLDBCQUEwQjtJQUMxQixHQUFHLEVBQUUsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7SUFDMUIsSUFBSSxFQUFFLE9BQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO0lBQ3hCLFFBQVEsRUFBRSxPQUFDO1NBQ04sTUFBTSxDQUFDO1FBQ0osTUFBTSxFQUFFLFlBQVksQ0FBQyxRQUFRLEVBQUU7UUFDL0IsRUFBRSxFQUFFLE9BQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxFQUFFO1FBQ2hDLEdBQUcsRUFBRSxPQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsRUFBRTtLQUNyQyxDQUFDO1NBQ0QsUUFBUSxFQUFFO0NBQ2xCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHogfSBmcm9tIFwiem9kXCI7XG5cbmNvbnN0IGFwcFNjaGVtYSA9IHoub2JqZWN0KHtcbiAgICBuYW1lOiB6LnN0cmluZygpLFxuICAgIGhlYWx0aENoZWNrRW5kcG9pbnQ6IHouc3RyaW5nKCksXG4gICAgZG9ja2VySW1hZ2VQYXRoOiB6LnN0cmluZygpLFxuICAgIHBvcnQ6IHoubnVtYmVyKCksXG4gICAgY3B1OiB6Lm51bWJlcigpLmRlZmF1bHQoMjU2KSxcbiAgICBtZW1vcnk6IHoubnVtYmVyKCkuZGVmYXVsdCg1MTIpLFxuICAgIG1pbkNhcGFjaXR5OiB6Lm51bWJlcigpLmRlZmF1bHQoMSksXG4gICAgbWF4Q2FwYWNpdHk6IHoubnVtYmVyKCkuZGVmYXVsdCg1KSxcbiAgICBwYXJhbWV0ZXJTdG9yZVNlY3JldHM6IHouYXJyYXkoei5zdHJpbmcoKSkub3B0aW9uYWwoKSxcbn0pO1xuXG5jb25zdCB2cGNTY2hlbWEgPSB6Lm9iamVjdCh7XG4gICAgbm9PZkF6czogei5udW1iZXIoKS5kZWZhdWx0KDIpLFxuICAgIGNyZWF0ZU5hdEdhdGV3YXk6IHouYm9vbGVhbigpLmRlZmF1bHQodHJ1ZSksXG4gICAgbm9PZk5hdEdhdGV3YXlzOiB6Lm51bWJlcigpLmRlZmF1bHQoMSksXG59KTtcblxuY29uc3QgZG9tYWluU2NoZW1hID0gei5vYmplY3Qoe1xuICAgIG5hbWU6IHouc3RyaW5nKCksXG59KTtcblxuY29uc3QgczNTY2hlbWEgPSB6Lm9iamVjdCh7XG4gICAgYnVja2V0TmFtZTogei5zdHJpbmcoKSxcbiAgICBwdWJsaWM6IHouYm9vbGVhbigpLFxuICAgIHVzZWRCeTogei5hcnJheSh6LnN0cmluZygpKSxcbn0pO1xuXG5jb25zdCBzcXNTY2hlbWEgPSB6Lm9iamVjdCh7XG4gICAgcXVldWVOYW1lOiB6LnN0cmluZygpLFxuICAgIGZpZm86IHouYm9vbGVhbigpLFxuICAgIHVzZWRCeTogei5hcnJheSh6LnN0cmluZygpKSxcbn0pO1xuXG5jb25zdCBzdGFnZVNjaGVtYSA9IHoub2JqZWN0KHtcbiAgICBkZXY6IHpcbiAgICAgICAgLm9iamVjdCh7XG4gICAgICAgICAgICBhY2NvdW50OiB6LnN0cmluZygpLFxuICAgICAgICAgICAgcmVnaW9uOiB6LnN0cmluZygpLFxuICAgICAgICB9KVxuICAgICAgICAub3B0aW9uYWwoKSxcbiAgICBzdGc6IHpcbiAgICAgICAgLm9iamVjdCh7XG4gICAgICAgICAgICBhY2NvdW50OiB6LnN0cmluZygpLFxuICAgICAgICAgICAgcmVnaW9uOiB6LnN0cmluZygpLFxuICAgICAgICB9KVxuICAgICAgICAub3B0aW9uYWwoKSxcbiAgICBwcmQ6IHpcbiAgICAgICAgLm9iamVjdCh7XG4gICAgICAgICAgICBhY2NvdW50OiB6LnN0cmluZygpLFxuICAgICAgICAgICAgcmVnaW9uOiB6LnN0cmluZygpLFxuICAgICAgICB9KVxuICAgICAgICAub3B0aW9uYWwoKSxcbiAgICBxYTogelxuICAgICAgICAub2JqZWN0KHtcbiAgICAgICAgICAgIGFjY291bnQ6IHouc3RyaW5nKCksXG4gICAgICAgICAgICByZWdpb246IHouc3RyaW5nKCksXG4gICAgICAgIH0pXG4gICAgICAgIC5vcHRpb25hbCgpLFxufSk7XG5cbmNvbnN0IHByb2plY3RTY2hlbWEgPSB6Lm9iamVjdCh7XG4gICAgbmFtZTogei5zdHJpbmcoKSxcbiAgICBzdGFnZXM6IHN0YWdlU2NoZW1hLmRlZmF1bHQoe1xuICAgICAgICBkZXY6IHtcbiAgICAgICAgICAgIGFjY291bnQ6IFwiMTIzNDU2Nzg5MDEyXCIsXG4gICAgICAgICAgICByZWdpb246IFwidXMtd2VzdC0yXCIsXG4gICAgICAgIH0sXG4gICAgfSksXG59KTtcblxuZXhwb3J0IGNvbnN0IGluZnJhQ29uZmlnU2NoZW1hID0gei5vYmplY3Qoe1xuICAgIC8vIHByb2plY3Q6IHByb2plY3RTY2hlbWEsXG4gICAgdnBjOiB2cGNTY2hlbWEuZGVmYXVsdCh7fSksXG4gICAgYXBwczogei5hcnJheShhcHBTY2hlbWEpLFxuICAgIHNlcnZpY2VzOiB6XG4gICAgICAgIC5vYmplY3Qoe1xuICAgICAgICAgICAgZG9tYWluOiBkb21haW5TY2hlbWEub3B0aW9uYWwoKSxcbiAgICAgICAgICAgIHMzOiB6LmFycmF5KHMzU2NoZW1hKS5vcHRpb25hbCgpLFxuICAgICAgICAgICAgc3FzOiB6LmFycmF5KHNxc1NjaGVtYSkub3B0aW9uYWwoKSxcbiAgICAgICAgfSlcbiAgICAgICAgLm9wdGlvbmFsKCksXG59KTtcblxuZXhwb3J0IHR5cGUgSW5mcmFDb25maWcgPSB6LmluZmVyPHR5cGVvZiBpbmZyYUNvbmZpZ1NjaGVtYT47XG5leHBvcnQgdHlwZSBQcm9qZWN0Q29uZmlnID0gei5pbmZlcjx0eXBlb2YgcHJvamVjdFNjaGVtYT47XG5leHBvcnQgdHlwZSBBcHBDb25maWcgPSB6LmluZmVyPHR5cGVvZiBhcHBTY2hlbWE+O1xuZXhwb3J0IHR5cGUgVnBjQ29uZmlnID0gei5pbmZlcjx0eXBlb2YgdnBjU2NoZW1hPjtcbmV4cG9ydCB0eXBlIERvbWFpbkNvbmZpZyA9IHouaW5mZXI8dHlwZW9mIGRvbWFpblNjaGVtYT47XG5leHBvcnQgdHlwZSBTM0NvbmZpZyA9IHouaW5mZXI8dHlwZW9mIHMzU2NoZW1hPjtcbmV4cG9ydCB0eXBlIFNxc0NvbmZpZyA9IHouaW5mZXI8dHlwZW9mIHNxc1NjaGVtYT47XG4iXX0=