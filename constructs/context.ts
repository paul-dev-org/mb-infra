import { Construct } from "constructs";

export class Context extends Construct {
    public readonly stage: string;
    constructor(scope: Construct, id: string) {
        super(scope, id);
        this.stage = this.node.tryGetContext("stage");
    }
}
