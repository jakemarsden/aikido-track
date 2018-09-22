import {MDCFoundation} from '@material/base/index.js';
import {cssClasses, numbers, strings} from './constants.js';

export default class AikDataFormFoundation extends MDCFoundation {
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
            notifySubmit: () => {},
            notifyReset: () => {},
            registerFormInteractionHandler: (event, handler) => {},
            deregisterFormInteractionHandler: (event, handler) => {}
        };
    }

    constructor(adapter) {
        super(Object.assign(AikDataFormFoundation.defaultAdapter, adapter));

        /** @private */
        this.submitHandler_ = event => this.handleFormSubmit_(event);
        /** @private */
        this.resetHandler_ = event => this.handleFormReset_(event);
    };

    init() {
        this.adapter_.registerFormInteractionHandler('submit', this.submitHandler_);
        this.adapter_.registerFormInteractionHandler('reset', this.resetHandler_);
    }

    destroy() {
        this.adapter_.deregisterFormInteractionHandler('submit', this.submitHandler_);
        this.adapter_.deregisterFormInteractionHandler('reset', this.resetHandler_);
    }

    /**
     * @param {Event} event
     * @private
     */
    handleFormSubmit_(event) {
        event.preventDefault();
        this.adapter_.notifySubmit();
    }

    /**
     * @param {Event} event
     * @private
     */
    handleFormReset_(event) {
        this.adapter_.notifyReset();
    }
}
