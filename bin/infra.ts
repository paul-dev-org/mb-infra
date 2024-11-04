#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { Context } from "../constructs/context";
import { MbInfraStack } from "../stacks/mb-infra-stack";

const cdkApp = new cdk.App();

const context = new Context(cdkApp, "mb-infra-context")
const env: cdk.Environment = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
};
const tags = {
    env: context.stage,
    managedBy: "mb-infra",
};
new MbInfraStack(cdkApp, context.config.project.name, {
    env,
    tags,
    stage: context.stage,
    ...context.config,
});
