import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { Cluster } from "aws-cdk-lib/aws-ecs";
import { VpcConfig } from "../schemas/infra.config";
import { ApplicationLoadBalancer } from "aws-cdk-lib/aws-elasticloadbalancingv2";

type NetworkProps = cdk.StackProps &
    VpcConfig & {
        stage: string;
    };

export class NetworkStack extends cdk.Stack {
    public readonly vpc: Vpc;
    public readonly cluster: Cluster;
    public readonly lb: ApplicationLoadBalancer;

    constructor(scope: Construct, id: string, props: NetworkProps) {
        super(scope, id, props);

        this.vpc = new Vpc(this, `${props.stage}Vpc`, {
            maxAzs: props.noOfAzs,
            natGateways: props.createNatGateway ? props.noOfNatGateways : 0,
        });

        this.cluster = new Cluster(this, `${props.stage}Cluster`, {
            vpc: this.vpc,
        });

        this.lb = new ApplicationLoadBalancer(this, `${props.stage}ALB`, {
            vpc: this.vpc,
            internetFacing: true,
        });
    }
}
