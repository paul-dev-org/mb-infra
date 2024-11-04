#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_child_process_1 = require("node:child_process");
const logger_1 = require("../utils/logger");
const files_1 = require("../conts/files");
const fs_1 = require("fs");
const path_1 = require("path");
const cdkJson = `{
    "app": "npx mb-infra",
    "watch": {
        "include": ["**"],
        "exclude": [
            "README.md",
            "cdk*.json",
            "**/*.d.ts",
            "**/*.js",
            "tsconfig.json",
            "package*.json",
            "yarn.lock",
            "node_modules",
            "test"
        ]
    },
    "context": {
        "@aws-cdk/aws-lambda:recognizeLayerVersion": true,
        "@aws-cdk/core:checkSecretUsage": true,
        "@aws-cdk/core:target-partitions": ["aws", "aws-cn"],
        "@aws-cdk-containers/ecs-service-extensions:enableDefaultLogDriver": true,
        "@aws-cdk/aws-ec2:uniqueImdsv2TemplateName": true,
        "@aws-cdk/aws-ecs:arnFormatIncludesClusterName": true,
        "@aws-cdk/aws-iam:minimizePolicies": true,
        "@aws-cdk/core:validateSnapshotRemovalPolicy": true,
        "@aws-cdk/aws-codepipeline:crossAccountKeyAliasStackSafeResourceName": true,
        "@aws-cdk/aws-s3:createDefaultLoggingPolicy": true,
        "@aws-cdk/aws-sns-subscriptions:restrictSqsDescryption": true,
        "@aws-cdk/aws-apigateway:disableCloudWatchRole": true,
        "@aws-cdk/core:enablePartitionLiterals": true,
        "@aws-cdk/aws-events:eventsTargetQueueSameAccount": true,
        "@aws-cdk/aws-ecs:disableExplicitDeploymentControllerForCircuitBreaker": true,
        "@aws-cdk/aws-iam:importedRoleStackSafeDefaultPolicyName": true,
        "@aws-cdk/aws-s3:serverAccessLogsUseBucketPolicy": true,
        "@aws-cdk/aws-route53-patters:useCertificate": true,
        "@aws-cdk/customresources:installLatestAwsSdkDefault": false,
        "@aws-cdk/aws-rds:databaseProxyUniqueResourceName": true,
        "@aws-cdk/aws-codedeploy:removeAlarmsFromDeploymentGroup": true,
        "@aws-cdk/aws-apigateway:authorizerChangeDeploymentLogicalId": true,
        "@aws-cdk/aws-ec2:launchTemplateDefaultUserData": true,
        "@aws-cdk/aws-secretsmanager:useAttachedSecretResourcePolicyForSecretTargetAttachments": true,
        "@aws-cdk/aws-redshift:columnId": true,
        "@aws-cdk/aws-stepfunctions-tasks:enableEmrServicePolicyV2": true,
        "@aws-cdk/aws-ec2:restrictDefaultSecurityGroup": true,
        "@aws-cdk/aws-apigateway:requestValidatorUniqueId": true,
        "@aws-cdk/aws-kms:aliasNameRef": true,
        "@aws-cdk/aws-autoscaling:generateLaunchTemplateInsteadOfLaunchConfig": true,
        "@aws-cdk/core:includePrefixInUniqueNameGeneration": true,
        "@aws-cdk/aws-efs:denyAnonymousAccess": true,
        "@aws-cdk/aws-opensearchservice:enableOpensearchMultiAzWithStandby": true,
        "@aws-cdk/aws-lambda-nodejs:useLatestRuntimeVersion": true,
        "@aws-cdk/aws-efs:mountTargetOrderInsensitiveLogicalId": true,
        "@aws-cdk/aws-rds:auroraClusterChangeScopeOfInstanceParameterGroupWithEachParameters": true,
        "@aws-cdk/aws-appsync:useArnForSourceApiAssociationIdentifier": true,
        "@aws-cdk/aws-rds:preventRenderingDeprecatedCredentials": true,
        "@aws-cdk/aws-codepipeline-actions:useNewDefaultBranchForCodeCommitSource": true,
        "@aws-cdk/aws-cloudwatch-actions:changeLambdaPermissionLogicalIdForLambdaAction": true,
        "@aws-cdk/aws-codepipeline:crossAccountKeysDefaultValueToFalse": true,
        "@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2": true,
        "@aws-cdk/aws-kms:reduceCrossAccountRegionPolicyScope": true,
        "@aws-cdk/aws-eks:nodegroupNameAttribute": true,
        "@aws-cdk/aws-ec2:ebsDefaultGp3Volume": true,
        "@aws-cdk/aws-ecs:removeDefaultDeploymentAlarm": true,
        "@aws-cdk/custom-resources:logApiResponseDataPropertyTrueDefault": false,
        "@aws-cdk/aws-s3:keepNotificationInImportedBucket": false,
        "@aws-cdk/aws-ecs:reduceEc2FargateCloudWatchPermissions": true,
        "@aws-cdk/aws-ec2:ec2SumTImeoutEnabled": true,
        "@aws-cdk/aws-appsync:appSyncGraphQLAPIScopeLambdaPermission": true,
        "@aws-cdk/aws-rds:setCorrectValueForDatabaseInstanceReadReplicaInstanceResourceId": true,
        "@aws-cdk/core:cfnIncludeRejectComplexResourceUpdateCreatePolicyIntrinsics": true,
        "@aws-cdk/aws-lambda-nodejs:sdkV3ExcludeSmithyPackages": true
    }
}
`;
const dummyConfig = {
    project: {
        name: "project-name",
        stages: {
            dev: {
                account: "123456789012",
                region: "us-east-1",
            },
            stg: {
                account: "123456789012",
                region: "us-east-1",
            },
        },
    },
    vpc: {
        noOfAzs: 3,
        createNatGateway: true,
        noOfNatGateways: 1,
    },
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
                fifo: false,
                usedBy: ["service-name-1"],
            },
            {
                queueName: "queue-name-2",
                fifo: true,
                usedBy: ["service-name-2"],
            },
        ],
    }
};
const checkIfCdkIsInstalled = () => {
    logger_1.log.info("Checking if CDK is installed...");
    const cdkInstalled = (0, node_child_process_1.execSync)("which cdk").toString();
    if (!cdkInstalled) {
        console.error("CDK is not installed. Please install CDK before running this command.");
        //ask user if they want to install CDK
        const installCdk = (0, node_child_process_1.execSync)("read -p 'Do you want to install CDK? (y/n): ' answer && echo $answer").toString();
        if (installCdk === "y") {
            logger_1.log.info("Installing CDK...");
            logger_1.log.info("Running: sudo npm install -g aws-cdk");
            (0, node_child_process_1.execSync)("sudo npm install -g aws-cdk", { stdio: "inherit" });
        }
        else {
            console.error("Exiting without installing cdk...");
            process.exit(1);
        }
    }
    logger_1.log.success("CDK is installed.");
};
const addCdkJson = () => {
    logger_1.log.info("Checking if cdk.json file exists...");
    const cdkJsonExists = (0, fs_1.existsSync)(files_1.FILES.CDK_CONFIG);
    if (cdkJsonExists) {
        logger_1.log.warn("cdk.json file already exists.");
        return;
    }
    logger_1.log.info("Adding cdk.json file...");
    (0, node_child_process_1.execSync)(`echo '${cdkJson}' > ${files_1.FILES.CDK_CONFIG}`, { cwd: process.cwd() });
    logger_1.log.success("cdk.json file added.");
};
const updateGitIgnore = () => {
    logger_1.log.info("Checking if .gitignore file exists...");
    const gitIgnoreExists = (0, fs_1.existsSync)(files_1.FILES.GIT_IGNORE);
    if (!gitIgnoreExists) {
        logger_1.log.warn(".gitignore file does not exist.");
        (0, fs_1.writeFileSync)(files_1.FILES.GIT_IGNORE, ".cdk.staging\ncdk.out");
        logger_1.log.success("Created .gitignore file.");
        return;
    }
    logger_1.log.info("Updating .gitignore file...");
    const gitIgnoreContent = (0, node_child_process_1.execSync)(`cat ${files_1.FILES.GIT_IGNORE}`).toString();
    if (gitIgnoreContent.includes(".cdk.staging") && gitIgnoreContent.includes("cdk.out")) {
        logger_1.log.warn(".gitignore file is already updated.");
        return;
    }
    !gitIgnoreContent.includes(".cdk.staging") && (0, node_child_process_1.execSync)(`echo '.cdk.staging' >> ${files_1.FILES.GIT_IGNORE}`);
    !gitIgnoreContent.includes("cdk.out") && (0, node_child_process_1.execSync)(`echo 'cdk.out' >> ${files_1.FILES.GIT_IGNORE}`);
    logger_1.log.success("Updated .gitignore file.");
};
const createDummyConfig = () => {
    const fileName = files_1.FILES.INFRA_CONFIG;
    const filePath = (0, path_1.join)(process.cwd(), fileName);
    if ((0, fs_1.existsSync)(filePath)) {
        logger_1.log.warn("File already exists");
        logger_1.log.warn("If you want to create a new file, please delete the existing file");
        return;
    }
    (0, fs_1.writeFileSync)(filePath, JSON.stringify(dummyConfig, null, 4));
    console.log("File created successfully");
};
const helpfulMessage = () => {
    logger_1.log.info(`Please run now following commands:
        1. npx cdk bootstrap --profile <profile-name> --region <region-name>
        2. npx cdk deploy --profile <profile-name> --region <region-name>
    `);
};
const initCdk = () => {
    // checkIfCdkIsInstalled();
    addCdkJson();
    updateGitIgnore();
    createDummyConfig();
    helpfulMessage();
};
initCdk();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mcmEtaW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZnJhLWluaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsMkRBQThDO0FBQzlDLDRDQUFzQztBQUN0QywwQ0FBdUM7QUFDdkMsMkJBQStDO0FBQy9DLCtCQUE0QjtBQUc1QixNQUFNLE9BQU8sR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQXlFZixDQUFDO0FBRUYsTUFBTSxXQUFXLEdBQWdCO0lBQzdCLE9BQU8sRUFBRTtRQUNMLElBQUksRUFBRSxjQUFjO1FBQ3BCLE1BQU0sRUFBRTtZQUNKLEdBQUcsRUFBRTtnQkFDRCxPQUFPLEVBQUUsY0FBYztnQkFDdkIsTUFBTSxFQUFFLFdBQVc7YUFDdEI7WUFDRCxHQUFHLEVBQUU7Z0JBQ0QsT0FBTyxFQUFFLGNBQWM7Z0JBQ3ZCLE1BQU0sRUFBRSxXQUFXO2FBQ3RCO1NBQ0o7S0FDSjtJQUNELEdBQUcsRUFBRTtRQUNELE9BQU8sRUFBRSxDQUFDO1FBQ1YsZ0JBQWdCLEVBQUUsSUFBSTtRQUN0QixlQUFlLEVBQUUsQ0FBQztLQUNyQjtJQUNELElBQUksRUFBRTtRQUNGO1lBQ0ksSUFBSSxFQUFFLGdCQUFnQjtZQUN0QixlQUFlLEVBQUUsdUJBQXVCO1lBQ3hDLG1CQUFtQixFQUFFLFNBQVM7WUFDOUIsSUFBSSxFQUFFLElBQUk7WUFDVixHQUFHLEVBQUUsR0FBRztZQUNSLE1BQU0sRUFBRSxHQUFHO1lBQ1gsV0FBVyxFQUFFLENBQUM7WUFDZCxXQUFXLEVBQUUsQ0FBQztZQUNkLHFCQUFxQixFQUFFLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQztTQUNqRDtRQUNEO1lBQ0ksSUFBSSxFQUFFLGdCQUFnQjtZQUN0QixlQUFlLEVBQUUsSUFBSTtZQUNyQixtQkFBbUIsRUFBRSxTQUFTO1lBQzlCLElBQUksRUFBRSxJQUFJO1lB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LElBQUksSUFBQSxlQUFVLEVBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztRQUN2QixZQUFHLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDaEMsWUFBRyxDQUFDLElBQUksQ0FBQyxtRUFBbUUsQ0FBQyxDQUFDO1FBQzlFLE9BQU87SUFDWCxDQUFDO0lBRUQsSUFBQSxrQkFBYSxFQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUU5RCxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFDN0MsQ0FBQyxDQUFDO0FBRUYsTUFBTSxjQUFjLEdBQUcsR0FBRyxFQUFFO0lBQ3hCLFlBQUcsQ0FBQyxJQUFJLENBQUM7OztLQUdSLENBQUMsQ0FBQztBQUVQLENBQUMsQ0FBQTtBQUVELE1BQU0sT0FBTyxHQUFHLEdBQUcsRUFBRTtJQUNqQiwyQkFBMkI7SUFDM0IsVUFBVSxFQUFFLENBQUM7SUFDYixlQUFlLEVBQUUsQ0FBQztJQUNsQixpQkFBaUIsRUFBRSxDQUFDO0lBQ3BCLGNBQWMsRUFBRSxDQUFDO0FBQ3JCLENBQUMsQ0FBQztBQUVGLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuXG5pbXBvcnQgeyBleGVjU3luYyB9IGZyb20gXCJub2RlOmNoaWxkX3Byb2Nlc3NcIjtcbmltcG9ydCB7IGxvZyB9IGZyb20gXCIuLi91dGlscy9sb2dnZXJcIjtcbmltcG9ydCB7IEZJTEVTIH0gZnJvbSBcIi4uL2NvbnRzL2ZpbGVzXCI7XG5pbXBvcnQgeyBleGlzdHNTeW5jLCB3cml0ZUZpbGVTeW5jIH0gZnJvbSBcImZzXCI7XG5pbXBvcnQgeyBqb2luIH0gZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IEluZnJhQ29uZmlnIH0gZnJvbSBcIi4uL3NjaGVtYXMvaW5mcmEuY29uZmlnXCI7XG5cbmNvbnN0IGNka0pzb24gPSBge1xuICAgIFwiYXBwXCI6IFwibnB4IG1iLWluZnJhXCIsXG4gICAgXCJ3YXRjaFwiOiB7XG4gICAgICAgIFwiaW5jbHVkZVwiOiBbXCIqKlwiXSxcbiAgICAgICAgXCJleGNsdWRlXCI6IFtcbiAgICAgICAgICAgIFwiUkVBRE1FLm1kXCIsXG4gICAgICAgICAgICBcImNkayouanNvblwiLFxuICAgICAgICAgICAgXCIqKi8qLmQudHNcIixcbiAgICAgICAgICAgIFwiKiovKi5qc1wiLFxuICAgICAgICAgICAgXCJ0c2NvbmZpZy5qc29uXCIsXG4gICAgICAgICAgICBcInBhY2thZ2UqLmpzb25cIixcbiAgICAgICAgICAgIFwieWFybi5sb2NrXCIsXG4gICAgICAgICAgICBcIm5vZGVfbW9kdWxlc1wiLFxuICAgICAgICAgICAgXCJ0ZXN0XCJcbiAgICAgICAgXVxuICAgIH0sXG4gICAgXCJjb250ZXh0XCI6IHtcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtbGFtYmRhOnJlY29nbml6ZUxheWVyVmVyc2lvblwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2NvcmU6Y2hlY2tTZWNyZXRVc2FnZVwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2NvcmU6dGFyZ2V0LXBhcnRpdGlvbnNcIjogW1wiYXdzXCIsIFwiYXdzLWNuXCJdLFxuICAgICAgICBcIkBhd3MtY2RrLWNvbnRhaW5lcnMvZWNzLXNlcnZpY2UtZXh0ZW5zaW9uczplbmFibGVEZWZhdWx0TG9nRHJpdmVyXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWVjMjp1bmlxdWVJbWRzdjJUZW1wbGF0ZU5hbWVcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtZWNzOmFybkZvcm1hdEluY2x1ZGVzQ2x1c3Rlck5hbWVcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtaWFtOm1pbmltaXplUG9saWNpZXNcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9jb3JlOnZhbGlkYXRlU25hcHNob3RSZW1vdmFsUG9saWN5XCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZTpjcm9zc0FjY291bnRLZXlBbGlhc1N0YWNrU2FmZVJlc291cmNlTmFtZVwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1zMzpjcmVhdGVEZWZhdWx0TG9nZ2luZ1BvbGljeVwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1zbnMtc3Vic2NyaXB0aW9uczpyZXN0cmljdFNxc0Rlc2NyeXB0aW9uXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXk6ZGlzYWJsZUNsb3VkV2F0Y2hSb2xlXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvY29yZTplbmFibGVQYXJ0aXRpb25MaXRlcmFsc1wiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1ldmVudHM6ZXZlbnRzVGFyZ2V0UXVldWVTYW1lQWNjb3VudFwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1lY3M6ZGlzYWJsZUV4cGxpY2l0RGVwbG95bWVudENvbnRyb2xsZXJGb3JDaXJjdWl0QnJlYWtlclwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1pYW06aW1wb3J0ZWRSb2xlU3RhY2tTYWZlRGVmYXVsdFBvbGljeU5hbWVcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtczM6c2VydmVyQWNjZXNzTG9nc1VzZUJ1Y2tldFBvbGljeVwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1yb3V0ZTUzLXBhdHRlcnM6dXNlQ2VydGlmaWNhdGVcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9jdXN0b21yZXNvdXJjZXM6aW5zdGFsbExhdGVzdEF3c1Nka0RlZmF1bHRcIjogZmFsc2UsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLXJkczpkYXRhYmFzZVByb3h5VW5pcXVlUmVzb3VyY2VOYW1lXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWNvZGVkZXBsb3k6cmVtb3ZlQWxhcm1zRnJvbURlcGxveW1lbnRHcm91cFwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1hcGlnYXRld2F5OmF1dGhvcml6ZXJDaGFuZ2VEZXBsb3ltZW50TG9naWNhbElkXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWVjMjpsYXVuY2hUZW1wbGF0ZURlZmF1bHRVc2VyRGF0YVwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1zZWNyZXRzbWFuYWdlcjp1c2VBdHRhY2hlZFNlY3JldFJlc291cmNlUG9saWN5Rm9yU2VjcmV0VGFyZ2V0QXR0YWNobWVudHNcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtcmVkc2hpZnQ6Y29sdW1uSWRcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3Mtc3RlcGZ1bmN0aW9ucy10YXNrczplbmFibGVFbXJTZXJ2aWNlUG9saWN5VjJcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtZWMyOnJlc3RyaWN0RGVmYXVsdFNlY3VyaXR5R3JvdXBcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtYXBpZ2F0ZXdheTpyZXF1ZXN0VmFsaWRhdG9yVW5pcXVlSWRcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3Mta21zOmFsaWFzTmFtZVJlZlwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1hdXRvc2NhbGluZzpnZW5lcmF0ZUxhdW5jaFRlbXBsYXRlSW5zdGVhZE9mTGF1bmNoQ29uZmlnXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvY29yZTppbmNsdWRlUHJlZml4SW5VbmlxdWVOYW1lR2VuZXJhdGlvblwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1lZnM6ZGVueUFub255bW91c0FjY2Vzc1wiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1vcGVuc2VhcmNoc2VydmljZTplbmFibGVPcGVuc2VhcmNoTXVsdGlBeldpdGhTdGFuZGJ5XCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWxhbWJkYS1ub2RlanM6dXNlTGF0ZXN0UnVudGltZVZlcnNpb25cIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtZWZzOm1vdW50VGFyZ2V0T3JkZXJJbnNlbnNpdGl2ZUxvZ2ljYWxJZFwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1yZHM6YXVyb3JhQ2x1c3RlckNoYW5nZVNjb3BlT2ZJbnN0YW5jZVBhcmFtZXRlckdyb3VwV2l0aEVhY2hQYXJhbWV0ZXJzXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWFwcHN5bmM6dXNlQXJuRm9yU291cmNlQXBpQXNzb2NpYXRpb25JZGVudGlmaWVyXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLXJkczpwcmV2ZW50UmVuZGVyaW5nRGVwcmVjYXRlZENyZWRlbnRpYWxzXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZS1hY3Rpb25zOnVzZU5ld0RlZmF1bHRCcmFuY2hGb3JDb2RlQ29tbWl0U291cmNlXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWNsb3Vkd2F0Y2gtYWN0aW9uczpjaGFuZ2VMYW1iZGFQZXJtaXNzaW9uTG9naWNhbElkRm9yTGFtYmRhQWN0aW9uXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZTpjcm9zc0FjY291bnRLZXlzRGVmYXVsdFZhbHVlVG9GYWxzZVwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmU6ZGVmYXVsdFBpcGVsaW5lVHlwZVRvVjJcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3Mta21zOnJlZHVjZUNyb3NzQWNjb3VudFJlZ2lvblBvbGljeVNjb3BlXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWVrczpub2RlZ3JvdXBOYW1lQXR0cmlidXRlXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWVjMjplYnNEZWZhdWx0R3AzVm9sdW1lXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWVjczpyZW1vdmVEZWZhdWx0RGVwbG95bWVudEFsYXJtXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvY3VzdG9tLXJlc291cmNlczpsb2dBcGlSZXNwb25zZURhdGFQcm9wZXJ0eVRydWVEZWZhdWx0XCI6IGZhbHNlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1zMzprZWVwTm90aWZpY2F0aW9uSW5JbXBvcnRlZEJ1Y2tldFwiOiBmYWxzZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtZWNzOnJlZHVjZUVjMkZhcmdhdGVDbG91ZFdhdGNoUGVybWlzc2lvbnNcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtZWMyOmVjMlN1bVRJbWVvdXRFbmFibGVkXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWFwcHN5bmM6YXBwU3luY0dyYXBoUUxBUElTY29wZUxhbWJkYVBlcm1pc3Npb25cIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtcmRzOnNldENvcnJlY3RWYWx1ZUZvckRhdGFiYXNlSW5zdGFuY2VSZWFkUmVwbGljYUluc3RhbmNlUmVzb3VyY2VJZFwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2NvcmU6Y2ZuSW5jbHVkZVJlamVjdENvbXBsZXhSZXNvdXJjZVVwZGF0ZUNyZWF0ZVBvbGljeUludHJpbnNpY3NcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtbGFtYmRhLW5vZGVqczpzZGtWM0V4Y2x1ZGVTbWl0aHlQYWNrYWdlc1wiOiB0cnVlXG4gICAgfVxufVxuYDtcblxuY29uc3QgZHVtbXlDb25maWc6IEluZnJhQ29uZmlnID0ge1xuICAgIHByb2plY3Q6IHtcbiAgICAgICAgbmFtZTogXCJwcm9qZWN0LW5hbWVcIixcbiAgICAgICAgc3RhZ2VzOiB7XG4gICAgICAgICAgICBkZXY6IHtcbiAgICAgICAgICAgICAgICBhY2NvdW50OiBcIjEyMzQ1Njc4OTAxMlwiLFxuICAgICAgICAgICAgICAgIHJlZ2lvbjogXCJ1cy1lYXN0LTFcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdGc6IHtcbiAgICAgICAgICAgICAgICBhY2NvdW50OiBcIjEyMzQ1Njc4OTAxMlwiLFxuICAgICAgICAgICAgICAgIHJlZ2lvbjogXCJ1cy1lYXN0LTFcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICB2cGM6IHtcbiAgICAgICAgbm9PZkF6czogMyxcbiAgICAgICAgY3JlYXRlTmF0R2F0ZXdheTogdHJ1ZSxcbiAgICAgICAgbm9PZk5hdEdhdGV3YXlzOiAxLFxuICAgIH0sXG4gICAgYXBwczogW1xuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiBcInNlcnZpY2UtbmFtZS0xXCIsXG4gICAgICAgICAgICBkb2NrZXJJbWFnZVBhdGg6IFwiLi9hcHBzL3NlcnZpY2UtbmFtZS0xXCIsXG4gICAgICAgICAgICBoZWFsdGhDaGVja0VuZHBvaW50OiBcIi9oZWFsdGhcIixcbiAgICAgICAgICAgIHBvcnQ6IDMwMDAsXG4gICAgICAgICAgICBjcHU6IDI1NixcbiAgICAgICAgICAgIG1lbW9yeTogNTEyLFxuICAgICAgICAgICAgbWluQ2FwYWNpdHk6IDEsXG4gICAgICAgICAgICBtYXhDYXBhY2l0eTogMixcbiAgICAgICAgICAgIHBhcmFtZXRlclN0b3JlU2VjcmV0czogW1wiUE9SVFwiLCBcIkRCX1BBU1NXT1JEXCJdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiBcInNlcnZpY2UtbmFtZS0yXCIsXG4gICAgICAgICAgICBkb2NrZXJJbWFnZVBhdGg6IFwiLi9cIixcbiAgICAgICAgICAgIGhlYWx0aENoZWNrRW5kcG9pbnQ6IFwiL2hlYWx0aFwiLFxuICAgICAgICAgICAgcG9ydDogMzAwMSxcbiAgICAgICAgICAgIGNwdTogMjU2LFxuICAgICAgICAgICAgbWVtb3J5OiA1MTIsXG4gICAgICAgICAgICBtaW5DYXBhY2l0eTogMixcbiAgICAgICAgICAgIG1heENhcGFjaXR5OiAxMCxcbiAgICAgICAgICAgIHBhcmFtZXRlclN0b3JlU2VjcmV0czogW1wiUE9SVFwiLCBcIkRCX1VSTFwiXSxcbiAgICAgICAgfSxcbiAgICBdLFxuICAgIHNlcnZpY2VzOiB7XG4gICAgICAgIHMzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYnVja2V0TmFtZTogXCJidWNrZXQtbmFtZS0xXCIsXG4gICAgICAgICAgICAgICAgcHVibGljOiB0cnVlLFxuICAgICAgICAgICAgICAgIHVzZWRCeTogW1wic2VydmljZS1uYW1lLTFcIl0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGJ1Y2tldE5hbWU6IFwiYnVja2V0LW5hbWUtMlwiLFxuICAgICAgICAgICAgICAgIHB1YmxpYzogZmFsc2UsXG4gICAgICAgICAgICAgICAgdXNlZEJ5OiBbXCJzZXJ2aWNlLW5hbWUtMVwiLCBcInNlcnZpY2UtbmFtZS0yXCJdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgc3FzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcXVldWVOYW1lOiBcInF1ZXVlLW5hbWUtMVwiLFxuICAgICAgICAgICAgICAgIGZpZm86IGZhbHNlLFxuICAgICAgICAgICAgICAgIHVzZWRCeTogW1wic2VydmljZS1uYW1lLTFcIl0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHF1ZXVlTmFtZTogXCJxdWV1ZS1uYW1lLTJcIixcbiAgICAgICAgICAgICAgICBmaWZvOiB0cnVlLFxuICAgICAgICAgICAgICAgIHVzZWRCeTogW1wic2VydmljZS1uYW1lLTJcIl0sXG4gICAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgIH1cbn1cblxuY29uc3QgY2hlY2tJZkNka0lzSW5zdGFsbGVkID0gKCkgPT4ge1xuICAgIGxvZy5pbmZvKFwiQ2hlY2tpbmcgaWYgQ0RLIGlzIGluc3RhbGxlZC4uLlwiKTtcbiAgICBjb25zdCBjZGtJbnN0YWxsZWQgPSBleGVjU3luYyhcIndoaWNoIGNka1wiKS50b1N0cmluZygpO1xuICAgIGlmICghY2RrSW5zdGFsbGVkKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDREsgaXMgbm90IGluc3RhbGxlZC4gUGxlYXNlIGluc3RhbGwgQ0RLIGJlZm9yZSBydW5uaW5nIHRoaXMgY29tbWFuZC5cIik7XG4gICAgICAgIC8vYXNrIHVzZXIgaWYgdGhleSB3YW50IHRvIGluc3RhbGwgQ0RLXG4gICAgICAgIGNvbnN0IGluc3RhbGxDZGsgPSBleGVjU3luYyhcInJlYWQgLXAgJ0RvIHlvdSB3YW50IHRvIGluc3RhbGwgQ0RLPyAoeS9uKTogJyBhbnN3ZXIgJiYgZWNobyAkYW5zd2VyXCIpLnRvU3RyaW5nKCk7XG4gICAgICAgIGlmIChpbnN0YWxsQ2RrID09PSBcInlcIikge1xuICAgICAgICAgICAgbG9nLmluZm8oXCJJbnN0YWxsaW5nIENESy4uLlwiKTtcbiAgICAgICAgICAgIGxvZy5pbmZvKFwiUnVubmluZzogc3VkbyBucG0gaW5zdGFsbCAtZyBhd3MtY2RrXCIpO1xuICAgICAgICAgICAgZXhlY1N5bmMoXCJzdWRvIG5wbSBpbnN0YWxsIC1nIGF3cy1jZGtcIiwgeyBzdGRpbzogXCJpbmhlcml0XCIgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXhpdGluZyB3aXRob3V0IGluc3RhbGxpbmcgY2RrLi4uXCIpO1xuICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGxvZy5zdWNjZXNzKFwiQ0RLIGlzIGluc3RhbGxlZC5cIik7XG59O1xuXG5jb25zdCBhZGRDZGtKc29uID0gKCkgPT4ge1xuICAgIGxvZy5pbmZvKFwiQ2hlY2tpbmcgaWYgY2RrLmpzb24gZmlsZSBleGlzdHMuLi5cIik7XG4gICAgY29uc3QgY2RrSnNvbkV4aXN0cyA9IGV4aXN0c1N5bmMoRklMRVMuQ0RLX0NPTkZJRyk7XG4gICAgaWYgKGNka0pzb25FeGlzdHMpIHtcbiAgICAgICAgbG9nLndhcm4oXCJjZGsuanNvbiBmaWxlIGFscmVhZHkgZXhpc3RzLlwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsb2cuaW5mbyhcIkFkZGluZyBjZGsuanNvbiBmaWxlLi4uXCIpO1xuICAgIGV4ZWNTeW5jKGBlY2hvICcke2Nka0pzb259JyA+ICR7RklMRVMuQ0RLX0NPTkZJR31gLCB7IGN3ZDogcHJvY2Vzcy5jd2QoKSB9KTtcbiAgICBsb2cuc3VjY2VzcyhcImNkay5qc29uIGZpbGUgYWRkZWQuXCIpO1xufTtcblxuY29uc3QgdXBkYXRlR2l0SWdub3JlID0gKCkgPT4ge1xuICAgIGxvZy5pbmZvKFwiQ2hlY2tpbmcgaWYgLmdpdGlnbm9yZSBmaWxlIGV4aXN0cy4uLlwiKTtcbiAgICBjb25zdCBnaXRJZ25vcmVFeGlzdHMgPSBleGlzdHNTeW5jKEZJTEVTLkdJVF9JR05PUkUpO1xuICAgIGlmICghZ2l0SWdub3JlRXhpc3RzKSB7XG4gICAgICAgIGxvZy53YXJuKFwiLmdpdGlnbm9yZSBmaWxlIGRvZXMgbm90IGV4aXN0LlwiKTtcbiAgICAgICAgd3JpdGVGaWxlU3luYyhGSUxFUy5HSVRfSUdOT1JFLCBcIi5jZGsuc3RhZ2luZ1xcbmNkay5vdXRcIik7XG4gICAgICAgIGxvZy5zdWNjZXNzKFwiQ3JlYXRlZCAuZ2l0aWdub3JlIGZpbGUuXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGxvZy5pbmZvKFwiVXBkYXRpbmcgLmdpdGlnbm9yZSBmaWxlLi4uXCIpO1xuICAgIGNvbnN0IGdpdElnbm9yZUNvbnRlbnQgPSBleGVjU3luYyhgY2F0ICR7RklMRVMuR0lUX0lHTk9SRX1gKS50b1N0cmluZygpO1xuICAgIGlmIChnaXRJZ25vcmVDb250ZW50LmluY2x1ZGVzKFwiLmNkay5zdGFnaW5nXCIpICYmIGdpdElnbm9yZUNvbnRlbnQuaW5jbHVkZXMoXCJjZGsub3V0XCIpKSB7XG4gICAgICAgIGxvZy53YXJuKFwiLmdpdGlnbm9yZSBmaWxlIGlzIGFscmVhZHkgdXBkYXRlZC5cIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgIWdpdElnbm9yZUNvbnRlbnQuaW5jbHVkZXMoXCIuY2RrLnN0YWdpbmdcIikgJiYgZXhlY1N5bmMoYGVjaG8gJy5jZGsuc3RhZ2luZycgPj4gJHtGSUxFUy5HSVRfSUdOT1JFfWApO1xuICAgICFnaXRJZ25vcmVDb250ZW50LmluY2x1ZGVzKFwiY2RrLm91dFwiKSAmJiBleGVjU3luYyhgZWNobyAnY2RrLm91dCcgPj4gJHtGSUxFUy5HSVRfSUdOT1JFfWApO1xuICAgIGxvZy5zdWNjZXNzKFwiVXBkYXRlZCAuZ2l0aWdub3JlIGZpbGUuXCIpO1xufTtcblxuY29uc3QgY3JlYXRlRHVtbXlDb25maWcgPSAoKSA9PiB7XG4gICAgY29uc3QgZmlsZU5hbWUgPSBGSUxFUy5JTkZSQV9DT05GSUc7XG4gICAgY29uc3QgZmlsZVBhdGggPSBqb2luKHByb2Nlc3MuY3dkKCksIGZpbGVOYW1lKTtcblxuICAgIGlmIChleGlzdHNTeW5jKGZpbGVQYXRoKSkge1xuICAgICAgICBsb2cud2FybihcIkZpbGUgYWxyZWFkeSBleGlzdHNcIik7XG4gICAgICAgIGxvZy53YXJuKFwiSWYgeW91IHdhbnQgdG8gY3JlYXRlIGEgbmV3IGZpbGUsIHBsZWFzZSBkZWxldGUgdGhlIGV4aXN0aW5nIGZpbGVcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB3cml0ZUZpbGVTeW5jKGZpbGVQYXRoLCBKU09OLnN0cmluZ2lmeShkdW1teUNvbmZpZywgbnVsbCwgNCkpO1xuXG4gICAgY29uc29sZS5sb2coXCJGaWxlIGNyZWF0ZWQgc3VjY2Vzc2Z1bGx5XCIpO1xufTtcblxuY29uc3QgaGVscGZ1bE1lc3NhZ2UgPSAoKSA9PiB7XG4gICAgbG9nLmluZm8oYFBsZWFzZSBydW4gbm93IGZvbGxvd2luZyBjb21tYW5kczpcbiAgICAgICAgMS4gbnB4IGNkayBib290c3RyYXAgLS1wcm9maWxlIDxwcm9maWxlLW5hbWU+IC0tcmVnaW9uIDxyZWdpb24tbmFtZT5cbiAgICAgICAgMi4gbnB4IGNkayBkZXBsb3kgLS1wcm9maWxlIDxwcm9maWxlLW5hbWU+IC0tcmVnaW9uIDxyZWdpb24tbmFtZT5cbiAgICBgKTtcblxufVxuXG5jb25zdCBpbml0Q2RrID0gKCkgPT4ge1xuICAgIC8vIGNoZWNrSWZDZGtJc0luc3RhbGxlZCgpO1xuICAgIGFkZENka0pzb24oKTtcbiAgICB1cGRhdGVHaXRJZ25vcmUoKTtcbiAgICBjcmVhdGVEdW1teUNvbmZpZygpO1xuICAgIGhlbHBmdWxNZXNzYWdlKCk7XG59O1xuXG5pbml0Q2RrKCk7XG4iXX0=