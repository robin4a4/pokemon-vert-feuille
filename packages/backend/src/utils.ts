export class Logger {
    logger_name: string;
    constructor(logger_name: string) {
        this.logger_name = logger_name;
    }
    info(message: string) {
        console.log(`[INFO] ${this.logger_name}: ${message}`);
    }
    error(message: string) {
        console.error(`[ERROR] ${this.logger_name}: ${message}`);
    }
    warn(message: string) {
        console.warn(`[WARN] ${this.logger_name}: ${message}`);
    }
}
