import {AikDataTable} from "../../ui-component/data-table/aik-data-table.js";
import {firstCharToUpper} from "../../util/string-utils.js";

const strings = {
    SESSION_ID_SELECTOR: '.aik-session-data-table__id',
    SESSION_TYPE_SELECTOR: '.aik-session-data-table__type',
    SESSION_DATE_SELECTOR: '.aik-session-data-table__date',
    SESSION_TIME_SELECTOR: '.aik-session-data-table__time',
    SESSION_DURATION_SELECTOR: '.aik-session-data-table__duration',
    SESSION_ATTENDANCE_COUNT_SELECTOR: '.aik-session-data-table__attendance-count'
};

/**
 * @extends AikDataTable<Session>
 * @package
 */
export class SessionDetailsDataTable extends AikDataTable {
    static attachTo(root) {
        return new SessionDetailsDataTable(root);
    }

    /**
     * @param {Session} data
     * @param {DocumentFragment} frag
     * @protected
     */
    renderDataRow(data, frag) {
        super.renderDataRow(data, frag);

        const date = data.dateTime && data.dateTime.toISODate();
        const time = data.dateTime && data.dateTime.toISOTime({ includeOffset: false, suppressSeconds: true });
        const duration = data.duration && data.duration.as('minutes');
        const attendanceCount = data.attendance &&
                (data.attendance.instructors.length + data.attendance.presentMembers.length);

        const values = {
            [strings.SESSION_ID_SELECTOR]: data.id,
            [strings.SESSION_TYPE_SELECTOR]: firstCharToUpper(data.type),
            [strings.SESSION_DATE_SELECTOR]: date,
            [strings.SESSION_TIME_SELECTOR]: time,
            [strings.SESSION_DURATION_SELECTOR]: duration,
            [strings.SESSION_ATTENDANCE_COUNT_SELECTOR]: attendanceCount
        };
        Object.entries(values).forEach(([selector, value]) =>
                frag.querySelectorAll(selector).forEach(elem => elem.textContent = value));
    }
}
