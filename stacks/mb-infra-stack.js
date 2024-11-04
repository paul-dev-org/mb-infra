"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MbInfraStack = void 0;
const cdk = require("aws-cdk-lib");
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
const aws_ecs_1 = require("aws-cdk-lib/aws-ecs");
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
        // const lb = new ApplicationLoadBalancer(this, `${props.stage}/alb`, {
        //     vpc,
        //     internetFacing: true,
        // });
        // props.apps.forEach((app) => {
        //     const ecr = new Repository(this, `${props.stage}-${app.name}`, {
        //         repositoryName: app.name,
        //         imageTagMutability: TagMutability.IMMUTABLE,
        //     });
        //
        //     const secrets = new SsmSecrets(this, `${props.stage}/${app.name}/Secrets`, {
        //         secretPath: `/${props.stage}/${app.name}`,
        //         secretsNames: app.parameterStoreSecrets,
        //     });
        //
        //     new EcsServiceConstruct(this, app.name, {
        //         serviceName: app.name,
        //         containerPort: app.port,
        //         containerImage: ContainerImage.fromAsset(app.dockerImagePath),
        //         memoryLimit: app.memory,
        //         cpuLimit: app.cpu,
        //         secrets: secrets.secrets,
        //         cluster,
        //         vpc,
        //         lb,
        //         ecr,
        //     });
        // });
    }
}
exports.MbInfraStack = MbInfraStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWItaW5mcmEtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYi1pbmZyYS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFHbkMsaURBQTBDO0FBQzFDLGlEQUE4QztBQUk5QyxNQUFhLFlBQWEsU0FBUSxHQUFHLENBQUMsS0FBSztJQUN2QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQW1CO1FBQ3pELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sR0FBRyxHQUFHLElBQUksYUFBRyxDQUFDLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxLQUFLLE1BQU0sRUFBRTtZQUM1QyxNQUFNLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPO1lBQ3pCLFdBQVcsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMxRSxDQUFDLENBQUM7UUFFSCxNQUFNLE9BQU8sR0FBRyxJQUFJLGlCQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLEtBQUssVUFBVSxFQUFFO1lBQ3hELEdBQUc7U0FDTixDQUFDLENBQUM7UUFFSCx1RUFBdUU7UUFDdkUsV0FBVztRQUNYLDRCQUE0QjtRQUM1QixNQUFNO1FBRU4sZ0NBQWdDO1FBQ2hDLHVFQUF1RTtRQUN2RSxvQ0FBb0M7UUFDcEMsdURBQXVEO1FBQ3ZELFVBQVU7UUFDVixFQUFFO1FBQ0YsbUZBQW1GO1FBQ25GLHFEQUFxRDtRQUNyRCxtREFBbUQ7UUFDbkQsVUFBVTtRQUNWLEVBQUU7UUFDRixnREFBZ0Q7UUFDaEQsaUNBQWlDO1FBQ2pDLG1DQUFtQztRQUNuQyx5RUFBeUU7UUFDekUsbUNBQW1DO1FBQ25DLDZCQUE2QjtRQUM3QixvQ0FBb0M7UUFDcEMsbUJBQW1CO1FBQ25CLGVBQWU7UUFDZixjQUFjO1FBQ2QsZUFBZTtRQUNmLFVBQVU7UUFDVixNQUFNO0lBQ1YsQ0FBQztDQUNKO0FBM0NELG9DQTJDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tIFwiYXdzLWNkay1saWJcIjtcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJjb25zdHJ1Y3RzXCI7XG5pbXBvcnQgeyBJbmZyYUNvbmZpZyB9IGZyb20gXCIuLi9zY2hlbWFzL2luZnJhLmNvbmZpZ1wiO1xuaW1wb3J0IHsgVnBjIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1lYzJcIjtcbmltcG9ydCB7IENsdXN0ZXIgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWVjc1wiO1xuXG50eXBlIE1iSW5mcmFQcm9wcyA9IGNkay5TdGFja1Byb3BzICYgSW5mcmFDb25maWcgJiB7IHN0YWdlOiBzdHJpbmcgfTtcblxuZXhwb3J0IGNsYXNzIE1iSW5mcmFTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IE1iSW5mcmFQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHRoaXMsIGAke3Byb3BzLnN0YWdlfS92cGNgLCB7XG4gICAgICAgICAgICBtYXhBenM6IHByb3BzLnZwYy5ub09mQXpzLFxuICAgICAgICAgICAgbmF0R2F0ZXdheXM6IHByb3BzLnZwYy5jcmVhdGVOYXRHYXRld2F5ID8gcHJvcHMudnBjLm5vT2ZOYXRHYXRld2F5cyA6IDAsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgQ2x1c3Rlcih0aGlzLCBgJHtwcm9wcy5zdGFnZX0vY2x1c3RlcmAsIHtcbiAgICAgICAgICAgIHZwYyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gY29uc3QgbGIgPSBuZXcgQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIodGhpcywgYCR7cHJvcHMuc3RhZ2V9L2FsYmAsIHtcbiAgICAgICAgLy8gICAgIHZwYyxcbiAgICAgICAgLy8gICAgIGludGVybmV0RmFjaW5nOiB0cnVlLFxuICAgICAgICAvLyB9KTtcblxuICAgICAgICAvLyBwcm9wcy5hcHBzLmZvckVhY2goKGFwcCkgPT4ge1xuICAgICAgICAvLyAgICAgY29uc3QgZWNyID0gbmV3IFJlcG9zaXRvcnkodGhpcywgYCR7cHJvcHMuc3RhZ2V9LSR7YXBwLm5hbWV9YCwge1xuICAgICAgICAvLyAgICAgICAgIHJlcG9zaXRvcnlOYW1lOiBhcHAubmFtZSxcbiAgICAgICAgLy8gICAgICAgICBpbWFnZVRhZ011dGFiaWxpdHk6IFRhZ011dGFiaWxpdHkuSU1NVVRBQkxFLFxuICAgICAgICAvLyAgICAgfSk7XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgICBjb25zdCBzZWNyZXRzID0gbmV3IFNzbVNlY3JldHModGhpcywgYCR7cHJvcHMuc3RhZ2V9LyR7YXBwLm5hbWV9L1NlY3JldHNgLCB7XG4gICAgICAgIC8vICAgICAgICAgc2VjcmV0UGF0aDogYC8ke3Byb3BzLnN0YWdlfS8ke2FwcC5uYW1lfWAsXG4gICAgICAgIC8vICAgICAgICAgc2VjcmV0c05hbWVzOiBhcHAucGFyYW1ldGVyU3RvcmVTZWNyZXRzLFxuICAgICAgICAvLyAgICAgfSk7XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgICBuZXcgRWNzU2VydmljZUNvbnN0cnVjdCh0aGlzLCBhcHAubmFtZSwge1xuICAgICAgICAvLyAgICAgICAgIHNlcnZpY2VOYW1lOiBhcHAubmFtZSxcbiAgICAgICAgLy8gICAgICAgICBjb250YWluZXJQb3J0OiBhcHAucG9ydCxcbiAgICAgICAgLy8gICAgICAgICBjb250YWluZXJJbWFnZTogQ29udGFpbmVySW1hZ2UuZnJvbUFzc2V0KGFwcC5kb2NrZXJJbWFnZVBhdGgpLFxuICAgICAgICAvLyAgICAgICAgIG1lbW9yeUxpbWl0OiBhcHAubWVtb3J5LFxuICAgICAgICAvLyAgICAgICAgIGNwdUxpbWl0OiBhcHAuY3B1LFxuICAgICAgICAvLyAgICAgICAgIHNlY3JldHM6IHNlY3JldHMuc2VjcmV0cyxcbiAgICAgICAgLy8gICAgICAgICBjbHVzdGVyLFxuICAgICAgICAvLyAgICAgICAgIHZwYyxcbiAgICAgICAgLy8gICAgICAgICBsYixcbiAgICAgICAgLy8gICAgICAgICBlY3IsXG4gICAgICAgIC8vICAgICB9KTtcbiAgICAgICAgLy8gfSk7XG4gICAgfVxufVxuIl19