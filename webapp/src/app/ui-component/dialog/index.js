import {MDCDialog} from '@material/dialog/index.js';
import MDCDialogFoundation from '@material/dialog/foundation.js';
import {Component} from '../base/index.js';

export class Dialog extends Component {

    /**
     * @protected
     */
    initDom() {
        /**
         * @constant {MDCDialog}
         * @private
         */
        this.mdc_ = new MDCDialog(this.root_);
    }

    /**
     * @protected
     */
    destroy() {
        this.mdc_.destroy();
    }

    /**
     * @return {boolean}
     */
    get isOpen() {
        return this.mdc_.isOpen;
    }

    open() {
        this.mdc_.open();
    }

    /**
     * @param {string=} action In what state the dialog should be closed. Potentially, but not necessarily, one of
     * {@link Dialog.Action}
     * @see Dialog.Action
     */
    close(action = Dialog.Action.CANCEL) {
        this.mdc_.close(action);
    }
}

/**
 * Potentially useful constants to use when {@link Dialog#close}ing a dialo, although these values aren't the only
 * ones accepted by {@link Dialog#close}
 * @enum {string}
 */
Dialog.Action = {
    ACCEPT: 'accept',
    CANCEL: 'close'
};

/**
 * @enum {string}
 */
Dialog.Event = {
    OPENING: MDCDialogFoundation.strings.OPENING_EVENT,
    OPENED: MDCDialogFoundation.strings.OPENED_EVENT,
    CLOSING: MDCDialogFoundation.strings.CLOSING_EVENT,
    CLOSED: MDCDialogFoundation.strings.CLOSED_EVENT
};
