#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const files_1 = require("../conts/files");
const logger_1 = require("../utils/logger");
const createDummyConfig = () => {
    const fileName = files_1.FILES.INFRA_CONFIG;
    const filePath = (0, path_1.join)(process.cwd(), fileName);
    if ((0, fs_1.existsSync)(filePath)) {
        logger_1.log.warn("File already exists");
        logger_1.log.warn("If you want to create a new file, please delete the existing file");
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
    (0, fs_1.writeFileSync)(filePath, JSON.stringify(dummyConfig, null, 4));
    console.log("File created successfully");
};
createDummyConfig();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLWR1bW15LWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNyZWF0ZS1kdW1teS1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsK0JBQTRCO0FBQzVCLDJCQUErQztBQUMvQywwQ0FBdUM7QUFDdkMsNENBQXNDO0FBRXRDLE1BQU0saUJBQWlCLEdBQUcsR0FBRyxFQUFFO0lBQzNCLE1BQU0sUUFBUSxHQUFHLGFBQUssQ0FBQyxZQUFZLENBQUM7SUFDcEMsTUFBTSxRQUFRLEdBQUcsSUFBQSxXQUFJLEVBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBRS9DLElBQUksSUFBQSxlQUFVLEVBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztRQUN2QixZQUFHLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDaEMsWUFBRyxDQUFDLElBQUksQ0FBQyxtRUFBbUUsQ0FBQyxDQUFDO1FBQzlFLE9BQU87SUFDWCxDQUFDO0lBRUQsTUFBTSxXQUFXLEdBQUc7UUFDaEIsSUFBSSxFQUFFO1lBQ0Y7Z0JBQ0ksSUFBSSxFQUFFLGdCQUFnQjtnQkFDdEIsZUFBZSxFQUFFLHVCQUF1QjtnQkFDeEMsbUJBQW1CLEVBQUUsU0FBUztnQkFDOUIsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsTUFBTSxFQUFFLEdBQUc7Z0JBQ1gsV0FBVyxFQUFFLENBQUM7Z0JBQ2QsV0FBVyxFQUFFLENBQUM7Z0JBQ2QscUJBQXFCLEVBQUUsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDO2FBQ2pEO1lBQ0Q7Z0JBQ0ksSUFBSSxFQUFFLGdCQUFnQjtnQkFDdEIsZUFBZSxFQUFFLElBQUk7Z0JBQ3JCLG1CQUFtQixFQUFFLFNBQVM7Z0JBQzlCLElBQUksRUFBRSxJQUFJO2dCQUNWLEdBQUcsRUFBRSxHQUFHO2dCQUNSLE1BQU0sRUFBRSxHQUFHO2dCQUNYLFdBQVcsRUFBRSxDQUFDO2dCQUNkLFdBQVcsRUFBRSxFQUFFO2dCQUNmLHFCQUFxQixFQUFFLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQzthQUM1QztTQUNKO1FBQ0QsUUFBUSxFQUFFO1lBQ04sTUFBTSxFQUFFO2dCQUNKLElBQUksRUFBRSxhQUFhO2FBQ3RCO1lBQ0QsRUFBRSxFQUFFO2dCQUNBO29CQUNJLFVBQVUsRUFBRSxlQUFlO29CQUMzQixNQUFNLEVBQUUsSUFBSTtvQkFDWixNQUFNLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDN0I7Z0JBQ0Q7b0JBQ0ksVUFBVSxFQUFFLGVBQWU7b0JBQzNCLE1BQU0sRUFBRSxLQUFLO29CQUNiLE1BQU0sRUFBRSxDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDO2lCQUMvQzthQUNKO1lBQ0QsR0FBRyxFQUFFO2dCQUNEO29CQUNJLFNBQVMsRUFBRSxjQUFjO29CQUN6QixJQUFJLEVBQUUsSUFBSTtvQkFDVixNQUFNLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDN0I7Z0JBQ0Q7b0JBQ0ksU0FBUyxFQUFFLGNBQWM7b0JBQ3pCLElBQUksRUFBRSxLQUFLO29CQUNYLE1BQU0sRUFBRSxDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDO2lCQUMvQzthQUNKO1lBQ0QsR0FBRyxFQUFFO2dCQUNELGFBQWEsRUFBRSxhQUFhO2dCQUM1QixNQUFNLEVBQUUsVUFBVTtnQkFDbEIsT0FBTyxFQUFFLEVBQUU7Z0JBQ1gsT0FBTyxFQUFFLEtBQUs7YUFDakI7WUFDRCxLQUFLLEVBQUU7Z0JBQ0gsYUFBYSxFQUFFLGdCQUFnQjtnQkFDL0IsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsTUFBTSxFQUFFLEdBQUc7YUFDZDtTQUNKO0tBQ0osQ0FBQztJQUVGLElBQUEsa0JBQWEsRUFBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUQsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQzdDLENBQUMsQ0FBQztBQUVGLGlCQUFpQixFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5cbmltcG9ydCB7IGpvaW4gfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgZXhpc3RzU3luYywgd3JpdGVGaWxlU3luYyB9IGZyb20gXCJmc1wiO1xuaW1wb3J0IHsgRklMRVMgfSBmcm9tIFwiLi4vY29udHMvZmlsZXNcIjtcbmltcG9ydCB7IGxvZyB9IGZyb20gXCIuLi91dGlscy9sb2dnZXJcIjtcblxuY29uc3QgY3JlYXRlRHVtbXlDb25maWcgPSAoKSA9PiB7XG4gICAgY29uc3QgZmlsZU5hbWUgPSBGSUxFUy5JTkZSQV9DT05GSUc7XG4gICAgY29uc3QgZmlsZVBhdGggPSBqb2luKHByb2Nlc3MuY3dkKCksIGZpbGVOYW1lKTtcblxuICAgIGlmIChleGlzdHNTeW5jKGZpbGVQYXRoKSkge1xuICAgICAgICBsb2cud2FybihcIkZpbGUgYWxyZWFkeSBleGlzdHNcIik7XG4gICAgICAgIGxvZy53YXJuKFwiSWYgeW91IHdhbnQgdG8gY3JlYXRlIGEgbmV3IGZpbGUsIHBsZWFzZSBkZWxldGUgdGhlIGV4aXN0aW5nIGZpbGVcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBkdW1teUNvbmZpZyA9IHtcbiAgICAgICAgYXBwczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6IFwic2VydmljZS1uYW1lLTFcIixcbiAgICAgICAgICAgICAgICBkb2NrZXJJbWFnZVBhdGg6IFwiLi9hcHBzL3NlcnZpY2UtbmFtZS0xXCIsXG4gICAgICAgICAgICAgICAgaGVhbHRoQ2hlY2tFbmRwb2ludDogXCIvaGVhbHRoXCIsXG4gICAgICAgICAgICAgICAgcG9ydDogMzAwMCxcbiAgICAgICAgICAgICAgICBjcHU6IDI1NixcbiAgICAgICAgICAgICAgICBtZW1vcnk6IDUxMixcbiAgICAgICAgICAgICAgICBtaW5DYXBhY2l0eTogMSxcbiAgICAgICAgICAgICAgICBtYXhDYXBhY2l0eTogMixcbiAgICAgICAgICAgICAgICBwYXJhbWV0ZXJTdG9yZVNlY3JldHM6IFtcIlBPUlRcIiwgXCJEQl9QQVNTV09SRFwiXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJzZXJ2aWNlLW5hbWUtMlwiLFxuICAgICAgICAgICAgICAgIGRvY2tlckltYWdlUGF0aDogXCIuL1wiLFxuICAgICAgICAgICAgICAgIGhlYWx0aENoZWNrRW5kcG9pbnQ6IFwiL2hlYWx0aFwiLFxuICAgICAgICAgICAgICAgIHBvcnQ6IDMwMDEsXG4gICAgICAgICAgICAgICAgY3B1OiAyNTYsXG4gICAgICAgICAgICAgICAgbWVtb3J5OiA1MTIsXG4gICAgICAgICAgICAgICAgbWluQ2FwYWNpdHk6IDIsXG4gICAgICAgICAgICAgICAgbWF4Q2FwYWNpdHk6IDEwLFxuICAgICAgICAgICAgICAgIHBhcmFtZXRlclN0b3JlU2VjcmV0czogW1wiUE9SVFwiLCBcIkRCX1VSTFwiXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHNlcnZpY2VzOiB7XG4gICAgICAgICAgICBkb21haW46IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcImV4YW1wbGUuY29tXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgczM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGJ1Y2tldE5hbWU6IFwiYnVja2V0LW5hbWUtMVwiLFxuICAgICAgICAgICAgICAgICAgICBwdWJsaWM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHVzZWRCeTogW1wic2VydmljZS1uYW1lLTFcIl0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGJ1Y2tldE5hbWU6IFwiYnVja2V0LW5hbWUtMlwiLFxuICAgICAgICAgICAgICAgICAgICBwdWJsaWM6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB1c2VkQnk6IFtcInNlcnZpY2UtbmFtZS0xXCIsIFwic2VydmljZS1uYW1lLTJcIl0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBzcXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHF1ZXVlTmFtZTogXCJxdWV1ZS1uYW1lLTFcIixcbiAgICAgICAgICAgICAgICAgICAgZmlmbzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgdXNlZEJ5OiBbXCJzZXJ2aWNlLW5hbWUtMVwiXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcXVldWVOYW1lOiBcInF1ZXVlLW5hbWUtMlwiLFxuICAgICAgICAgICAgICAgICAgICBmaWZvOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdXNlZEJ5OiBbXCJzZXJ2aWNlLW5hbWUtMVwiLCBcInNlcnZpY2UtbmFtZS0yXCJdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgcmRzOiB7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2VDbGFzczogXCJkYi50Mi5taWNyb1wiLFxuICAgICAgICAgICAgICAgIGVuZ2luZTogXCJwb3N0Z3Jlc1wiLFxuICAgICAgICAgICAgICAgIHN0b3JhZ2U6IDIwLFxuICAgICAgICAgICAgICAgIG11bHRpQVo6IGZhbHNlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlZGlzOiB7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2VDbGFzczogXCJjYWNoZS50Mi5taWNyb1wiLFxuICAgICAgICAgICAgICAgIGVuZ2luZTogXCJyZWRpc1wiLFxuICAgICAgICAgICAgICAgIG1lbW9yeTogMC41LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICB9O1xuXG4gICAgd3JpdGVGaWxlU3luYyhmaWxlUGF0aCwgSlNPTi5zdHJpbmdpZnkoZHVtbXlDb25maWcsIG51bGwsIDQpKTtcbiAgICBjb25zb2xlLmxvZyhcIkZpbGUgY3JlYXRlZCBzdWNjZXNzZnVsbHlcIik7XG59O1xuXG5jcmVhdGVEdW1teUNvbmZpZygpO1xuIl19