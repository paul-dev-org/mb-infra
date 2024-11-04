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
    // project: {
    //     name: "project-name",
    //     stages: {
    //         dev: {
    //             account: "123456789012",
    //             region: "us-east-1",
    //         },
    //         stg: {
    //             account: "123456789012",
    //             region: "us-east-1",
    //         },
    //     },
    // },
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
const initCdkRepo = () => {
    (0, node_child_process_1.execSync)("mkdir infra", { stdio: "inherit" });
    (0, node_child_process_1.execSync)("cd infra && cdk init app --language typescript", { stdio: "inherit" });
    (0, node_child_process_1.execSync)("rm -rf bin/infra.ts", { stdio: "inherit" });
    (0, node_child_process_1.execSync)("rm -rf lib/infra-stack.ts", { stdio: "inherit" });
    const infraFile = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, "inra"));
    (0, fs_1.writeFileSync)(process.cwd() + "/infra/bin/infra.ts", infraFile);
    const stackFile = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, "stack"));
    (0, fs_1.writeFileSync)(process.cwd() + "/infra/lib/infra-stack.ts", stackFile);
};
const helpfulMessage = () => {
    logger_1.log.info(`Please run now following commands:
        1. npx cdk bootstrap --profile <profile-name> --region <region-name> --context stage=<stage-name>
        2. npx cdk deploy --profile <profile-name> --region <region-name> --context stage=<stage-name>
    `);
};
const initCdk = () => {
    // checkIfCdkIsInstalled();
    addCdkJson();
    updateGitIgnore();
    createDummyConfig();
    initCdkRepo();
    helpfulMessage();
};
initCdk();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mcmEtaW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZnJhLWluaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsMkRBQThDO0FBQzlDLDRDQUFzQztBQUN0QywwQ0FBdUM7QUFDdkMsMkJBQTZEO0FBQzdELCtCQUE0QjtBQUc1QixNQUFNLE9BQU8sR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQXlFZixDQUFDO0FBRUYsTUFBTSxXQUFXLEdBQWdCO0lBQzdCLGFBQWE7SUFDYiw0QkFBNEI7SUFDNUIsZ0JBQWdCO0lBQ2hCLGlCQUFpQjtJQUNqQix1Q0FBdUM7SUFDdkMsbUNBQW1DO0lBQ25DLGFBQWE7SUFDYixpQkFBaUI7SUFDakIsdUNBQXVDO0lBQ3ZDLG1DQUFtQztJQUNuQyxhQUFhO0lBQ2IsU0FBUztJQUNULEtBQUs7SUFDTCxHQUFHLEVBQUU7UUFDRCxPQUFPLEVBQUUsQ0FBQztRQUNWLGdCQUFnQixFQUFFLElBQUk7UUFDdEIsZUFBZSxFQUFFLENBQUM7S0FDckI7SUFDRCxJQUFJLEVBQUU7UUFDRjtZQUNJLElBQUksRUFBRSxnQkFBZ0I7WUFDdEIsZUFBZSxFQUFFLHVCQUF1QjtZQUN4QyxtQkFBbUIsRUFBRSxTQUFTO1lBQzlCLElBQUksRUFBRSxJQUFJO1lBQ1YsR0FBRyxFQUFFLEdBQUc7WUFDUixNQUFNLEVBQUUsR0FBRztZQUNYLFdBQVcsRUFBRSxDQUFDO1lBQ2QsV0FBVyxFQUFFLENBQUM7WUFDZCxxQkFBcUIsRUFBRSxDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUM7U0FDakQ7UUFDRDtZQUNJLElBQUksRUFBRSxnQkFBZ0I7WUFDdEIsZUFBZSxFQUFFLElBQUk7WUFDckIsbUJBQW1CLEVBQUUsU0FBUztZQUM5QixJQUFJLEVBQUUsSUFBSTtZQUNWLEdBQUcsRUFBRSxHQUFHO1lBQ1IsTUFBTSxFQUFFLEdB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TUFBTSxjQUFjLEdBQUcsR0FBRyxFQUFFO0lBQ3hCLFlBQUcsQ0FBQyxJQUFJLENBQUM7OztLQUdSLENBQUMsQ0FBQztBQUVQLENBQUMsQ0FBQTtBQUVELE1BQU0sT0FBTyxHQUFHLEdBQUcsRUFBRTtJQUNqQiwyQkFBMkI7SUFDM0IsVUFBVSxFQUFFLENBQUM7SUFDYixlQUFlLEVBQUUsQ0FBQztJQUNsQixpQkFBaUIsRUFBRSxDQUFDO0lBQ3BCLFdBQVcsRUFBRSxDQUFDO0lBQ2QsY0FBYyxFQUFFLENBQUM7QUFDckIsQ0FBQyxDQUFDO0FBRUYsT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5cbmltcG9ydCB7IGV4ZWNTeW5jIH0gZnJvbSBcIm5vZGU6Y2hpbGRfcHJvY2Vzc1wiO1xuaW1wb3J0IHsgbG9nIH0gZnJvbSBcIi4uL3V0aWxzL2xvZ2dlclwiO1xuaW1wb3J0IHsgRklMRVMgfSBmcm9tIFwiLi4vY29udHMvZmlsZXNcIjtcbmltcG9ydCB7IGV4aXN0c1N5bmMsIHJlYWRGaWxlU3luYywgd3JpdGVGaWxlU3luYyB9IGZyb20gXCJmc1wiO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBJbmZyYUNvbmZpZyB9IGZyb20gXCIuLi9zY2hlbWFzL2luZnJhLmNvbmZpZ1wiO1xuXG5jb25zdCBjZGtKc29uID0gYHtcbiAgICBcImFwcFwiOiBcIm5weCBtYi1pbmZyYVwiLFxuICAgIFwid2F0Y2hcIjoge1xuICAgICAgICBcImluY2x1ZGVcIjogW1wiKipcIl0sXG4gICAgICAgIFwiZXhjbHVkZVwiOiBbXG4gICAgICAgICAgICBcIlJFQURNRS5tZFwiLFxuICAgICAgICAgICAgXCJjZGsqLmpzb25cIixcbiAgICAgICAgICAgIFwiKiovKi5kLnRzXCIsXG4gICAgICAgICAgICBcIioqLyouanNcIixcbiAgICAgICAgICAgIFwidHNjb25maWcuanNvblwiLFxuICAgICAgICAgICAgXCJwYWNrYWdlKi5qc29uXCIsXG4gICAgICAgICAgICBcInlhcm4ubG9ja1wiLFxuICAgICAgICAgICAgXCJub2RlX21vZHVsZXNcIixcbiAgICAgICAgICAgIFwidGVzdFwiXG4gICAgICAgIF1cbiAgICB9LFxuICAgIFwiY29udGV4dFwiOiB7XG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWxhbWJkYTpyZWNvZ25pemVMYXllclZlcnNpb25cIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9jb3JlOmNoZWNrU2VjcmV0VXNhZ2VcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9jb3JlOnRhcmdldC1wYXJ0aXRpb25zXCI6IFtcImF3c1wiLCBcImF3cy1jblwiXSxcbiAgICAgICAgXCJAYXdzLWNkay1jb250YWluZXJzL2Vjcy1zZXJ2aWNlLWV4dGVuc2lvbnM6ZW5hYmxlRGVmYXVsdExvZ0RyaXZlclwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1lYzI6dW5pcXVlSW1kc3YyVGVtcGxhdGVOYW1lXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWVjczphcm5Gb3JtYXRJbmNsdWRlc0NsdXN0ZXJOYW1lXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWlhbTptaW5pbWl6ZVBvbGljaWVzXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvY29yZTp2YWxpZGF0ZVNuYXBzaG90UmVtb3ZhbFBvbGljeVwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmU6Y3Jvc3NBY2NvdW50S2V5QWxpYXNTdGFja1NhZmVSZXNvdXJjZU5hbWVcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtczM6Y3JlYXRlRGVmYXVsdExvZ2dpbmdQb2xpY3lcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3Mtc25zLXN1YnNjcmlwdGlvbnM6cmVzdHJpY3RTcXNEZXNjcnlwdGlvblwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1hcGlnYXRld2F5OmRpc2FibGVDbG91ZFdhdGNoUm9sZVwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2NvcmU6ZW5hYmxlUGFydGl0aW9uTGl0ZXJhbHNcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtZXZlbnRzOmV2ZW50c1RhcmdldFF1ZXVlU2FtZUFjY291bnRcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtZWNzOmRpc2FibGVFeHBsaWNpdERlcGxveW1lbnRDb250cm9sbGVyRm9yQ2lyY3VpdEJyZWFrZXJcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtaWFtOmltcG9ydGVkUm9sZVN0YWNrU2FmZURlZmF1bHRQb2xpY3lOYW1lXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLXMzOnNlcnZlckFjY2Vzc0xvZ3NVc2VCdWNrZXRQb2xpY3lcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3Mtcm91dGU1My1wYXR0ZXJzOnVzZUNlcnRpZmljYXRlXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvY3VzdG9tcmVzb3VyY2VzOmluc3RhbGxMYXRlc3RBd3NTZGtEZWZhdWx0XCI6IGZhbHNlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1yZHM6ZGF0YWJhc2VQcm94eVVuaXF1ZVJlc291cmNlTmFtZVwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1jb2RlZGVwbG95OnJlbW92ZUFsYXJtc0Zyb21EZXBsb3ltZW50R3JvdXBcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtYXBpZ2F0ZXdheTphdXRob3JpemVyQ2hhbmdlRGVwbG95bWVudExvZ2ljYWxJZFwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1lYzI6bGF1bmNoVGVtcGxhdGVEZWZhdWx0VXNlckRhdGFcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3Mtc2VjcmV0c21hbmFnZXI6dXNlQXR0YWNoZWRTZWNyZXRSZXNvdXJjZVBvbGljeUZvclNlY3JldFRhcmdldEF0dGFjaG1lbnRzXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLXJlZHNoaWZ0OmNvbHVtbklkXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLXN0ZXBmdW5jdGlvbnMtdGFza3M6ZW5hYmxlRW1yU2VydmljZVBvbGljeVYyXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWVjMjpyZXN0cmljdERlZmF1bHRTZWN1cml0eUdyb3VwXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXk6cmVxdWVzdFZhbGlkYXRvclVuaXF1ZUlkXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWttczphbGlhc05hbWVSZWZcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtYXV0b3NjYWxpbmc6Z2VuZXJhdGVMYXVuY2hUZW1wbGF0ZUluc3RlYWRPZkxhdW5jaENvbmZpZ1wiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2NvcmU6aW5jbHVkZVByZWZpeEluVW5pcXVlTmFtZUdlbmVyYXRpb25cIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtZWZzOmRlbnlBbm9ueW1vdXNBY2Nlc3NcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3Mtb3BlbnNlYXJjaHNlcnZpY2U6ZW5hYmxlT3BlbnNlYXJjaE11bHRpQXpXaXRoU3RhbmRieVwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1sYW1iZGEtbm9kZWpzOnVzZUxhdGVzdFJ1bnRpbWVWZXJzaW9uXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWVmczptb3VudFRhcmdldE9yZGVySW5zZW5zaXRpdmVMb2dpY2FsSWRcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtcmRzOmF1cm9yYUNsdXN0ZXJDaGFuZ2VTY29wZU9mSW5zdGFuY2VQYXJhbWV0ZXJHcm91cFdpdGhFYWNoUGFyYW1ldGVyc1wiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1hcHBzeW5jOnVzZUFybkZvclNvdXJjZUFwaUFzc29jaWF0aW9uSWRlbnRpZmllclwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1yZHM6cHJldmVudFJlbmRlcmluZ0RlcHJlY2F0ZWRDcmVkZW50aWFsc1wiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUtYWN0aW9uczp1c2VOZXdEZWZhdWx0QnJhbmNoRm9yQ29kZUNvbW1pdFNvdXJjZVwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1jbG91ZHdhdGNoLWFjdGlvbnM6Y2hhbmdlTGFtYmRhUGVybWlzc2lvbkxvZ2ljYWxJZEZvckxhbWJkYUFjdGlvblwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmU6Y3Jvc3NBY2NvdW50S2V5c0RlZmF1bHRWYWx1ZVRvRmFsc2VcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lOmRlZmF1bHRQaXBlbGluZVR5cGVUb1YyXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWttczpyZWR1Y2VDcm9zc0FjY291bnRSZWdpb25Qb2xpY3lTY29wZVwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1la3M6bm9kZWdyb3VwTmFtZUF0dHJpYnV0ZVwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1lYzI6ZWJzRGVmYXVsdEdwM1ZvbHVtZVwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1lY3M6cmVtb3ZlRGVmYXVsdERlcGxveW1lbnRBbGFybVwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2N1c3RvbS1yZXNvdXJjZXM6bG9nQXBpUmVzcG9uc2VEYXRhUHJvcGVydHlUcnVlRGVmYXVsdFwiOiBmYWxzZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtczM6a2VlcE5vdGlmaWNhdGlvbkluSW1wb3J0ZWRCdWNrZXRcIjogZmFsc2UsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWVjczpyZWR1Y2VFYzJGYXJnYXRlQ2xvdWRXYXRjaFBlcm1pc3Npb25zXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWVjMjplYzJTdW1USW1lb3V0RW5hYmxlZFwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1hcHBzeW5jOmFwcFN5bmNHcmFwaFFMQVBJU2NvcGVMYW1iZGFQZXJtaXNzaW9uXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLXJkczpzZXRDb3JyZWN0VmFsdWVGb3JEYXRhYmFzZUluc3RhbmNlUmVhZFJlcGxpY2FJbnN0YW5jZVJlc291cmNlSWRcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9jb3JlOmNmbkluY2x1ZGVSZWplY3RDb21wbGV4UmVzb3VyY2VVcGRhdGVDcmVhdGVQb2xpY3lJbnRyaW5zaWNzXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWxhbWJkYS1ub2RlanM6c2RrVjNFeGNsdWRlU21pdGh5UGFja2FnZXNcIjogdHJ1ZVxuICAgIH1cbn1cbmA7XG5cbmNvbnN0IGR1bW15Q29uZmlnOiBJbmZyYUNvbmZpZyA9IHtcbiAgICAvLyBwcm9qZWN0OiB7XG4gICAgLy8gICAgIG5hbWU6IFwicHJvamVjdC1uYW1lXCIsXG4gICAgLy8gICAgIHN0YWdlczoge1xuICAgIC8vICAgICAgICAgZGV2OiB7XG4gICAgLy8gICAgICAgICAgICAgYWNjb3VudDogXCIxMjM0NTY3ODkwMTJcIixcbiAgICAvLyAgICAgICAgICAgICByZWdpb246IFwidXMtZWFzdC0xXCIsXG4gICAgLy8gICAgICAgICB9LFxuICAgIC8vICAgICAgICAgc3RnOiB7XG4gICAgLy8gICAgICAgICAgICAgYWNjb3VudDogXCIxMjM0NTY3ODkwMTJcIixcbiAgICAvLyAgICAgICAgICAgICByZWdpb246IFwidXMtZWFzdC0xXCIsXG4gICAgLy8gICAgICAgICB9LFxuICAgIC8vICAgICB9LFxuICAgIC8vIH0sXG4gICAgdnBjOiB7XG4gICAgICAgIG5vT2ZBenM6IDMsXG4gICAgICAgIGNyZWF0ZU5hdEdhdGV3YXk6IHRydWUsXG4gICAgICAgIG5vT2ZOYXRHYXRld2F5czogMSxcbiAgICB9LFxuICAgIGFwcHM6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogXCJzZXJ2aWNlLW5hbWUtMVwiLFxuICAgICAgICAgICAgZG9ja2VySW1hZ2VQYXRoOiBcIi4vYXBwcy9zZXJ2aWNlLW5hbWUtMVwiLFxuICAgICAgICAgICAgaGVhbHRoQ2hlY2tFbmRwb2ludDogXCIvaGVhbHRoXCIsXG4gICAgICAgICAgICBwb3J0OiAzMDAwLFxuICAgICAgICAgICAgY3B1OiAyNTYsXG4gICAgICAgICAgICBtZW1vcnk6IDUxMixcbiAgICAgICAgICAgIG1pbkNhcGFjaXR5OiAxLFxuICAgICAgICAgICAgbWF4Q2FwYWNpdHk6IDIsXG4gICAgICAgICAgICBwYXJhbWV0ZXJTdG9yZVNlY3JldHM6IFtcIlBPUlRcIiwgXCJEQl9QQVNTV09SRFwiXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogXCJzZXJ2aWNlLW5hbWUtMlwiLFxuICAgICAgICAgICAgZG9ja2VySW1hZ2VQYXRoOiBcIi4vXCIsXG4gICAgICAgICAgICBoZWFsdGhDaGVja0VuZHBvaW50OiBcIi9oZWFsdGhcIixcbiAgICAgICAgICAgIHBvcnQ6IDMwMDEsXG4gICAgICAgICAgICBjcHU6IDI1NixcbiAgICAgICAgICAgIG1lbW9yeTogNTEyLFxuICAgICAgICAgICAgbWluQ2FwYWNpdHk6IDIsXG4gICAgICAgICAgICBtYXhDYXBhY2l0eTogMTAsXG4gICAgICAgICAgICBwYXJhbWV0ZXJTdG9yZVNlY3JldHM6IFtcIlBPUlRcIiwgXCJEQl9VUkxcIl0sXG4gICAgICAgIH0sXG4gICAgXSxcbiAgICBzZXJ2aWNlczoge1xuICAgICAgICBzMzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGJ1Y2tldE5hbWU6IFwiYnVja2V0LW5hbWUtMVwiLFxuICAgICAgICAgICAgICAgIHB1YmxpYzogdHJ1ZSxcbiAgICAgICAgICAgICAgICB1c2VkQnk6IFtcInNlcnZpY2UtbmFtZS0xXCJdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBidWNrZXROYW1lOiBcImJ1Y2tldC1uYW1lLTJcIixcbiAgICAgICAgICAgICAgICBwdWJsaWM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHVzZWRCeTogW1wic2VydmljZS1uYW1lLTFcIiwgXCJzZXJ2aWNlLW5hbWUtMlwiXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHNxczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHF1ZXVlTmFtZTogXCJxdWV1ZS1uYW1lLTFcIixcbiAgICAgICAgICAgICAgICBmaWZvOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB1c2VkQnk6IFtcInNlcnZpY2UtbmFtZS0xXCJdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBxdWV1ZU5hbWU6IFwicXVldWUtbmFtZS0yXCIsXG4gICAgICAgICAgICAgICAgZmlmbzogdHJ1ZSxcbiAgICAgICAgICAgICAgICB1c2VkQnk6IFtcInNlcnZpY2UtbmFtZS0yXCJdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICB9XG59XG5cbmNvbnN0IGNoZWNrSWZDZGtJc0luc3RhbGxlZCA9ICgpID0+IHtcbiAgICBsb2cuaW5mbyhcIkNoZWNraW5nIGlmIENESyBpcyBpbnN0YWxsZWQuLi5cIik7XG4gICAgY29uc3QgY2RrSW5zdGFsbGVkID0gZXhlY1N5bmMoXCJ3aGljaCBjZGtcIikudG9TdHJpbmcoKTtcbiAgICBpZiAoIWNka0luc3RhbGxlZCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiQ0RLIGlzIG5vdCBpbnN0YWxsZWQuIFBsZWFzZSBpbnN0YWxsIENESyBiZWZvcmUgcnVubmluZyB0aGlzIGNvbW1hbmQuXCIpO1xuICAgICAgICAvL2FzayB1c2VyIGlmIHRoZXkgd2FudCB0byBpbnN0YWxsIENES1xuICAgICAgICBjb25zdCBpbnN0YWxsQ2RrID0gZXhlY1N5bmMoXCJyZWFkIC1wICdEbyB5b3Ugd2FudCB0byBpbnN0YWxsIENESz8gKHkvbik6ICcgYW5zd2VyICYmIGVjaG8gJGFuc3dlclwiKS50b1N0cmluZygpO1xuICAgICAgICBpZiAoaW5zdGFsbENkayA9PT0gXCJ5XCIpIHtcbiAgICAgICAgICAgIGxvZy5pbmZvKFwiSW5zdGFsbGluZyBDREsuLi5cIik7XG4gICAgICAgICAgICBsb2cuaW5mbyhcIlJ1bm5pbmc6IHN1ZG8gbnBtIGluc3RhbGwgLWcgYXdzLWNka1wiKTtcbiAgICAgICAgICAgIGV4ZWNTeW5jKFwic3VkbyBucG0gaW5zdGFsbCAtZyBhd3MtY2RrXCIsIHsgc3RkaW86IFwiaW5oZXJpdFwiIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkV4aXRpbmcgd2l0aG91dCBpbnN0YWxsaW5nIGNkay4uLlwiKTtcbiAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBsb2cuc3VjY2VzcyhcIkNESyBpcyBpbnN0YWxsZWQuXCIpO1xufTtcblxuY29uc3QgYWRkQ2RrSnNvbiA9ICgpID0+IHtcbiAgICBsb2cuaW5mbyhcIkNoZWNraW5nIGlmIGNkay5qc29uIGZpbGUgZXhpc3RzLi4uXCIpO1xuICAgIGNvbnN0IGNka0pzb25FeGlzdHMgPSBleGlzdHNTeW5jKEZJTEVTLkNES19DT05GSUcpO1xuICAgIGlmIChjZGtKc29uRXhpc3RzKSB7XG4gICAgICAgIGxvZy53YXJuKFwiY2RrLmpzb24gZmlsZSBhbHJlYWR5IGV4aXN0cy5cIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbG9nLmluZm8oXCJBZGRpbmcgY2RrLmpzb24gZmlsZS4uLlwiKTtcbiAgICBleGVjU3luYyhgZWNobyAnJHtjZGtKc29ufScgPiAke0ZJTEVTLkNES19DT05GSUd9YCwgeyBjd2Q6IHByb2Nlc3MuY3dkKCkgfSk7XG4gICAgbG9nLnN1Y2Nlc3MoXCJjZGsuanNvbiBmaWxlIGFkZGVkLlwiKTtcbn07XG5cbmNvbnN0IHVwZGF0ZUdpdElnbm9yZSA9ICgpID0+IHtcbiAgICBsb2cuaW5mbyhcIkNoZWNraW5nIGlmIC5naXRpZ25vcmUgZmlsZSBleGlzdHMuLi5cIik7XG4gICAgY29uc3QgZ2l0SWdub3JlRXhpc3RzID0gZXhpc3RzU3luYyhGSUxFUy5HSVRfSUdOT1JFKTtcbiAgICBpZiAoIWdpdElnbm9yZUV4aXN0cykge1xuICAgICAgICBsb2cud2FybihcIi5naXRpZ25vcmUgZmlsZSBkb2VzIG5vdCBleGlzdC5cIik7XG4gICAgICAgIHdyaXRlRmlsZVN5bmMoRklMRVMuR0lUX0lHTk9SRSwgXCIuY2RrLnN0YWdpbmdcXG5jZGsub3V0XCIpO1xuICAgICAgICBsb2cuc3VjY2VzcyhcIkNyZWF0ZWQgLmdpdGlnbm9yZSBmaWxlLlwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsb2cuaW5mbyhcIlVwZGF0aW5nIC5naXRpZ25vcmUgZmlsZS4uLlwiKTtcbiAgICBjb25zdCBnaXRJZ25vcmVDb250ZW50ID0gZXhlY1N5bmMoYGNhdCAke0ZJTEVTLkdJVF9JR05PUkV9YCkudG9TdHJpbmcoKTtcbiAgICBpZiAoZ2l0SWdub3JlQ29udGVudC5pbmNsdWRlcyhcIi5jZGsuc3RhZ2luZ1wiKSAmJiBnaXRJZ25vcmVDb250ZW50LmluY2x1ZGVzKFwiY2RrLm91dFwiKSkge1xuICAgICAgICBsb2cud2FybihcIi5naXRpZ25vcmUgZmlsZSBpcyBhbHJlYWR5IHVwZGF0ZWQuXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgICFnaXRJZ25vcmVDb250ZW50LmluY2x1ZGVzKFwiLmNkay5zdGFnaW5nXCIpICYmIGV4ZWNTeW5jKGBlY2hvICcuY2RrLnN0YWdpbmcnID4+ICR7RklMRVMuR0lUX0lHTk9SRX1gKTtcbiAgICAhZ2l0SWdub3JlQ29udGVudC5pbmNsdWRlcyhcImNkay5vdXRcIikgJiYgZXhlY1N5bmMoYGVjaG8gJ2Nkay5vdXQnID4+ICR7RklMRVMuR0lUX0lHTk9SRX1gKTtcbiAgICBsb2cuc3VjY2VzcyhcIlVwZGF0ZWQgLmdpdGlnbm9yZSBmaWxlLlwiKTtcbn07XG5cbmNvbnN0IGNyZWF0ZUR1bW15Q29uZmlnID0gKCkgPT4ge1xuICAgIGNvbnN0IGZpbGVOYW1lID0gRklMRVMuSU5GUkFfQ09ORklHO1xuICAgIGNvbnN0IGZpbGVQYXRoID0gam9pbihwcm9jZXNzLmN3ZCgpLCBmaWxlTmFtZSk7XG5cbiAgICBpZiAoZXhpc3RzU3luYyhmaWxlUGF0aCkpIHtcbiAgICAgICAgbG9nLndhcm4oXCJGaWxlIGFscmVhZHkgZXhpc3RzXCIpO1xuICAgICAgICBsb2cud2FybihcIklmIHlvdSB3YW50IHRvIGNyZWF0ZSBhIG5ldyBmaWxlLCBwbGVhc2UgZGVsZXRlIHRoZSBleGlzdGluZyBmaWxlXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgd3JpdGVGaWxlU3luYyhmaWxlUGF0aCwgSlNPTi5zdHJpbmdpZnkoZHVtbXlDb25maWcsIG51bGwsIDQpKTtcblxuICAgIGNvbnNvbGUubG9nKFwiRmlsZSBjcmVhdGVkIHN1Y2Nlc3NmdWxseVwiKTtcbn07XG5cbmNvbnN0IGluaXRDZGtSZXBvID0gKCkgPT4ge1xuICAgIGV4ZWNTeW5jKFwibWtkaXIgaW5mcmFcIiwgeyBzdGRpbzogXCJpbmhlcml0XCIgfSk7XG4gICAgZXhlY1N5bmMoXCJjZCBpbmZyYSAmJiBjZGsgaW5pdCBhcHAgLS1sYW5ndWFnZSB0eXBlc2NyaXB0XCIsIHsgc3RkaW86IFwiaW5oZXJpdFwiIH0pO1xuICAgIGV4ZWNTeW5jKFwicm0gLXJmIGJpbi9pbmZyYS50c1wiLCB7IHN0ZGlvOiBcImluaGVyaXRcIiB9KTtcbiAgICBleGVjU3luYyhcInJtIC1yZiBsaWIvaW5mcmEtc3RhY2sudHNcIiwgeyBzdGRpbzogXCJpbmhlcml0XCIgfSk7XG5cbiAgICBjb25zdCBpbmZyYUZpbGUgPSByZWFkRmlsZVN5bmMoam9pbihfX2Rpcm5hbWUsIFwiaW5yYVwiKSlcbiAgICB3cml0ZUZpbGVTeW5jKHByb2Nlc3MuY3dkKCkgKyBcIi9pbmZyYS9iaW4vaW5mcmEudHNcIiwgaW5mcmFGaWxlKTtcblxuICAgIGNvbnN0IHN0YWNrRmlsZSA9IHJlYWRGaWxlU3luYyhqb2luKF9fZGlybmFtZSwgXCJzdGFja1wiKSlcbiAgICB3cml0ZUZpbGVTeW5jKHByb2Nlc3MuY3dkKCkgKyBcIi9pbmZyYS9saWIvaW5mcmEtc3RhY2sudHNcIiwgc3RhY2tGaWxlKTtcbn1cblxuY29uc3QgaGVscGZ1bE1lc3NhZ2UgPSAoKSA9PiB7XG4gICAgbG9nLmluZm8oYFBsZWFzZSBydW4gbm93IGZvbGxvd2luZyBjb21tYW5kczpcbiAgICAgICAgMS4gbnB4IGNkayBib290c3RyYXAgLS1wcm9maWxlIDxwcm9maWxlLW5hbWU+IC0tcmVnaW9uIDxyZWdpb24tbmFtZT4gLS1jb250ZXh0IHN0YWdlPTxzdGFnZS1uYW1lPlxuICAgICAgICAyLiBucHggY2RrIGRlcGxveSAtLXByb2ZpbGUgPHByb2ZpbGUtbmFtZT4gLS1yZWdpb24gPHJlZ2lvbi1uYW1lPiAtLWNvbnRleHQgc3RhZ2U9PHN0YWdlLW5hbWU+XG4gICAgYCk7XG5cbn1cblxuY29uc3QgaW5pdENkayA9ICgpID0+IHtcbiAgICAvLyBjaGVja0lmQ2RrSXNJbnN0YWxsZWQoKTtcbiAgICBhZGRDZGtKc29uKCk7XG4gICAgdXBkYXRlR2l0SWdub3JlKCk7XG4gICAgY3JlYXRlRHVtbXlDb25maWcoKTtcbiAgICBpbml0Q2RrUmVwbygpO1xuICAgIGhlbHBmdWxNZXNzYWdlKCk7XG59O1xuXG5pbml0Q2RrKCk7XG4iXX0=