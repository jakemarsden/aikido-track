import MDCFoundation from "@material/base/foundation.js";
import {range} from "../../util/array-utils.js";
import {IllegalStateError} from "../../util/error.js";
import {cssClasses, numbers, strings} from './constants.js';

export default class AikDataTableFoundation extends MDCFoundation {
    static get cssClasses() {
        return cssClasses;
    }

    static get strings() {
        return strings;
    }

    static get numbers() {
        return numbers;
    }

    static get defaultAdapter() {
        return {
            hasHeaderClass: (columnIdx, clazz) => {},
            addHeaderClass: (columnIdx, clazz) => {},
            removeHeaderClass: (columnIdx, clazz) => {},

            getHeaderIndex: header => {},
            getColumnCount: () => {},
            getRowCount: () => {},
            getCellText: (rowIdx, columnIdx) => {},
            reorderRows: (rowIdxs) => {},

            notifyHeaderClick: header => {},
            notifyRowClick: row => {},
            registerHeaderInteractionHandler: (event, handler) => {},
            deregisterHeaderInteractionHandler: (event, handler) => {},
            registerRowInteractionHandler: (event, handler) => {},
            deregisterRowInteractionHandler: (event, handler) => {}
        };
    }

    constructor(adapter) {
        super(Object.assign(AikDataTableFoundation.defaultAdapter, adapter));

        /** @private */
        this.headerClickHandler_ = event => this.handleHeaderClick_(event);
        /** @private */
        this.rowClickHandler_ = event => this.handleRowClick_(event);
    }

    init() {
        this.adapter_.registerHeaderInteractionHandler('click', this.headerClickHandler_);
        this.adapter_.registerRowInteractionHandler('click', this.rowClickHandler_);
    }

    destroy() {
        this.adapter_.deregisterHeaderInteractionHandler('click', this.headerClickHandler_);
        this.adapter_.deregisterRowInteractionHandler('click', this.rowClickHandler_);
    }

    /**
     * @param {number} columnIdx
     * @return {boolean}
     */
    isColumnSortable(columnIdx) {
        return this.adapter_.hasHeaderClass(columnIdx, cssClasses.HEADER_SORTABLE);
    }

    /**
     * @param {number} columnIdx
     * @param {boolean} sortable
     */
    setColumnSortable(columnIdx, sortable) {
        if (!sortable) {
            this.setColumnSort(columnIdx, numbers.DIRECTION_UNSORTED);
        }
        const method = (sortable ? this.adapter_.addHeaderClass : this.adapter_.removeHeaderClass);
        method(columnIdx, cssClasses.HEADER_SORTABLE);
    }

    /**
     * @param {number} columnIdx
     * @return {number}
     */
    getColumnSort(columnIdx) {
        if (this.adapter_.hasHeaderClass(columnIdx, cssClasses.HEADER_SORTED_ASC)) {
            return numbers.DIRECTION_ASC;
        }
        if (this.adapter_.hasHeaderClass(columnIdx, cssClasses.HEADER_SORTED_DESC)) {
            return numbers.DIRECTION_DESC;
        }
        return numbers.DIRECTION_UNSORTED;
    }

    /**
     * @param {number} columnIdx
     * @param {number} direction
     */
    setColumnSort(columnIdx, direction) {
        if (direction === this.getColumnSort(columnIdx)) {
            // Nothing to do
            return;
        }
        if (direction !== numbers.DIRECTION_UNSORTED && !this.isColumnSortable(columnIdx)) {
            throw new IllegalStateError(`Unable to sort a column which hasn't been made sortable: ${columnIdx}`);
        }

        const columnCount = this.adapter_.getColumnCount();
        for (let columnIdx = 0; columnIdx < columnCount; columnIdx++) {
            this.adapter_.removeHeaderClass(columnIdx, cssClasses.HEADER_SORTED_ASC);
            this.adapter_.removeHeaderClass(columnIdx, cssClasses.HEADER_SORTED_DESC);
        }
        switch (direction) {
            case numbers.DIRECTION_ASC:
                this.adapter_.addHeaderClass(columnIdx, cssClasses.HEADER_SORTED_ASC);
                break;
            case numbers.DIRECTION_DESC:
                this.adapter_.addHeaderClass(columnIdx, cssClasses.HEADER_SORTED_DESC);
                break;
        }
        this.sort();
    }

    /** @param {number} columnIdx */
    toggleColumnSort(columnIdx) {
        const direction = this.getColumnSort(columnIdx);
        switch (direction) {
            case numbers.DIRECTION_UNSORTED:
            case numbers.DIRECTION_DESC:
                this.setColumnSort(columnIdx, numbers.DIRECTION_ASC);
                break;
            case numbers.DIRECTION_ASC:
                this.setColumnSort(columnIdx, numbers.DIRECTION_DESC);
                break;
            default:
                throw new TypeError(`Unsupported sort direction for column ${columnIdx}: ${direction}`);
        }
    }

    sort() {
        const columnCount = this.adapter_.getColumnCount();
        for (let columnIdx = 0; columnIdx < columnCount; columnIdx++) {
            const direction = this.getColumnSort(columnIdx);
            this.sortColumn_(columnIdx, direction);
        }
    }

    /**
     * @param {number} columnIdx
     * @param {number} direction
     * @private
     */
    sortColumn_(columnIdx, direction) {
        switch (direction) {
            case numbers.DIRECTION_UNSORTED:
                // Nothing to do
                return;
            case numbers.DIRECTION_ASC:
            case numbers.DIRECTION_DESC:
                break;
            default:
                throw new TypeError(`Unsupported sort direction for column ${columnIdx}: ${direction}`);
        }
        const rowIdxComparator = (rowIdxA, rowIdxB) => {
            const textA = this.adapter_.getCellText(rowIdxA, columnIdx).trim();
            const textB = this.adapter_.getCellText(rowIdxB, columnIdx).trim();
            return direction * textA.localeCompare(textB);
        };
        const rowIdxs = range(0, this.adapter_.getRowCount());
        rowIdxs.sort(rowIdxComparator);
        this.adapter_.reorderRows(rowIdxs);
    }

    /**
     * @param {Event} event
     * @private
     */
    handleHeaderClick_(event) {
        if (!event.target) {
            return;
        }
        const targetHeader = event.target.closest('th');
        if (targetHeader === null) {
            return;
        }
        const targetHeaderIdx = this.adapter_.getHeaderIndex(targetHeader);
        if (this.isColumnSortable(targetHeaderIdx)) {
            this.toggleColumnSort(targetHeaderIdx);
        }
        this.adapter_.notifyHeaderClick(targetHeader);
    }

    /**
     * @param {Event} event
     * @private
     */
    handleRowClick_(event) {
        if (!event.target) {
            return;
        }
        const targetRow = event.target.closest('tr');
        if (targetRow === null) {
            return;
        }
        this.adapter_.notifyRowClick(targetRow);
    }
}
