#!/usr/bin/env node

import { join } from "path";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { FILES } from "../conts/files";
import { log } from "../utils/logger";

const createDummyConfig = () => {
    const fileName = FILES.INFRA_CONFIG;
    const filePath = join(process.cwd(), fileName);

    if (existsSync(filePath)) {
        log.warn("File already exists");
        log.warn("If you want to create a new file, please delete the existing file");
        return;
    }

    const template = readFileSync(join(__dirname, "template"));
    writeFileSync(filePath, template);

    console.log("File created successfully");
};

createDummyConfig();
