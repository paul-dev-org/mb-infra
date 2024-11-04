"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MbInfraStack = void 0;
const cdk = require("aws-cdk-lib");
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
const aws_ecs_1 = require("aws-cdk-lib/aws-ecs");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWItaW5mcmEtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYi1pbmZyYS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFHbkMsaURBQTBDO0FBQzFDLGlEQUE4QztBQUk5QyxNQUFhLFlBQWEsU0FBUSxHQUFHLENBQUMsS0FBSztJQUN2QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQW1CO1FBQ3pELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBVyxDQUFDO1FBRXpELE1BQU0sR0FBRyxHQUFHLElBQUksYUFBRyxDQUFDLElBQUksRUFBRSxHQUFHLEtBQUssTUFBTSxFQUFFO1lBQ3RDLE1BQU0sRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU87WUFDekIsV0FBVyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzFFLENBQUMsQ0FBQztRQUVILE1BQU0sT0FBTyxHQUFHLElBQUksaUJBQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLLFVBQVUsRUFBRTtZQUNsRCxHQUFHO1NBQ04sQ0FBQyxDQUFDO1FBRUgsdUVBQXVFO1FBQ3ZFLFdBQVc7UUFDWCw0QkFBNEI7UUFDNUIsTUFBTTtRQUVOLGdDQUFnQztRQUNoQyx1RUFBdUU7UUFDdkUsb0NBQW9DO1FBQ3BDLHVEQUF1RDtRQUN2RCxVQUFVO1FBQ1YsRUFBRTtRQUNGLG1GQUFtRjtRQUNuRixxREFBcUQ7UUFDckQsbURBQW1EO1FBQ25ELFVBQVU7UUFDVixFQUFFO1FBQ0YsZ0RBQWdEO1FBQ2hELGlDQUFpQztRQUNqQyxtQ0FBbUM7UUFDbkMseUVBQXlFO1FBQ3pFLG1DQUFtQztRQUNuQyw2QkFBNkI7UUFDN0Isb0NBQW9DO1FBQ3BDLG1CQUFtQjtRQUNuQixlQUFlO1FBQ2YsY0FBYztRQUNkLGVBQWU7UUFDZixVQUFVO1FBQ1YsTUFBTTtJQUNWLENBQUM7Q0FDSjtBQTdDRCxvQ0E2Q0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSBcImF3cy1jZGstbGliXCI7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiY29uc3RydWN0c1wiO1xuaW1wb3J0IHsgSW5mcmFDb25maWcgfSBmcm9tIFwiLi4vc2NoZW1hcy9pbmZyYS5jb25maWdcIjtcbmltcG9ydCB7IFZwYyB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtZWMyXCI7XG5pbXBvcnQgeyBDbHVzdGVyIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1lY3NcIjtcblxudHlwZSBNYkluZnJhUHJvcHMgPSBjZGsuU3RhY2tQcm9wcyAmIEluZnJhQ29uZmlnO1xuXG5leHBvcnQgY2xhc3MgTWJJbmZyYVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTWJJbmZyYVByb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgICAgIGNvbnN0IHN0YWdlID0gdGhpcy5ub2RlLnRyeUdldENvbnRleHQoXCJzdGFnZVwiKSBhcyBzdHJpbmc7XG5cbiAgICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyh0aGlzLCBgJHtzdGFnZX0vdnBjYCwge1xuICAgICAgICAgICAgbWF4QXpzOiBwcm9wcy52cGMubm9PZkF6cyxcbiAgICAgICAgICAgIG5hdEdhdGV3YXlzOiBwcm9wcy52cGMuY3JlYXRlTmF0R2F0ZXdheSA/IHByb3BzLnZwYy5ub09mTmF0R2F0ZXdheXMgOiAwLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBjbHVzdGVyID0gbmV3IENsdXN0ZXIodGhpcywgYCR7c3RhZ2V9L2NsdXN0ZXJgLCB7XG4gICAgICAgICAgICB2cGMsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGNvbnN0IGxiID0gbmV3IEFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKHRoaXMsIGAke3Byb3BzLnN0YWdlfS9hbGJgLCB7XG4gICAgICAgIC8vICAgICB2cGMsXG4gICAgICAgIC8vICAgICBpbnRlcm5ldEZhY2luZzogdHJ1ZSxcbiAgICAgICAgLy8gfSk7XG5cbiAgICAgICAgLy8gcHJvcHMuYXBwcy5mb3JFYWNoKChhcHApID0+IHtcbiAgICAgICAgLy8gICAgIGNvbnN0IGVjciA9IG5ldyBSZXBvc2l0b3J5KHRoaXMsIGAke3Byb3BzLnN0YWdlfS0ke2FwcC5uYW1lfWAsIHtcbiAgICAgICAgLy8gICAgICAgICByZXBvc2l0b3J5TmFtZTogYXBwLm5hbWUsXG4gICAgICAgIC8vICAgICAgICAgaW1hZ2VUYWdNdXRhYmlsaXR5OiBUYWdNdXRhYmlsaXR5LklNTVVUQUJMRSxcbiAgICAgICAgLy8gICAgIH0pO1xuICAgICAgICAvL1xuICAgICAgICAvLyAgICAgY29uc3Qgc2VjcmV0cyA9IG5ldyBTc21TZWNyZXRzKHRoaXMsIGAke3Byb3BzLnN0YWdlfS8ke2FwcC5uYW1lfS9TZWNyZXRzYCwge1xuICAgICAgICAvLyAgICAgICAgIHNlY3JldFBhdGg6IGAvJHtwcm9wcy5zdGFnZX0vJHthcHAubmFtZX1gLFxuICAgICAgICAvLyAgICAgICAgIHNlY3JldHNOYW1lczogYXBwLnBhcmFtZXRlclN0b3JlU2VjcmV0cyxcbiAgICAgICAgLy8gICAgIH0pO1xuICAgICAgICAvL1xuICAgICAgICAvLyAgICAgbmV3IEVjc1NlcnZpY2VDb25zdHJ1Y3QodGhpcywgYXBwLm5hbWUsIHtcbiAgICAgICAgLy8gICAgICAgICBzZXJ2aWNlTmFtZTogYXBwLm5hbWUsXG4gICAgICAgIC8vICAgICAgICAgY29udGFpbmVyUG9ydDogYXBwLnBvcnQsXG4gICAgICAgIC8vICAgICAgICAgY29udGFpbmVySW1hZ2U6IENvbnRhaW5lckltYWdlLmZyb21Bc3NldChhcHAuZG9ja2VySW1hZ2VQYXRoKSxcbiAgICAgICAgLy8gICAgICAgICBtZW1vcnlMaW1pdDogYXBwLm1lbW9yeSxcbiAgICAgICAgLy8gICAgICAgICBjcHVMaW1pdDogYXBwLmNwdSxcbiAgICAgICAgLy8gICAgICAgICBzZWNyZXRzOiBzZWNyZXRzLnNlY3JldHMsXG4gICAgICAgIC8vICAgICAgICAgY2x1c3RlcixcbiAgICAgICAgLy8gICAgICAgICB2cGMsXG4gICAgICAgIC8vICAgICAgICAgbGIsXG4gICAgICAgIC8vICAgICAgICAgZWNyLFxuICAgICAgICAvLyAgICAgfSk7XG4gICAgICAgIC8vIH0pO1xuICAgIH1cbn1cbiJdfQ==