import { checkIfConfigFileExists, readConfigFile } from "../../utils/config-ops";
import { pipe } from "../../utils/fp";
import { InfraConfig } from "../../schemas/infra.config";

describe("infra config operations", () => {
    const valid = `${process.cwd()}/test/config/correct.json`;
    const invalid = `${process.cwd()}/test/config/non.json`;
    const wrong = `${process.cwd()}/test/config/wrong.json`;
    it("should check if config file exists", () => {
        const path = checkIfConfigFileExists(valid);
        expect(path).toBe(valid);
    });
    it("should throw error if config file does not exist", () => {
        expect(() => checkIfConfigFileExists(invalid)).toThrow();
    });
    it("should read config file", () => {
        const config = readConfigFile(valid);
        expect(config).toHaveProperty("vpc");
        expect(config).toHaveProperty("services");
        expect(config).toHaveProperty("apps");
    });
    it("should throw error if config file is not valid", () => {
        expect(() => readConfigFile(wrong)).toThrow();
    });
    it("validate config pipe", () => {
        const config = pipe<string, InfraConfig>(valid, checkIfConfigFileExists, readConfigFile);
        expect(config).toHaveProperty("vpc");
        expect(config).toHaveProperty("services");
        expect(config).toHaveProperty("apps");
    });
});
