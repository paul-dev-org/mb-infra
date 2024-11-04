import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

type MbInfraProps = cdk.StackProps & {};

export class MbInfraStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: MbInfraProps) {
        super(scope, id, props);
    }
}
