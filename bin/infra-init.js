#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_child_process_1 = require("node:child_process");
const logger_1 = require("../utils/logger");
const files_1 = require("../conts/files");
const fs_1 = require("fs");
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
    helpfulMessage();
};
initCdk();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mcmEtaW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZnJhLWluaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsMkRBQThDO0FBQzlDLDRDQUFzQztBQUN0QywwQ0FBdUM7QUFDdkMsMkJBQStDO0FBRS9DLE1BQU0sT0FBTyxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBeUVmLENBQUM7QUFFRixNQUFNLHFCQUFxQixHQUFHLEdBQUcsRUFBRTtJQUMvQixZQUFHLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7SUFDNUMsTUFBTSxZQUFZLEdBQUcsSUFBQSw2QkFBUSxFQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3RELElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNoQixPQUFPLENBQUMsS0FBSyxDQUFDLHVFQUF1RSxDQUFDLENBQUM7UUFDdkYsc0NBQXNDO1FBQ3RDLE1BQU0sVUFBVSxHQUFHLElBQUEsNkJBQVEsRUFBQyxzRUFBc0UsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQy9HLElBQUksVUFBVSxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ3JCLFlBQUcsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUM5QixZQUFHLENBQUMsSUFBSSxDQUFDLHNDQUFzQyxDQUFDLENBQUM7WUFDakQsSUFBQSw2QkFBUSxFQUFDLDZCQUE2QixFQUFFLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFDbEUsQ0FBQzthQUFNLENBQUM7WUFDSixPQUFPLENBQUMsS0FBSyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7WUFDbkQsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQixDQUFDO0lBQ0wsQ0FBQztJQUNELFlBQUcsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUNyQyxDQUFDLENBQUM7QUFFRixNQUFNLFVBQVUsR0FBRyxHQUFHLEVBQUU7SUFDcEIsWUFBRyxDQUFDLElBQUksQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO0lBQ2hELE1BQU0sYUFBYSxHQUFHLElBQUEsZUFBVSxFQUFDLGFBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNuRCxJQUFJLGFBQWEsRUFBRSxDQUFDO1FBQ2hCLFlBQUcsQ0FBQyxJQUFJLENBQUMsK0JBQStCLENBQUMsQ0FBQztRQUMxQyxPQUFPO0lBQ1gsQ0FBQztJQUNELFlBQUcsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQztJQUNwQyxJQUFBLDZCQUFRLEVBQUMsU0FBUyxPQUFPLE9BQU8sYUFBSyxDQUFDLFVBQVUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDNUUsWUFBRyxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ3hDLENBQUMsQ0FBQztBQUVGLE1BQU0sZUFBZSxHQUFHLEdBQUcsRUFBRTtJQUN6QixZQUFHLENBQUMsSUFBSSxDQUFDLHVDQUF1QyxDQUFDLENBQUM7SUFDbEQsTUFBTSxlQUFlLEdBQUcsSUFBQSxlQUFVLEVBQUMsYUFBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3JELElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUNuQixZQUFHLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7UUFDNUMsSUFBQSxrQkFBYSxFQUFDLGFBQUssQ0FBQyxVQUFVLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztRQUN6RCxZQUFHLENBQUMsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUM7UUFDeEMsT0FBTztJQUNYLENBQUM7SUFDRCxZQUFHLENBQUMsSUFBSSxDQUFDLDZCQUE2QixDQUFDLENBQUM7SUFDeEMsTUFBTSxnQkFBZ0IsR0FBRyxJQUFBLDZCQUFRLEVBQUMsT0FBTyxhQUFLLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN4RSxJQUFJLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQztRQUNwRixZQUFHLENBQUMsSUFBSSxDQUFDLHFDQUFxQyxDQUFDLENBQUM7UUFDaEQsT0FBTztJQUNYLENBQUM7SUFDRCxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxJQUFBLDZCQUFRLEVBQUMsMEJBQTBCLGFBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO0lBQ3JHLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUEsNkJBQVEsRUFBQyxxQkFBcUIsYUFBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7SUFDM0YsWUFBRyxDQUFDLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBQzVDLENBQUMsQ0FBQztBQUVGLE1BQU0sY0FBYyxHQUFHLEdBQUcsRUFBRTtJQUN4QixZQUFHLENBQUMsSUFBSSxDQUFDOzs7S0FHUixDQUFDLENBQUM7QUFFUCxDQUFDLENBQUE7QUFFRCxNQUFNLE9BQU8sR0FBRyxHQUFHLEVBQUU7SUFDakIsMkJBQTJCO0lBQzNCLFVBQVUsRUFBRSxDQUFDO0lBQ2IsZUFBZSxFQUFFLENBQUM7SUFDbEIsY0FBYyxFQUFFLENBQUM7QUFDckIsQ0FBQyxDQUFDO0FBRUYsT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5cbmltcG9ydCB7IGV4ZWNTeW5jIH0gZnJvbSBcIm5vZGU6Y2hpbGRfcHJvY2Vzc1wiO1xuaW1wb3J0IHsgbG9nIH0gZnJvbSBcIi4uL3V0aWxzL2xvZ2dlclwiO1xuaW1wb3J0IHsgRklMRVMgfSBmcm9tIFwiLi4vY29udHMvZmlsZXNcIjtcbmltcG9ydCB7IGV4aXN0c1N5bmMsIHdyaXRlRmlsZVN5bmMgfSBmcm9tIFwiZnNcIjtcblxuY29uc3QgY2RrSnNvbiA9IGB7XG4gICAgXCJhcHBcIjogXCJucHggbWItaW5mcmFcIixcbiAgICBcIndhdGNoXCI6IHtcbiAgICAgICAgXCJpbmNsdWRlXCI6IFtcIioqXCJdLFxuICAgICAgICBcImV4Y2x1ZGVcIjogW1xuICAgICAgICAgICAgXCJSRUFETUUubWRcIixcbiAgICAgICAgICAgIFwiY2RrKi5qc29uXCIsXG4gICAgICAgICAgICBcIioqLyouZC50c1wiLFxuICAgICAgICAgICAgXCIqKi8qLmpzXCIsXG4gICAgICAgICAgICBcInRzY29uZmlnLmpzb25cIixcbiAgICAgICAgICAgIFwicGFja2FnZSouanNvblwiLFxuICAgICAgICAgICAgXCJ5YXJuLmxvY2tcIixcbiAgICAgICAgICAgIFwibm9kZV9tb2R1bGVzXCIsXG4gICAgICAgICAgICBcInRlc3RcIlxuICAgICAgICBdXG4gICAgfSxcbiAgICBcImNvbnRleHRcIjoge1xuICAgICAgICBcIkBhd3MtY2RrL2F3cy1sYW1iZGE6cmVjb2duaXplTGF5ZXJWZXJzaW9uXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvY29yZTpjaGVja1NlY3JldFVzYWdlXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvY29yZTp0YXJnZXQtcGFydGl0aW9uc1wiOiBbXCJhd3NcIiwgXCJhd3MtY25cIl0sXG4gICAgICAgIFwiQGF3cy1jZGstY29udGFpbmVycy9lY3Mtc2VydmljZS1leHRlbnNpb25zOmVuYWJsZURlZmF1bHRMb2dEcml2ZXJcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtZWMyOnVuaXF1ZUltZHN2MlRlbXBsYXRlTmFtZVwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1lY3M6YXJuRm9ybWF0SW5jbHVkZXNDbHVzdGVyTmFtZVwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1pYW06bWluaW1pemVQb2xpY2llc1wiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2NvcmU6dmFsaWRhdGVTbmFwc2hvdFJlbW92YWxQb2xpY3lcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lOmNyb3NzQWNjb3VudEtleUFsaWFzU3RhY2tTYWZlUmVzb3VyY2VOYW1lXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLXMzOmNyZWF0ZURlZmF1bHRMb2dnaW5nUG9saWN5XCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLXNucy1zdWJzY3JpcHRpb25zOnJlc3RyaWN0U3FzRGVzY3J5cHRpb25cIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtYXBpZ2F0ZXdheTpkaXNhYmxlQ2xvdWRXYXRjaFJvbGVcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9jb3JlOmVuYWJsZVBhcnRpdGlvbkxpdGVyYWxzXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWV2ZW50czpldmVudHNUYXJnZXRRdWV1ZVNhbWVBY2NvdW50XCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWVjczpkaXNhYmxlRXhwbGljaXREZXBsb3ltZW50Q29udHJvbGxlckZvckNpcmN1aXRCcmVha2VyXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWlhbTppbXBvcnRlZFJvbGVTdGFja1NhZmVEZWZhdWx0UG9saWN5TmFtZVwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1zMzpzZXJ2ZXJBY2Nlc3NMb2dzVXNlQnVja2V0UG9saWN5XCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLXJvdXRlNTMtcGF0dGVyczp1c2VDZXJ0aWZpY2F0ZVwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2N1c3RvbXJlc291cmNlczppbnN0YWxsTGF0ZXN0QXdzU2RrRGVmYXVsdFwiOiBmYWxzZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtcmRzOmRhdGFiYXNlUHJveHlVbmlxdWVSZXNvdXJjZU5hbWVcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtY29kZWRlcGxveTpyZW1vdmVBbGFybXNGcm9tRGVwbG95bWVudEdyb3VwXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXk6YXV0aG9yaXplckNoYW5nZURlcGxveW1lbnRMb2dpY2FsSWRcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtZWMyOmxhdW5jaFRlbXBsYXRlRGVmYXVsdFVzZXJEYXRhXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLXNlY3JldHNtYW5hZ2VyOnVzZUF0dGFjaGVkU2VjcmV0UmVzb3VyY2VQb2xpY3lGb3JTZWNyZXRUYXJnZXRBdHRhY2htZW50c1wiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1yZWRzaGlmdDpjb2x1bW5JZFwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1zdGVwZnVuY3Rpb25zLXRhc2tzOmVuYWJsZUVtclNlcnZpY2VQb2xpY3lWMlwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1lYzI6cmVzdHJpY3REZWZhdWx0U2VjdXJpdHlHcm91cFwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1hcGlnYXRld2F5OnJlcXVlc3RWYWxpZGF0b3JVbmlxdWVJZFwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1rbXM6YWxpYXNOYW1lUmVmXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWF1dG9zY2FsaW5nOmdlbmVyYXRlTGF1bmNoVGVtcGxhdGVJbnN0ZWFkT2ZMYXVuY2hDb25maWdcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9jb3JlOmluY2x1ZGVQcmVmaXhJblVuaXF1ZU5hbWVHZW5lcmF0aW9uXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWVmczpkZW55QW5vbnltb3VzQWNjZXNzXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLW9wZW5zZWFyY2hzZXJ2aWNlOmVuYWJsZU9wZW5zZWFyY2hNdWx0aUF6V2l0aFN0YW5kYnlcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtbGFtYmRhLW5vZGVqczp1c2VMYXRlc3RSdW50aW1lVmVyc2lvblwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1lZnM6bW91bnRUYXJnZXRPcmRlckluc2Vuc2l0aXZlTG9naWNhbElkXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLXJkczphdXJvcmFDbHVzdGVyQ2hhbmdlU2NvcGVPZkluc3RhbmNlUGFyYW1ldGVyR3JvdXBXaXRoRWFjaFBhcmFtZXRlcnNcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtYXBwc3luYzp1c2VBcm5Gb3JTb3VyY2VBcGlBc3NvY2lhdGlvbklkZW50aWZpZXJcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtcmRzOnByZXZlbnRSZW5kZXJpbmdEZXByZWNhdGVkQ3JlZGVudGlhbHNcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lLWFjdGlvbnM6dXNlTmV3RGVmYXVsdEJyYW5jaEZvckNvZGVDb21taXRTb3VyY2VcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtY2xvdWR3YXRjaC1hY3Rpb25zOmNoYW5nZUxhbWJkYVBlcm1pc3Npb25Mb2dpY2FsSWRGb3JMYW1iZGFBY3Rpb25cIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lOmNyb3NzQWNjb3VudEtleXNEZWZhdWx0VmFsdWVUb0ZhbHNlXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZTpkZWZhdWx0UGlwZWxpbmVUeXBlVG9WMlwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1rbXM6cmVkdWNlQ3Jvc3NBY2NvdW50UmVnaW9uUG9saWN5U2NvcGVcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtZWtzOm5vZGVncm91cE5hbWVBdHRyaWJ1dGVcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtZWMyOmVic0RlZmF1bHRHcDNWb2x1bWVcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtZWNzOnJlbW92ZURlZmF1bHREZXBsb3ltZW50QWxhcm1cIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9jdXN0b20tcmVzb3VyY2VzOmxvZ0FwaVJlc3BvbnNlRGF0YVByb3BlcnR5VHJ1ZURlZmF1bHRcIjogZmFsc2UsXG4gICAgICAgIFwiQGF3cy1jZGsvYXdzLXMzOmtlZXBOb3RpZmljYXRpb25JbkltcG9ydGVkQnVja2V0XCI6IGZhbHNlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1lY3M6cmVkdWNlRWMyRmFyZ2F0ZUNsb3VkV2F0Y2hQZXJtaXNzaW9uc1wiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1lYzI6ZWMyU3VtVEltZW91dEVuYWJsZWRcIjogdHJ1ZSxcbiAgICAgICAgXCJAYXdzLWNkay9hd3MtYXBwc3luYzphcHBTeW5jR3JhcGhRTEFQSVNjb3BlTGFtYmRhUGVybWlzc2lvblwiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1yZHM6c2V0Q29ycmVjdFZhbHVlRm9yRGF0YWJhc2VJbnN0YW5jZVJlYWRSZXBsaWNhSW5zdGFuY2VSZXNvdXJjZUlkXCI6IHRydWUsXG4gICAgICAgIFwiQGF3cy1jZGsvY29yZTpjZm5JbmNsdWRlUmVqZWN0Q29tcGxleFJlc291cmNlVXBkYXRlQ3JlYXRlUG9saWN5SW50cmluc2ljc1wiOiB0cnVlLFxuICAgICAgICBcIkBhd3MtY2RrL2F3cy1sYW1iZGEtbm9kZWpzOnNka1YzRXhjbHVkZVNtaXRoeVBhY2thZ2VzXCI6IHRydWVcbiAgICB9XG59XG5gO1xuXG5jb25zdCBjaGVja0lmQ2RrSXNJbnN0YWxsZWQgPSAoKSA9PiB7XG4gICAgbG9nLmluZm8oXCJDaGVja2luZyBpZiBDREsgaXMgaW5zdGFsbGVkLi4uXCIpO1xuICAgIGNvbnN0IGNka0luc3RhbGxlZCA9IGV4ZWNTeW5jKFwid2hpY2ggY2RrXCIpLnRvU3RyaW5nKCk7XG4gICAgaWYgKCFjZGtJbnN0YWxsZWQpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkNESyBpcyBub3QgaW5zdGFsbGVkLiBQbGVhc2UgaW5zdGFsbCBDREsgYmVmb3JlIHJ1bm5pbmcgdGhpcyBjb21tYW5kLlwiKTtcbiAgICAgICAgLy9hc2sgdXNlciBpZiB0aGV5IHdhbnQgdG8gaW5zdGFsbCBDREtcbiAgICAgICAgY29uc3QgaW5zdGFsbENkayA9IGV4ZWNTeW5jKFwicmVhZCAtcCAnRG8geW91IHdhbnQgdG8gaW5zdGFsbCBDREs/ICh5L24pOiAnIGFuc3dlciAmJiBlY2hvICRhbnN3ZXJcIikudG9TdHJpbmcoKTtcbiAgICAgICAgaWYgKGluc3RhbGxDZGsgPT09IFwieVwiKSB7XG4gICAgICAgICAgICBsb2cuaW5mbyhcIkluc3RhbGxpbmcgQ0RLLi4uXCIpO1xuICAgICAgICAgICAgbG9nLmluZm8oXCJSdW5uaW5nOiBzdWRvIG5wbSBpbnN0YWxsIC1nIGF3cy1jZGtcIik7XG4gICAgICAgICAgICBleGVjU3luYyhcInN1ZG8gbnBtIGluc3RhbGwgLWcgYXdzLWNka1wiLCB7IHN0ZGlvOiBcImluaGVyaXRcIiB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFeGl0aW5nIHdpdGhvdXQgaW5zdGFsbGluZyBjZGsuLi5cIik7XG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbG9nLnN1Y2Nlc3MoXCJDREsgaXMgaW5zdGFsbGVkLlwiKTtcbn07XG5cbmNvbnN0IGFkZENka0pzb24gPSAoKSA9PiB7XG4gICAgbG9nLmluZm8oXCJDaGVja2luZyBpZiBjZGsuanNvbiBmaWxlIGV4aXN0cy4uLlwiKTtcbiAgICBjb25zdCBjZGtKc29uRXhpc3RzID0gZXhpc3RzU3luYyhGSUxFUy5DREtfQ09ORklHKTtcbiAgICBpZiAoY2RrSnNvbkV4aXN0cykge1xuICAgICAgICBsb2cud2FybihcImNkay5qc29uIGZpbGUgYWxyZWFkeSBleGlzdHMuXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGxvZy5pbmZvKFwiQWRkaW5nIGNkay5qc29uIGZpbGUuLi5cIik7XG4gICAgZXhlY1N5bmMoYGVjaG8gJyR7Y2RrSnNvbn0nID4gJHtGSUxFUy5DREtfQ09ORklHfWAsIHsgY3dkOiBwcm9jZXNzLmN3ZCgpIH0pO1xuICAgIGxvZy5zdWNjZXNzKFwiY2RrLmpzb24gZmlsZSBhZGRlZC5cIik7XG59O1xuXG5jb25zdCB1cGRhdGVHaXRJZ25vcmUgPSAoKSA9PiB7XG4gICAgbG9nLmluZm8oXCJDaGVja2luZyBpZiAuZ2l0aWdub3JlIGZpbGUgZXhpc3RzLi4uXCIpO1xuICAgIGNvbnN0IGdpdElnbm9yZUV4aXN0cyA9IGV4aXN0c1N5bmMoRklMRVMuR0lUX0lHTk9SRSk7XG4gICAgaWYgKCFnaXRJZ25vcmVFeGlzdHMpIHtcbiAgICAgICAgbG9nLndhcm4oXCIuZ2l0aWdub3JlIGZpbGUgZG9lcyBub3QgZXhpc3QuXCIpO1xuICAgICAgICB3cml0ZUZpbGVTeW5jKEZJTEVTLkdJVF9JR05PUkUsIFwiLmNkay5zdGFnaW5nXFxuY2RrLm91dFwiKTtcbiAgICAgICAgbG9nLnN1Y2Nlc3MoXCJDcmVhdGVkIC5naXRpZ25vcmUgZmlsZS5cIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbG9nLmluZm8oXCJVcGRhdGluZyAuZ2l0aWdub3JlIGZpbGUuLi5cIik7XG4gICAgY29uc3QgZ2l0SWdub3JlQ29udGVudCA9IGV4ZWNTeW5jKGBjYXQgJHtGSUxFUy5HSVRfSUdOT1JFfWApLnRvU3RyaW5nKCk7XG4gICAgaWYgKGdpdElnbm9yZUNvbnRlbnQuaW5jbHVkZXMoXCIuY2RrLnN0YWdpbmdcIikgJiYgZ2l0SWdub3JlQ29udGVudC5pbmNsdWRlcyhcImNkay5vdXRcIikpIHtcbiAgICAgICAgbG9nLndhcm4oXCIuZ2l0aWdub3JlIGZpbGUgaXMgYWxyZWFkeSB1cGRhdGVkLlwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAhZ2l0SWdub3JlQ29udGVudC5pbmNsdWRlcyhcIi5jZGsuc3RhZ2luZ1wiKSAmJiBleGVjU3luYyhgZWNobyAnLmNkay5zdGFnaW5nJyA+PiAke0ZJTEVTLkdJVF9JR05PUkV9YCk7XG4gICAgIWdpdElnbm9yZUNvbnRlbnQuaW5jbHVkZXMoXCJjZGsub3V0XCIpICYmIGV4ZWNTeW5jKGBlY2hvICdjZGsub3V0JyA+PiAke0ZJTEVTLkdJVF9JR05PUkV9YCk7XG4gICAgbG9nLnN1Y2Nlc3MoXCJVcGRhdGVkIC5naXRpZ25vcmUgZmlsZS5cIik7XG59O1xuXG5jb25zdCBoZWxwZnVsTWVzc2FnZSA9ICgpID0+IHtcbiAgICBsb2cuaW5mbyhgUGxlYXNlIHJ1biBub3cgZm9sbG93aW5nIGNvbW1hbmRzOlxuICAgICAgICAxLiBucHggY2RrIGJvb3RzdHJhcCAtLXByb2ZpbGUgPHByb2ZpbGUtbmFtZT4gLS1yZWdpb24gPHJlZ2lvbi1uYW1lPlxuICAgICAgICAyLiBucHggY2RrIGRlcGxveSAtLXByb2ZpbGUgPHByb2ZpbGUtbmFtZT4gLS1yZWdpb24gPHJlZ2lvbi1uYW1lPlxuICAgIGApO1xuXG59XG5cbmNvbnN0IGluaXRDZGsgPSAoKSA9PiB7XG4gICAgLy8gY2hlY2tJZkNka0lzSW5zdGFsbGVkKCk7XG4gICAgYWRkQ2RrSnNvbigpO1xuICAgIHVwZGF0ZUdpdElnbm9yZSgpO1xuICAgIGhlbHBmdWxNZXNzYWdlKCk7XG59O1xuXG5pbml0Q2RrKCk7XG4iXX0=