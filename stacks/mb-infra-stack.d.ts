import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { InfraConfig } from "../schemas/infra.config";
type MbInfraProps = cdk.StackProps & InfraConfig;
export declare class MbInfraStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: MbInfraProps);
}
export {};
