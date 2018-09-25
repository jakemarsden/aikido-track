import {IllegalStateError} from '../util/error.js';
import {JQueryAjaxRestEndpoint, RestEndpoint} from './endpoint.js';

/**
 * @extends JQueryAjaxRestEndpoint<string, Member[]>
 * @private
 */
class GetMemberRestEndpoint extends JQueryAjaxRestEndpoint {
    constructor() { super(); };

    /**
     * @inheritDoc
     * @protected
     */
    createRequestOpts(request, opts) {
        super.createRequestOpts(request, opts);
        opts.url = `/api/member/${request}`;
    }
}

/**
 * @extends JQueryAjaxRestEndpoint<undefined, Member[]>
 * @private
 */
class GetMembersRestEndpoint extends JQueryAjaxRestEndpoint {
    constructor() { super(); };

    /** @inheritDoc */
    execute() {
        // This endpoint doesn't require a request object
        return super.execute(null);
    }

    /**
     * @inheritDoc
     * @protected
     */
    createRequestOpts(request, opts) {
        super.createRequestOpts(request, opts);
        opts.url = '/api/member';
    }
}

/**
 * @extends JQueryAjaxRestEndpoint<Member, Member>
 * @private
 */
class CreateMemberRestEndpoint extends JQueryAjaxRestEndpoint {
    constructor() { super(); };

    /**
     * @inheritDoc
     * @protected
     */
    createRequestOpts(request, opts) {
        if (request.id != null) {
            throw new IllegalStateError(`Unable to create a Member which has previously been created: ${request}`);
        }
        super.createRequestOpts(request, opts);
        opts.url = '/api/member';
        opts.method = 'POST';
    }
}

/**
 * @extends JQueryAjaxRestEndpoint<Member, Member>
 * @private
 */
class UpdateMemberRestEndpoint extends JQueryAjaxRestEndpoint {
    constructor() { super(); };

    /**
     * @inheritDoc
     * @protected
     */
    createRequestOpts(request, opts) {
        if (request.id == null) {
            throw new IllegalStateError(`Unable to update a Member which hasn't previously been created: ${request}`);
        }
        super.createRequestOpts(request, opts);
        opts.url = `/api/member/${request.id}`;
        opts.method = 'POST';
    }
}

/**
 * @extends RestEndpoint<Member, Member>
 * @private
 */
class CreateOrUpdateMemberRestEndpoint extends RestEndpoint {
    /**
     * @param {RestEndpoint<Member, Member>} createEndpoint
     * @param {RestEndpoint<Member, Member>} updateEndpoint
     */
    constructor(createEndpoint, updateEndpoint) {
        super();
        /**
         * @type {RestEndpoint<Member, Member>} createEndpoint
         * @private
         */
        this.createEndpoint_ = createEndpoint;
        /**
         * @type {RestEndpoint<Member, Member>} updateEndpoint
         * @private
         */
        this.updateEndpoint_ = updateEndpoint;
    }

    /**
     * @param {Member} request
     * @returns {Promise<Member>}
     * @inheritDoc
     */
    execute(request) {
        // If a member has an ID then we can assume it has already been created
        return (request.id == null) ?
                this.createEndpoint_.execute(request) :
                this.updateEndpoint_.execute(request);
    }
}

/**
 * Retrieve the {@link Member} with the specified ID
 *
 * @type {RestEndpoint<string, Member>}
 * @constant
 */
export const ENDPOINT_GET_MEMBER = new GetMemberRestEndpoint();
/**
 * Retrieve a list of all {@link Member}s
 *
 * @type {RestEndpoint<null, Member[]>}
 * @constant
 */
export const ENDPOINT_GET_MEMBERS = new GetMembersRestEndpoint();
/**
 * Create a new {@link Member}
 *
 * @type {RestEndpoint<Member, Member>}
 * @constant
 */
export const ENDPOINT_CREATE_MEMBER = new CreateMemberRestEndpoint();
/**
 * Update a previously created {@link Member}
 *
 * @type {RestEndpoint<Member, Member>}
 * @constant
 */
export const ENDPOINT_UPDATE_MEMBER = new UpdateMemberRestEndpoint();
/**
 * Either create or update a {@link Member} based on whether it has previously been created
 *
 * @type {RestEndpoint<Member, Member>}
 * @constant
 */
export const ENDPOINT_CREATE_OR_UPDATE_MEMBER =
        new CreateOrUpdateMemberRestEndpoint(ENDPOINT_CREATE_MEMBER, ENDPOINT_UPDATE_MEMBER);

/**
 * @typedef {Object} Member
 * @property {string} id
 * @property {string} type
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} birthDate
 */
