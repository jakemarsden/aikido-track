import {MDCSelect} from '@material/select/index.js';
import {MDCTextField} from '@material/textfield/index.js';
import {Component} from '../base/index.js';

export class DataForm extends Component {

    /**
     * @param {...?} args
     * @protected
     */
    init(...args) {
        this.submitHandler_ = event => {
            event.preventDefault();
            this.emit(DataForm.Event.SUBMIT);
        };
        this.resetHandler_ = event => this.emit(DataForm.Event.RESET);

        /**
         * @constant {!Map<string, DataForm~FormField>}
         * @private
         */
        this.fields_ = new Map();
    }

    /**
     * @protected
     */
    initDom() {
        const textFieldElems = this.root_.querySelectorAll(DataForm.Selector.TEXT_FIELD);
        const selectFieldElems = this.root_.querySelectorAll(DataForm.Selector.SELECT_FIELD);
        textFieldElems.forEach(textFieldElem => {
            const name = textFieldElem.querySelector('input').name;
            const field = new MDCTextField(textFieldElem);
            this.fields_.set(name, field);
        });
        selectFieldElems.forEach(selectFieldElem => {
            const name = selectFieldElem.querySelector('select').name;
            const field = new MDCSelect(selectFieldElem);
            this.fields_.set(name, field);
        });

        this.root_.addEventListener('submit', this.submitHandler_);
        this.root_.addEventListener('reset', this.resetHandler_);
    }

    /**
     * @protected
     */
    destroy() {
        this.root_.removeEventListener('submit', this.submitHandler_);
        this.root_.removeEventListener('reset', this.resetHandler_);

        this.fields_.forEach(field => field.destroy());
    }

    /**
     * @return {!Map<string, DataForm~FormField>}
     */
    get fields() {
        return this.fields_;
    }

    submit() {
        this.root_.submit();
    }

    reset() {
        this.root_.reset();
    }
}

/**
 * @enum {string}
 */
DataForm.Event = {
    SUBMIT: 'DataForm:submit',
    RESET: 'DataForm:reset'
}

/**
 * @enum {string}
 * @private
 */
DataForm.Selector = {
    TEXT_FIELD: '.mdc-text-field',
    SELECT_FIELD: '.mdc-select'
};

/** @typedef {(MDCTextField|MDCSelect)} DataForm~FormField */
