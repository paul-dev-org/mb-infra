#!/usr/bin/env node

import { execSync } from "node:child_process";
import { log } from "../utils/logger";
import { FILES } from "../conts/files";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { InfraConfig } from "../schemas/infra.config";

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

const dummyConfig: InfraConfig = {
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
}

const checkIfCdkIsInstalled = () => {
    log.info("Checking if CDK is installed...");
    const cdkInstalled = execSync("which cdk").toString();
    if (!cdkInstalled) {
        console.error("CDK is not installed. Please install CDK before running this command.");
        //ask user if they want to install CDK
        const installCdk = execSync("read -p 'Do you want to install CDK? (y/n): ' answer && echo $answer").toString();
        if (installCdk === "y") {
            log.info("Installing CDK...");
            log.info("Running: sudo npm install -g aws-cdk");
            execSync("sudo npm install -g aws-cdk", { stdio: "inherit" });
        } else {
            console.error("Exiting without installing cdk...");
            process.exit(1);
        }
    }
    log.success("CDK is installed.");
};

const addCdkJson = () => {
    log.info("Checking if cdk.json file exists...");
    const cdkJsonExists = existsSync(FILES.CDK_CONFIG);
    if (cdkJsonExists) {
        log.warn("cdk.json file already exists.");
        return;
    }
    log.info("Adding cdk.json file...");
    execSync(`echo '${cdkJson}' > ${FILES.CDK_CONFIG}`, { cwd: process.cwd() });
    log.success("cdk.json file added.");
};

const updateGitIgnore = () => {
    log.info("Checking if .gitignore file exists...");
    const gitIgnoreExists = existsSync(FILES.GIT_IGNORE);
    if (!gitIgnoreExists) {
        log.warn(".gitignore file does not exist.");
        writeFileSync(FILES.GIT_IGNORE, ".cdk.staging\ncdk.out");
        log.success("Created .gitignore file.");
        return;
    }
    log.info("Updating .gitignore file...");
    const gitIgnoreContent = execSync(`cat ${FILES.GIT_IGNORE}`).toString();
    if (gitIgnoreContent.includes(".cdk.staging") && gitIgnoreContent.includes("cdk.out")) {
        log.warn(".gitignore file is already updated.");
        return;
    }
    !gitIgnoreContent.includes(".cdk.staging") && execSync(`echo '.cdk.staging' >> ${FILES.GIT_IGNORE}`);
    !gitIgnoreContent.includes("cdk.out") && execSync(`echo 'cdk.out' >> ${FILES.GIT_IGNORE}`);
    log.success("Updated .gitignore file.");
};

const createDummyConfig = () => {
    const fileName = FILES.INFRA_CONFIG;
    const filePath = join(process.cwd(), fileName);

    if (existsSync(filePath)) {
        log.warn("File already exists");
        log.warn("If you want to create a new file, please delete the existing file");
        return;
    }

    writeFileSync(filePath, JSON.stringify(dummyConfig, null, 4));

    console.log("File created successfully");
};

const initCdkRepo = () => {
    execSync("mkdir infra", { stdio: "inherit" });
    execSync("cd infra && cdk init app --language typescript", { stdio: "inherit" });
    execSync("rm -rf ./infra/bin/infra.ts", { stdio: "inherit" });
    execSync("rm -rf lib/infra-stack.ts", { stdio: "inherit" });

    const infraFile = readFileSync(join(__dirname, "infra"))
    writeFileSync(process.cwd() + "/infra/bin/infra.ts", infraFile);

    const stackFile = readFileSync(join(__dirname, "stack"))
    writeFileSync(process.cwd() + "/infra/lib/infra-stack.ts", stackFile);
}

const helpfulMessage = () => {
    log.info(`Please run now following commands:
        1. npx cdk bootstrap --profile <profile-name> --region <region-name> --context stage=<stage-name>
        2. npx cdk deploy --profile <profile-name> --region <region-name> --context stage=<stage-name>
    `);

}

const initCdk = () => {
    // checkIfCdkIsInstalled();
    addCdkJson();
    updateGitIgnore();
    createDummyConfig();
    // initCdkRepo();
    helpfulMessage();
};

initCdk();
