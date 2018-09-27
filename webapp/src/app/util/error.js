/**
 * @abstract
 * @see https://stackoverflow.com/a/32749533
 */
export class AbstractError extends Error {
    /**
     * @param {string} message
     * @param {(Error|string|null)=} cause
     */
    constructor(message, cause = null) {
        super(message);
        this.name = this.constructor.name;
        /**
         * @constant {(Error|string|null)}
         * @private
         */
        this.cause_ = cause;

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }

        if (cause !== null) {
            if (typeof cause === 'string') {
                this.message += `:\nCaused by: ${cause}`;
            } else {
                this.message += `:\nCaused by ${cause.name}: ${cause.message}`;
                this.stack = [this.stack, frame(), frame('Caused by\:'), frame(), cause.stack].join('\n');
            }
        }
    }

    /** @return {(Error|string|null)} */
    get cause() { return this.cause_; }
}

export class IllegalStateError extends AbstractError {}

export class RestEndpointError extends AbstractError {}

/**
 * Firefox doesn't like logging stack traces with "invalid" frames (ie. frames which don't match the below format).
 * Firefox also truncates frames with an empty function name, but not those with a *blank* function name.
 * **Untested for other browsers**
 * @param {string=} functionName
 */
function frame(functionName = ' ') {
    return `${functionName}@::`;
}
