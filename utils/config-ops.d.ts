export declare const checkIfConfigFileExists: (filePath: string) => string;
export declare const readConfigFile: (filePath: string) => {
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
};
