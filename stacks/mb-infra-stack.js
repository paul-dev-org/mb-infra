"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MbInfraStack = void 0;
const cdk = require("aws-cdk-lib");
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
const aws_ecs_1 = require("aws-cdk-lib/aws-ecs");
const aws_elasticloadbalancingv2_1 = require("aws-cdk-lib/aws-elasticloadbalancingv2");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWItaW5mcmEtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYi1pbmZyYS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFHbkMsaURBQTBDO0FBQzFDLGlEQUE4QztBQUM5Qyx1RkFBaUY7QUFJakYsTUFBYSxZQUFhLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDdkMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFtQjtRQUN6RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEdBQUcsR0FBRyxJQUFJLGFBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsS0FBSyxNQUFNLEVBQUU7WUFDNUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTztZQUN6QixXQUFXLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDMUUsQ0FBQyxDQUFDO1FBRUgsTUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxLQUFLLFVBQVUsRUFBRTtZQUN4RCxHQUFHO1NBQ04sQ0FBQyxDQUFDO1FBRUgsTUFBTSxFQUFFLEdBQUcsSUFBSSxvREFBdUIsQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsS0FBSyxNQUFNLEVBQUU7WUFDL0QsR0FBRztZQUNILGNBQWMsRUFBRSxJQUFJO1NBQ3ZCLENBQUMsQ0FBQztRQUVILGdDQUFnQztRQUNoQyx1RUFBdUU7UUFDdkUsb0NBQW9DO1FBQ3BDLHVEQUF1RDtRQUN2RCxVQUFVO1FBQ1YsRUFBRTtRQUNGLG1GQUFtRjtRQUNuRixxREFBcUQ7UUFDckQsbURBQW1EO1FBQ25ELFVBQVU7UUFDVixFQUFFO1FBQ0YsZ0RBQWdEO1FBQ2hELGlDQUFpQztRQUNqQyxtQ0FBbUM7UUFDbkMseUVBQXlFO1FBQ3pFLG1DQUFtQztRQUNuQyw2QkFBNkI7UUFDN0Isb0NBQW9DO1FBQ3BDLG1CQUFtQjtRQUNuQixlQUFlO1FBQ2YsY0FBYztRQUNkLGVBQWU7UUFDZixVQUFVO1FBQ1YsTUFBTTtJQUNWLENBQUM7Q0FDSjtBQTNDRCxvQ0EyQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSBcImF3cy1jZGstbGliXCI7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiY29uc3RydWN0c1wiO1xuaW1wb3J0IHsgSW5mcmFDb25maWcgfSBmcm9tIFwiLi4vc2NoZW1hcy9pbmZyYS5jb25maWdcIjtcbmltcG9ydCB7IFZwYyB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtZWMyXCI7XG5pbXBvcnQgeyBDbHVzdGVyIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1lY3NcIjtcbmltcG9ydCB7IEFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1lbGFzdGljbG9hZGJhbGFuY2luZ3YyXCI7XG5cbnR5cGUgTWJJbmZyYVByb3BzID0gY2RrLlN0YWNrUHJvcHMgJiBJbmZyYUNvbmZpZyAmIHsgc3RhZ2U6IHN0cmluZyB9O1xuXG5leHBvcnQgY2xhc3MgTWJJbmZyYVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTWJJbmZyYVByb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGModGhpcywgYCR7cHJvcHMuc3RhZ2V9L3ZwY2AsIHtcbiAgICAgICAgICAgIG1heEF6czogcHJvcHMudnBjLm5vT2ZBenMsXG4gICAgICAgICAgICBuYXRHYXRld2F5czogcHJvcHMudnBjLmNyZWF0ZU5hdEdhdGV3YXkgPyBwcm9wcy52cGMubm9PZk5hdEdhdGV3YXlzIDogMCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBDbHVzdGVyKHRoaXMsIGAke3Byb3BzLnN0YWdlfS9jbHVzdGVyYCwge1xuICAgICAgICAgICAgdnBjLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBsYiA9IG5ldyBBcHBsaWNhdGlvbkxvYWRCYWxhbmNlcih0aGlzLCBgJHtwcm9wcy5zdGFnZX0vYWxiYCwge1xuICAgICAgICAgICAgdnBjLFxuICAgICAgICAgICAgaW50ZXJuZXRGYWNpbmc6IHRydWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHByb3BzLmFwcHMuZm9yRWFjaCgoYXBwKSA9PiB7XG4gICAgICAgIC8vICAgICBjb25zdCBlY3IgPSBuZXcgUmVwb3NpdG9yeSh0aGlzLCBgJHtwcm9wcy5zdGFnZX0tJHthcHAubmFtZX1gLCB7XG4gICAgICAgIC8vICAgICAgICAgcmVwb3NpdG9yeU5hbWU6IGFwcC5uYW1lLFxuICAgICAgICAvLyAgICAgICAgIGltYWdlVGFnTXV0YWJpbGl0eTogVGFnTXV0YWJpbGl0eS5JTU1VVEFCTEUsXG4gICAgICAgIC8vICAgICB9KTtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgIGNvbnN0IHNlY3JldHMgPSBuZXcgU3NtU2VjcmV0cyh0aGlzLCBgJHtwcm9wcy5zdGFnZX0vJHthcHAubmFtZX0vU2VjcmV0c2AsIHtcbiAgICAgICAgLy8gICAgICAgICBzZWNyZXRQYXRoOiBgLyR7cHJvcHMuc3RhZ2V9LyR7YXBwLm5hbWV9YCxcbiAgICAgICAgLy8gICAgICAgICBzZWNyZXRzTmFtZXM6IGFwcC5wYXJhbWV0ZXJTdG9yZVNlY3JldHMsXG4gICAgICAgIC8vICAgICB9KTtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgIG5ldyBFY3NTZXJ2aWNlQ29uc3RydWN0KHRoaXMsIGFwcC5uYW1lLCB7XG4gICAgICAgIC8vICAgICAgICAgc2VydmljZU5hbWU6IGFwcC5uYW1lLFxuICAgICAgICAvLyAgICAgICAgIGNvbnRhaW5lclBvcnQ6IGFwcC5wb3J0LFxuICAgICAgICAvLyAgICAgICAgIGNvbnRhaW5lckltYWdlOiBDb250YWluZXJJbWFnZS5mcm9tQXNzZXQoYXBwLmRvY2tlckltYWdlUGF0aCksXG4gICAgICAgIC8vICAgICAgICAgbWVtb3J5TGltaXQ6IGFwcC5tZW1vcnksXG4gICAgICAgIC8vICAgICAgICAgY3B1TGltaXQ6IGFwcC5jcHUsXG4gICAgICAgIC8vICAgICAgICAgc2VjcmV0czogc2VjcmV0cy5zZWNyZXRzLFxuICAgICAgICAvLyAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIC8vICAgICAgICAgdnBjLFxuICAgICAgICAvLyAgICAgICAgIGxiLFxuICAgICAgICAvLyAgICAgICAgIGVjcixcbiAgICAgICAgLy8gICAgIH0pO1xuICAgICAgICAvLyB9KTtcbiAgICB9XG59XG4iXX0=