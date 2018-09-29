import MDCComponent from "@material/base/component.js";
import MDCFoundation from "@material/base/foundation.js";
import {indexOf} from "../../util/collection-utils.js";

/**
 * @template TData
 */
export class DataTable extends MDCComponent {
    /**
     * @param {!DataRow~Ctor<TData>} ctor
     * @return {!DataRow~Factory<TData>}
     * @template TData
     */
    static basicRowFactory(ctor) {
        return data => {
            const elem = document.createElement('tr');
            return ctor(elem, data);
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
            const elem = frag.querySelector(DataTable.Selector.TEMPLATE_ROW);
            return ctor(elem, data);
        };
    }

    /**
     * @param {!HTMLTableElement} root
     * @param {!DataRow~Factory<TData>} rowFactory
     * @param {F=} foundation
     * @param {...?} args
     */
    constructor(root, rowFactory, foundation, ...args) {
        super(root, foundation, rowFactory, ...args);
    }

    /**
     * @param {!DataRow~Factory<TData>} rowFactory
     */
    initialize(rowFactory) {
        /**
         * @constant {!EventHandler}
         * @private
         */
        this.tbodyClickHandler_ = event => this.handleTbodyClick(event);
        /**
         * @constant {!EventHandler}
         * @private
         */
        this.theadClickHandler_ = event => this.handleTheadClick(event);
        /**
         * @constant {!DataRow~Factory<TData>}
         * @private
         */
        this.rowFactory_ = rowFactory;
        /**
         * @constant {!Array<DataRow<TData>>}
         * @private
         */
        this.rows_ = [];

        this.tbody.addEventListener('click', this.tbodyClickHandler_);
        this.thead.addEventListener('click', this.theadClickHandler_);
    }

    destroy() {
        this.tbody.removeEventListener('click', this.tbodyClickHandler_);
        this.thead.removeEventListener('click', this.theadClickHandler_);
        this.rows_.forEach(row => row.destroy());
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
        row.onAttach();
        this.tbody.appendChild(row.elem);
        this.rows_.push(row);
        return row;
    }

    clearRows() {
        const tbody = this.tbody;
        this.rows_.forEach(row => {
            tbody.removeChild(row.elem);
            row.onDetach();
        });
        this.rows_.length = 0;
    }

    /**
     * @param {number} colIdx
     * @return {boolean}
     */
    isColumnSortable(colIdx) {
        const cell = this.thead.rows.item(0).cells.item(colIdx);
        return cell.classList.contains(DataTable.CssClass.SORTABLE);
    }

    /**
     * @param {number} colIdx
     * @param {boolean} sortable
     */
    setColumnSortable(colIdx, sortable) {
        const cell = this.thead.rows.item(0).cells.item(colIdx);
        cell.classList.toggle(DataTable.CssClass.SORTABLE, sortable);
    }

    /**
     * @param {number} colIdx
     * @return {DataTable.SortDirection}
     */
    getColumnSort(colIdx) {
        const cell = this.thead.rows.item(0).cells.item(colIdx);
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
        const cells = this.thead.rows.item(0).cells;
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
        const cells = this.thead.rows.item(0).cells;
        for (let colIdx = 0; colIdx < cells.length; colIdx++) {
            const dir = this.isColumnSortable(colIdx) ? this.getColumnSort(colIdx) : DataTable.SortDirection.UNSORTED;
            if (dir !== DataTable.SortDirection.UNSORTED) {
                this.sortCol_(colIdx, dir);
                return;
            }
        }
    }

    /**
     * @return {!HTMLTableSectionElement}
     * @protected
     */
    get tbody() {
        return this.root_.querySelector(DataTable.Selector.TBODY);
    }

    /**
     * @return {!HTMLTableSectionElement}
     * @protected
     */
    get thead() {
        return this.root_.querySelector(DataTable.Selector.THEAD);
    }

    /**
     * @param {Event} event
     * @protected
     */
    handleTbodyClick(event) {
        const rowElem = event.target && event.target.closest(DataTable.Selector.BODY_ROW);
        const rowIdx = indexOf(rowElem.parentElement.children, rowElem);
        if (rowIdx === -1) {
            return;
        }
        const cellElem = event.target && event.target.closest(DataTable.Selector.BODY_CELL);
        const colIdx = indexOf(cellElem.parentElement.children, cellElem);
        if (colIdx === -1) {
            return;
        }
        const row = this.rows_.find(row => row.elem === rowElem);
        this.emit(DataTable.Event.ROW_CLICK, { row, rowIdx, colIdx });
    }

    /**
     * @param {Event} event
     * @protected
     */
    handleTheadClick(event) {
        const cellElem = event.target && event.target.closest(DataTable.Selector.HEADER_CELL);
        const colIdx = indexOf(cellElem.parentElement.children, cellElem);
        if (colIdx === -1) {
            return;
        }
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
        const tbody = this.tbody;
        const sortedRows = Array.from(this.rows_);
        sortedRows.sort(rowComparator);
        sortedRows.forEach(row => tbody.appendChild(row.elem));
    }

    /**
     * @param {(DataRow<TData>|null)} a
     * @param {(DataRow<TData>|null)} b
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

    getDefaultFoundation() {
        return new NoOpFoundation();
    }
}

/**
 * @private
 */
class NoOpFoundation extends MDCFoundation {}

/**
 * @constant
 * @enum {string}
 */
DataTable.Event = {
    ROW_CLICK: 'DataTable:rowClick',
    HEADER_CLICK: 'DataTable:headerClick'
};
/**
 * @constant
 * @enum {number}
 */
DataTable.SortDirection = {
    UNSORTED: 0,
    ASC: 1,
    DESC: -1
};

/**
 * @constant
 * @enum {string}
 * @protected
 */
DataTable.CssClass = {
    SORTABLE: 'mdl-data-table__header--sortable',
    SORTED_ASC: 'mdl-data-table__header--sorted-ascending',
    SORTED_DESC: 'mdl-data-table__header--sorted-descending'
};

/**
 * @constant
 * @enum {string}
 * @private
 */
DataTable.Selector = {
    TEMPLATE_ROW: 'tr',
    TBODY: 'tbody',
    THEAD: 'thead',
    BODY_ROW: 'tbody tr',
    BODY_CELL: 'tbody td',
    HEADER_CELL: 'thead td, thead th'
};
