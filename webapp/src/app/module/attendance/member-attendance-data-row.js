import {MDCSwitch} from '@material/switch/index.js';
import {MemberDataRow} from "../../ui-component/data-table/member-data-row.js";
import {DataRow} from "../../ui-component/data-table/data-row.js";

/**
 * @extends {DataRow<SessionAttendance>}
 * @package
 */
export class MemberAttendanceDataRow extends DataRow {

    /**
     * @return {!DataRow~Ctor<SessionAttendance>}
     */
    static get ctor() {
        return (root, data) => new MemberAttendanceDataRow(root, data);
    }

    /**
     * @param {SessionAttendance} data
     * @param {...?} args
     * @protected
     */
    init(data, ...args) {
        super.init(data, ...args);

        /**
         * @constant {!DataRow<Member>}
         * @private
         */
        this.memberRow_ = new MemberDataRow(this.root_, data.member);
    }

    /**
     * @protected
     */
    initDom() {
        super.initDom();

        /**
         * @constant {!MDCSwitch}
         * @private
         */
        this.presentSwitch_ = new MDCSwitch(
                this.root_.querySelector(MemberAttendanceDataRow.Selector.PRESENT_SWITCH));
        this.presentSwitch_.checked = this.data_.present;
    }

    /**
     * @protected
     */
    destroy() {
        this.presentSwitch_.destroy();
        this.memberRow_.destroy();
    }

    /**
     * @return {boolean}
     */
    get present() {
        return this.presentSwitch_.checked;
    }

    /**
     * @param {MemberAttendanceDataRow~FilterCriteria} criteria
     * @return {boolean}
     */
    filter(criteria) {
        if (criteria.memberType != null && criteria.memberType.length !== 0) {
            if (this.data_.member.type !== criteria.memberType) {
                if (!this.data_.present && !this.presentSwitch_.checked) {
                    return false;
                }
            }
        }
        return this.memberRow_.filter(criteria);
    }

    /**
     * @param {(MemberAttendanceDataRow|null|undefined)} other
     * @param {number} colIdx
     * @return {number}
     */
    compareTo(other, colIdx) {
        if (other == null) {
            return 1;
        }
        const cell = this.root_.cells.item(colIdx);
        if (cell.querySelector(MemberAttendanceDataRow.Selector.PRESENT_SWITCH) != null) {
            const present = this.presentSwitch_.checked;
            const otherPresent = other.presentSwitch_.checked;
            return otherPresent - present;
        }
        return this.memberRow_.compareTo(other.memberRow_, colIdx);
    }
}

const SELECTOR_BASE = 'aik-session-attendance-data-table';

/**
 * @enum {string}
 * @private
 */
MemberAttendanceDataRow.Selector = {
    PRESENT_SWITCH: `.${SELECTOR_BASE}__attendance`
};

/**
 * @typedef {DataRow~FilterCriteria} MemberAttendanceDataRow~FilterCriteria
 * @property {string=} memberType
 */
