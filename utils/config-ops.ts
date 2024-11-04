import { existsSync, readFileSync } from "fs";
import { infraConfigSchema } from "../schemas/infra.config";
import { ZodError } from "zod";

export const checkIfConfigFileExists = (filePath: string) => {
    if (!existsSync(filePath)) {
        console.error("Config file does not exist");
        throw new Error("Config file does not exist");
    }
    return filePath;
};

export const readConfigFile = (filePath: string) => {
    try {
        const config = JSON.parse(readFileSync(filePath).toString());
        return infraConfigSchema.parse(config);
    } catch (e) {
        if (e instanceof ZodError) {
            console.error("Error parsing config file", e.errors);
            throw new Error("Error parsing config file");
        }
        console.error("Error reading config file", e);
        throw new Error("Error reading config file");
    }
};
