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
        this.dialogShowHandler_ = event => this.handleDialogShow_(event);
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
        this.dialog_.listen(Dialog.Event.SHOW, this.dialogShowHandler_);
        this.dialog_.listen(Dialog.Event.ACCEPT, this.dialogCloseHandler_);
        this.dialog_.listen(Dialog.Event.CANCEL, this.dialogCloseHandler_);
    }

    /**
     * @protected
     */
    destroy() {
        this.dialog_.unlisten(Dialog.Event.SHOW, this.dialogShowHandler_);
        this.dialog_.unlisten(Dialog.Event.ACCEPT, this.dialogCloseHandler_);
        this.dialog_.unlisten(Dialog.Event.CANCEL, this.dialogCloseHandler_);
        this.form_.unlisten(DataForm.Event.SUBMIT, this.formSubmitHandler_);
        this.form_.unlisten(DataForm.Event.RESET, this.formResetHandler_);

        this.dialog_.destroy();
        this.form_.destroy();
    }

    /**
     * @return {boolean}
     */
    get open() {
        return this.dialog_.open;
    }

    show() {
        this.dialog_.show();
    }

    /**
     * @param {boolean} accept
     */
    close(accept) {
        this.dialog_.close(accept);
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
    handleDialogShow_(event) {
        this.form_.listen(DataForm.Event.SUBMIT, this.formSubmitHandler_);
        this.form_.listen(DataForm.Event.RESET, this.formResetHandler_);
        this.emit(DataFormDialog.Event.SHOW);
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
        this.emit(DataFormDialog.Event.ACCEPT);
        this.dialog_.close(true);
    }

    /**
     * @param {Event} event
     * @private
     */
    handleFormReset_(event) {
        this.emit(DataFormDialog.Event.CANCEL);
        this.dialog_.close(false);
    }
}

/**
 * @enum {string}
 */
DataFormDialog.Event = {
    SHOW: 'DataFormDialog:show',
    ACCEPT: 'DataFormDialog:accept',
    CANCEL: 'DataFormDialog:cancel'
};
