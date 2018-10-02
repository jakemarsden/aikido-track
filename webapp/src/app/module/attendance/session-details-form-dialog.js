import Duration from "luxon/src/duration.js";
import {AikDataFormDialog} from "../../ui-component/data-form-dialog/aik-data-form-dialog.js";
import {fromIsoDateAndTime} from "../../util/date-time-utils.js";

/**
 * @package
 */
export class SessionDetailsFormDialog extends AikDataFormDialog {
    /**
     * @param {!Element} root
     * @param {!DataTable<SessionAttendance>} attendanceTable
     * @param {F=} foundation
     * @param {...?} args
     */
    constructor(root, attendanceTable, foundation = undefined, ...args) {
        super(root, foundation, attendanceTable, ...args);
    }

    /**
     * @param {DataTable<SessionAttendance>} attendanceTable
     */
    initialize(attendanceTable) {
        super.initialize();
        /**
         * @type {DataTable<SessionAttendance>}
         * @private
         */
        this.attendanceTable_ = attendanceTable;
    }

    destroy() {
        this.attendanceTable_.destroy();
        super.destroy();
    }

    /**
     * @return {DataTable<SessionAttendance>}
     */
    get attendanceTable() {
        return this.attendanceTable_;
    }

    /**
     * @return {boolean}
     */
    get attendanceFieldsetHidden() {
        return this.root_
                .querySelector(SessionDetailsFormDialog.Selector.ATTENDANCE_FIELDSET)
                .classList.contains(SessionDetailsFormDialog.CssClass.HIDDEN);
    }

    /**
     * @param {boolean} attendanceFieldsetHidden
     */
    set attendanceFieldsetHidden(attendanceFieldsetHidden) {
        this.root_
                .querySelector(SessionDetailsFormDialog.Selector.ATTENDANCE_FIELDSET)
                .classList.toggle(SessionDetailsFormDialog.CssClass.HIDDEN, attendanceFieldsetHidden);
    }

    /**
     * @param {Event} event
     * @param {Session} session
     * @param {(Array<SessionAttendance>|null)} attendances Pass `null` if there's no attendance info to edit
     * @param {(DateTime|null)} [defaultDate=null]
     * @param {(Duration|null)} [defaultDuration=null]
     */
    showWith(event, session, attendances = null, defaultDate = null, defaultDuration = null) {
        this.lastFocusedTarget = event.target;
        this.populateSession(session, defaultDate, defaultDuration);
        this.populateAttendance(attendances);
        this.show();
    }

    /**
     * @param {Session} session
     * @param {(DateTime|null)} defaultDate
     * @param {(Duration|null)} defaultDuration
     * @protected
     */
    populateSession(session, defaultDate, defaultDuration) {
        const date = (session.dateTime && session.dateTime.toISODate());
        const time = session.dateTime && session.dateTime.toISOTime({ includeOffset: false, suppressSeconds: true });
        const duration = (session.duration && session.duration.as('minutes'));

        const fields = this.form.fields;
        fields.get('id').value = session.id || null;
        fields.get('type').value = session.type || null;
        fields.get('date').value = date || (defaultDate && defaultDate.toISODate());
        fields.get('time').value = time || null;
        fields.get('duration').value = duration || (defaultDuration && defaultDuration.as('minutes'));
    }

    /**
     * @param {(Array<SessionAttendance>|null)} attendances
     * @protected
     */
    populateAttendance(attendances) {
        this.attendanceTable_.clearRows();
        if (attendances !== null) {
            attendances.forEach(attendance => this.attendanceTable_.appendRow(attendance));
            this.attendanceTable_.sort();
        }
        this.attendanceFieldsetHidden = (attendances === null);
    }

    /**
     * @return {Session}
     */
    parseSession() {
        const fields = this.form.fields;
        const date = fields.get('date').value || null;
        const time = fields.get('time').value || null;
        const duration = fields.get('duration').value || null;
        return {
            id: fields.get('id').value || null,
            type: fields.get('type').value || null,
            dateTime: date && time && fromIsoDateAndTime(date, time),
            duration: duration && Duration.fromObject({ minutes: duration }) || null
        };
    }

    /**
     * @return {Array<SessionAttendance>}
     */
    parseAttendance() {
        /**
         * @type {!Array<MemberAttendanceDataRow>}
         */
        const attendances = this.attendanceTable_.rows;
        return attendances.map(it => ({ member: it.data.member, present: it.presentSwitch.checked }));
    }
}

/**
 * @constant
 * @enum {string}
 * @private
 */
SessionDetailsFormDialog.CssClass = {
    HIDDEN: 'aik-data-form__fieldset--hidden'
};

/**
 * @constant
 * @enum {string}
 * @private
 */
SessionDetailsFormDialog.Selector = {
    ATTENDANCE_FIELDSET: '.aik-session-details-form__attendance-fieldset'
};
