import { Construct } from "constructs";
import { InfraConfig } from "../schemas/infra.config";
type stageType = "dev" | "stg" | "prd" | "qa";
export declare class Context extends Construct {
    readonly stage: stageType;
    readonly config: InfraConfig;
    constructor(scope: Construct, id: string);
}
export {};
