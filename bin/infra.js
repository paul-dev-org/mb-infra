#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const cdk = require("aws-cdk-lib");
const fp_1 = require("../utils/fp");
const config_ops_1 = require("../utils/config-ops");
const args_1 = require("../utils/args");
const files_1 = require("../conts/files");
const network_stack_1 = require("../stacks/network.stack");
const config = (0, fp_1.pipe)(`${process.cwd()}/${files_1.FILES.INFRA_CONFIG}`, config_ops_1.checkIfConfigFileExists, config_ops_1.readConfigFile);
const args = (0, fp_1.pipe)(process.argv.slice(2), args_1.validateArgs, args_1.parsingArgs);
const env = {
    account: args.profile,
    region: args.region,
};
const tags = {
    env: args.env,
    managedBy: "mb-infra",
};
const cdkApp = new cdk.App();
new network_stack_1.NetworkStack(cdkApp, `${args.env}Network`, {
    env,
    tags,
    stage: args.env,
    ...config.vpc,
});
// config.apps.forEach((app) => {
//     new MbInfraStack(cdkApp, app.name, {
//         env: env,
//         appConfig: app,
//         tags: tags,
//     });
// });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mcmEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmZyYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx1Q0FBcUM7QUFDckMsbUNBQW1DO0FBQ25DLG9DQUFtQztBQUNuQyxvREFBOEU7QUFFOUUsd0NBQTBEO0FBRTFELDBDQUF1QztBQUN2QywyREFBdUQ7QUFFdkQsTUFBTSxNQUFNLEdBQUcsSUFBQSxTQUFJLEVBQ2YsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksYUFBSyxDQUFDLFlBQVksRUFBRSxFQUN4QyxvQ0FBdUIsRUFDdkIsMkJBQWMsQ0FDakIsQ0FBQztBQUNGLE1BQU0sSUFBSSxHQUFHLElBQUEsU0FBSSxFQUFpQixPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxtQkFBWSxFQUFFLGtCQUFXLENBQUMsQ0FBQztBQUVwRixNQUFNLEdBQUcsR0FBb0I7SUFDekIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO0lBQ3JCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtDQUN0QixDQUFDO0FBQ0YsTUFBTSxJQUFJLEdBQUc7SUFDVCxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7SUFDYixTQUFTLEVBQUUsVUFBVTtDQUN4QixDQUFDO0FBRUYsTUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFN0IsSUFBSSw0QkFBWSxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLFNBQVMsRUFBRTtJQUMzQyxHQUFHO0lBQ0gsSUFBSTtJQUNKLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRztJQUNmLEdBQUcsTUFBTSxDQUFDLEdBQUc7Q0FDaEIsQ0FBQyxDQUFDO0FBRUgsaUNBQWlDO0FBQ2pDLDJDQUEyQztBQUMzQyxvQkFBb0I7QUFDcEIsMEJBQTBCO0FBQzFCLHNCQUFzQjtBQUN0QixVQUFVO0FBQ1YsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbmltcG9ydCBcInNvdXJjZS1tYXAtc3VwcG9ydC9yZWdpc3RlclwiO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gXCJhd3MtY2RrLWxpYlwiO1xuaW1wb3J0IHsgcGlwZSB9IGZyb20gXCIuLi91dGlscy9mcFwiO1xuaW1wb3J0IHsgY2hlY2tJZkNvbmZpZ0ZpbGVFeGlzdHMsIHJlYWRDb25maWdGaWxlIH0gZnJvbSBcIi4uL3V0aWxzL2NvbmZpZy1vcHNcIjtcbmltcG9ydCB7IEFyZ3MgfSBmcm9tIFwiLi4vc2NoZW1hcy9hcmdzXCI7XG5pbXBvcnQgeyBwYXJzaW5nQXJncywgdmFsaWRhdGVBcmdzIH0gZnJvbSBcIi4uL3V0aWxzL2FyZ3NcIjtcbmltcG9ydCB7IEluZnJhQ29uZmlnIH0gZnJvbSBcIi4uL3NjaGVtYXMvaW5mcmEuY29uZmlnXCI7XG5pbXBvcnQgeyBGSUxFUyB9IGZyb20gXCIuLi9jb250cy9maWxlc1wiO1xuaW1wb3J0IHsgTmV0d29ya1N0YWNrIH0gZnJvbSBcIi4uL3N0YWNrcy9uZXR3b3JrLnN0YWNrXCI7XG5cbmNvbnN0IGNvbmZpZyA9IHBpcGU8c3RyaW5nLCBJbmZyYUNvbmZpZz4oXG4gICAgYCR7cHJvY2Vzcy5jd2QoKX0vJHtGSUxFUy5JTkZSQV9DT05GSUd9YCxcbiAgICBjaGVja0lmQ29uZmlnRmlsZUV4aXN0cyxcbiAgICByZWFkQ29uZmlnRmlsZVxuKTtcbmNvbnN0IGFyZ3MgPSBwaXBlPHN0cmluZ1tdLCBBcmdzPihwcm9jZXNzLmFyZ3Yuc2xpY2UoMiksIHZhbGlkYXRlQXJncywgcGFyc2luZ0FyZ3MpO1xuXG5jb25zdCBlbnY6IGNkay5FbnZpcm9ubWVudCA9IHtcbiAgICBhY2NvdW50OiBhcmdzLnByb2ZpbGUsXG4gICAgcmVnaW9uOiBhcmdzLnJlZ2lvbixcbn07XG5jb25zdCB0YWdzID0ge1xuICAgIGVudjogYXJncy5lbnYsXG4gICAgbWFuYWdlZEJ5OiBcIm1iLWluZnJhXCIsXG59O1xuXG5jb25zdCBjZGtBcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5uZXcgTmV0d29ya1N0YWNrKGNka0FwcCwgYCR7YXJncy5lbnZ9TmV0d29ya2AsIHtcbiAgICBlbnYsXG4gICAgdGFncyxcbiAgICBzdGFnZTogYXJncy5lbnYsXG4gICAgLi4uY29uZmlnLnZwYyxcbn0pO1xuXG4vLyBjb25maWcuYXBwcy5mb3JFYWNoKChhcHApID0+IHtcbi8vICAgICBuZXcgTWJJbmZyYVN0YWNrKGNka0FwcCwgYXBwLm5hbWUsIHtcbi8vICAgICAgICAgZW52OiBlbnYsXG4vLyAgICAgICAgIGFwcENvbmZpZzogYXBwLFxuLy8gICAgICAgICB0YWdzOiB0YWdzLFxuLy8gICAgIH0pO1xuLy8gfSk7XG4iXX0=