import Duration from "luxon/src/duration.js";
import {DataFormDialog} from "../../ui-component/data-form-dialog/index.js";
import {fromIsoDateAndTime} from "../../util/date-time-utils.js";

/**
 * @package
 */
export class SessionDetailsFormDialog extends DataFormDialog {

    /**
     * @param {!Dialog} dialog
     * @param {!DataForm} form
     * @param {!MemberAttendanceDataTable} attendanceTable
     * @param {...?} args Any additional arguments to pass to {@link #init}
     */
    constructor(dialog, form, attendanceTable, ...args) {
        super(dialog, form, attendanceTable, ...args);
    }

    /**
     * @param {!Dialog} dialog
     * @param {!DataForm} form
     * @param {!MemberAttendanceDataTable} attendanceTable
     * @param {...?} args
     * @protected
     */
    init(dialog, form, attendanceTable, ...args) {
        super.init(dialog, form, attendanceTable, ...args);
        /**
         * @constant {!MemberAttendanceDataTable}
         * @private
         */
        this.attendanceTable_ = attendanceTable;

        this.sessionFieldChangeHandler_ = event => {
            this.attendanceTable_.memberType = getMemberTypeFor(event.target.value);
            this.attendanceTable_.filter();
        }
    }

    /**
     * @protected
     */
    initDom() {
        super.initDom();
        this.fields.get('type').listen('change', this.sessionFieldChangeHandler_);
    }

    /**
     * @protected
     */
    destroy() {
        this.fields.get('type').unlisten('change', this.sessionFieldChangeHandler_);
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
                .classList.contains(SessionDetailsFormDialog.CssClass.HIDDEN_FIELDSET);
    }

    /**
     * @param {boolean} attendanceFieldsetHidden
     */
    set attendanceFieldsetHidden(attendanceFieldsetHidden) {
        this.root_
                .querySelector(SessionDetailsFormDialog.Selector.ATTENDANCE_FIELDSET)
                .classList.toggle(SessionDetailsFormDialog.CssClass.HIDDEN_FIELDSET, attendanceFieldsetHidden);
    }

    /**
     * @param {Session} session
     * @param {(Array<SessionAttendance>|null)} attendances Pass `null` if there's no attendance info to edit
     * @param {DateTime=} defaultDate
     * @param {Duration=} defaultDuration
     */
    show(session, attendances = null, defaultDate = null, defaultDuration = null) {
        this.populateSession(session, defaultDate, defaultDuration);
        this.populateAttendance(attendances);
        super.show();
    }

    /**
     * @param {Session} session
     * @param {(DateTime|null)} defaultDate
     * @param {(Duration|null)} defaultDuration
     * @private
     */
    populateSession(session, defaultDate, defaultDuration) {
        const date = (session.dateTime && session.dateTime.toISODate());
        const time = session.dateTime && session.dateTime.toISOTime({ includeOffset: false, suppressSeconds: true });
        const duration = (session.duration && session.duration.as('minutes'));

        const fields = this.fields;
        fields.get('id').value = session.id || null;
        fields.get('type').value = session.type || null;
        fields.get('date').value = date || (defaultDate && defaultDate.toISODate());
        fields.get('time').value = time || null;
        fields.get('duration').value = duration || (defaultDuration && defaultDuration.as('minutes'));
    }

    /**
     * @param {(Array<SessionAttendance>|null)} attendances
     * @private
     */
    populateAttendance(attendances) {
        this.attendanceTable_.memberType = getMemberTypeFor(this.fields.get('type').value);
        this.attendanceTable_.clearRows();
        if (attendances !== null) {
            attendances.forEach(attendance => this.attendanceTable_.appendRow(attendance));
            this.attendanceTable_.filter();
            this.attendanceTable_.sort();
        }
        this.attendanceFieldsetHidden = (attendances === null);
    }

    /**
     * @return {Session}
     */
    parseSession() {
        const fields = this.fields;
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
        return attendances.map(it => ({ member: it.data.member, present: it.present }));
    }
}

/**
 * @enum {string}
 * @private
 */
SessionDetailsFormDialog.CssClass = {
    HIDDEN_FIELDSET: 'aik-data-form__fieldset--hidden'
};

/**
 * @enum {string}
 * @private
 */
SessionDetailsFormDialog.Selector = {
    ATTENDANCE_FIELDSET: '.aik-session-details-form__attendance-fieldset'
};

/**
 * @param {(string|null|undefined)} sessionType
 * @return {(string|null)} The member type associated with the given session type
 */
function getMemberTypeFor(sessionType) {
    if (sessionType == null || sessionType.length === 0) {
        return null;
    }
    switch (sessionType) {
        case 'advanced':
        case 'beginner':
        case 'general':
        case 'iaido':
        case 'weapons':
            return 'adult';
        case 'junior':
            return 'junior';
        default:
            throw new TypeError(`Unsupported session type: '${sessionType}'`)
    }
}
