import { Construct } from "constructs";
import {
    Cluster,
    ContainerImage,
    FargateService,
    FargateTaskDefinition,
    LogDriver,
    Protocol,
    Secret,
} from "aws-cdk-lib/aws-ecs";
import { Duration } from "aws-cdk-lib";
import { Peer, Port, SecurityGroup, Vpc } from "aws-cdk-lib/aws-ec2";
import { ApplicationLoadBalancer, ApplicationProtocol } from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { Repository } from "aws-cdk-lib/aws-ecr";

type ServiceProps = {
    serviceName: string;
    containerPort: number;
    containerImage: ContainerImage;
    memoryLimit?: number;
    cpuLimit?: number;
    secrets?: { [key: string]: Secret };
    cluster: Cluster;
    vpc: Vpc;
    lb: ApplicationLoadBalancer;
    ecr: Repository;
};

export class EcsServiceConstruct extends Construct {
    constructor(scope: Construct, id: string, props: ServiceProps) {
        super(scope, id);

        const sg = new SecurityGroup(this, `${id}SecurityGroup`, {
            vpc: props.vpc,
        });

        sg.addIngressRule(Peer.ipv4("0.0.0.0/0"), Port.tcp(props.containerPort));

        const taskDef = new FargateTaskDefinition(this, `${props.serviceName}TaskDef`);
        const container = taskDef.addContainer(props.serviceName, {
            secrets: props.secrets ?? {},
            image: props.containerImage,
            memoryLimitMiB: props.memoryLimit ?? 512,
            cpu: props.cpuLimit ?? 256,
            logging: LogDriver.awsLogs({ streamPrefix: props.serviceName }),
        });

        container.addPortMappings({
            containerPort: props.containerPort,
            protocol: Protocol.TCP,
        });

        props.ecr.grantPull(container.taskDefinition.executionRole!);

        const service = new FargateService(this, props.serviceName, {
            cluster: props.cluster,
            taskDefinition: taskDef,
            securityGroups: [sg],
            circuitBreaker: {
                enable: true,
                rollback: true,
            },
        });

        const scaling = service.autoScaleTaskCount({
            minCapacity: 1,
            maxCapacity: 10,
        });
        scaling.scaleOnCpuUtilization("CpuScaling", {
            targetUtilizationPercent: 60,
            scaleInCooldown: Duration.seconds(60),
            scaleOutCooldown: Duration.seconds(10),
        });

        // LB Listener
        const authListener = props.lb.addListener(`${id}${props.serviceName}`, {
            port: props.containerPort,
            open: true,
            protocol: ApplicationProtocol.HTTP,
        });

        authListener.addTargets(props.serviceName, {
            port: props.containerPort,
            protocol: ApplicationProtocol.HTTP,
            targets: [
                service.loadBalancerTarget({
                    containerName: props.serviceName,
                    containerPort: props.containerPort,
                }),
            ],
            healthCheck: {
                interval: Duration.seconds(60),
                path: "/",
                timeout: Duration.seconds(5),
            },
        });
    }
}
