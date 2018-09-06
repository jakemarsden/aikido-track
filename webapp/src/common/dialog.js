import $ from 'jquery';

/** @class Dialog */
class Dialog {
    /** @param {(string|jQuery)} elemSelector */
    constructor(elemSelector) {
        /**
         * @type {string|undefined}
         * @private
         */
        this._originalDisplayProperty = undefined;

        this.elem = $(elemSelector);
        this.overlayElem = this.elem.parents(".modal-overlay");
        this.contentElem = this.elem.find(".content:first");
        this.iconElem = this.elem.find(".header .icon");
        this.titleElem = this.elem.find(".header .title");
        this.confirmBtn = this.elem.find(".control .confirm");
        this.cancelBtn = this.elem.find(".control .cancel");
    }

    /** Call after setting any desired properties (eg. callbacks) but before {@link open}ing the dialog */
    init() {
        this._hide();
        this.confirmBtn.click(() => this.confirm());
        this.cancelBtn.click(() => this.cancel());
    }

    isOpen() {
        return this._isShown();
    }

    open() {
        this.onOpen();
        this._show();
    }

    confirm() {
        this._hide();
        this.onConfirm();
        this.onClose();
    }

    cancel() {
        this._hide();
        this.onCancel();
        this.onClose();
    }

    /**
     * @return {boolean}
     * @private
     */
    _isShown() {
        return this.overlayElem.css("display") !== "none";
    }

    /** @private */
    _show() {
        this.overlayElem.css("display", this._originalDisplayProperty);
    }

    /** @private */
    _hide() {
        this._originalDisplayProperty = this.overlayElem.css("display");
        this.overlayElem.css("display", "none");
    }

    // Callbacks

    onOpen() {}

    onClose() {}

    onConfirm() {}

    onCancel() {}
}

/**
 * @class Dialog.FormDialog
 * @extends Dialog
 */
class FormDialog extends Dialog {
    /**
     * @param {(string|jQuery)} elemSelector
     * @param {boolean} [startEditable=false]
     */
    constructor(elemSelector, startEditable) {
        super(elemSelector);
        /**
         * @type { boolean}
         * @private
         */
        this._startEditable = startEditable === true;
        /**
         * @type {(string|undefined)}
         * @private
         */
        this._originalConfirmBtnDisplayProperty = undefined;
        /**
         * @type {(Object|undefined)}
         * @private
         */
        this._data = undefined;

        this.formEditModeBtn = this.elem.find(".control .edit");
        this.formElem = this.elem.find("form:first-of-type");
    }

    init() {
        this._originalConfirmBtnDisplayProperty = this.confirmBtn.css("display");
        super.init();
        this.formEditMode = this._startEditable;
        this.formEditModeBtn.click(() => this._updateFormEditMode());
    }

    /** @param {Object} data The data to populate the form with */
    open(data) {
        this._data = data;
        this.onFormPopulate(this.formElem, data);
        super.open();
    }

    confirm() {
        super.confirm();
        this._data = undefined;
        this.formEditMode = this._startEditable;
        this.onFormSubmit(this.formElem);
        this.formElem.trigger("reset");
        this.onFormReset(this.formElem);
    }

    cancel() {
        super.cancel();
        this._data = undefined;
        this.formEditMode = this._startEditable;
        this.formElem.trigger("reset");
        this.onFormReset(this.formElem);
    }

    /** @return {boolean} */
    get formEditMode() {
        return this.formEditModeBtn.hasClass("selected");
    }

    /** @param {boolean} mode */
    set formEditMode(mode) {
        this.formEditModeBtn.toggleClass("selected", mode);
        this._updateFormEditMode();
    }

    /** @private */
    _updateFormEditMode() {
        const mode = this.formEditMode;
        this.formElem.find("> fieldset").prop("disabled", !mode);
        this.confirmBtn.prop("disabled", !mode);
        this.confirmBtn.css("display", mode ? this._originalConfirmBtnDisplayProperty : "none");

        if (!mode && this.isOpen()) {
            if (this._data === undefined) {
                throw new Error("Illegal state exception: data should be defined for as long as the form is open");
            }
            // Edit mode has been disabled before #confirm()ing the dialog. Reset the form back to its original
            // state (at the time of #open()ing) in case the user made any changes while the form was editable
            this.onFormPopulate(this.formElem, this._data);
        }
        this.onFormEditModeChange(this.formElem, mode);
    }

    // Callbacks

    /**
     * @param {jQuery} form The form element which needs to be populated
     * @param {Object} data The data to populate the form with
     */
    onFormPopulate(form, data) {}

    /** @param {jQuery} form */
    onFormSubmit(form) {}

    /** @param {jQuery} form */
    onFormReset(form) {}

    /**
     * @param {jQuery} form
     * @param {boolean} mode
     */
    onFormEditModeChange(form, mode) {}
}

Dialog.FormDialog = FormDialog;
export default Dialog;
