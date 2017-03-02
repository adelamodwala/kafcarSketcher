import Logger from 'js-logger';

class LoggerFactory {
    constructor() {
        this.logger = Logger;
        this.logger.useDefaults({
            formatter: (messages, context) => {
                // prefix each log message with its caller
                messages.unshift(context.name);

                // prefix each log message with its level
                messages.unshift(context.level.name);

                // prefix each log message with a timestamp.
                messages.unshift(new Date().toISOString());
            }
        });
    }

    /**
     * Retrieves an instance of a logger for a given caller
     * @param caller The name of a class or file that is requesting a logger instance
     */
    getLogger(caller) {
        return this.logger.get(caller);
    }
}

export default new LoggerFactory();