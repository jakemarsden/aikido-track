import {AikRequest, JQueryAjaxRestEndpoint, RequestType} from './endpoint.js';

/**
 * @extends {JQueryAjaxRestEndpoint<GetMembersRequest, GetMembersResponse>}
 * @private
 */
class GetMembersRestEndpoint extends JQueryAjaxRestEndpoint {

    /**
     * @inheritDoc
     * @protected
     */
    createRequestOpts(opts, request, requestTransport) {
        super.createRequestOpts(opts, request, requestTransport);
        opts.url = '/api/member';
    }
}

/**
 * @extends {JQueryAjaxRestEndpoint<PostMembersRequest, PostMembersResponse>}
 * @private
 */
class PostMembersRestEndpoint extends JQueryAjaxRestEndpoint {

    /**
     * @inheritDoc
     * @protected
     */
    createRequestOpts(opts, request, requestTransport) {
        super.createRequestOpts(opts, request, requestTransport);
        opts.url = '/api/member';
    }
}

/**
 * @constant {RestEndpoint<GetMembersRequest, GetMembersResponse>}
 */
export const ENDPOINT_GET_MEMBERS = new GetMembersRestEndpoint();

/**
 * @constant {RestEndpoint<PostMembersRequest, PostMembersResponse>}
 */
export const ENDPOINT_POST_MEMBERS = new PostMembersRestEndpoint();

/**
 * @see com.jakemarsden.aikidotrack.controller.model.GetMembersRequest
 */
export class GetMembersRequest extends AikRequest {

    constructor() {
        super(RequestType.GET);
    }
}

/**
 * @typedef {AikResponse} GetMembersResponse
 * @property {Array<Member>} members
 * @see com.jakemarsden.aikidotrack.controller.model.GetMembersResponse
 */

/**
 * @see com.jakemarsden.aikidotrack.controller.model.PostMembersRequest
 */
export class PostMembersRequest extends AikRequest {

    /**
     * @param {RequestType} reqType
     * @param {Array<Member>) members
     */
    constructor(reqType, members) {
        super(reqType);
        /**
         * @constant {Array<Member>)
         */
        this.members = members;
    }
}

/**
 * @typedef {AikResponse} PostMembersResponse
 * @property {Array<Member>} members
 * @see com.jakemarsden.aikidotrack.controller.model.PostMembersResponse
 */

/**
 * @typedef {Object} Member
 * @property {string} id
 * @property {string} type
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} birthDate
 */
