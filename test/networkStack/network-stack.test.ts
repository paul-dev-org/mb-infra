import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { NetworkStack } from "../../stacks/network.stack";
import { pipe } from "../../utils/fp";
import { InfraConfig } from "../../schemas/infra.config";
import { checkIfConfigFileExists, readConfigFile } from "../../utils/config-ops";
import { Args } from "../../schemas/args";
import { parsingArgs, validateArgs } from "../../utils/args";

test("Network Stack", () => {
    const valid = `${process.cwd()}/test/config/correct.json`;
    const config = pipe<string, InfraConfig>(valid, checkIfConfigFileExists, readConfigFile);
    const argsInput = ["--profile", "test", "--region", "us-east-1"];
    const args = pipe<string[], Args>(argsInput, validateArgs, parsingArgs);

    const app = new cdk.App();
    const stack = new NetworkStack(app, "MyTestStack", {
        stage: args.env,
        noOfAzs: config.vpc.noOfAzs,
        createNatGateway: config.vpc.createNatGateway,
        noOfNatGateways: config.vpc.noOfNatGateways,
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties("AWS::EC2::VPC", {
        EnableDnsSupport: true,
        EnableDnsHostnames: true,
    });
    template.hasResourceProperties("AWS::EC2::InternetGateway", {
        Tags: [
            {
                Key: "Name",
                Value: "MyTestStack/devVpc",
            },
        ],
    });
    template.hasResource("AWS::ECS::Cluster", {});
    template.hasResourceProperties("AWS::ElasticLoadBalancingV2::LoadBalancer", {
        Scheme: "internet-facing",
    });
});
