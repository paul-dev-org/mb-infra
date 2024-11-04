import { Construct } from "constructs";
import { Secret } from "aws-cdk-lib/aws-ecs";
type SsmSecretsProps = {
    secretPath?: string;
    secretsNames?: string[];
};
export declare class SsmSecrets extends Construct {
    readonly secrets: {
        [key: string]: Secret;
    };
    constructor(scope: Construct, id: string, props: SsmSecretsProps);
}
export {};
