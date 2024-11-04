"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SsmSecrets = void 0;
const constructs_1 = require("constructs");
const aws_ecs_1 = require("aws-cdk-lib/aws-ecs");
const ssm = require("aws-cdk-lib/aws-ssm");
class SsmSecrets extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.secrets = {};
        const { secretPath, secretsNames } = props;
        if (!secretPath || !secretsNames) {
            this.secrets = {};
            return;
        }
        const names = secretsNames.length ? secretsNames : [];
        // const _secrets: {[key: string]: Secret} = {};
        names.forEach((secretName) => {
            this.secrets[secretName] = aws_ecs_1.Secret.fromSsmParameter(ssm.StringParameter.fromStringParameterAttributes(this, `${id}${secretName}`, {
                parameterName: `${secretPath}/${secretName}`,
            }));
        });
        // this.secrets = _secrets;
    }
}
exports.SsmSecrets = SsmSecrets;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3NtLmNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNzbS5jb25zdHJ1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkNBQXVDO0FBQ3ZDLGlEQUE2QztBQUM3QywyQ0FBMkM7QUFPM0MsTUFBYSxVQUFXLFNBQVEsc0JBQVM7SUFFckMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM1RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRkwsWUFBTyxHQUE4QixFQUFFLENBQUM7UUFJcEQsTUFBTSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsR0FBRyxLQUFLLENBQUM7UUFDM0MsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQy9CLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1lBQ2xCLE9BQU87UUFDWCxDQUFDO1FBRUQsTUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDdEQsZ0RBQWdEO1FBQ2hELEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFrQixFQUFFLEVBQUU7WUFDakMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxnQkFBTSxDQUFDLGdCQUFnQixDQUM5QyxHQUFHLENBQUMsZUFBZSxDQUFDLDZCQUE2QixDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxVQUFVLEVBQUUsRUFBRTtnQkFDMUUsYUFBYSxFQUFFLEdBQUcsVUFBVSxJQUFJLFVBQVUsRUFBRTthQUMvQyxDQUFDLENBQ0wsQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUFDO1FBRUgsMkJBQTJCO0lBQy9CLENBQUM7Q0FDSjtBQXZCRCxnQ0F1QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiY29uc3RydWN0c1wiO1xuaW1wb3J0IHsgU2VjcmV0IH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1lY3NcIjtcbmltcG9ydCAqIGFzIHNzbSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLXNzbVwiO1xuXG50eXBlIFNzbVNlY3JldHNQcm9wcyA9IHtcbiAgICBzZWNyZXRQYXRoPzogc3RyaW5nO1xuICAgIHNlY3JldHNOYW1lcz86IHN0cmluZ1tdO1xufTtcblxuZXhwb3J0IGNsYXNzIFNzbVNlY3JldHMgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICAgIHB1YmxpYyByZWFkb25seSBzZWNyZXRzOiB7IFtrZXk6IHN0cmluZ106IFNlY3JldCB9ID0ge307XG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFNzbVNlY3JldHNQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgICAgIGNvbnN0IHsgc2VjcmV0UGF0aCwgc2VjcmV0c05hbWVzIH0gPSBwcm9wcztcbiAgICAgICAgaWYgKCFzZWNyZXRQYXRoIHx8ICFzZWNyZXRzTmFtZXMpIHtcbiAgICAgICAgICAgIHRoaXMuc2VjcmV0cyA9IHt9O1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmFtZXMgPSBzZWNyZXRzTmFtZXMubGVuZ3RoID8gc2VjcmV0c05hbWVzIDogW107XG4gICAgICAgIC8vIGNvbnN0IF9zZWNyZXRzOiB7W2tleTogc3RyaW5nXTogU2VjcmV0fSA9IHt9O1xuICAgICAgICBuYW1lcy5mb3JFYWNoKChzZWNyZXROYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2VjcmV0c1tzZWNyZXROYW1lXSA9IFNlY3JldC5mcm9tU3NtUGFyYW1ldGVyKFxuICAgICAgICAgICAgICAgIHNzbS5TdHJpbmdQYXJhbWV0ZXIuZnJvbVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXModGhpcywgYCR7aWR9JHtzZWNyZXROYW1lfWAsIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyTmFtZTogYCR7c2VjcmV0UGF0aH0vJHtzZWNyZXROYW1lfWAsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHRoaXMuc2VjcmV0cyA9IF9zZWNyZXRzO1xuICAgIH1cbn1cbiJdfQ==