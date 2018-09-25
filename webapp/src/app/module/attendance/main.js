import {MDCRipple} from "@material/ripple";
import {DateTime, Duration} from "luxon";
import {ENDPOINT_CREATE_OR_UPDATE_SESSION, ENDPOINT_GET_SESSIONS_BY_DATE} from "../../endpoint/session-endpoint.js";
import {AikDataForm} from "../../ui-component/data-form/aik-data-form.js";
import '../layout.js';
import './main.scss';
import {SessionDetailsDataTable} from "./session-details-data-table.js";
import {SessionDetailsFormDialog} from "./session-details-form-dialog.js";

window.addEventListener('load', () => {
    const now = DateTime.local();
    new SessionUi(now).initialize();
});

class SessionUi {
    constructor() {
        /** @private */
        this.addSessionBtnHandler_ = event => this.handleAddSessionBtn_(event);
        /** @private */
        this.dateChangeHandler_ = event => this.repopulateSessionTable();
        /** @private */
        this.sessionTableSelectionHandler_ = event => this.sessionDialog_.showWith(event, event.detail.targetRowData);
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
        this.sessionTable_ =
                new SessionDetailsDataTable(document.querySelector('#aik-session-details-table'), undefined,
                        document.querySelector('#aik-tmpl-session-details-table__row'));
        /** @private */
        this.sessionDialog_ = new SessionDetailsFormDialog(document.querySelector('#aik-session-details-dialog'));

        this.btnAddSession_.addEventListener('click', this.addSessionBtnHandler_);
        this.dateForm_.listen('AikDataForm:submit', this.dateChangeHandler_);
        this.sessionTable_.listen('AikDataTable:rowClick', this.sessionTableSelectionHandler_);
        this.sessionDialog_.form.listen('AikDataForm:submit', this.sessionFormSubmitHandler_);

        this.dateForm_.fields.get('date').value = DateTime.local().toISODate();
        this.repopulateSessionTable();
    }

    destroy() {
        this.btnAddSession_.removeEventListener('click', this.addSessionBtnHandler_);
        this.dateForm_.unlisten('AikDataForm:submit', this.dateChangeHandler_);
        this.sessionTable_.unlisten('AikDataTable:rowClick', this.sessionTableSelectionHandler_);
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
                    sessions.forEach(session => this.sessionTable_.appendDataRow(session));
                    this.sessionTable_.sort();
                });
    }

    /**
     * @param {Event} event
     * @private
     */
    handleAddSessionBtn_(event) {
        const session = {
            id: null,
            type: null,
            dateTime: null,
            duration: null,
            attendance: null
        };
        const date = this.dateForm_.fields.get('date').value;
        this.sessionDialog_.showWith(event, session, DateTime.fromISO(date), Duration.fromObject({ minutes: 60 }));
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
