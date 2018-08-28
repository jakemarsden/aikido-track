define(["jquery"], $ => {
    "use strict";

    function createDialogWithForm(elemSelector, opts) {
        opts = validateFormOpts(opts);

        const originalOnInit = opts.onInit;
        opts.onInit = dlg => {
            dlg._originalConfirmBtnDisplayProperty = dlg.confirmBtn.css("display");
            dlg._originalFormEditMode = opts.startEditable;
            dlg.formEditModeBtn = dlg.elem.find(".control .edit");
            dlg.formElem = dlg.elem.find("form:first-of-type");

            dlg.getFormEditMode = function () {
                return dlg.formEditModeBtn.hasClass("selected");
            };
            dlg.setFormEditMode = function (mode) {
                dlg.formEditModeBtn.toggleClass("selected", mode);
                dlg._updateFormEditMode();
            };
            dlg.toggleFormEditMode = function () {
                dlg.formEditModeBtn.toggleClass("selected");
                dlg._updateFormEditMode();
            };
            dlg._updateFormEditMode = function () {
                const mode = dlg.getFormEditMode();
                opts.onFormEditModeChange(dlg, dlg.formElem, mode);

                dlg.formElem.find("> fieldset").prop("disabled", !mode);
                dlg.confirmBtn.prop("disabled", !mode);
                dlg.confirmBtn.css("display", mode ? dlg._originalConfirmBtnDisplayProperty : "none");
            };

            dlg.setFormEditMode(dlg._originalFormEditMode);
            dlg.formEditModeBtn.click(() => dlg._updateFormEditMode());
            return originalOnInit(dlg);
        };

        const originalOnOpen = opts.onOpen;
        opts.onOpen = dlg => {
            opts.onFormPopulate(dlg, dlg.formElem);
            return originalOnOpen(dlg);
        };

        const originalOnConfirm = opts.onConfirm;
        opts.onConfirm = dlg => {
            opts.onFormSubmit(dlg, dlg.formElem);
            return originalOnConfirm(dlg);
        };

        const originalOnClose = opts.onClose;
        opts.onClose = dlg => {
            opts.onFormReset(dlg, dlg.formElem);
            dlg.formElem.trigger("reset");
            dlg.setFormEditMode(dlg._originalFormEditMode);
            return originalOnClose(dlg);
        };

        return createDialog(elemSelector, opts);
    }

    function createDialog(elemSelector, opts) {
        opts = validateOpts(opts);

        const dialogElem = $(elemSelector);
        const dialog = {
            _originalDisplayProperty: undefined,
            elem: dialogElem,
            overlayElem: dialogElem.parents(".modal-overlay"),
            contentElem: dialogElem.find(".content:first"),
            iconElem: dialogElem.find(".header .icon"),
            titleElem: dialogElem.find(".header .title"),
            confirmBtn: dialogElem.find(".control .confirm"),
            cancelBtn: dialogElem.find(".control .cancel"),

            show: function () {
                this.overlayElem.css("display", this._originalDisplayProperty);
            },
            hide: function () {
                this._originalDisplayProperty = this.overlayElem.css("display");
                this.overlayElem.css("display", "none");
            },

            open: function () {
                opts.onOpen(this);
                this.show();
            },
            confirm: function () {
                opts.onConfirm(this);
                opts.onClose(this);
                this.hide();
            },
            cancel: function () {
                opts.onCancel(this);
                opts.onClose(this);
                this.hide();
            }
        };

        dialog.hide();
        opts.onInit(dialog);

        dialog.confirmBtn.click(() => dialog.confirm());
        dialog.cancelBtn.click(() => dialog.cancel());

        return dialog;
    }

    function validateOpts(opts) {
        if (opts == null) {
            opts = {};
        }

        const noop = dlg => {};
        if (opts.onInit == null) {
            opts.onInit = noop;
        }
        if (opts.onOpen == null) {
            opts.onOpen = noop;
        }
        if (opts.onClose == null) {
            opts.onClose = noop;
        }
        if (opts.onConfirm == null) {
            opts.onConfirm = noop;
        }
        if (opts.onCancel == null) {
            opts.onCancel = noop;
        }
        return opts;
    }

    function validateFormOpts(opts) {
        opts = validateOpts(opts);
        const noop = (dlg, form) => {};

        if (opts.startEditable !== true) {
            // ie. the default is false
            opts.startEditable = false;
        }
        if (opts.onFormPopulate == null) {
            opts.onFormPopulate = noop;
        }
        if (opts.onFormSubmit == null) {
            opts.onFormSubmit = noop;
        }
        if (opts.onFormReset == null) {
            opts.onFormReset = noop;
        }
        if (opts.onFormEditModeChange == null) {
            opts.onFormEditModeChange = noop;
        }
        return opts;
    }

    return {
        create: createDialog,
        createWithForm: createDialogWithForm
    };
});
