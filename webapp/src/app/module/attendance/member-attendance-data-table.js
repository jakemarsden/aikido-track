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
        this.filterByTypeControl_ && this.filterByTypeControl_.listen('input', this.filterByTypeControlHandler_);
    }

    /**
     * @protected
     */
    destroy() {
        this.filterByTypeControl_ && this.filterByTypeControl_.unlisten('input', this.filterByTypeControlHandler_);
        this.filterByTypeControl_ && this.filterByTypeControl_.destroy();
        super.destroy();
    }

    /**
     * @return {MemberAttendanceDataRow~FilterCriteria}
     */
    get filterCriteria() {
        const criteria = super.filterCriteria;
        if (this.filterByTypeControl_ !== null) {
            criteria.memberType = this.filterByTypeControl_.checked ? 'junior' : null;
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
