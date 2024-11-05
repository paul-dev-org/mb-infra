"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MbInfraStack = void 0;
const cdk = require("aws-cdk-lib");
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
const aws_ecs_1 = require("aws-cdk-lib/aws-ecs");
const aws_elasticloadbalancingv2_1 = require("aws-cdk-lib/aws-elasticloadbalancingv2");
const aws_ecr_1 = require("aws-cdk-lib/aws-ecr");
const ssm_construct_1 = require("../constructs/ssm.construct");
const ecsService_construct_1 = require("../constructs/ecsService.construct");
class MbInfraStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const stage = this.node.tryGetContext("stage");
        const vpc = new aws_ec2_1.Vpc(this, `${stage}/vpc`, {
            maxAzs: props.vpc.noOfAzs,
            natGateways: props.vpc.createNatGateway ? props.vpc.noOfNatGateways : 0,
        });
        const cluster = new aws_ecs_1.Cluster(this, `${stage}/cluster`, {
            vpc,
        });
        const lb = new aws_elasticloadbalancingv2_1.ApplicationLoadBalancer(this, `${stage}/alb`, {
            vpc,
            internetFacing: true,
        });
        props.apps.forEach((app) => {
            const ecr = new aws_ecr_1.Repository(this, `${stage}-${app.name}`, {
                repositoryName: app.name,
                imageTagMutability: aws_ecr_1.TagMutability.IMMUTABLE,
            });
            const secrets = new ssm_construct_1.SsmSecrets(this, `${stage}/${app.name}/Secrets`, {
                secretPath: `/${stage}/${app.name}`,
                secretsNames: app.parameterStoreSecrets,
            });
            new ecsService_construct_1.EcsServiceConstruct(this, app.name, {
                serviceName: app.name,
                containerPort: app.port,
                containerImage: aws_ecs_1.ContainerImage.fromAsset(app.dockerImagePath),
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
exports.MbInfraStack = MbInfraStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWItaW5mcmEtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYi1pbmZyYS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFHbkMsaURBQTBDO0FBQzFDLGlEQUE4RDtBQUM5RCx1RkFBaUY7QUFDakYsaURBQWdFO0FBQ2hFLCtEQUF5RDtBQUN6RCw2RUFBeUU7QUFJekUsTUFBYSxZQUFhLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDdkMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFtQjtRQUN6RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQVcsQ0FBQztRQUV6RCxNQUFNLEdBQUcsR0FBRyxJQUFJLGFBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLLE1BQU0sRUFBRTtZQUN0QyxNQUFNLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPO1lBQ3pCLFdBQVcsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMxRSxDQUFDLENBQUM7UUFFSCxNQUFNLE9BQU8sR0FBRyxJQUFJLGlCQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsS0FBSyxVQUFVLEVBQUU7WUFDbEQsR0FBRztTQUNOLENBQUMsQ0FBQztRQUVILE1BQU0sRUFBRSxHQUFHLElBQUksb0RBQXVCLENBQUMsSUFBSSxFQUFFLEdBQUcsS0FBSyxNQUFNLEVBQUU7WUFDekQsR0FBRztZQUNILGNBQWMsRUFBRSxJQUFJO1NBQ3ZCLENBQUMsQ0FBQztRQUVILEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDdkIsTUFBTSxHQUFHLEdBQUcsSUFBSSxvQkFBVSxDQUFDLElBQUksRUFBRSxHQUFHLEtBQUssSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBQ3JELGNBQWMsRUFBRSxHQUFHLENBQUMsSUFBSTtnQkFDeEIsa0JBQWtCLEVBQUUsdUJBQWEsQ0FBQyxTQUFTO2FBQzlDLENBQUMsQ0FBQztZQUVILE1BQU0sT0FBTyxHQUFHLElBQUksMEJBQVUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLLElBQUksR0FBRyxDQUFDLElBQUksVUFBVSxFQUFFO2dCQUNqRSxVQUFVLEVBQUUsSUFBSSxLQUFLLElBQUksR0FBRyxDQUFDLElBQUksRUFBRTtnQkFDbkMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxxQkFBcUI7YUFDMUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSwwQ0FBbUIsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRTtnQkFDcEMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxJQUFJO2dCQUNyQixhQUFhLEVBQUUsR0FBRyxDQUFDLElBQUk7Z0JBQ3ZCLGNBQWMsRUFBRSx3QkFBYyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDO2dCQUM3RCxXQUFXLEVBQUUsR0FBRyxDQUFDLE1BQU07Z0JBQ3ZCLFFBQVEsRUFBRSxHQUFHLENBQUMsR0FBRztnQkFDakIsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPO2dCQUN4QixPQUFPO2dCQUNQLEdBQUc7Z0JBQ0gsRUFBRTtnQkFDRixHQUFHO2FBQ04sQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUE3Q0Qsb0NBNkNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gXCJhd3MtY2RrLWxpYlwiO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSBcImNvbnN0cnVjdHNcIjtcbmltcG9ydCB7IEluZnJhQ29uZmlnIH0gZnJvbSBcIi4uL3NjaGVtYXMvaW5mcmEuY29uZmlnXCI7XG5pbXBvcnQgeyBWcGMgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWVjMlwiO1xuaW1wb3J0IHsgQ2x1c3RlciwgQ29udGFpbmVySW1hZ2UgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWVjc1wiO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWVsYXN0aWNsb2FkYmFsYW5jaW5ndjJcIjtcbmltcG9ydCB7IFJlcG9zaXRvcnksIFRhZ011dGFiaWxpdHkgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWVjclwiO1xuaW1wb3J0IHsgU3NtU2VjcmV0cyB9IGZyb20gXCIuLi9jb25zdHJ1Y3RzL3NzbS5jb25zdHJ1Y3RcIjtcbmltcG9ydCB7IEVjc1NlcnZpY2VDb25zdHJ1Y3QgfSBmcm9tIFwiLi4vY29uc3RydWN0cy9lY3NTZXJ2aWNlLmNvbnN0cnVjdFwiO1xuXG50eXBlIE1iSW5mcmFQcm9wcyA9IGNkay5TdGFja1Byb3BzICYgSW5mcmFDb25maWc7XG5cbmV4cG9ydCBjbGFzcyBNYkluZnJhU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBNYkluZnJhUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAgICAgY29uc3Qgc3RhZ2UgPSB0aGlzLm5vZGUudHJ5R2V0Q29udGV4dChcInN0YWdlXCIpIGFzIHN0cmluZztcblxuICAgICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHRoaXMsIGAke3N0YWdlfS92cGNgLCB7XG4gICAgICAgICAgICBtYXhBenM6IHByb3BzLnZwYy5ub09mQXpzLFxuICAgICAgICAgICAgbmF0R2F0ZXdheXM6IHByb3BzLnZwYy5jcmVhdGVOYXRHYXRld2F5ID8gcHJvcHMudnBjLm5vT2ZOYXRHYXRld2F5cyA6IDAsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgQ2x1c3Rlcih0aGlzLCBgJHtzdGFnZX0vY2x1c3RlcmAsIHtcbiAgICAgICAgICAgIHZwYyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgbGIgPSBuZXcgQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIodGhpcywgYCR7c3RhZ2V9L2FsYmAsIHtcbiAgICAgICAgICAgIHZwYyxcbiAgICAgICAgICAgIGludGVybmV0RmFjaW5nOiB0cnVlLFxuICAgICAgICB9KTtcblxuICAgICAgICBwcm9wcy5hcHBzLmZvckVhY2goKGFwcCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZWNyID0gbmV3IFJlcG9zaXRvcnkodGhpcywgYCR7c3RhZ2V9LSR7YXBwLm5hbWV9YCwge1xuICAgICAgICAgICAgICAgIHJlcG9zaXRvcnlOYW1lOiBhcHAubmFtZSxcbiAgICAgICAgICAgICAgICBpbWFnZVRhZ011dGFiaWxpdHk6IFRhZ011dGFiaWxpdHkuSU1NVVRBQkxFLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNlY3JldHMgPSBuZXcgU3NtU2VjcmV0cyh0aGlzLCBgJHtzdGFnZX0vJHthcHAubmFtZX0vU2VjcmV0c2AsIHtcbiAgICAgICAgICAgICAgICBzZWNyZXRQYXRoOiBgLyR7c3RhZ2V9LyR7YXBwLm5hbWV9YCxcbiAgICAgICAgICAgICAgICBzZWNyZXRzTmFtZXM6IGFwcC5wYXJhbWV0ZXJTdG9yZVNlY3JldHMsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbmV3IEVjc1NlcnZpY2VDb25zdHJ1Y3QodGhpcywgYXBwLm5hbWUsIHtcbiAgICAgICAgICAgICAgICBzZXJ2aWNlTmFtZTogYXBwLm5hbWUsXG4gICAgICAgICAgICAgICAgY29udGFpbmVyUG9ydDogYXBwLnBvcnQsXG4gICAgICAgICAgICAgICAgY29udGFpbmVySW1hZ2U6IENvbnRhaW5lckltYWdlLmZyb21Bc3NldChhcHAuZG9ja2VySW1hZ2VQYXRoKSxcbiAgICAgICAgICAgICAgICBtZW1vcnlMaW1pdDogYXBwLm1lbW9yeSxcbiAgICAgICAgICAgICAgICBjcHVMaW1pdDogYXBwLmNwdSxcbiAgICAgICAgICAgICAgICBzZWNyZXRzOiBzZWNyZXRzLnNlY3JldHMsXG4gICAgICAgICAgICAgICAgY2x1c3RlcixcbiAgICAgICAgICAgICAgICB2cGMsXG4gICAgICAgICAgICAgICAgbGIsXG4gICAgICAgICAgICAgICAgZWNyLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==