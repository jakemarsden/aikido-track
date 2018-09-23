/**
 * @abstract
 * @see https://stackoverflow.com/a/32749533
 */
export class AbstractError extends Error {
    /**
     * @param {string} message
     * @param {(Error|string|null)} [cause=null]
     */
    constructor(message, cause) {
        if (cause === undefined) {
            cause = null;
        }
        super(message);
        this.name = this.constructor.name;
        /**
         * @type {(Error|string|null)}
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
                this.message = [this.message, `Caused by ${cause}`].join(': ');
                this.stack = [this.stack, `Caused by: ${cause}`].join('\n');
            } else {
                this.message = [this.message, `Caused by ${cause.name}: ${cause.message}`].join(': ');
                this.stack = [this.stack, `Caused by: ${cause.stack}`].join('\n');
            }
        }
    }

    /** @return {(Error|string|null)} */
    get cause() { return this.cause_; }
}

export class IllegalStateError extends AbstractError {}

export class RestEndpointError extends AbstractError {}
