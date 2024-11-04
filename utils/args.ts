export const validateArgs = (args: string[]) => {
    if (!args.includes("--profile") && !args.includes("-p")) {
        throw new Error("Profile name is required");
    }
    if (!args.includes("--region") && !args.includes("-r")) {
        throw new Error("Region name is required");
    }
    return args;
};

export const parsingArgs = (args: string[]) => {
    return {
        profile: args.includes("--profile") ? args[args.indexOf("--profile") + 1] : args[args.indexOf("-p") + 1],
        region: args.includes("--region") ? args[args.indexOf("--region") + 1] : args[args.indexOf("-r") + 1],
        env: args.includes("--env")
            ? args[args.indexOf("--env") + 1]
            : args.includes("-e")
              ? args[args.indexOf("-e") + 1]
              : "dev",
    };
};
