import MDCDialogFoundation from '@material/dialog/foundation.js';
import {DateTime, Duration} from "luxon";
import {RequestType} from "../../endpoint/endpoint.js";
import {
    ENDPOINT_GET_SESSION_ATTENDANCES,
    ENDPOINT_GET_SESSIONS,
    ENDPOINT_POST_SESSION_ATTENDANCES,
    ENDPOINT_POST_SESSIONS,
    GetSessionAttendancesRequest,
    GetSessionsRequest,
    PostSessionAttendancesRequest,
    PostSessionsRequest
} from "../../endpoint/session-endpoint.js";
import {Button} from '../../ui-component/button/index.js';
import {DataForm} from "../../ui-component/data-form/index.js";
import {DataTable} from "../../ui-component/data-table/index.js";
import {LayoutPage} from '../layout.js';
import './main.scss';
import {MemberAttendanceDataRow} from "./member-attendance-data-row.js";
import {SessionDataRow} from "./session-data-row.js";
import {SessionDetailsFormDialog} from "./session-details-form-dialog.js";

/**
 * @private
 */
class AttendancePage extends LayoutPage {

    /**
     * @param {...?} args
     * @protected
     */
    init(...args) {
        super.init(...args);

        this.addSessionBtnHandler_ = event => this.showSessionDialog(event, null);
        this.dateChangeHandler_ = event => this.repopulateSessionTable();
        this.sessionTableSelectionHandler_ = event => this.showSessionDialog(event, event.detail.row.data);
        this.sessionDialogAcceptHandler_ = event => this.handleSessionDialogAccept_(event);
    }

    /**
     * @protected
     */
    initDom() {
        super.initDom();

        const s = AttendancePage.Selector;
        const root = this.root_;

        this.dateForm_ = new DataForm(root.querySelector(s.DATE_FORM));
        this.dateFormAcceptBtn_ = new Button(root.querySelector(s.DATE_FORM_ACCEPT_BTN));

        this.sessionTable_ = new DataTable(
                root.querySelector(s.SESSION_DETAILS_TABLE),
                DataTable.templatedRowFactory(SessionDataRow.ctor, s.SESSION_DETAILS_TABLE_ROW_TMPL));
        this.addSessionBtn_ = new Button(root.querySelector(s.ADD_SESSION_BTN));

        const sessionAttendanceTable = new DataTable(
                root.querySelector(s.SESSION_ATTENDANCE_TABLE),
                DataTable.templatedRowFactory(MemberAttendanceDataRow.ctor, s.SESSION_ATTENDANCE_TABLE_ROW_TMPL));
        this.sessionDialog_ = new SessionDetailsFormDialog(
                root.querySelector(s.SESSION_DETAILS_DIALOG), sessionAttendanceTable);

        this.dateForm_.listen(DataForm.Event.SUBMIT, this.dateChangeHandler_);
        this.sessionTable_.listen(DataTable.Event.ROW_CLICK, this.sessionTableSelectionHandler_);
        this.addSessionBtn_.listen(Button.Event.CLICK, this.addSessionBtnHandler_);
        this.sessionDialog_.listen(MDCDialogFoundation.strings.ACCEPT_EVENT, this.sessionDialogAcceptHandler_);

        this.dateForm_.fields.get('date').value = DateTime.local().toISODate();
        this.repopulateSessionTable();
    }

    /**
     * @protected
     */
    destroy() {
        this.dateForm_.unlisten(DataTable.Event.SUBMIT, this.dateChangeHandler_);
        this.sessionTable_.unlisten(DataTable.Event.ROW_CLICK, this.sessionTableSelectionHandler_);
        this.addSessionBtn_.unlisten(Button.Event.CLICK, this.addSessionBtnHandler_);
        this.sessionDialog_.unlisten(MDCDialogFoundation.strings.ACCEPT_EVENT, this.sessionDialogAcceptHandler_);

        this.dateForm_.destroy();
        this.dateFormAcceptBtn_.destroy();
        this.sessionTable_.destroy();
        this.addSessionBtn_.destroy();
        this.sessionDialog_.destroy();

        super.destroy();
    }

    repopulateSessionTable() {
        const rawDate = this.dateForm_.fields.get('date').value;
        const req = new GetSessionsRequest(DateTime.fromISO(rawDate));
        ENDPOINT_GET_SESSIONS.execute(req)
                .then(resp => {
                    this.sessionTable_.clearRows();
                    resp.sessions.forEach(session => this.sessionTable_.appendRow(session));
                    this.sessionTable_.sort();
                });
    }

    /**
     * @param {Event} event
     * @param {(Session|null)} session Pass `null` if a new {@link Session} is to be created
     */
    showSessionDialog(event, session) {
        let date;
        let duration;
        if (session === null) {
            // Create new session
            session = {
                id: null,
                type: null,
                dateTime: null,
                duration: null
            };
            const rawDate = this.dateForm_.fields.get('date').value;
            date = DateTime.fromISO(rawDate);
            duration = Duration.fromObject({ minutes: 60 });

            this.sessionDialog_.showWith(event, session, null, date, duration);

        } else {
            // Update existing session
            const req = new GetSessionAttendancesRequest(session.id);
            ENDPOINT_GET_SESSION_ATTENDANCES.execute(req)
                    .then(resp => this.sessionDialog_.showWith(event, session, resp.attendances, date, duration));
        }
    }

    /**
     * @param {Event} event
     * @private
     */
    handleSessionDialogAccept_(event) {
        const session = this.sessionDialog_.parseSession();
        const updateExisting = session.id != null;

        const sessionsReqType = session.id == null ? RequestType.CREATE : RequestType.UPDATE;
        const sessionsReq = new PostSessionsRequest(sessionsReqType, [session]);
        const sessionsReqPromise = ENDPOINT_POST_SESSIONS.execute(sessionsReq);

        /**
         * @type {Promise<(PostSessionAttendancesResponse|null)>}
         */
        let attendancesReqPromise;
        if (updateExisting) {
            // Attendance info may have changed
            const attendances = this.sessionDialog_.parseAttendance();
            const attendancesReq = new PostSessionAttendancesRequest(session.id, attendances);
            attendancesReqPromise = ENDPOINT_POST_SESSION_ATTENDANCES.execute(attendancesReq);
        } else {
            // There's no attendance info to update
            attendancesReqPromise = Promise.resolve(null);
        }

        Promise.all([sessionsReqPromise, attendancesReqPromise])
                .then(([sessionsResp, attendancesRespOrNull]) => {
                    // Fuck it, just repopulate the entire table...
                    this.repopulateSessionTable()

                    if (!updateExisting) {
                        // Show the dialog again so user can now update attendance
                        this.showSessionDialog(event, sessionsResp.sessions[0]);
                    }
                });
    }
}

/**
 * @enum {string}
 * @private
 */
AttendancePage.Selector = {
    DATE_FORM: '#aik-attendance-date-form',
    DATE_FORM_ACCEPT_BTN: '#aik-attendance-date-form__apply-btn',
    SESSION_DETAILS_TABLE: '#aik-session-details-table',
    SESSION_DETAILS_TABLE_ROW_TMPL: '#aik-tmpl-session-details-table__row',
    ADD_SESSION_BTN: '#aik-session-details-add-session-btn',
    SESSION_ATTENDANCE_TABLE: '#aik-session-attendance-table',
    SESSION_ATTENDANCE_TABLE_ROW_TMPL: '#aik-tmpl-session-attendance-table__row',
    SESSION_DETAILS_DIALOG: '#aik-session-details-dialog'
};

new AttendancePage(window);
