import {DataRow} from "../../ui-component/data-table/data-row.js";
import {firstCharToUpper} from "../../util/string-utils.js";

/**
 * @extends DataRow<Session>
 * @package
 */
export class SessionDataRow extends DataRow {
    /**
     * @return {!DataRow~Ctor<Session>}
     */
    static get ctor() {
        return (elem, data) => new SessionDataRow(elem, data);
    }

    /**
     * @param {!HTMLTableRowElement} elem
     * @param {Session} data
     */
    constructor(elem, data) {
        super(elem, data);

        const s = SessionDataRow.Selector;
        /**
         * @param {Session} data
         * @param {T} def
         * @param {function(it: SessionAttendance): T} fn
         * @return {T} `def` if the {@link Session}'s attendance is `null`. Otherwise, the result of executing `fn`
         * @template T
         */
        const withAttendance = (data, def, fn) => (data.attendance && fn(data.attendance)) || def;
        /**
         * @constant {Object<string, DataRow~Renderer<Session>>}
         * @private
         */
        this.renderers_ = {
            [s.ID]: (elem, data) => elem.textContent = data.id,
            [s.TYPE]: (elem, data) => elem.textContent = firstCharToUpper(data.type),
            [s.DATE]: (elem, data) => elem.textContent = data.dateTime.toISODate(),
            [s.TIME]: (elem, data) =>
                    elem.textContent = data.dateTime.toISOTime({ includeOffset: false, suppressSeconds: true }),
            [s.DURATION]: (elem, data) => elem.textContent = data.duration.as('minutes'),
            [s.ATTENDANCE_PRESENT_COUNT]: (elem, data) =>
                    elem.textContent = withAttendance(data, 0, it => it.instructors.length + it.presentMembers.length),
            [s.ATTENDANCE_ABSENT_COUNT]: (elem, data) =>
                    elem.textContent = withAttendance(data, 0, it => it.absentMembers.length),
            [s.ATTENDANCE_TOTAL_COUNT]: (elem, data) =>
                    elem.textContent = withAttendance(data, 0, it =>
                            it.instructors.length + it.presentMembers.length + it.absentMembers.length)
        };
    }

    onAttach() {
        this.render(this.renderers_);
    }
}

const SELECTOR_BASE = 'aik-session-data-table';
/**
 * @constant
 * @enum {string}
 * @private
 */
SessionDataRow.Selector = {
    ID: `.${SELECTOR_BASE}__id`,
    TYPE: `.${SELECTOR_BASE}__type`,
    DATE: `.${SELECTOR_BASE}__date`,
    TIME: `.${SELECTOR_BASE}__time`,
    DURATION: `.${SELECTOR_BASE}__duration`,
    ATTENDANCE_PRESENT_COUNT: `.${SELECTOR_BASE}__attendance-present-count`,
    ATTENDANCE_ABSENT_COUNT: `.${SELECTOR_BASE}__attendance-absent-count`,
    ATTENDANCE_TOTAL_COUNT: `.${SELECTOR_BASE}__attendance-total-count`
};
