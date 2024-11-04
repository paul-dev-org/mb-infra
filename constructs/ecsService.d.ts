import { Construct } from "constructs";
import { Cluster, ContainerImage, Secret } from "aws-cdk-lib/aws-ecs";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { ApplicationLoadBalancer } from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { Repository } from "aws-cdk-lib/aws-ecr";
type ServiceProps = {
    serviceName: string;
    containerPort: number;
    containerImage: ContainerImage;
    memoryLimit?: number;
    cpuLimit?: number;
    secrets?: {
        [key: string]: Secret;
    };
    cluster: Cluster;
    vpc: Vpc;
    lb: ApplicationLoadBalancer;
    ecr: Repository;
};
export declare class EcsService extends Construct {
    constructor(scope: Construct, id: string, props: ServiceProps);
}
export {};
