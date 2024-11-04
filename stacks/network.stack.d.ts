import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { Cluster } from "aws-cdk-lib/aws-ecs";
import { VpcConfig } from "../schemas/infra.config";
import { ApplicationLoadBalancer } from "aws-cdk-lib/aws-elasticloadbalancingv2";
type NetworkProps = cdk.StackProps & VpcConfig & {
    stage: string;
};
export declare class NetworkStack extends cdk.Stack {
    readonly vpc: Vpc;
    readonly cluster: Cluster;
    readonly lb: ApplicationLoadBalancer;
    constructor(scope: Construct, id: string, props: NetworkProps);
}
export {};
