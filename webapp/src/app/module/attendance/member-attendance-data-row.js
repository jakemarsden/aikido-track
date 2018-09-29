import {MDCSwitch} from "@material/switch";
import {DataRow} from "../../ui-component/data-table/data-row.js";
import {MemberDataRow} from "../../ui-component/member-data-table/member-data-row.js";
import {IllegalStateError} from "../../util/error.js";

/**
 * @extends {DataRow<SessionAttendance>}
 * @package
 */
export class MemberAttendanceDataRow extends DataRow {
    /**
     * @return {!DataRow~Ctor<SessionAttendance>}
     */
    static get ctor() {
        return (elem, data) => new MemberAttendanceDataRow(elem, data);
    }

    /**
     * @param {!HTMLTableRowElement} elem
     * @param {SessionAttendance} data
     */
    constructor(elem, data) {
        super(elem, data);
        /**
         * @constant {!DataRow<Member>}
         * @private
         */
        this.memberRow_ = new MemberDataRow(elem, data && data.member);
        /**
         * @type {(MDCSwitch|null)}
         * @private
         */
        this.presentSwitch_ = null;
    }

    /**
     * @return {!MDCSwitch}
     */
    get presentSwitch() {
        if (this.presentSwitch_ === null) {
            throw new IllegalStateError(`This ${this.constructor.name} has not yet been attached`);
        }
        return this.presentSwitch_;
    }

    /**
     * @param {(MemberAttendanceDataRow|null)} other
     * @param {number} colIdx
     * @return {number}
     */
    compareTo(other, colIdx) {
        if (other == null) {
            return 1;
        }
        const cell = this.elem.cells.item(colIdx);
        if (cell.querySelector(MemberAttendanceDataRow.Selector.PRESENT_SWITCH) != null) {
            const present = this.presentSwitch_.checked;
            const otherPresent = other.presentSwitch_.checked;
            return otherPresent - present;
        }
        return this.memberRow_.compareTo(other.memberRow_, colIdx);
    }

    onAttach() {
        this.memberRow_.onAttach();
        this.presentSwitch_ = new MDCSwitch(this.elem.querySelector(MemberAttendanceDataRow.Selector.PRESENT_SWITCH));
        this.presentSwitch_.checked = this.data.present;
    }

    onDetach() {
        this.presentSwitch_.destroy();
        this.presentSwitch_ = null;
        this.memberRow_.onDetach();
    }

    destroy() {
        if (this.presentSwitch_ !== null) {
            this.presentSwitch_.destroy();
        }
        this.memberRow_.destroy();
    }
}

const SELECTOR_BASE = 'aik-session-attendance-data-table';
/**
 * @constant
 * @enum {string}
 * @private
 */
MemberAttendanceDataRow.Selector = {
    PRESENT_SWITCH: `.${SELECTOR_BASE}__attendance`
};
