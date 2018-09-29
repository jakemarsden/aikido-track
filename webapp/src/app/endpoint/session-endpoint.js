import {DateTime, Duration} from "luxon";
import {fromIsoDateAndTime} from "../util/date-time-utils.js";
import {IllegalStateError} from "../util/error.js";
import {JQueryAjaxRestEndpoint} from "./endpoint.js";

/**
 * @extends {JQueryAjaxRestEndpoint<DateTime, Array<Session>>}
 * @private
 */
class GetSessionsByDateRestEndpoint extends JQueryAjaxRestEndpoint {

    /**
     * @inheritDoc
     * @protected
     */
    createRequestOpts(opts, request, requestTransport) {
        super.createRequestOpts(opts, request, requestTransport);
        opts.url = `/api/session/${request.toISODate()}`;
    }

    /**
     * @inheritDoc
     * @protected
     */
    serializeRequest(request) {
        return undefined;
    }

    /**
     * @inheritDoc
     * @protected
     */
    deserializeResponse(responseTransport) {
        const response = super.deserializeResponse(responseTransport);
        return response.map(session => parseSessionResponse(session));
    }
}

/**
 * @extends {JQueryAjaxRestEndpoint<Session, Session>}
 * @private
 */
class CreateOrUpdateSessionRestEndpoint extends JQueryAjaxRestEndpoint {

    /**
     * @inheritDoc
     * @protected
     */
    createRequestOpts(opts, request, requestTransport) {
        super.createRequestOpts(opts, request, requestTransport);
        opts.method = 'POST';
        opts.url = '/api/session';
    }

    /**
     * @inheritDoc
     * @protected
     */
    serializeRequest(request) {
        const requestTransport = createSessionRequest(request);
        return super.serializeRequest(requestTransport);
    }

    /**
     * @inheritDoc
     * @protected
     */
    deserializeResponse(responseTransport) {
        const response = super.deserializeResponse(responseTransport);
        return parseSessionResponse(response);
    }
}

/**
 * @extends {JQueryAjaxRestEndpoint<Session, SessionAttendance>}
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
 * @return {SerialisedSession}
 */
function createSessionRequest(session) {
    const request = {};
    request.id = session.id;
    request.type = session.type;
    request.date = session.dateTime && session.dateTime.toISODate();
    request.time = session.dateTime && session.dateTime.toISOTime({ includeOffset: false });
    request.duration = session.duration && session.duration.toISO();
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
 * Retrieve {@link SessionAttendance} information about a given {@link Session}
 *
 * @type {RestEndpoint<Session, SessionAttendance>}
 */
export const ENDPOINT_GET_SESSION_ATTENDANCE = new GetSessionAttendanceRestEndpoint();

/**
 * @typedef {Object} Session
 * @property {string} id
 * @property {string} type
 * @property {DateTime} dateTime
 * @property {Duration} duration
 */

/**
 * @typedef {Object} SerialisedSession
 * @property {string} id
 * @property {string} type
 * @property {string} date
 * @property {string} time
 * @property {string} duration
 */

/**
 * @typedef {Object} SessionAttendance
 * @property {Array<Member>} instructors
 * @property {Array<Member>} presentMembers
 * @property {Array<Member>} absentMembers
 */
