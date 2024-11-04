#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { pipe } from "../utils/fp";
import { checkIfConfigFileExists, readConfigFile } from "../utils/config-ops";
import { Args } from "../schemas/args";
import { parsingArgs, validateArgs } from "../utils/args";
import { InfraConfig } from "../schemas/infra.config";
import { FILES } from "../conts/files";
import { NetworkStack } from "../stacks/network.stack";

const config = pipe<string, InfraConfig>(
    `${process.cwd()}/${FILES.INFRA_CONFIG}`,
    checkIfConfigFileExists,
    readConfigFile
);
const args = pipe<string[], Args>(process.argv.slice(2), validateArgs, parsingArgs);

const env: cdk.Environment = {
    account: args.profile,
    region: args.region,
};
const tags = {
    env: args.env,
    managedBy: "mb-infra",
};

const cdkApp = new cdk.App();

const network = new NetworkStack(cdkApp, `${args.env}Network`, {
    env,
    tags,
    stage: args.env,
    ...config.vpc,
});

// config.apps.forEach((app) => {
//     new MbInfraStack(cdkApp, app.name, {
//         env: env,
//         appConfig: app,
//         tags: tags,
//     });
// });
