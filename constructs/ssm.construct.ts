import { Construct } from "constructs";
import { Secret } from "aws-cdk-lib/aws-ecs";
import * as ssm from "aws-cdk-lib/aws-ssm";

type SsmSecretsProps = {
    secretPath?: string;
    secretsNames?: string[];
};

export class SsmSecrets extends Construct {
    public readonly secrets: { [key: string]: Secret } = {};
    constructor(scope: Construct, id: string, props: SsmSecretsProps) {
        super(scope, id);

        const { secretPath, secretsNames } = props;
        if (!secretPath || !secretsNames) {
            this.secrets = {};
            return;
        }

        const names = secretsNames.length ? secretsNames : [];
        // const _secrets: {[key: string]: Secret} = {};
        names.forEach((secretName: string) => {
            this.secrets[secretName] = Secret.fromSsmParameter(
                ssm.StringParameter.fromStringParameterAttributes(this, `${id}${secretName}`, {
                    parameterName: `${secretPath}/${secretName}`,
                })
            );
        });

        // this.secrets = _secrets;
    }
}
