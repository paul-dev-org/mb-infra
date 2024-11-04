#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { MbInfraStack } from "../stacks/mb-infra-stack";
import { pipe } from "../utils/fp";
import { InfraConfig } from "../schemas/infra.config";
import { FILES } from "../conts/files";
import { checkIfConfigFileExists, readConfigFile } from "../utils/config-ops";

const config = pipe<string, InfraConfig>(
    `${process.cwd()}/${FILES.INFRA_CONFIG}`,
    checkIfConfigFileExists,
    readConfigFile
);

const cdkApp = new cdk.App();

const env: cdk.Environment = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
};
const tags = {
    managedBy: "mb-infra",
};
new MbInfraStack(cdkApp, 'MbInfra', {
    env,
    tags,
    ...config,
});
