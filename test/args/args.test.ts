import { parsingArgs, validateArgs } from "../../utils/args";
import { pipe } from "../../utils/fp";
import { Args } from "../../schemas/args";

describe("args operations", () => {
    it("should throw error if profile name is not provided", () => {
        expect(() => validateArgs([])).toThrow();
    });
    it("should throw error if region name is not provided", () => {
        expect(() => validateArgs(["--profile", "test"])).toThrow();
    });
    it("should return args", () => {
        const args = ["--profile", "test", "--region", "us-east-1"];
        expect(validateArgs(args)).toEqual(args);
    });
    it("should parse args", () => {
        const args = ["--profile", "test", "--region", "us-east-1"];
        expect(parsingArgs(args)).toEqual({ profile: "test", region: "us-east-1", env: "dev" });
    });
    it("should parse args with env", () => {
        const args = ["--profile", "test", "--region", "us-east-1", "--env", "prod"];
        expect(parsingArgs(args)).toEqual({ profile: "test", region: "us-east-1", env: "prod" });
    });
    it("should parse args with short flags", () => {
        const args = ["-p", "test", "-r", "us-east-1", "-e", "prod"];
        expect(parsingArgs(args)).toEqual({ profile: "test", region: "us-east-1", env: "prod" });
    });
    it("should test pipe", () => {
        const args = ["--profile", "test", "--region", "us-east-1"];
        const result = pipe<string[], Args>(args, validateArgs, parsingArgs);

        expect(result).toEqual({ profile: "test", region: "us-east-1", env: "dev" });
    });
});
