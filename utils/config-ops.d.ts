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
        healthCheckEndpoint: string;
        dockerImagePath: string;
        cpu: number;
        minCapacity: number;
        maxCapacity: number;
        parameterStoreSecrets?: string[] | undefined;
    }[];
    services?: {
        domain?: {
            name: string;
        } | undefined;
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
    } | undefined;
};
