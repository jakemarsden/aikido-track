import {MDCSwitch} from '@material/switch';
import {DataTable} from '../../ui-component/data-table/index.js';

/**
 * @extends {DataTable<TData>}
 * @template TData
 */
export class MemberAttendanceDataTable extends DataTable {

    /**
     * @param {!DataRow~Factory<TData>} rowFactory
     * @param {...?} args
     * @protected
     */
    init(rowFactory, ...args) {
        super.init(rowFactory, ...args);
        this.filterByTypeControlHandler_ = event => this.filter();

        /**
         * @type {(string|null)}
         * @private
         */
        this.memberType_ = null;
    }

    /**
     * @protected
     */
    initDom() {
        super.initDom();

        const elem = this.root_.querySelector(MemberAttendanceDataTable.Selector.FILTER_BY_TYPE_CONTROL);
        /**
         * @constant {(MDCSwitch|null)}
         * @protected
         */
        this.filterByTypeControl_ = (elem && new MDCSwitch(elem)) || null;
        this.filterByTypeControl_ && this.filterByTypeControl_.listen('change', this.filterByTypeControlHandler_);
    }

    /**
     * @protected
     */
    destroy() {
        this.filterByTypeControl_ && this.filterByTypeControl_.unlisten('change', this.filterByTypeControlHandler_);
        this.filterByTypeControl_ && this.filterByTypeControl_.destroy();
        super.destroy();
    }

    /**
     * If non-`null`, this is the member type used to filter members when the
     * {@link MemberAttendanceDataTable.Selector.FILTER_BY_TYPE_CONTROL} field is checked. If `null`, the field will
     * be disabled and members won't be filtered by type. Note that {@link #filter} may need to be called to actually
     * apply the updated {@link MemberAttendanceDataTable~FilterCriteria}, although the `FILTER_BY_TYPE_CONTROL` field
     * *will* be (*en/dis*)abled automatically
     * @param {(string|null)} type Pass `null` to disable the option to filter members by type
     * @see #filterCriteria
     * @see #filter
     * @see MemberAttendanceDataRow#filter
     */
    set memberType(type) {
        this.memberType_ = type;
        this.filterByTypeControl_ && (this.filterByTypeControl_.disabled = type === null);
    }

    /**
     * @return {MemberAttendanceDataRow~FilterCriteria}
     */
    get filterCriteria() {
        const criteria = super.filterCriteria;
        if (this.memberType_ !== null && this.filterByTypeControl_ !== null) {
            criteria.memberType = this.filterByTypeControl_.checked ? this.memberType_ : null;
        }
        return criteria;
    }
}

/**
 * @enum {string}
 * @private
 */
MemberAttendanceDataTable.Selector = {
    FILTER_BY_TYPE_CONTROL: '.aik-member-attendance-table__control__filter-by-type'
};
