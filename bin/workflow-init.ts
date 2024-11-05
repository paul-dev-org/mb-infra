#!/usr/bin/env node

import * as path from "path";
import * as fs from "fs";
import { pipe } from "../utils/fp";
import { InfraConfig } from "../schemas/infra.config";
import { FILES } from "../conts/files";
import { checkIfConfigFileExists, readConfigFile } from "../utils/config-ops";

const createWorkflows = () => {
    const workflowsPath = ".github/workflows";
    if (!fs.existsSync(workflowsPath)) {
        fs.mkdirSync(workflowsPath, { recursive: true });
        console.log("Workflows directory created");
    } else {
        console.log(`Workflows directory already exists`);
    }
    const config = pipe<string, InfraConfig>(
        `${process.cwd()}/${FILES.INFRA_CONFIG}`,
        checkIfConfigFileExists,
        readConfigFile
    );

    const { apps } = pipe<string, InfraConfig>(
        `${process.cwd()}/${FILES.INFRA_CONFIG}`,
        checkIfConfigFileExists,
        readConfigFile
    );

    const serviceA = apps[0];
    const serviceB = apps[1];

    const releasePleaseTemplate = fs.readFileSync(path.resolve(__dirname, "release-please.yaml"), "utf8");
    const findReg = new RegExp("{{service_a}}", "g");
    const replacedA = releasePleaseTemplate.replace(findReg, serviceA.name);
    const findRegB = new RegExp("{{service_b}}", "g");
    const relFinal = replacedA.replace(findRegB, serviceB.name);

    const deployTemplate = fs.readFileSync(path.resolve(__dirname, "deploy.yaml"), "utf8");
    const replacedDeployA = deployTemplate.replace(findReg, serviceA.name);
    const replacedDeployB = replacedDeployA.replace(findRegB, serviceB.name);

    fs.writeFileSync(path.resolve(workflowsPath, "release-please.yaml"), relFinal);
    fs.writeFileSync(path.resolve(workflowsPath, "deploy.yaml"), replacedDeployB);

    console.log("\x1b[43m\x1b[30m%s\x1b[0m", "IMPORTANT");
    console.log(
        "\x1b[43m\x1b[30m%s\x1b[0m",
        "Make sure to create environment stg and prd in the github repository settings"
    );
    console.log("\x1b[43m\x1b[30m%s\x1b[0m", "Add people to the environment protection rules");
};

createWorkflows();
