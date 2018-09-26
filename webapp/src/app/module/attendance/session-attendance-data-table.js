import {MDCSwitch} from "@material/switch";
import {AikMemberDataTable} from "../../ui-component/member-data-table/aik-member-data-table.js";

const strings = {
    MEMBER_ATTENDANCE_SELECTOR: '.aik-session-attendance-data-table__attendance'
};

/** @package */
export class SessionAttendanceDataTable {
    /**
     * @param {!Element} root
     * @param {F=} foundation
     * @param {HTMLTemplateElement=} rowTmpl Pass `undefined` if you don't wish to make use of {@link #appendDataRow}
     * @param {...?} args
     */
    constructor(root, foundation = undefined, rowTmpl = undefined, ...args) {
        /**
         * @type {Array<MDCComponent>}
         * @private
         */
        this.embeddedComponents_ = [];
        /** @private */
        this.table_ = new AikMemberDataTable(root, foundation, rowTmpl, ...args);
    }

    destroy() {
        this.embeddedComponents_.forEach(it => it.destroy());
        this.table_.destroy();
    }

    /**
     * @param {number} columnIdx
     * @return {number}
     */
    getColumnSort(columnIdx) {
        return this.table_.getColumnSort(columnIdx);
    }

    /**
     * @param {number} columnIdx
     * @param {number} direction
     */
    setColumnSort(columnIdx, direction) {
        this.table_.setColumnSort(columnIdx, direction);
    }

    /** @param {number} columnIdx */
    toggleColumnSort(columnIdx) {
        this.table_.toggleColumnSort(columnIdx);
    }

    sort() {
        this.table_.sort();
    }

    clearRows() {
        this.table_.clearRows();
    }

    /** @param {(SessionAttendance|null)} attendance */
    appendAttendanceDataRows(attendance) {
        attendance.instructors.forEach(member => this.appendAttendanceDataRow_(member, true));
        attendance.presentMembers.forEach(member => this.appendAttendanceDataRow_(member, true));
        attendance.absentMembers.forEach(member => this.appendAttendanceDataRow_(member, false));
    }

    /**
     * @param {Member} member
     * @param {boolean} present
     * @private
     */
    appendAttendanceDataRow_(member, present) {
        const row = this.table_.appendDataRow(member);
        const attendanceSwitch = new MDCSwitch(row.querySelector(strings.MEMBER_ATTENDANCE_SELECTOR));
        attendanceSwitch.checked = present;
        this.embeddedComponents_.push(attendanceSwitch);
    }
}
