import $ from 'jquery';
import {RestEndpointError} from '../util/error.js';

/**
 * A `RestEndpoint<undefined, ?>` is an endpoint which doesn't require a request object (`undefined` should be passed
 * to its {@link RestEndpoint#execute} method)
 *
 * @template TReq, TResp
 * @abstract
 */
export class RestEndpoint {
    /** @protected */
    constructor() {}

    /**
     * @param {TReq} request Pass `undefined` if the endpoint is of type `RestEndpoint<undefined, ?>` (ie. if it
     *         doesn't take a request object)
     * @return Promise<TResp>
     * @abstract
     */
    execute(request) {}
}

/**
 * @extends RestEndpoint<TReq, TResp>
 * @template TReq, TResp
 * @abstract
 */
export class AjaxRestEndpoint extends RestEndpoint {
    /**
     * @param {string} [name=] The name of the endpoint to use for logging. Defaults to the name of the concrete
     *         subclass
     * @protected
     */
    constructor(name) {
        super();
        /**
         * @type {string}
         * @private
         */
        this.name_ = name || this.constructor.name;
    }

    /** @inheritDoc */
    execute(request) {
        const jsonRequest = request === undefined ? undefined : this.createRequestJson(request);
        return this.executeAjax(request, jsonRequest)
                .then(
                        responseJson => this.parseResponseJson(responseJson),
                        reason => new RestEndpointError(`Failed to execute ${this.name_}`, reason));
    }

    /**
     * @param {TReq} request The request object or `undefined` if no request object is required for the endpoint
     * @param {string} requestJson
     * @return {Promise<Object>}
     * @protected
     * @abstract
     */
    executeAjax(request, requestJson) {}

    /**
     * The `TReq` request object needs to be serialised to a JSON string for transmission. This method defines how
     * this is done. Can be overridden by subclasses
     *
     * @param {TReq} request The request object
     * @return {string} The request JSON
     * @protected
     */
    createRequestJson(request) {
        return JSON.stringify(request);
    }

    /**
     * The transmitted `TResp` response object needs to be deserialised from a JSON string. This method defines how
     * this is done. Can be overridden by subclasses. Note that this method isn't *actually* passed a JSON string, but
     * an Object created using `JSON.parse`
     *
     * @param {Object} responseJson
     * @return {TResp}
     * @protected
     */
    parseResponseJson(responseJson) {
        return responseJson;
    }
}

/**
 * @extends AjaxRestEndpoint<TReq, TResp>
 * @template TReq, TResp
 * @abstract
 */
export class JQueryAjaxRestEndpoint extends AjaxRestEndpoint {
    /**
     * @inheritDoc
     * @protected
     */
    constructor(name) { super(name); }

    /**
     * @inheritDoc
     * @protected
     */
    executeAjax(request, requestJson) {
        const opts = {};
        if (requestJson !== undefined) {
            opts.data = requestJson;
        }
        this.createRequestOpts(request, opts);
        return $.ajax(opts);
    }

    /**
     * Example implementation:
     *
     * ```JavaScript
     * /** @extends JQueryAjaxRestEndpoint<MyRequestType, MyRestType>
     * class MyRestEndpoint extends JQueryAjaxRestEndpoint {
     *     // ...
     *     createRequestOpts(request, requestJson, opts) {
     *         super.createRequestOpts(request, requestJson, opts);
     *         opts.url = `/api/member/${request.id}`;
     *         // ...further customisation of opts if required
     *     }
     * }
     * ```
     *
     * @param {TReq} request The request object or `undefined` if no request object is required for the endpoint
     * @param {Object} opts
     * @protected
     * @abstract
     */
    createRequestOpts(request, opts) {
        opts.cache = false;
        opts.contentType = 'application/json;charset=UTF-8';
        opts.dataType = 'json';
        opts.method = 'GET';
    }
}
