import { Construct } from "constructs";
import { pipe } from "../utils/fp";
import { InfraConfig } from "../schemas/infra.config";
import { FILES } from "../conts/files";
import { checkIfConfigFileExists, readConfigFile } from "../utils/config-ops";

type stageType = "dev" | "stg" | "prd" | "qa";

export class Context extends Construct {
    public readonly stage: stageType;
    public readonly config: InfraConfig;
    public readonly env: { account: string; region: string; stage: stageType };

    constructor(scope: Construct, id: string) {
        super(scope, id);
        const config = pipe<string, InfraConfig>(
            `${process.cwd()}/${FILES.INFRA_CONFIG}`,
            checkIfConfigFileExists,
            readConfigFile
        );
        this.stage = this.node.tryGetContext("stage") as stageType;

        const env = config.project.stages[this.stage];

        if (!env?.account) {
            throw new Error(`Stage ${this.stage} not found in infra.config.ts`);
        }

        this.env = {
            account: env?.account,
            region: env?.region,
            stage: this.stage,
        };

        this.config = config;
    }
}
