import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { InfraConfig } from "../schemas/infra.config";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { Cluster, ContainerImage } from "aws-cdk-lib/aws-ecs";
import { ApplicationLoadBalancer } from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { Repository, TagMutability } from "aws-cdk-lib/aws-ecr";
import { SsmSecrets } from "../constructs/ssm.construct";
import { EcsServiceConstruct } from "../constructs/ecsService.construct";

type MbInfraProps = cdk.StackProps & InfraConfig;

export class MbInfraStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: MbInfraProps) {
        super(scope, id, props);

        const stage = this.node.tryGetContext("stage") as string;

        const vpc = new Vpc(this, `${stage}/vpc`, {
            maxAzs: props.vpc.noOfAzs,
            natGateways: props.vpc.createNatGateway ? props.vpc.noOfNatGateways : 0,
        });

        const cluster = new Cluster(this, `${stage}/cluster`, {
            vpc,
        });

        const lb = new ApplicationLoadBalancer(this, `${stage}/alb`, {
            vpc,
            internetFacing: true,
        });

        props.apps.forEach((app) => {
            const ecr = new Repository(this, `${stage}-${app.name}`, {
                repositoryName: app.name,
                imageTagMutability: TagMutability.IMMUTABLE,
            });

            const secrets = new SsmSecrets(this, `${stage}/${app.name}/Secrets`, {
                secretPath: `/${stage}/${app.name}`,
                secretsNames: app.parameterStoreSecrets,
            });

            new EcsServiceConstruct(this, app.name, {
                serviceName: app.name,
                containerPort: app.port,
                containerImage: ContainerImage.fromAsset(app.dockerImagePath),
                memoryLimit: app.memory,
                cpuLimit: app.cpu,
                secrets: secrets.secrets,
                cluster,
                vpc,
                lb,
                ecr,
            });
        });
    }
}
