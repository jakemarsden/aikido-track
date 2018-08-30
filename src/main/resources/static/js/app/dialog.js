define(["jquery"], $ => {
    "use strict";

    /** @class Dialog */
    class Dialog {
        /** @param {!(string|jQuery)} elemSelector */
        constructor(elemSelector) {
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

        /** @protected */
        _show() {
            this.overlayElem.css("display", this._originalDisplayProperty);
        }

        /** @protected */
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
         * @param {!(string|jQuery)} elemSelector
         * @param {boolean} [startEditable=false]
         */
        constructor(elemSelector, startEditable) {
            super(elemSelector);
            this._startEditable = startEditable === true;
            this._originalConfirmBtnDisplayProperty = undefined;
            this.formEditModeBtn = this.elem.find(".control .edit");
            this.formElem = this.elem.find("form:first-of-type");
        }

        init() {
            this._originalConfirmBtnDisplayProperty = this.confirmBtn.css("display");
            this.formEditMode = this._startEditable;
            super.init();
            this.formEditModeBtn.click(() => this._updateFormEditMode());
        }

        open() {
            this.onFormPopulate(this.formElem);
            super.open();
        }

        confirm() {
            super.confirm();
            this.formEditMode = this._startEditable;
            this.onFormSubmit(this.formElem);
            this.formElem.trigger("reset");
            this.onFormReset(this.formElem);
        }

        cancel() {
            super.cancel();
            this.formEditMode = this._startEditable;
            this.formElem.trigger("reset");
            this.onFormReset(this.formElem);
        }

        /** @return {!boolean} */
        get formEditMode() {
            return this.formEditModeBtn.hasClass("selected");
        }

        /** @param {!boolean} mode */
        set formEditMode(mode) {
            this.formEditModeBtn.toggleClass("selected", mode);
            this._updateFormEditMode();
        }

        /** @protected */
        _updateFormEditMode() {
            const mode = this.formEditMode;
            this.formElem.find("> fieldset").prop("disabled", !mode);
            this.confirmBtn.prop("disabled", !mode);
            this.confirmBtn.css("display", mode ? this._originalConfirmBtnDisplayProperty : "none");
            this.onFormEditModeChange(this.formElem, mode);
        }

        // Callbacks

        /** @param {!jQuery} form */
        onFormPopulate(form) {}

        /** @param {!jQuery} form */
        onFormSubmit(form) {}

        /** @param {!jQuery} form */
        onFormReset(form) {}

        /**
         * @param {!jQuery} form
         * @param {!boolean} mode
         */
        onFormEditModeChange(form, mode) {}
    }

    Dialog.FormDialog = FormDialog;
    return Dialog;
});
