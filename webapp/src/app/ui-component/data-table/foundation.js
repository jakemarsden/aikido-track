import MDCFoundation from "@material/base/foundation.js";
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
            notifyRowClick: row => {},
            registerRowInteractionHandler: (event, handler) => {},
            deregisterRowInteractionHandler: (event, handler) => {}
        };
    }

    constructor(adapter) {
        super(Object.assign(AikDataTableFoundation.defaultAdapter, adapter));

        /** @private */
        this.rowClickHandler_ = event => this.handleRowClick_(event);
    }

    init() {
        this.adapter_.registerRowInteractionHandler('click', this.rowClickHandler_);
    }

    destroy() {
        this.adapter_.deregisterRowInteractionHandler('click', this.rowClickHandler_);
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
