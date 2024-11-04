#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { pipe } from "../utils/fp";
import { checkIfConfigFileExists, readConfigFile } from "../utils/config-ops";
import { InfraConfig } from "../schemas/infra.config";
import { FILES } from "../conts/files";
import { NetworkStack } from "../stacks/network.stack";
import { Context } from "../constructs/context";

const config = pipe<string, InfraConfig>(
    `${process.cwd()}/${FILES.INFRA_CONFIG}`,
    checkIfConfigFileExists,
    readConfigFile
);
const env: cdk.Environment = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
};

const cdkApp = new cdk.App();

const context = new Context(cdkApp, "mb-infra-context")
const tags = {
    env: context.stage,
    managedBy: "mb-infra",
};

new NetworkStack(cdkApp, `${context.stage}Network`, {
    env,
    tags,
    stage: context.stage,
    ...config.vpc,
});

// config.apps.forEach((app) => {
//     new MbInfraStack(cdkApp, app.name, {
//         env: env,
//         appConfig: app,
//         tags: tags,
//     });
// });
