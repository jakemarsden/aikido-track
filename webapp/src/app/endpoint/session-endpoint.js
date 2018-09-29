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
 * @extends {JQueryAjaxRestEndpoint<Session, SessionAttendance>}
 * @private
 */
class GetSessionAttendanceRestEndpoint extends JQueryAjaxRestEndpoint {

    /**
     * @inheritDoc
     * @protected
     */
    createRequestOpts(opts, request, requestTransport) {
        if (request.id == null) {
            throw new IllegalStateError(
                    `Unable to get SessionAttendance for a session which hasn't yet been created: ${request}`);
        }
        super.createRequestOpts(opts, request, requestTransport);
        opts.url = `/api/session/${request.id}/attendance`;
    }

    /**
     * @inheritDoc
     * @protected
     */
    serializeRequest(request) {
        return undefined;
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
    return session;
}

/**
 * @type {RestEndpoint<GetSessionsRequest, GetSessionsResponse>}
 */
export const ENDPOINT_GET_SESSIONS = new GetSessionsRestEndpoint();

/**
 * @type {RestEndpoint<PostSessionsRequest, PostSessionsResponse>}
 */
export const ENDPOINT_POST_SESSIONS = new PostSessionsRestEndpoint();

/**
 * Retrieve {@link SessionAttendance} information about a given {@link Session}
 *
 * @type {RestEndpoint<Session, SessionAttendance>}
 */
export const ENDPOINT_GET_SESSION_ATTENDANCE = new GetSessionAttendanceRestEndpoint();

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
 * @typedef {Object} Session
 * @property {string} id
 * @property {string} type
 * @property {DateTime} dateTime
 * @property {Duration} duration
 */

/**
 * @typedef {Object} SessionAttendance
 * @property {Array<Member>} instructors
 * @property {Array<Member>} presentMembers
 * @property {Array<Member>} absentMembers
 */
