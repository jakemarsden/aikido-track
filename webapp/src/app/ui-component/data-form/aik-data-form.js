import MDCComponent from "@material/base/component.js";
import {MDCSelect} from "@material/select";
import {MDCTextField} from "@material/textfield";
import AikDataFormFoundation from "./foundation.js";

export class AikDataForm extends MDCComponent {
    static attachTo(root) {
        return new AikDataForm(root);
    }

    /** @return {FormFieldMap} */
    get fields() {
        return this.fields_;
    }

    initialize() {
        /** @private */
        this.fields_ = findFormFields(this.root_);
    }

    destroy() {
        this.fields_.forEach(field => field.destroy());
        super.destroy();
    }

    submit() {
        this.root_.submit();
    }

    reset() {
        this.root_.reset();
    }

    getDefaultFoundation() {
        return new AikDataFormFoundation({
            notifySubmit: () => this.emit(AikDataFormFoundation.strings.SUBMIT_EVENT, {}),
            notifyReset: () => this.emit(AikDataFormFoundation.strings.RESET_EVENT, {}),
            registerFormInteractionHandler: (event, handler) => this.root_.addEventListener(event, handler),
            deregisterFormInteractionHandler: (event, handler) => this.root_.removeEventListener(event, handler)
        });
    }
}

/**
 * @param {HTMLFormElement} formElem
 * @return {FormFieldMap}
 */
function findFormFields(formElem) {
    const fields = new Map();
    const textFieldElems = formElem.querySelectorAll(AikDataFormFoundation.strings.TEXT_FIELD_SELECTOR);
    const selectFieldElems = formElem.querySelectorAll(AikDataFormFoundation.strings.SELECT_FIELD_SELECTOR);

    textFieldElems.forEach(textFieldElem => {
        const name = textFieldElem.querySelector('input').name;
        const field = new MDCTextField(textFieldElem);
        fields.set(name, field);
    });
    selectFieldElems.forEach(selectFieldElem => {
        const name = selectFieldElem.querySelector('select').name;
        const field = new MDCSelect(selectFieldElem);
        fields.set(name, field);
    });

    return fields;
}

/** @typedef {(MDCTextField|MDCSelect)} FormField */
/** @typedef {Map<string, FormField>} FormFieldMap */
