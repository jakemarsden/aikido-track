import MDCDialogFoundation from "@material/dialog/foundation.js";
import AikDataFormFoundation from "../data-form/foundation.js";
import {cssClasses, numbers, strings} from './constants.js';

export default class AikFormDialogFoundation extends MDCDialogFoundation {
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
            resetForm: () => {},
            registerFormInteractionHandler: (event, handler) => {},
            deregisterFormInteractionHandler: (event, handler) => {}
        };
    }

    constructor(adapter) {
        super(Object.assign(AikFormDialogFoundation.defaultAdapter, adapter));
        this.formSubmitHandler_ = event => this.handleFormSubmit_(event);
        this.formResetHandler_ = event => this.handleFormReset_(event);
    }

    open() {
        super.open();
        this.adapter_.registerFormInteractionHandler(
                AikDataFormFoundation.strings.SUBMIT_EVENT, this.formSubmitHandler_);
        this.adapter_.registerFormInteractionHandler(
                AikDataFormFoundation.strings.RESET_EVENT, this.formResetHandler_);
    }

    close() {
        super.close();
        this.adapter_.deregisterFormInteractionHandler(
                AikDataFormFoundation.strings.SUBMIT_EVENT, this.formSubmitHandler_);
        this.adapter_.deregisterFormInteractionHandler(
                AikDataFormFoundation.strings.RESET_EVENT, this.formResetHandler_);
        this.adapter_.resetForm();
    }

    /** @param {Event} event */
    handleFormSubmit_(event) {
        this.accept(true);
    }

    /** @param {Event} event */
    handleFormReset_(event) {
        this.cancel(true);
    }
}
