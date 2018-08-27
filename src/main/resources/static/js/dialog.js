define(["jquery"], $ => {
    "use strict";

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

        dialog.confirmBtn.click(() => dialog.confirm());
        dialog.cancelBtn.click(() => dialog.cancel());

        dialog.hide();
        opts.onInit(dialog);

        return dialog;
    }

    function validateOpts(opts) {
        if (opts == null) {
            opts = {};
        }

        const noop = dialog => {};
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

    return { create: createDialog };
});
