import MDCComponent from "@material/base/component.js";
import 'material-design-lite/material.js';
import AikDataTableFoundation from "./foundation.js";

export class AikDataTable extends MDCComponent {
    static attachTo(root) {
        return new AikDataTable(root);
    }

    /**
     * @param {number} columnIdx
     * @return {number}
     * @see AikDataTableFoundation#getColumnSort
     */
    getColumnSort(columnIdx) {
        return this.foundation_.getColumnSort(columnIdx);
    }

    /**
     * @param {number} columnIdx
     * @param {number} direction
     * @see AikDataTableFoundation#setColumnSort
     */
    setColumnSort(columnIdx, direction) {
        this.foundation_.setColumnSort(columnIdx, direction);
    }

    /**
     * @param {number} columnIdx
     * @see AikDataTableFoundation#toggleColumnSort
     */
    toggleColumnSort(columnIdx) {
        this.foundation_.toggleColumnSort(columnIdx);
    }

    /** @see AikDataTableFoundation#sort */
    sort() {
        this.foundation_.sort();
    }

    /**
     * Remove all data rows while preserving everything in the <thead/>
     */
    clearRows() {
        const tbody = this.tbody_;
        while (tbody.hasChildNodes()) {
            tbody.removeChild(tbody.lastChild);
        }
    }

    /**
     * @return {HTMLTableSectionElement}
     * @protected
     */
    get thead_() {
        return this.root_.querySelector(AikDataTableFoundation.strings.THEAD_SELECTOR);
    }

    /**
     * @return {HTMLTableSectionElement}
     * @protected
     */
    get tbody_() {
        return this.root_.querySelector(AikDataTableFoundation.strings.TBODY_SELECTOR);
    }

    /**
     * @param {number} columnIdx
     * @return {HTMLTableCellElement}
     */
    getHeader_(columnIdx) {
        return this.thead_.rows.item(0).cells.item(columnIdx);
    }

    /**
     * @param {number} rowIdx
     * @return {HTMLTableRowElement}
     */
    getRow_(rowIdx) {
        return this.tbody_.rows.item(rowIdx);
    }

    /**
     * @param {number} rowIdx
     * @param {number} columnIdx
     * @return {HTMLTableCellElement}
     * @private
     */
    getCell_(rowIdx, columnIdx) {
        return this.getRow_(rowIdx).cells.item(columnIdx);
    }

    getDefaultFoundation() {
        return new AikDataTableFoundation({
            hasHeaderClass: (columnIdx, clazz) => this.getHeader_(columnIdx).classList.contains(clazz),
            addHeaderClass: (columnIdx, clazz) => this.getHeader_(columnIdx).classList.add(clazz),
            removeHeaderClass: (columnIdx, clazz) => this.getHeader_(columnIdx).classList.remove(clazz),

            getHeaderIndex: header => Array.from(header.parentElement.children).indexOf(header),
            getColumnCount: () => this.thead_.rows.item(0).cells.length,
            getRowCount: () => this.tbody_.rows.length,
            getCellText: (rowIdx, columnIdx) => this.getCell_(rowIdx, columnIdx).textContent,
            reorderRows: rowIdxs => rowIdxs
                    .map(rowIdx => this.getRow_(rowIdx))
                    .forEach(row => this.tbody_.appendChild(row)),

            notifyHeaderClick: header =>
                    this.emit(AikDataTableFoundation.strings.HEADER_CLICK_EVENT, { targetHeader: header }),
            notifyRowClick: row => this.emit(AikDataTableFoundation.strings.ROW_CLICK_EVENT, { targetRow: row }),

            registerHeaderInteractionHandler: (event, handler) => this.thead_.addEventListener(event, handler),
            deregisterHeaderInteractionHandler: (event, handler) => this.thead_.removeEventListener(event, handler),
            registerRowInteractionHandler: (event, handler) => this.tbody_.addEventListener(event, handler),
            deregisterRowInteractionHandler: (event, handler) => this.tbody_.removeEventListener(event, handler)
        });
    }
}
