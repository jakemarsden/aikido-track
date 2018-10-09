import {MDCDialog} from '@material/dialog';
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
    get open() {
        return this.mdc_.foundation_.isOpen();
    }

    show() {
        this.emit(Dialog.Event.SHOW);
        this.mdc_.foundation_.open();
    }

    /**
     * @param {boolean} accept 
     */
    close(accept) {
        accept ? this.mdc_.foundation_.accept(true) : this.mdc_.foundation_.cancel(true);
    }
}

/**
 * @enum {string}
 */
Dialog.Event = {
    SHOW: 'Dialog:show',
    ACCEPT: MDCDialogFoundation.strings.ACCEPT_EVENT,
    CANCEL: MDCDialogFoundation.strings.CANCEL_EVENT
};
