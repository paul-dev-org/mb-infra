export class log {
    static info(message: string) {
        console.info('\x1b[34m%s\x1b[0m',`[INFO]: ${message}`);
    }

    static error(message: string) {
        console.error('\x1b[31m%s\x1b[0m',`[ERROR]: ${message} \n`);
    }

    static success(message: string) {
        console.log('\x1b[32m%s\x1b[0m', `[SUCCESS]: ${message} \n`);
    }

    static warn(message: string) {
        console.warn('\x1b[33m%s\x1b[0m', `[WARNING]: ${message} \n`);
    }

    static debug(message: string) {
        console.debug(`[DEBUG]: ${message}`);
    }
}