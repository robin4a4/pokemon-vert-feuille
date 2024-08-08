export class Logger {
    logger_name: string;
    constructor(logger_name: string) {
        this.logger_name = logger_name;
    }
    info(message: string) {
        console.log(`INFO ${this.logger_name}: ${message}`);
    }
    error(message: string) {
        console.error(`Error ${this.logger_name}: ${message}`);
    }
    warn(message: string) {
        console.warn(`Warning ${this.logger_name}: ${message}`);
    }
}
