import {Component} from '../base/index.js';
import {DataForm} from '../data-form/index.js';
import {Dialog} from '../dialog/index.js';

export class DataFormDialog extends Component {

    /**
     * @param {!Dialog} dialog
     * @param {!DataForm} form
     * @param {...?} args Any additional arguments to pass to {@link #init}
     */
    constructor(dialog, form, ...args) {
        super(dialog.root, dialog, form, ...args);
    }

    /**
     * @param {!Dialog} dialog
     * @param {!DataForm} form
     * @param {...?} args
     * @protected
     */
    init(dialog, form, ...args) {
        this.dialogOpenHandler_ = event => this.handleDialogOpen_(event);
        this.dialogCloseHandler_ = event => this.handleDialogClose_(event);
        this.formSubmitHandler_ = event => this.handleFormSubmit_(event);
        this.formResetHandler_ = event => this.handleFormReset_(event);

        /**
         * @constant {!Dialog}
         * @private
         */
        this.dialog_ = dialog;
        /**
         * @constant {!DataForm}
         * @private
         */
        this.form_ = form;
    }

    /**
     * @protected
     */
    initDom() {
        this.dialog_.listen(Dialog.Event.OPENING, this.dialogOpenHandler_);
        this.dialog_.listen(Dialog.Event.CLOSING, this.dialogCloseHandler_);
    }

    /**
     * @protected
     */
    destroy() {
        this.dialog_.unlisten(Dialog.Event.OPENING, this.dialogOpenHandler_);
        this.dialog_.unlisten(Dialog.Event.CLOSING, this.dialogCloseHandler_);
        this.form_.unlisten(DataForm.Event.SUBMIT, this.formSubmitHandler_);
        this.form_.unlisten(DataForm.Event.RESET, this.formResetHandler_);

        this.dialog_.destroy();
        this.form_.destroy();
    }

    /**
     * @return {boolean}
     */
    get isOpen() {
        return this.dialog_.isOpen;
    }

    open() {
        this.dialog_.open();
    }

    /**
     * @param {string=} action In what state the form dialog should be closed. Potentially, but not necessarily, one
     * of {@link Dialog.Action}. {@link DataFormDialog} uses {@link Dialog.Action.ACCEPT} to indicate form submission
     * @see Dialog.Action
     */
    close(action = Dialog.Action.CANCEL) {
        this.dialog_.close(action);
    }

    /**
     * @return {!Map<string, DataForm~FormField>}
     */
    get fields() {
        return this.form_.fields;
    }

    reset() {
        this.form_.reset();
    }

    /**
     * @param {Event} event
     * @private
     */
    handleDialogOpen_(event) {
        this.form_.listen(DataForm.Event.SUBMIT, this.formSubmitHandler_);
        this.form_.listen(DataForm.Event.RESET, this.formResetHandler_);
    }

    /**
     * @param {Event} event
     * @private
     */
    handleDialogClose_(event) {
        this.form_.unlisten(DataForm.Event.SUBMIT, this.formSubmitHandler_);
        this.form_.unlisten(DataForm.Event.RESET, this.formResetHandler_);
        this.form_.reset();
    }

    /**
     * @param {Event} event
     * @private
     */
    handleFormSubmit_(event) {
        this.emit(DataFormDialog.Event.SUBMIT);
        this.dialog_.close(Dialog.Action.ACCEPT);
    }

    /**
     * @param {Event} event
     * @private
     */
    handleFormReset_(event) {
        this.dialog_.close(Dialog.Action.CANCEL);
    }
}

/**
 * @enum {string}
 */
DataFormDialog.Event = {
    SUBMIT: 'DataFormDialog:submit'
};
