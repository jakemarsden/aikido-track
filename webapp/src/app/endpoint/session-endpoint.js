import {DateTime, Duration} from "luxon";
import {fromIsoDateAndTime} from "../util/date-time-utils.js";
import {JQueryAjaxRestEndpoint} from "./endpoint.js";

/**
 * @extends JQueryAjaxRestEndpoint<DateTime, Array<Session>>
 * @private
 */
class GetSessionsByDateRestEndpoint extends JQueryAjaxRestEndpoint {
    constructor() { super(); };

    /**
     * @inheritDoc
     * @protected
     */
    createRequestOpts(request, opts) {
        super.createRequestOpts(request, opts);
        opts.url = `/api/session/${request.toISODate()}`;
    }

    /**
     * @inheritDoc
     * @protected
     */
    createRequestJson(request) {
        return undefined;
    }

    /**
     * @inheritDoc
     * @protected
     */
    parseResponseJson(responseJson) {
        return responseJson.map(sessionResponseJson => parseSessionResponse(sessionResponseJson));
    }
}

/**
 * @extends JQueryAjaxRestEndpoint<Session, Session>
 * @private
 */
class CreateOrUpdateSessionRestEndpoint extends JQueryAjaxRestEndpoint {
    constructor() { super(); };

    /**
     * @inheritDoc
     * @protected
     */
    createRequestOpts(request, opts) {
        super.createRequestOpts(request, opts);
        opts.method = 'POST';
        opts.url = '/api/session';
    }

    /**
     * @inheritDoc
     * @protected
     */
    createRequestJson(request) {
        const requestJson = createSessionRequest(request);
        return super.createRequestJson(requestJson);
    }

    /**
     * @inheritDoc
     * @protected
     */
    parseResponseJson(responseJson) {
        return parseSessionResponse(responseJson);
    }
}

/**
 * @param {Session} session
 * @return {SerialisedSession}
 */
function createSessionRequest(session) {
    const request = {};
    request.id = session.id;
    request.type = session.type;
    request.date = session.dateTime && session.dateTime.toISODate();
    request.time = session.dateTime && session.dateTime.toISOTime({ includeOffset: false });
    request.duration = session.duration && session.duration.toISO();
    request.attendance = session.attendance;
    return request;
}

/**
 * @param {SerialisedSession} response
 * @return {Session}
 */
function parseSessionResponse(response) {
    const session = {};
    session.id = response.id;
    session.type = response.type;
    session.dateTime = response.date && response.time && fromIsoDateAndTime(response.date, response.time);
    session.duration = response.duration && Duration.fromISO(response.duration);
    session.attendance = response.attendance;
    return session;
}

/**
 * Retrieve a list of all {@link Session}s on the given date
 *
 * @type {RestEndpoint<DateTime, Array<Session>>}
 * @constant
 */
export const ENDPOINT_GET_SESSIONS_BY_DATE = new GetSessionsByDateRestEndpoint();

/**
 * Either create or update a {@link Session} based on whether it has previously been created
 *
 * @type {RestEndpoint<Session, Session>}
 */
export const ENDPOINT_CREATE_OR_UPDATE_SESSION = new CreateOrUpdateSessionRestEndpoint();

/**
 * @typedef {Object} SessionAttendance
 * @property {Array<Member>} instructors
 * @property {Array<Member>} presentMembers
 * @property {Array<Member>} absentMembers
 */

/**
 * @typedef {Object} Session
 * @property {string} id
 * @property {string} type
 * @property {DateTime} dateTime
 * @property {Duration} duration
 * @property {(SessionAttendance|null)} attendance
 */

/**
 * @typedef {Object} SerialisedSession
 * @property {string} id
 * @property {string} type
 * @property {string} date
 * @property {string} time
 * @property {string} duration
 * @property {(SessionAttendance|null)} attendance
 */
