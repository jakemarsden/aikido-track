import Duration from "luxon/src/duration.js";
import {AikDataFormDialog} from "../../ui-component/data-form-dialog/aik-data-form-dialog.js";
import {fromIsoDateAndTime} from "../../util/date-time-utils.js";
import {SessionAttendanceDataTable} from "./session-attendance-data-table.js";

/** @package*/
export class SessionDetailsFormDialog extends AikDataFormDialog {
    /**
     * @param {!Element} root
     * @param {F=} foundation
     * @param {SessionAttendanceDataTable} attendanceTable
     * @param {...?} args
     */
    constructor(root, foundation = undefined, attendanceTable, ...args) {
        super(root, foundation, attendanceTable, ...args);
    }

    /** @param {SessionAttendanceDataTable} attendanceTable */
    initialize(attendanceTable) {
        super.initialize();
        /** @private */
        this.attendanceTable_ = attendanceTable;
    }

    destroy() {
        this.attendanceTable_.destroy();
        super.destroy();
    }

    /** @return {SessionAttendanceDataTable} */
    get attendanceTable() {
        return this.attendanceTable_;
    }

    /**
     * @param {Event} event
     * @param {Session} session
     *  @param {(DateTime|null)} [defaultDate=null]
     *  @param {(Duration|null)} [defaultDuration=null]
     */
    showWith(event, session, defaultDate = null, defaultDuration = null) {
        this.lastFocusedTarget = event.target;
        this.populateSession(session, defaultDate, defaultDuration);
        this.show();
    }

    /**
     *  @param {Session} session
     *  @param {(DateTime|null)} defaultDate
     *  @param {(Duration|null)} defaultDuration
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

        this.attendanceTable_.clearRows();
        if (session.attendance != null) {
            this.attendanceTable_.appendAttendanceDataRows(session.attendance);
            this.attendanceTable_.sort();
        }
    }

    /** @return {Session} */
    parseSession() {
        const fields = this.form.fields;
        const date = fields.get('date').value || null;
        const time = fields.get('time').value || null;
        const duration = fields.get('duration').value || null;
        return {
            id: fields.get('id').value || null,
            type: fields.get('type').value || null,
            dateTime: date && time && fromIsoDateAndTime(date, time),
            duration: duration && Duration.fromObject({ minutes: duration }) || null,
            attendance: {
                instructors: [],
                presentMembers: [],
                absentMembers: []
            }
        };
    }
}
