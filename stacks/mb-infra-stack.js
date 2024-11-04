"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MbInfraStack = void 0;
const cdk = require("aws-cdk-lib");
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
const aws_ecs_1 = require("aws-cdk-lib/aws-ecs");
const aws_elasticloadbalancingv2_1 = require("aws-cdk-lib/aws-elasticloadbalancingv2");
const ecsService_construct_1 = require("../constructs/ecsService.construct");
const aws_ecr_1 = require("aws-cdk-lib/aws-ecr");
const ssm_construct_1 = require("../constructs/ssm.construct");
class MbInfraStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const vpc = new aws_ec2_1.Vpc(this, `${props.stage}/vpc`, {
            maxAzs: props.vpc.noOfAzs,
            natGateways: props.vpc.createNatGateway ? props.vpc.noOfNatGateways : 0,
        });
        const cluster = new aws_ecs_1.Cluster(this, `${props.stage}/cluster`, {
            vpc,
        });
        const lb = new aws_elasticloadbalancingv2_1.ApplicationLoadBalancer(this, `${props.stage}/alb`, {
            vpc,
            internetFacing: true,
        });
        props.apps.forEach((app) => {
            const ecr = new aws_ecr_1.Repository(this, `${props.stage}-${app.name}`, {
                repositoryName: app.name,
                imageTagMutability: aws_ecr_1.TagMutability.IMMUTABLE,
            });
            const secrets = new ssm_construct_1.SsmSecrets(this, `${props.stage}/${app.name}/Secrets`, {
                secretPath: `/${props.stage}/${app.name}`,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWItaW5mcmEtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYi1pbmZyYS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFHbkMsaURBQTBDO0FBQzFDLGlEQUE4RDtBQUM5RCx1RkFBaUY7QUFDakYsNkVBQXlFO0FBQ3pFLGlEQUFnRTtBQUNoRSwrREFBeUQ7QUFJekQsTUFBYSxZQUFhLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDdkMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFtQjtRQUN6RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEdBQUcsR0FBRyxJQUFJLGFBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsS0FBSyxNQUFNLEVBQUU7WUFDNUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTztZQUN6QixXQUFXLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDMUUsQ0FBQyxDQUFDO1FBRUgsTUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxLQUFLLFVBQVUsRUFBRTtZQUN4RCxHQUFHO1NBQ04sQ0FBQyxDQUFDO1FBRUgsTUFBTSxFQUFFLEdBQUcsSUFBSSxvREFBdUIsQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsS0FBSyxNQUFNLEVBQUU7WUFDL0QsR0FBRztZQUNILGNBQWMsRUFBRSxJQUFJO1NBQ3ZCLENBQUMsQ0FBQztRQUVILEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDdkIsTUFBTSxHQUFHLEdBQUcsSUFBSSxvQkFBVSxDQUFDLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxLQUFLLElBQUksR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUMzRCxjQUFjLEVBQUUsR0FBRyxDQUFDLElBQUk7Z0JBQ3hCLGtCQUFrQixFQUFFLHVCQUFhLENBQUMsU0FBUzthQUM5QyxDQUFDLENBQUM7WUFFSCxNQUFNLE9BQU8sR0FBRyxJQUFJLDBCQUFVLENBQUMsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLEtBQUssSUFBSSxHQUFHLENBQUMsSUFBSSxVQUFVLEVBQUU7Z0JBQ3ZFLFVBQVUsRUFBRSxJQUFJLEtBQUssQ0FBQyxLQUFLLElBQUksR0FBRyxDQUFDLElBQUksRUFBRTtnQkFDekMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxxQkFBcUI7YUFDMUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSwwQ0FBbUIsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRTtnQkFDcEMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxJQUFJO2dCQUNyQixhQUFhLEVBQUUsR0FBRyxDQUFDLElBQUk7Z0JBQ3ZCLGNBQWMsRUFBRSx3QkFBYyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDO2dCQUM3RCxXQUFXLEVBQUUsR0FBRyxDQUFDLE1BQU07Z0JBQ3ZCLFFBQVEsRUFBRSxHQUFHLENBQUMsR0FBRztnQkFDakIsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPO2dCQUN4QixPQUFPO2dCQUNQLEdBQUc7Z0JBQ0gsRUFBRTtnQkFDRixHQUFHO2FBQ04sQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUEzQ0Qsb0NBMkNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gXCJhd3MtY2RrLWxpYlwiO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSBcImNvbnN0cnVjdHNcIjtcbmltcG9ydCB7IEluZnJhQ29uZmlnIH0gZnJvbSBcIi4uL3NjaGVtYXMvaW5mcmEuY29uZmlnXCI7XG5pbXBvcnQgeyBWcGMgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWVjMlwiO1xuaW1wb3J0IHsgQ2x1c3RlciwgQ29udGFpbmVySW1hZ2UgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWVjc1wiO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWVsYXN0aWNsb2FkYmFsYW5jaW5ndjJcIjtcbmltcG9ydCB7IEVjc1NlcnZpY2VDb25zdHJ1Y3QgfSBmcm9tIFwiLi4vY29uc3RydWN0cy9lY3NTZXJ2aWNlLmNvbnN0cnVjdFwiO1xuaW1wb3J0IHsgUmVwb3NpdG9yeSwgVGFnTXV0YWJpbGl0eSB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtZWNyXCI7XG5pbXBvcnQgeyBTc21TZWNyZXRzIH0gZnJvbSBcIi4uL2NvbnN0cnVjdHMvc3NtLmNvbnN0cnVjdFwiO1xuXG50eXBlIE1iSW5mcmFQcm9wcyA9IGNkay5TdGFja1Byb3BzICYgSW5mcmFDb25maWcgJiB7IHN0YWdlOiBzdHJpbmcgfTtcblxuZXhwb3J0IGNsYXNzIE1iSW5mcmFTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IE1iSW5mcmFQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHRoaXMsIGAke3Byb3BzLnN0YWdlfS92cGNgLCB7XG4gICAgICAgICAgICBtYXhBenM6IHByb3BzLnZwYy5ub09mQXpzLFxuICAgICAgICAgICAgbmF0R2F0ZXdheXM6IHByb3BzLnZwYy5jcmVhdGVOYXRHYXRld2F5ID8gcHJvcHMudnBjLm5vT2ZOYXRHYXRld2F5cyA6IDAsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgQ2x1c3Rlcih0aGlzLCBgJHtwcm9wcy5zdGFnZX0vY2x1c3RlcmAsIHtcbiAgICAgICAgICAgIHZwYyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgbGIgPSBuZXcgQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIodGhpcywgYCR7cHJvcHMuc3RhZ2V9L2FsYmAsIHtcbiAgICAgICAgICAgIHZwYyxcbiAgICAgICAgICAgIGludGVybmV0RmFjaW5nOiB0cnVlLFxuICAgICAgICB9KTtcblxuICAgICAgICBwcm9wcy5hcHBzLmZvckVhY2goKGFwcCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZWNyID0gbmV3IFJlcG9zaXRvcnkodGhpcywgYCR7cHJvcHMuc3RhZ2V9LSR7YXBwLm5hbWV9YCwge1xuICAgICAgICAgICAgICAgIHJlcG9zaXRvcnlOYW1lOiBhcHAubmFtZSxcbiAgICAgICAgICAgICAgICBpbWFnZVRhZ011dGFiaWxpdHk6IFRhZ011dGFiaWxpdHkuSU1NVVRBQkxFLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNlY3JldHMgPSBuZXcgU3NtU2VjcmV0cyh0aGlzLCBgJHtwcm9wcy5zdGFnZX0vJHthcHAubmFtZX0vU2VjcmV0c2AsIHtcbiAgICAgICAgICAgICAgICBzZWNyZXRQYXRoOiBgLyR7cHJvcHMuc3RhZ2V9LyR7YXBwLm5hbWV9YCxcbiAgICAgICAgICAgICAgICBzZWNyZXRzTmFtZXM6IGFwcC5wYXJhbWV0ZXJTdG9yZVNlY3JldHMsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbmV3IEVjc1NlcnZpY2VDb25zdHJ1Y3QodGhpcywgYXBwLm5hbWUsIHtcbiAgICAgICAgICAgICAgICBzZXJ2aWNlTmFtZTogYXBwLm5hbWUsXG4gICAgICAgICAgICAgICAgY29udGFpbmVyUG9ydDogYXBwLnBvcnQsXG4gICAgICAgICAgICAgICAgY29udGFpbmVySW1hZ2U6IENvbnRhaW5lckltYWdlLmZyb21Bc3NldChhcHAuZG9ja2VySW1hZ2VQYXRoKSxcbiAgICAgICAgICAgICAgICBtZW1vcnlMaW1pdDogYXBwLm1lbW9yeSxcbiAgICAgICAgICAgICAgICBjcHVMaW1pdDogYXBwLmNwdSxcbiAgICAgICAgICAgICAgICBzZWNyZXRzOiBzZWNyZXRzLnNlY3JldHMsXG4gICAgICAgICAgICAgICAgY2x1c3RlcixcbiAgICAgICAgICAgICAgICB2cGMsXG4gICAgICAgICAgICAgICAgbGIsXG4gICAgICAgICAgICAgICAgZWNyLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==