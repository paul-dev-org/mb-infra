"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readConfigFile = exports.checkIfConfigFileExists = void 0;
const fs_1 = require("fs");
const infra_config_1 = require("../schemas/infra.config");
const zod_1 = require("zod");
const checkIfConfigFileExists = (filePath) => {
    if (!(0, fs_1.existsSync)(filePath)) {
        console.error("Config file does not exist");
        throw new Error("Config file does not exist");
    }
    return filePath;
};
exports.checkIfConfigFileExists = checkIfConfigFileExists;
const readConfigFile = (filePath) => {
    try {
        const config = JSON.parse((0, fs_1.readFileSync)(filePath).toString());
        return infra_config_1.infraConfigSchema.parse(config);
    }
    catch (e) {
        if (e instanceof zod_1.ZodError) {
            console.error("Error parsing config file", e.errors);
            throw new Error("Error parsing config file");
        }
        console.error("Error reading config file", e);
        throw new Error("Error reading config file");
    }
};
exports.readConfigFile = readConfigFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLW9wcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbmZpZy1vcHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkJBQThDO0FBQzlDLDBEQUE0RDtBQUM1RCw2QkFBK0I7QUFFeEIsTUFBTSx1QkFBdUIsR0FBRyxDQUFDLFFBQWdCLEVBQUUsRUFBRTtJQUN4RCxJQUFJLENBQUMsSUFBQSxlQUFVLEVBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztRQUN4QixPQUFPLENBQUMsS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUM7UUFDNUMsTUFBTSxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFDRCxPQUFPLFFBQVEsQ0FBQztBQUNwQixDQUFDLENBQUM7QUFOVyxRQUFBLHVCQUF1QiwyQkFNbEM7QUFFSyxNQUFNLGNBQWMsR0FBRyxDQUFDLFFBQWdCLEVBQUUsRUFBRTtJQUMvQyxJQUFJLENBQUM7UUFDRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUEsaUJBQVksRUFBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQzdELE9BQU8sZ0NBQWlCLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1FBQ1QsSUFBSSxDQUFDLFlBQVksY0FBUSxFQUFFLENBQUM7WUFDeEIsT0FBTyxDQUFDLEtBQUssQ0FBQywyQkFBMkIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDckQsTUFBTSxJQUFJLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1FBQ2pELENBQUM7UUFDRCxPQUFPLENBQUMsS0FBSyxDQUFDLDJCQUEyQixFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzlDLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQztJQUNqRCxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBWlcsUUFBQSxjQUFjLGtCQVl6QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV4aXN0c1N5bmMsIHJlYWRGaWxlU3luYyB9IGZyb20gXCJmc1wiO1xuaW1wb3J0IHsgaW5mcmFDb25maWdTY2hlbWEgfSBmcm9tIFwiLi4vc2NoZW1hcy9pbmZyYS5jb25maWdcIjtcbmltcG9ydCB7IFpvZEVycm9yIH0gZnJvbSBcInpvZFwiO1xuXG5leHBvcnQgY29uc3QgY2hlY2tJZkNvbmZpZ0ZpbGVFeGlzdHMgPSAoZmlsZVBhdGg6IHN0cmluZykgPT4ge1xuICAgIGlmICghZXhpc3RzU3luYyhmaWxlUGF0aCkpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkNvbmZpZyBmaWxlIGRvZXMgbm90IGV4aXN0XCIpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb25maWcgZmlsZSBkb2VzIG5vdCBleGlzdFwiKTtcbiAgICB9XG4gICAgcmV0dXJuIGZpbGVQYXRoO1xufTtcblxuZXhwb3J0IGNvbnN0IHJlYWRDb25maWdGaWxlID0gKGZpbGVQYXRoOiBzdHJpbmcpID0+IHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBjb25maWcgPSBKU09OLnBhcnNlKHJlYWRGaWxlU3luYyhmaWxlUGF0aCkudG9TdHJpbmcoKSk7XG4gICAgICAgIHJldHVybiBpbmZyYUNvbmZpZ1NjaGVtYS5wYXJzZShjb25maWcpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBab2RFcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHBhcnNpbmcgY29uZmlnIGZpbGVcIiwgZS5lcnJvcnMpO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXJyb3IgcGFyc2luZyBjb25maWcgZmlsZVwiKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgcmVhZGluZyBjb25maWcgZmlsZVwiLCBlKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXJyb3IgcmVhZGluZyBjb25maWcgZmlsZVwiKTtcbiAgICB9XG59O1xuIl19