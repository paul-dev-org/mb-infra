import { Construct } from "constructs";
import { pipe } from "../utils/fp";
import { InfraConfig } from "../schemas/infra.config";
import { FILES } from "../conts/files";
import { checkIfConfigFileExists, readConfigFile } from "../utils/config-ops";

type stageType = "dev" | "stg" | "prd" | "qa";

export class Context extends Construct {
    public readonly stage: stageType;
    public readonly config: InfraConfig;

    constructor(scope: Construct, id: string) {
        super(scope, id);
        const config = pipe<string, InfraConfig>(
            `${process.cwd()}/${FILES.INFRA_CONFIG}`,
            checkIfConfigFileExists,
            readConfigFile
        );
        this.stage = this.node.tryGetContext("stage") as stageType;

        this.config = config;
    }
}
