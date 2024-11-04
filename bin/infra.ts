#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { pipe } from "../utils/fp";
import { checkIfConfigFileExists, readConfigFile } from "../utils/config-ops";
import { InfraConfig } from "../schemas/infra.config";
import { FILES } from "../conts/files";
import { Context } from "../constructs/context";
import { MbInfraStack } from "../stacks/mb-infra-stack";

const config = pipe<string, InfraConfig>(
    `${process.cwd()}/${FILES.INFRA_CONFIG}`,
    checkIfConfigFileExists,
    readConfigFile
);

const cdkApp = new cdk.App();

const context = new Context(cdkApp, "mb-infra-context")
const env: cdk.Environment = {
    account: context.env.account,
    region: context.env.region,
};
const tags = {
    env: context.stage,
    managedBy: "mb-infra",
};
new MbInfraStack(cdkApp, context.config.project.name, {
    env,
    tags,
    stage: context.stage,
    ...config,
});
