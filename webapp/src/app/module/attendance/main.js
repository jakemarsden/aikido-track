import {MDCRipple} from "@material/ripple";
import {DateTime, Duration} from "luxon";
import {ENDPOINT_CREATE_OR_UPDATE_SESSION, ENDPOINT_GET_SESSIONS_BY_DATE} from "../../endpoint/session-endpoint.js";
import {AikDataForm} from "../../ui-component/data-form/aik-data-form.js";
import {DataTable} from "../../ui-component/data-table/data-table.js";
import '../layout.js';
import './main.scss';
import {MemberAttendanceDataRow} from "./member-attendance-data-row.js";
import {SessionDataRow} from "./session-data-row.js";
import {SessionDetailsFormDialog} from "./session-details-form-dialog.js";

window.addEventListener('load', () => {
    const now = DateTime.local();
    new SessionUi(now).initialize();
});

class SessionUi {
    constructor() {
        /** @private */
        this.addSessionBtnHandler_ = event => this.showSessionDialog(event, null);
        /** @private */
        this.dateChangeHandler_ = event => this.repopulateSessionTable();
        /** @private */
        this.sessionTableSelectionHandler_ = event => this.showSessionDialog(event, event.detail.row.data);
        /** @private */
        this.sessionFormSubmitHandler_ = event => this.handleSessionFormSubmit_(event);
    }

    initialize() {
        /**
         * @type {HTMLButtonElement}
         * @private
         */
        this.btnAddSession_ = document.querySelector('#aik-session-details-add-session-btn');
        /** @private */
        this.btnRipples_ = [
            new MDCRipple(this.btnAddSession_),
            new MDCRipple(document.querySelector('#aik-attendance-date-form__apply-btn'))
        ];
        /** @private */
        this.dateForm_ = new AikDataForm(document.querySelector('#aik-attendance-date-form'));
        /** @private */
        this.sessionTable_ = new DataTable(
                document.querySelector('#aik-session-details-table'),
                DataTable.templatedRowFactory(SessionDataRow.ctor, '#aik-tmpl-session-details-table__row'));
        /** @private */
        const sessionAttendanceTable = new DataTable(
                document.querySelector('#aik-session-attendance-table'),
                DataTable.templatedRowFactory(MemberAttendanceDataRow.ctor, '#aik-tmpl-session-attendance-table__row'));
        /** @private */
        this.sessionDialog_ = new SessionDetailsFormDialog(
                document.querySelector('#aik-session-details-dialog'), sessionAttendanceTable, undefined);

        this.btnAddSession_.addEventListener('click', this.addSessionBtnHandler_);
        this.dateForm_.listen('AikDataForm:submit', this.dateChangeHandler_);
        this.sessionTable_.listen(DataTable.Event.ROW_CLICK, this.sessionTableSelectionHandler_);
        this.sessionDialog_.form.listen('AikDataForm:submit', this.sessionFormSubmitHandler_);

        this.dateForm_.fields.get('date').value = DateTime.local().toISODate();
        this.repopulateSessionTable();
    }

    destroy() {
        this.btnAddSession_.removeEventListener('click', this.addSessionBtnHandler_);
        this.dateForm_.unlisten('AikDataForm:submit', this.dateChangeHandler_);
        this.sessionTable_.unlisten(DataTable.Event.ROW_CLICK, this.sessionTableSelectionHandler_);
        this.sessionDialog_.form.unlisten('AikDataForm:submit', this.sessionFormSubmitHandler_);

        this.btnRipples_.forEach(ripple => ripple.destroy());
        this.dateForm_.destroy();
        this.sessionTable_.destroy();
        this.sessionDialog_.destroy();
    }

    repopulateSessionTable() {
        const rawDate = this.dateForm_.fields.get('date').value;
        const date = DateTime.fromISO(rawDate);

        this.sessionTable_.clearRows();
        ENDPOINT_GET_SESSIONS_BY_DATE.execute(date)
                .then(sessions => {
                    sessions.forEach(session => this.sessionTable_.appendRow(session));
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
            session = {
                id: null,
                type: null,
                dateTime: null,
                duration: null,
                attendance: null
            };
            const rawDate = this.dateForm_.fields.get('date').value;
            date = DateTime.fromISO(rawDate);
            duration = Duration.fromObject({ minutes: 60 });
        }
        this.sessionDialog_.showWith(event, session, date, duration);
    }

    /**
     * @param {Event} event
     * @private
     */
    handleSessionFormSubmit_(event) {
        const session = this.sessionDialog_.parseSession();
        this.sessionTable_.clearRows();

        ENDPOINT_CREATE_OR_UPDATE_SESSION.execute(session)
                // Fuck it, just repopulate the entire table...
                .then(session => this.repopulateSessionTable());
    }
}
