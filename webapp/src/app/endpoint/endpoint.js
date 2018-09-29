import $ from 'jquery';
import {RestEndpointError} from '../util/error.js';

/**
 * Baseclass for the endpoints the application may wish to execute
 *
 *  - `TReq` should represent an implementation of {@link AikRequest}
 *  - `TResp` should represent an implementation of {@link AikResponse}
 *
 * @template TReq, TResp
 * @abstract
 */
export class RestEndpoint {

    /**
     * @protected
     */
    constructor() {
    }

    /**
     * @param {TReq} request
     * @return {Promise<TResp>}
     * @abstract
     */
    execute(request) {
    }
}

/**
 * @extends {RestEndpoint<TReq, TResp>}
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
         * @constant {string}
         * @private
         */
        this.name_ = name || this.constructor.name;
    }

    /**
     * @inheritDoc
     */
    execute(request) {
        let requestTransport;
        try {
            requestTransport = this.serializeRequest(request);
        } catch (err) {
            throw new RestEndpointError(`Unable to serialize request for transport: ${request}`, err);
        }
        return this.executeAjax(request, requestTransport)
                .catch(reason => {
                    const err = new RestEndpointError(`Failed to execute ${this.name_}`, reason);
                    console.error(err);
                    throw err;
                })
                .then(responseTransport => {
                    try {
                        return this.deserializeResponse(responseTransport);
                    } catch (err) {
                        throw new RestEndpointError(`Unable to deserialize response: ${responseTransport}`, err);
                    }
                });
    }

    /**
     * @param {TReq} request The request object
     * @param {string} requestTransport The serialized request
     * @return {Promise<Object>} A promise for the serialized response
     * @protected
     * @abstract
     */
    executeAjax(request, requestTransport) {
    }

    /**
     * The `TReq` {@link AikRequest request object} needs to be serialised before transport. Subclasses may override
     * this method to define how request serialization should occur
     * @param {TReq} request The request object produced by the application
     * @return {string} The serialized request ready for transport to the endpoint
     * @protected
     */
    serializeRequest(request) {
        switch (request.requestType) {
            case RequestType.GET:
                // HTTP GET requests don't have bodies so the default behaviour is not to include one. Generally
                // subclasses should add any necessary info from the request object as URI query parameters
                return undefined;
            default:
                return JSON.stringify(request);
        }
    }

    /**
     * The response needs to be deserialised to a `TResp` {@link AikResponse response object} after transport.
     * Subclasses may override this method to define how response deserialization should occur
     * @param {Object} responseTransport The serialized response retrieved from the endpoint
     * @return {TResp} The deserialized response object ready for consumption by the application
     * @protected
     */
    deserializeResponse(responseTransport) {
        return responseTransport
    }
}

/**
 * @extends {AjaxRestEndpoint<TReq, TResp>}
 * @template TReq, TResp
 * @abstract
 */
export class JQueryAjaxRestEndpoint extends AjaxRestEndpoint {

    /**
     * @inheritDoc
     * @protected
     */
    executeAjax(request, requestTransport) {
        const opts = {};
        this.createRequestOpts(opts, request, requestTransport);
        return new Promise((resolve, reject) => {
            $.ajax(opts)
                    .fail((jqXhr, textStatus, errorThrown) => reject(jqXhr.responseText))
                    .done((data, textStatus, jqXhr) => resolve(data));
        });
    }

    /**
     * @param {Object} opts
     * @param {TReq} request The request object
     * @param {string} requestTransport The serialized request
     * @protected
     * @abstract
     */
    createRequestOpts(opts, request, requestTransport) {
        switch (request.requestType) {
            case RequestType.GET:
                opts.method = 'GET';
                break;
            case RequestType.CREATE:
            case RequestType.UPDATE:
                opts.method = 'POST';
                break;
            default:
                // Not necessarily an issue so long as the subclass knows what the hell to do with it because we sure
                // as hell don't...
                break;
        }
        opts.cache = false;

        opts.accepts = { 'json': 'application/json;charset=UTF-8' };
        opts.contentType = 'application/json;charset=UTF-8';
        opts.dataType = 'json';
        opts.data = requestTransport;
    }
}

/**
 * Baseclass for the application's request objects
 * @see com.jakemarsden.aikidotrack.controller.model.AikRequest
 */
export class AikRequest {

    /**
     * @param {RequestType} reqType
     */
    constructor(reqType) {
        /**
         * @constant {RequestType}
         */
        this.requestType = reqType;
    }
}

/**
 * Baseclass for the application's response objects
 * @typedef {Object} AikResponse
 * @property {RequestType} requestType
 * @see com.jakemarsden.aikidotrack.controller.model.AikResponse
 */

/**
 * @enum {string}
 * @see com.jakemarsden.aikidotrack.controller.model.RequestType
 */
export const RequestType = {
    GET: 'Get',
    CREATE: 'Create',
    UPDATE: 'Update'
};
