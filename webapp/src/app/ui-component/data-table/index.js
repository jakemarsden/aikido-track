import {MDCTextField} from '@material/textfield';
import {indexOf} from "../../util/collection-utils.js";
import {Component} from "../base/index.js";

/**
 * @template TData
 */
export class DataTable extends Component {

    /**
     * @param {!DataRow~Ctor<TData>} ctor
     * @return {!DataRow~Factory<TData>}
     * @template TData
     */
    static basicRowFactory(ctor) {
        return data => {
            const root = document.createElement('tr');
            return ctor(root, data);
        };
    }

    /**
     * @param {!DataRow~Ctor<TData>} ctor
     * @param {!(HTMLTemplateElement|string)} tmpl
     * @return {!DataRow~Factory<TData>}
     * @template TData
     */
    static templatedRowFactory(ctor, tmpl) {
        if (typeof tmpl === 'string') {
            tmpl = document.querySelector(tmpl);
        }
        return data => {
            const frag = document.importNode(tmpl.content, true);
            const root = frag.querySelector(DataTable.Selector.TEMPLATE_ROW);
            return ctor(root, data);
        };
    }

    /**
     * @param {!HTMLTableElement} root
     * @param {!DataRow~Factory<TData>} rowFactory
     * @param {...?} args Any additional arguments to pass to {@link #init}
     */
    constructor(root, rowFactory, ...args) {
        super(root, rowFactory, ...args);
    }

    /**
     * @param {!DataRow~Factory<TData>} rowFactory
     * @param {...?} args
     * @protected
     */
    init(rowFactory, ...args) {
        this.bodyCellClickHandler_ = event => this.handleBodyCellClick_(event);
        this.headerCellClickHandler_ = event => this.handleHeaderCellClick_(event);
        this.filterControlChangeHandler_ = this.debounce(event => this.filter());
        this.rowFactory_ = rowFactory;
        /**
         * @constant {!Array<DataRow<TData>>}
         * @protected
         */
        this.rows_ = [];
    }

    /**
     * @protected
     */
    initDom() {
        /**
         * @constant {!HTMLTableSectionElement}
         * @protected
         */
        this.tbody_ = this.root_.querySelector(DataTable.Selector.TBODY);
        /**
         * @constant {!HTMLTableSectionElement}
         * @protected
         */
        this.thead_ = this.root_.querySelector(DataTable.Selector.THEAD);

        const filterControlElem = this.root_.querySelector(DataTable.Selector.FILTER_CONTROL);
        /**
         * @constant {(MDCTextField|null)}
         * @protected
         */
        this.filterControl_ = (filterControlElem && new MDCTextField(filterControlElem)) || null;

        this.tbody_.addEventListener('click', this.bodyCellClickHandler_);
        this.thead_.addEventListener('click', this.headerCellClickHandler_);
        this.filterControl_ && this.filterControl_.listen('input', this.filterControlChangeHandler_);
    }

    /**
     * @protected
     */
    destroy() {
        this.tbody_.removeEventListener('click', this.bodyCellClickHandler_);
        this.thead_.removeEventListener('click', this.headerCellClickHandler_);
        this.filterControl_ && this.filterControl_.unlisten('input', this.filterControlChangeHandler_);

        this.clearRows();
        this.filterControl_ && this.filterControl_.destroy();
    }

    /**
     * @return {!Array<DataRow<TData>>} In insertion order
     */
    get rows() {
        return Array.from(this.rows_);
    }

    /**
     * @return {!Array<TData>} In row insertion order
     */
    get rowDatas() {
        return this.rows_.map(row => row.data);
    }

    /**
     * @param {TData} data
     * @return {DataRow<TData>}
     */
    appendRow(data) {
        const row = this.rowFactory_(data);
        this.rows_.push(row);
        this.tbody_.appendChild(row.root);
        return row;
    }

    clearRows() {
        const tbody = this.tbody_;
        this.rows_.forEach(row => {
            tbody.removeChild(row.root);
            row.destroy();
        });
        this.rows_.length = 0;
    }

    /**
     * @param {number} colIdx
     * @return {boolean}
     */
    isColumnSortable(colIdx) {
        const cell = this.thead_.rows.item(0).cells.item(colIdx);
        return cell.classList.contains(DataTable.CssClass.SORTABLE);
    }

    /**
     * @param {number} colIdx
     * @param {boolean} sortable
     */
    setColumnSortable(colIdx, sortable) {
        const cell = this.thead_.rows.item(0).cells.item(colIdx);
        cell.classList.toggle(DataTable.CssClass.SORTABLE, sortable);
    }

    /**
     * @param {number} colIdx
     * @return {DataTable.SortDirection}
     */
    getColumnSort(colIdx) {
        const cell = this.thead_.rows.item(0).cells.item(colIdx);
        const clazzes = cell.classList;
        if (clazzes.contains(DataTable.CssClass.SORTED_ASC)) {
            return DataTable.SortDirection.ASC;
        }
        if (clazzes.contains(DataTable.CssClass.SORTED_DESC)) {
            return DataTable.SortDirection.DESC;
        }
        return DataTable.SortDirection.UNSORTED;
    }

    /**
     * @param {number} colIdx
     * @param {DataTable.SortDirection} dir
     */
    setColumnSort(colIdx, dir) {
        const cells = this.thead_.rows.item(0).cells;
        for (let i = 0; i < cells.length; i++) {
            const clazzes = cells.item(i).classList;
            clazzes.remove(DataTable.CssClass.SORTED_ASC);
            clazzes.remove(DataTable.CssClass.SORTED_DESC);
        }
        const clazzes = cells.item(colIdx).classList;
        switch (dir) {
            case DataTable.SortDirection.UNSORTED:
                break;
            case DataTable.SortDirection.ASC:
                clazzes.add(DataTable.CssClass.SORTED_ASC);
                break;
            case DataTable.SortDirection.DESC:
                clazzes.add(DataTable.CssClass.SORTED_DESC);
                break;
            default:
                throw new TypeError(`Unsupported SortDirection: ${dir}`);
        }
        this.sort();
    }

    /**
     * @param {number} colIdx
     * @param {DataTable.SortDirection=} dir
     */
    toggleColumnSort(colIdx, dir = undefined) {
        if (dir === undefined) {
            const currentDir = this.getColumnSort(colIdx);
            switch (currentDir) {
                case DataTable.SortDirection.ASC:
                    dir = DataTable.SortDirection.DESC;
                    break;
                case DataTable.SortDirection.DESC:
                case DataTable.SortDirection.UNSORTED:
                    dir = DataTable.SortDirection.ASC;
                    break;
                default:
                    throw new TypeError(`Unsupported SortDirection: ${currentDir}`);
            }
        }
        this.setColumnSort(colIdx, dir);
    }

    sort() {
        const cells = this.thead_.rows.item(0).cells;
        for (let colIdx = 0; colIdx < cells.length; colIdx++) {
            const dir = this.isColumnSortable(colIdx) ? this.getColumnSort(colIdx) : DataTable.SortDirection.UNSORTED;
            if (dir !== DataTable.SortDirection.UNSORTED) {
                this.sortCol_(colIdx, dir);
                return;
            }
        }
    }

    /**
     * @return {!DataRow~FilterCriteria}
     */
    get filterCriteria() {
        const criteria = {};
        if (this.filterControl_ !== null) {
            criteria.searchTerms = this.filterControl_.value
                    .split(/\s+/)
                    .map(it => it.trim())
                    .filter(it => it.length !== 0)
        }
        return criteria;
    }

    filter() {
        const criteria = this.filterCriteria;
        this.rows_.forEach(row => {
            const passesFilter = row.filter(criteria);
            row.root.classList.toggle(DataTable.CssClass.ROW_HIDDEN, !passesFilter);
        });
    }

    /**
     * @param {Event} event
     * @private
     */
    handleBodyCellClick_(event) {
        const cellElem = event.target && event.target.closest(DataTable.Selector.BODY_CELL);
        if (cellElem == null) {
            return;
        }

        const rowElem = cellElem.parentElement;
        const rowIdx = indexOf(rowElem.parentElement.children, rowElem);
        const colIdx = indexOf(rowElem.children, cellElem);

        const row = this.rows_.find(row => row.root === rowElem);
        this.emit(DataTable.Event.ROW_CLICK, { row, rowIdx, colIdx });
    }

    /**
     * @param {Event} event
     * @private
     */
    handleHeaderCellClick_(event) {
        const cellElem = event.target && event.target.closest(DataTable.Selector.HEADER_CELL);
        if (cellElem == null) {
            return;
        }

        const rowElem = cellElem.parentElement;
        const colIdx = indexOf(rowElem.children, cellElem);

        if (this.isColumnSortable(colIdx)) {
            this.toggleColumnSort(colIdx);
        }
        this.emit(DataTable.Event.HEADER_CLICK, { colIdx });
    }

    /**
     * @param {number} colIdx
     * @param {DataTable.SortDirection} dir
     * @private
     */
    sortCol_(colIdx, dir) {
        const rowComparator = (a, b) => dir * DataTable.compareRows_(a, b, colIdx);
        const tbody = this.tbody_;
        const sortedRows = Array.from(this.rows_);
        sortedRows.sort(rowComparator);
        sortedRows.forEach(row => tbody.appendChild(row.root));
    }

    /**
     * @param {(DataRow<TData>|null|undefined)} a
     * @param {(DataRow<TData>|null|undefined)} b
     * @param {number} colIdx
     * @return {number}
     * @private
     */
    static compareRows_(a, b, colIdx) {
        if (a != null) {
            return a.compareTo(b, colIdx);
        }
        if (b != null) {
            return -b.compareTo(a, colIdx);
        }
        return 0;
    }
}

/**
 * @enum {string}
 */
DataTable.Event = {
    ROW_CLICK: 'DataTable:rowClick',
    HEADER_CLICK: 'DataTable:headerClick'
};

/**
 * @enum {number}
 */
DataTable.SortDirection = {
    UNSORTED: 0,
    ASC: 1,
    DESC: -1
};

/**
 * @enum {string}
 * @private
 */
DataTable.CssClass = {
    SORTABLE: 'mdl-data-table__header--sortable',
    SORTED_ASC: 'mdl-data-table__header--sorted-ascending',
    SORTED_DESC: 'mdl-data-table__header--sorted-descending',
    ROW_HIDDEN: 'aik-data-table__row__hidden'
};

/**
 * @enum {string}
 * @private
 */
DataTable.Selector = {
    TEMPLATE_ROW: 'tr',
    TBODY: 'tbody',
    THEAD: 'thead',
    BODY_CELL: 'tbody td',
    HEADER_CELL: 'thead tr:first-of-type td, thead tr:first-of-type th',
    FILTER_CONTROL: '.aik-data-table__control__filter'
};
