import { z } from "zod";
declare const appSchema: z.ZodObject<{
    name: z.ZodString;
    healthCheckEndpoint: z.ZodString;
    port: z.ZodNumber;
    cpu: z.ZodDefault<z.ZodNumber>;
    memory: z.ZodDefault<z.ZodNumber>;
    minCapacity: z.ZodDefault<z.ZodNumber>;
    maxCapacity: z.ZodDefault<z.ZodNumber>;
    parameterStoreSecrets: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    port: number;
    memory: number;
    cpu: number;
    healthCheckEndpoint: string;
    minCapacity: number;
    maxCapacity: number;
    parameterStoreSecrets?: string[] | undefined;
}, {
    name: string;
    port: number;
    healthCheckEndpoint: string;
    memory?: number | undefined;
    cpu?: number | undefined;
    minCapacity?: number | undefined;
    maxCapacity?: number | undefined;
    parameterStoreSecrets?: string[] | undefined;
}>;
declare const vpcSchema: z.ZodObject<{
    noOfAzs: z.ZodDefault<z.ZodNumber>;
    createNatGateway: z.ZodDefault<z.ZodBoolean>;
    noOfNatGateways: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    noOfAzs: number;
    createNatGateway: boolean;
    noOfNatGateways: number;
}, {
    noOfAzs?: number | undefined;
    createNatGateway?: boolean | undefined;
    noOfNatGateways?: number | undefined;
}>;
declare const domainSchema: z.ZodObject<{
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
}, {
    name: string;
}>;
declare const s3Schema: z.ZodObject<{
    bucketName: z.ZodString;
    public: z.ZodBoolean;
    usedBy: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    public: boolean;
    bucketName: string;
    usedBy: string[];
}, {
    public: boolean;
    bucketName: string;
    usedBy: string[];
}>;
declare const sqsSchema: z.ZodObject<{
    queueName: z.ZodString;
    fifo: z.ZodBoolean;
    usedBy: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    usedBy: string[];
    queueName: string;
    fifo: boolean;
}, {
    usedBy: string[];
    queueName: string;
    fifo: boolean;
}>;
export declare const infraConfigSchema: z.ZodObject<{
    vpc: z.ZodDefault<z.ZodObject<{
        noOfAzs: z.ZodDefault<z.ZodNumber>;
        createNatGateway: z.ZodDefault<z.ZodBoolean>;
        noOfNatGateways: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        noOfAzs: number;
        createNatGateway: boolean;
        noOfNatGateways: number;
    }, {
        noOfAzs?: number | undefined;
        createNatGateway?: boolean | undefined;
        noOfNatGateways?: number | undefined;
    }>>;
    apps: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        healthCheckEndpoint: z.ZodString;
        port: z.ZodNumber;
        cpu: z.ZodDefault<z.ZodNumber>;
        memory: z.ZodDefault<z.ZodNumber>;
        minCapacity: z.ZodDefault<z.ZodNumber>;
        maxCapacity: z.ZodDefault<z.ZodNumber>;
        parameterStoreSecrets: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        port: number;
        memory: number;
        cpu: number;
        healthCheckEndpoint: string;
        minCapacity: number;
        maxCapacity: number;
        parameterStoreSecrets?: string[] | undefined;
    }, {
        name: string;
        port: number;
        healthCheckEndpoint: string;
        memory?: number | undefined;
        cpu?: number | undefined;
        minCapacity?: number | undefined;
        maxCapacity?: number | undefined;
        parameterStoreSecrets?: string[] | undefined;
    }>, "many">;
    services: z.ZodOptional<z.ZodObject<{
        domain: z.ZodOptional<z.ZodObject<{
            name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
        }, {
            name: string;
        }>>;
        s3: z.ZodOptional<z.ZodArray<z.ZodObject<{
            bucketName: z.ZodString;
            public: z.ZodBoolean;
            usedBy: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            public: boolean;
            bucketName: string;
            usedBy: string[];
        }, {
            public: boolean;
            bucketName: string;
            usedBy: string[];
        }>, "many">>;
        sqs: z.ZodOptional<z.ZodArray<z.ZodObject<{
            queueName: z.ZodString;
            fifo: z.ZodBoolean;
            usedBy: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            usedBy: string[];
            queueName: string;
            fifo: boolean;
        }, {
            usedBy: string[];
            queueName: string;
            fifo: boolean;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        s3?: {
            public: boolean;
            bucketName: string;
            usedBy: string[];
        }[] | undefined;
        sqs?: {
            usedBy: string[];
            queueName: string;
            fifo: boolean;
        }[] | undefined;
        domain?: {
            name: string;
        } | undefined;
    }, {
        s3?: {
            public: boolean;
            bucketName: string;
            usedBy: string[];
        }[] | undefined;
        sqs?: {
            usedBy: string[];
            queueName: string;
            fifo: boolean;
        }[] | undefined;
        domain?: {
            name: string;
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    vpc: {
        noOfAzs: number;
        createNatGateway: boolean;
        noOfNatGateways: number;
    };
    apps: {
        name: string;
        port: number;
        memory: number;
        cpu: number;
        healthCheckEndpoint: string;
        minCapacity: number;
        maxCapacity: number;
        parameterStoreSecrets?: string[] | undefined;
    }[];
    services?: {
        s3?: {
            public: boolean;
            bucketName: string;
            usedBy: string[];
        }[] | undefined;
        sqs?: {
            usedBy: string[];
            queueName: string;
            fifo: boolean;
        }[] | undefined;
        domain?: {
            name: string;
        } | undefined;
    } | undefined;
}, {
    apps: {
        name: string;
        port: number;
        healthCheckEndpoint: string;
        memory?: number | undefined;
        cpu?: number | undefined;
        minCapacity?: number | undefined;
        maxCapacity?: number | undefined;
        parameterStoreSecrets?: string[] | undefined;
    }[];
    vpc?: {
        noOfAzs?: number | undefined;
        createNatGateway?: boolean | undefined;
        noOfNatGateways?: number | undefined;
    } | undefined;
    services?: {
        s3?: {
            public: boolean;
            bucketName: string;
            usedBy: string[];
        }[] | undefined;
        sqs?: {
            usedBy: string[];
            queueName: string;
            fifo: boolean;
        }[] | undefined;
        domain?: {
            name: string;
        } | undefined;
    } | undefined;
}>;
export type InfraConfig = z.infer<typeof infraConfigSchema>;
export type AppConfig = z.infer<typeof appSchema>;
export type VpcConfig = z.infer<typeof vpcSchema>;
export type DomainConfig = z.infer<typeof domainSchema>;
export type S3Config = z.infer<typeof s3Schema>;
export type SqsConfig = z.infer<typeof sqsSchema>;
export {};
