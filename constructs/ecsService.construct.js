"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcsServiceConstruct = void 0;
const constructs_1 = require("constructs");
const aws_ecs_1 = require("aws-cdk-lib/aws-ecs");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
const aws_elasticloadbalancingv2_1 = require("aws-cdk-lib/aws-elasticloadbalancingv2");
class EcsServiceConstruct extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        const sg = new aws_ec2_1.SecurityGroup(this, `${id}SecurityGroup`, {
            vpc: props.vpc,
        });
        sg.addIngressRule(aws_ec2_1.Peer.ipv4("0.0.0.0/0"), aws_ec2_1.Port.tcp(props.containerPort));
        const taskDef = new aws_ecs_1.FargateTaskDefinition(this, `${props.serviceName}TaskDef`);
        const container = taskDef.addContainer(props.serviceName, {
            secrets: props.secrets ?? {},
            image: props.containerImage,
            memoryLimitMiB: props.memoryLimit ?? 512,
            cpu: props.cpuLimit ?? 256,
            logging: aws_ecs_1.LogDriver.awsLogs({ streamPrefix: props.serviceName }),
        });
        container.addPortMappings({
            containerPort: props.containerPort,
            protocol: aws_ecs_1.Protocol.TCP,
        });
        props.ecr.grantPull(container.taskDefinition.executionRole);
        const service = new aws_ecs_1.FargateService(this, props.serviceName, {
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
            scaleInCooldown: aws_cdk_lib_1.Duration.seconds(60),
            scaleOutCooldown: aws_cdk_lib_1.Duration.seconds(10),
        });
        // LB Listener
        const authListener = props.lb.addListener(`${id}${props.serviceName}`, {
            port: props.containerPort,
            open: true,
            protocol: aws_elasticloadbalancingv2_1.ApplicationProtocol.HTTP,
        });
        authListener.addTargets(props.serviceName, {
            port: props.containerPort,
            protocol: aws_elasticloadbalancingv2_1.ApplicationProtocol.HTTP,
            targets: [
                service.loadBalancerTarget({
                    containerName: props.serviceName,
                    containerPort: props.containerPort,
                }),
            ],
            healthCheck: {
                interval: aws_cdk_lib_1.Duration.seconds(60),
                path: "/",
                timeout: aws_cdk_lib_1.Duration.seconds(5),
            },
        });
    }
}
exports.EcsServiceConstruct = EcsServiceConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzU2VydmljZS5jb25zdHJ1Y3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlY3NTZXJ2aWNlLmNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBdUM7QUFDdkMsaURBUTZCO0FBQzdCLDZDQUF1QztBQUN2QyxpREFBcUU7QUFDckUsdUZBQXNHO0FBZ0J0RyxNQUFhLG1CQUFvQixTQUFRLHNCQUFTO0lBQzlDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBbUI7UUFDekQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLEVBQUUsR0FBRyxJQUFJLHVCQUFhLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxlQUFlLEVBQUU7WUFDckQsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO1NBQ2pCLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxjQUFjLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxjQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1FBRXpFLE1BQU0sT0FBTyxHQUFHLElBQUksK0JBQXFCLENBQUMsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLFdBQVcsU0FBUyxDQUFDLENBQUM7UUFDL0UsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFO1lBQ3RELE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxJQUFJLEVBQUU7WUFDNUIsS0FBSyxFQUFFLEtBQUssQ0FBQyxjQUFjO1lBQzNCLGNBQWMsRUFBRSxLQUFLLENBQUMsV0FBVyxJQUFJLEdBQUc7WUFDeEMsR0FBRyxFQUFFLEtBQUssQ0FBQyxRQUFRLElBQUksR0FBRztZQUMxQixPQUFPLEVBQUUsbUJBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxZQUFZLEVBQUUsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ2xFLENBQUMsQ0FBQztRQUVILFNBQVMsQ0FBQyxlQUFlLENBQUM7WUFDdEIsYUFBYSxFQUFFLEtBQUssQ0FBQyxhQUFhO1lBQ2xDLFFBQVEsRUFBRSxrQkFBUSxDQUFDLEdBQUc7U0FDekIsQ0FBQyxDQUFDO1FBRUgsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxhQUFjLENBQUMsQ0FBQztRQUU3RCxNQUFNLE9BQU8sR0FBRyxJQUFJLHdCQUFjLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxXQUFXLEVBQUU7WUFDeEQsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO1lBQ3RCLGNBQWMsRUFBRSxPQUFPO1lBQ3ZCLGNBQWMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNwQixjQUFjLEVBQUU7Z0JBQ1osTUFBTSxFQUFFLElBQUk7Z0JBQ1osUUFBUSxFQUFFLElBQUk7YUFDakI7U0FDSixDQUFDLENBQUM7UUFFSCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUM7WUFDdkMsV0FBVyxFQUFFLENBQUM7WUFDZCxXQUFXLEVBQUUsRUFBRTtTQUNsQixDQUFDLENBQUM7UUFDSCxPQUFPLENBQUMscUJBQXFCLENBQUMsWUFBWSxFQUFFO1lBQ3hDLHdCQUF3QixFQUFFLEVBQUU7WUFDNUIsZUFBZSxFQUFFLHNCQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUNyQyxnQkFBZ0IsRUFBRSxzQkFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7U0FDekMsQ0FBQyxDQUFDO1FBRUgsY0FBYztRQUNkLE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQyxXQUFXLEVBQUUsRUFBRTtZQUNuRSxJQUFJLEVBQUUsS0FBSyxDQUFDLGFBQWE7WUFDekIsSUFBSSxFQUFFLElBQUk7WUFDVixRQUFRLEVBQUUsZ0RBQW1CLENBQUMsSUFBSTtTQUNyQyxDQUFDLENBQUM7UUFFSCxZQUFZLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUU7WUFDdkMsSUFBSSxFQUFFLEtBQUssQ0FBQyxhQUFhO1lBQ3pCLFFBQVEsRUFBRSxnREFBbUIsQ0FBQyxJQUFJO1lBQ2xDLE9BQU8sRUFBRTtnQkFDTCxPQUFPLENBQUMsa0JBQWtCLENBQUM7b0JBQ3ZCLGFBQWEsRUFBRSxLQUFLLENBQUMsV0FBVztvQkFDaEMsYUFBYSxFQUFFLEtBQUssQ0FBQyxhQUFhO2lCQUNyQyxDQUFDO2FBQ0w7WUFDRCxXQUFXLEVBQUU7Z0JBQ1QsUUFBUSxFQUFFLHNCQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQkFDOUIsSUFBSSxFQUFFLEdBQUc7Z0JBQ1QsT0FBTyxFQUFFLHNCQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzthQUMvQjtTQUNKLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQXJFRCxrREFxRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiY29uc3RydWN0c1wiO1xuaW1wb3J0IHtcbiAgICBDbHVzdGVyLFxuICAgIENvbnRhaW5lckltYWdlLFxuICAgIEZhcmdhdGVTZXJ2aWNlLFxuICAgIEZhcmdhdGVUYXNrRGVmaW5pdGlvbixcbiAgICBMb2dEcml2ZXIsXG4gICAgUHJvdG9jb2wsXG4gICAgU2VjcmV0LFxufSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWVjc1wiO1xuaW1wb3J0IHsgRHVyYXRpb24gfSBmcm9tIFwiYXdzLWNkay1saWJcIjtcbmltcG9ydCB7IFBlZXIsIFBvcnQsIFNlY3VyaXR5R3JvdXAsIFZwYyB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtZWMyXCI7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkxvYWRCYWxhbmNlciwgQXBwbGljYXRpb25Qcm90b2NvbCB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtZWxhc3RpY2xvYWRiYWxhbmNpbmd2MlwiO1xuaW1wb3J0IHsgUmVwb3NpdG9yeSB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtZWNyXCI7XG5cbnR5cGUgU2VydmljZVByb3BzID0ge1xuICAgIHNlcnZpY2VOYW1lOiBzdHJpbmc7XG4gICAgY29udGFpbmVyUG9ydDogbnVtYmVyO1xuICAgIGNvbnRhaW5lckltYWdlOiBDb250YWluZXJJbWFnZTtcbiAgICBtZW1vcnlMaW1pdD86IG51bWJlcjtcbiAgICBjcHVMaW1pdD86IG51bWJlcjtcbiAgICBzZWNyZXRzPzogeyBba2V5OiBzdHJpbmddOiBTZWNyZXQgfTtcbiAgICBjbHVzdGVyOiBDbHVzdGVyO1xuICAgIHZwYzogVnBjO1xuICAgIGxiOiBBcHBsaWNhdGlvbkxvYWRCYWxhbmNlcjtcbiAgICBlY3I6IFJlcG9zaXRvcnk7XG59O1xuXG5leHBvcnQgY2xhc3MgRWNzU2VydmljZUNvbnN0cnVjdCBleHRlbmRzIENvbnN0cnVjdCB7XG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFNlcnZpY2VQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgICAgIGNvbnN0IHNnID0gbmV3IFNlY3VyaXR5R3JvdXAodGhpcywgYCR7aWR9U2VjdXJpdHlHcm91cGAsIHtcbiAgICAgICAgICAgIHZwYzogcHJvcHMudnBjLFxuICAgICAgICB9KTtcblxuICAgICAgICBzZy5hZGRJbmdyZXNzUnVsZShQZWVyLmlwdjQoXCIwLjAuMC4wLzBcIiksIFBvcnQudGNwKHByb3BzLmNvbnRhaW5lclBvcnQpKTtcblxuICAgICAgICBjb25zdCB0YXNrRGVmID0gbmV3IEZhcmdhdGVUYXNrRGVmaW5pdGlvbih0aGlzLCBgJHtwcm9wcy5zZXJ2aWNlTmFtZX1UYXNrRGVmYCk7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRhc2tEZWYuYWRkQ29udGFpbmVyKHByb3BzLnNlcnZpY2VOYW1lLCB7XG4gICAgICAgICAgICBzZWNyZXRzOiBwcm9wcy5zZWNyZXRzID8/IHt9LFxuICAgICAgICAgICAgaW1hZ2U6IHByb3BzLmNvbnRhaW5lckltYWdlLFxuICAgICAgICAgICAgbWVtb3J5TGltaXRNaUI6IHByb3BzLm1lbW9yeUxpbWl0ID8/IDUxMixcbiAgICAgICAgICAgIGNwdTogcHJvcHMuY3B1TGltaXQgPz8gMjU2LFxuICAgICAgICAgICAgbG9nZ2luZzogTG9nRHJpdmVyLmF3c0xvZ3MoeyBzdHJlYW1QcmVmaXg6IHByb3BzLnNlcnZpY2VOYW1lIH0pLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHtcbiAgICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IHByb3BzLmNvbnRhaW5lclBvcnQsXG4gICAgICAgICAgICBwcm90b2NvbDogUHJvdG9jb2wuVENQLFxuICAgICAgICB9KTtcblxuICAgICAgICBwcm9wcy5lY3IuZ3JhbnRQdWxsKGNvbnRhaW5lci50YXNrRGVmaW5pdGlvbi5leGVjdXRpb25Sb2xlISk7XG5cbiAgICAgICAgY29uc3Qgc2VydmljZSA9IG5ldyBGYXJnYXRlU2VydmljZSh0aGlzLCBwcm9wcy5zZXJ2aWNlTmFtZSwge1xuICAgICAgICAgICAgY2x1c3RlcjogcHJvcHMuY2x1c3RlcixcbiAgICAgICAgICAgIHRhc2tEZWZpbml0aW9uOiB0YXNrRGVmLFxuICAgICAgICAgICAgc2VjdXJpdHlHcm91cHM6IFtzZ10sXG4gICAgICAgICAgICBjaXJjdWl0QnJlYWtlcjoge1xuICAgICAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICByb2xsYmFjazogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHNjYWxpbmcgPSBzZXJ2aWNlLmF1dG9TY2FsZVRhc2tDb3VudCh7XG4gICAgICAgICAgICBtaW5DYXBhY2l0eTogMSxcbiAgICAgICAgICAgIG1heENhcGFjaXR5OiAxMCxcbiAgICAgICAgfSk7XG4gICAgICAgIHNjYWxpbmcuc2NhbGVPbkNwdVV0aWxpemF0aW9uKFwiQ3B1U2NhbGluZ1wiLCB7XG4gICAgICAgICAgICB0YXJnZXRVdGlsaXphdGlvblBlcmNlbnQ6IDYwLFxuICAgICAgICAgICAgc2NhbGVJbkNvb2xkb3duOiBEdXJhdGlvbi5zZWNvbmRzKDYwKSxcbiAgICAgICAgICAgIHNjYWxlT3V0Q29vbGRvd246IER1cmF0aW9uLnNlY29uZHMoMTApLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBMQiBMaXN0ZW5lclxuICAgICAgICBjb25zdCBhdXRoTGlzdGVuZXIgPSBwcm9wcy5sYi5hZGRMaXN0ZW5lcihgJHtpZH0ke3Byb3BzLnNlcnZpY2VOYW1lfWAsIHtcbiAgICAgICAgICAgIHBvcnQ6IHByb3BzLmNvbnRhaW5lclBvcnQsXG4gICAgICAgICAgICBvcGVuOiB0cnVlLFxuICAgICAgICAgICAgcHJvdG9jb2w6IEFwcGxpY2F0aW9uUHJvdG9jb2wuSFRUUCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXV0aExpc3RlbmVyLmFkZFRhcmdldHMocHJvcHMuc2VydmljZU5hbWUsIHtcbiAgICAgICAgICAgIHBvcnQ6IHByb3BzLmNvbnRhaW5lclBvcnQsXG4gICAgICAgICAgICBwcm90b2NvbDogQXBwbGljYXRpb25Qcm90b2NvbC5IVFRQLFxuICAgICAgICAgICAgdGFyZ2V0czogW1xuICAgICAgICAgICAgICAgIHNlcnZpY2UubG9hZEJhbGFuY2VyVGFyZ2V0KHtcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyTmFtZTogcHJvcHMuc2VydmljZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IHByb3BzLmNvbnRhaW5lclBvcnQsXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgaGVhbHRoQ2hlY2s6IHtcbiAgICAgICAgICAgICAgICBpbnRlcnZhbDogRHVyYXRpb24uc2Vjb25kcyg2MCksXG4gICAgICAgICAgICAgICAgcGF0aDogXCIvXCIsXG4gICAgICAgICAgICAgICAgdGltZW91dDogRHVyYXRpb24uc2Vjb25kcyg1KSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==