import {DateTime, Duration} from "luxon";
import {fromIsoDateAndTime} from "../util/date-time-utils.js";
import {IllegalStateError} from "../util/error.js";
import {AikRequest, JQueryAjaxRestEndpoint, RequestType} from "./endpoint.js";

/**
 * @extends {JQueryAjaxRestEndpoint<GetSessionsRequest, GetSessionsResponse>}
 * @private
 */
class GetSessionsRestEndpoint extends JQueryAjaxRestEndpoint {

    /**
     * @inheritDoc
     * @protected
     */
    createRequestOpts(opts, request, requestTransport) {
        super.createRequestOpts(opts, request, requestTransport);
        opts.url = request.date === null ? '/api/session' : `/api/session/${request.date.toISODate()}`;
    }

    /**
     * @inheritDoc
     * @protected
     */
    deserializeResponse(responseTransport) {
        const response = super.deserializeResponse(responseTransport);
        response.sessions = response.sessions.map(session => deserializeSession(session));
        return response;
    }
}

/**
 * @extends {JQueryAjaxRestEndpoint<PostSessionsRequest, PostSessionsResponse>}
 * @private
 */
class PostSessionsRestEndpoint extends JQueryAjaxRestEndpoint {

    /**
     * @inheritDoc
     * @protected
     */
    createRequestOpts(opts, request, requestTransport) {
        super.createRequestOpts(opts, request, requestTransport);
        opts.url = '/api/session';
    }

    /**
     * @inheritDoc
     * @protected
     */
    serializeRequest(request) {
        request.sessions = request.sessions.map(session => serializeSession(session));
        return super.serializeRequest(request);
    }

    /**
     * @inheritDoc
     * @protected
     */
    deserializeResponse(responseTransport) {
        const response = super.deserializeResponse(responseTransport);
        response.sessions = response.sessions.map(session => deserializeSession(session));
        return response;
    }
}

/**
 * @extends {JQueryAjaxRestEndpoint<GetSessionAttendancesRequest, GetSessionAttendancesResponse>}
 * @private
 */
class GetSessionAttendancesRestEndpoint extends JQueryAjaxRestEndpoint {

    /**
     * @inheritDoc
     * @protected
     */
    createRequestOpts(opts, request, requestTransport) {
        super.createRequestOpts(opts, request, requestTransport);
        opts.url = `/api/session/${request.sessionId}/attendance`;
    }
}

/**
 * @extends {JQueryAjaxRestEndpoint<PostSessionAttendancesRequest, PostSessionAttendancesResponse>}
 * @private
 */
class PostSessionAttendancesRestEndpoint extends JQueryAjaxRestEndpoint {

    /**
     * @inheritDoc
     * @protected
     */
    createRequestOpts(opts, request, requestTransport) {
        super.createRequestOpts(opts, request, requestTransport);
        opts.url = `/api/session/attendance`;
    }
}

/**
 * @param {Session} session
 * @return {Object}
 */
function serializeSession(session) {
    const sessionTransport = {};
    sessionTransport.id = session.id;
    sessionTransport.type = session.type;
    sessionTransport.date = session.dateTime && session.dateTime.toISODate();
    sessionTransport.time = session.dateTime && session.dateTime.toISOTime({ includeOffset: false });
    sessionTransport.duration = session.duration && session.duration.toISO();
    sessionTransport.presentMemberCount = null;
    sessionTransport.absentMemberCount = null;
    return sessionTransport;
}

/**
 * @param {Object} sessionTransport
 * @return {Session}
 */
function deserializeSession(sessionTransport) {
    const session = {};
    session.id = sessionTransport.id;
    session.type = sessionTransport.type;
    session.dateTime = sessionTransport.date && sessionTransport.time &&
            fromIsoDateAndTime(sessionTransport.date, sessionTransport.time);
    session.duration = sessionTransport.duration && Duration.fromISO(sessionTransport.duration);
    session.presentMemberCount = sessionTransport.presentMemberCount;
    session.absentMemberCount = sessionTransport.absentMemberCount;
    return session;
}

/**
 * @constant {RestEndpoint<GetSessionsRequest, GetSessionsResponse>}
 */
export const ENDPOINT_GET_SESSIONS = new GetSessionsRestEndpoint();

/**
 * @constant {RestEndpoint<PostSessionsRequest, PostSessionsResponse>}
 */
export const ENDPOINT_POST_SESSIONS = new PostSessionsRestEndpoint();

/**
 * @constant {RestEndpoint<GetSessionAttendancesRequest, GetSessionAttendancesResponse>}
 */
export const ENDPOINT_GET_SESSION_ATTENDANCES = new GetSessionAttendancesRestEndpoint();

/**
 * @constant {RestEndpoint<PostSessionAttendancesRequest, PostSessionAttendancesResponse>}
 */
export const ENDPOINT_POST_SESSION_ATTENDANCES = new PostSessionAttendancesRestEndpoint();

/**
 * @see com.jakemarsden.aikidotrack.controller.model.GetSessionsRequest
 */
export class GetSessionsRequest extends AikRequest {

    /**
     * @param {(DateTime|null)} date `null` if you don't want to filter results by date
     */
    constructor(date) {
        super(RequestType.GET);
        /**
         * @constant {(DateTime|null)} date
         */
        this.date = date || null;
    }
}

/**
 * @typedef {AikResponse} GetSessionsResponse
 * @property {Array<Session>} sessions
 * @see com.jakemarsden.aikidotrack.controller.model.GetSessionsResponse
 */

/**
 * @see com.jakemarsden.aikidotrack.controller.model.PostSessionsRequest
 */
export class PostSessionsRequest extends AikRequest {

    /**
     * @param {RequestType} reqType
     * @param {Array<Session>} sessions
     */
    constructor(reqType, sessions) {
        super(reqType);
        /**
         * @constant {Array<Session>)
         */
        this.sessions = sessions;
    }
}

/**
 * @typedef {AikResponse} PostSessionsResponse
 * @property {Array<Session>} sessions
 * @see com.jakemarsden.aikidotrack.controller.model.PostSessionsResponse
 */

/**
 * @see com.jakemarsden.aikidotrack.controller.model.GetSessionAttendancesRequest
 */
export class GetSessionAttendancesRequest extends AikRequest {

    /**
     * @param {string} sessionId
     */
    constructor(sessionId) {
        super(RequestType.GET);
        /**
         * @constant {!string} sessionId
         */
        this.sessionId = sessionId
    }
}

/**
 * @typedef {AikResponse} GetSessionAttendancesResponse
 * @property {Array<SessionAttendance>} attendances
 * @see com.jakemarsden.aikidotrack.controller.model.GetSessionAttendancesResponse
 */

/**
 * @see com.jakemarsden.aikidotrack.controller.model.PostSessionAttendancesRequest
 */
export class PostSessionAttendancesRequest extends AikRequest {

    /**
     * @param {string} sessionId
     * @param {Array<SessionAttendance>} attendances
     */
    constructor(sessionId, attendances) {
        super(RequestType.UPDATE);
        /**
         * @constant {string} sessionId
         */
        this.sessionId = sessionId;
        /**
         * @constant {Array<SessionAttendance>)
         */
        this.attendances = attendances;
    }
}

/**
 * @typedef {AikResponse} PostSessionAttendancesResponse
 * @see com.jakemarsden.aikidotrack.controller.model.PostSessionAttendancesResponse
 */

/**
 * @typedef {Object} Session
 * @property {string} id
 * @property {string} type
 * @property {DateTime} dateTime
 * @property {Duration} duration
 * @property {number} presentMemberCount
 * @property {number} absentMemberCount
 */

/**
 * @typedef {Object} SessionAttendance
 * @property {Member} member
 * @property {boolean} present
 */
