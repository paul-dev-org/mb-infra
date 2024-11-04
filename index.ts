import { pipe } from "./utils/fp";
import { InfraConfig } from "./schemas/infra.config";
import { FILES } from "./conts/files";
import { checkIfConfigFileExists, readConfigFile } from "./utils/config-ops";

export { InfraConfig, infraConfigSchema } from "./schemas/infra.config";
export const config = pipe<string, InfraConfig>(
    `${process.cwd()}/${FILES.INFRA_CONFIG}`,
    checkIfConfigFileExists,
    readConfigFile
);
