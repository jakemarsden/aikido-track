import {Component} from '../base/index.js';

/**
 * @template TData
 */
export class DataRow extends Component {

    /**
     * @return {!DataRow~Ctor<TData>}
     * @template TData
     */
    static get ctor() {
        return (root, data) => new DataRow(root, data);
    }

    /**
     * @param {!HTMLTableRowElement} root
     * @param {TData} data
     * @param {...?} args Any additional arguments to pass to {@link #init}
     */
    constructor(root, data, ...args) {
        super(root, data, ...args);
    }

    /**
     * @param {TData} data
     * @param {...?} args
     * @protected
     */
    init(data, ...args) {
        /**
         * @constant {TData}
         * @private
         */
        this.data_ = data;
    }

    /**
     * @protected
     */
    initDom() {
    }

    /**
     * @protected
     */
    destroy() {
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
     * @param {(DataRow<TData>|null|undefined)} other
     * @param {number} colIdx
     * @return {number}
     */
    compareTo(other, colIdx) {
        if (other == null) {
            return 1;
        }
        const cell = this.root_.cells.item(colIdx);
        const text = cell.textContent.trim();
        const otherCell = other.root_.cells.item(colIdx);
        const otherText = otherCell.textContent.trim();
        return text.localeCompare(otherText);
    }

    /**
     * @param {Object<string, DataRow~Renderer<TData>>} renderers
     * @protected
     */
    render(renderers) {
        const root = this.root_;
        const data = this.data_;
        Object.entries(renderers).forEach(([selector, renderer]) =>
                root.querySelectorAll(selector).forEach(elem =>
                        renderer(elem, data)));
    }
}

/**
 * @callback DataRow~Ctor
 * @param {!HTMLTableRowElement} root
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
