#!/usr/bin/env node

import { join } from "path";
import { existsSync, writeFileSync } from "fs";
import { FILES } from "../conts/files";
import { log } from "../utils/logger";

const createDummyConfig = () => {
    const fileName = FILES.INFRA_CONFIG;
    const filePath = join(process.cwd(), fileName);

    if (existsSync(filePath)) {
        log.warn("File already exists");
        log.warn("If you want to create a new file, please delete the existing file");
        return;
    }

    const dummyConfig = {
        apps: [
            {
                name: "service-name-1",
                dockerImagePath: "./apps/service-name-1",
                healthCheckEndpoint: "/health",
                port: 3000,
                cpu: 256,
                memory: 512,
                minCapacity: 1,
                maxCapacity: 2,
                parameterStoreSecrets: ["PORT", "DB_PASSWORD"],
            },
            {
                name: "service-name-2",
                dockerImagePath: "./",
                healthCheckEndpoint: "/health",
                port: 3001,
                cpu: 256,
                memory: 512,
                minCapacity: 2,
                maxCapacity: 10,
                parameterStoreSecrets: ["PORT", "DB_URL"],
            },
        ],
        services: {
            domain: {
                name: "example.com",
            },
            s3: [
                {
                    bucketName: "bucket-name-1",
                    public: true,
                    usedBy: ["service-name-1"],
                },
                {
                    bucketName: "bucket-name-2",
                    public: false,
                    usedBy: ["service-name-1", "service-name-2"],
                },
            ],
            sqs: [
                {
                    queueName: "queue-name-1",
                    fifo: true,
                    usedBy: ["service-name-1"],
                },
                {
                    queueName: "queue-name-2",
                    fifo: false,
                    usedBy: ["service-name-1", "service-name-2"],
                },
            ],
            rds: {
                instanceClass: "db.t2.micro",
                engine: "postgres",
                storage: 20,
                multiAZ: false,
            },
            redis: {
                instanceClass: "cache.t2.micro",
                engine: "redis",
                memory: 0.5,
            },
        },
    };

    writeFileSync(filePath, JSON.stringify(dummyConfig, null, 4));
    console.log("File created successfully");
};

createDummyConfig();
