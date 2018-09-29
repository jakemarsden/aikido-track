/**
 * @template TData
 */
export class DataRow {
    /**
     * @return {!DataRow~Ctor<TData>}
     * @template TData
     */
    static get ctor() {
        return (elem, data) => new DataRow(elem, data);
    }

    /**
     * @param {!HTMLTableRowElement} elem
     * @param {TData} data
     */
    constructor(elem, data) {
        /**
         * @constant {!HTMLTableRowElement}
         * @private
         */
        this.elem_ = elem;
        /**
         * @constant {TData}
         * @private
         */
        this.data_ = data;
    }

    /**
     * @return {!HTMLTableRowElement}
     */
    get elem() {
        return this.elem_;
    }

    /**
     * @return {TData}
     */
    get data() {
        return this.data_;
    }

    /**
     * Default behaviour is to compare the text content of the {@link HTMLTableDataCellElement} elements
     * alphabetically, since this class doesn't know anything about the structure of the underlying {@link #data}.
     * Subclasses may override this method to perform a better comparison
     * @param {(DataRow<TData>|null)} other
     * @param {number} colIdx
     * @return {number}
     */
    compareTo(other, colIdx) {
        if (other == null) {
            return 1;
        }
        const cell = this.elem_.cells.item(colIdx);
        const text = cell.textContent.trim();
        const otherCell = other.elem_.cells.item(colIdx);
        const otherText = otherCell.textContent.trim();
        return text.localeCompare(otherText);
    }

    onAttach() {}

    onDetach() {}

    destroy() {}

    /**
     * @param {Object<string, DataRow~Renderer<TData>>} renderers
     * @protected
     */
    render(renderers) {
        const elem = this.elem_;
        const data = this.data_;
        Object.entries(renderers).forEach(([selector, renderer]) =>
                elem.querySelectorAll(selector).forEach(childElem =>
                        renderer(childElem, data)));
    }
}

/**
 * @callback DataRow~Ctor
 * @param {!HTMLTableRowElement} elem
 * @param {TData} data
 * @return {!DataRow<TData>}
 * @template TData
 */

/**
 * @callback DataRow~Factory
 * @param {TData} data
 * @return {!DataRow<TData>}
 * @template TData
 */

/**
 * @callback DataRow~Renderer
 * @param {!Element} elem
 * @param {TData} data
 * @template TData
 * @protected
 */
