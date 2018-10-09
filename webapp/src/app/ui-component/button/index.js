import {MDCRipple} from '@material/ripple';
import {Component} from '../base/index.js';

export class Button extends Component {

    /**
     * @param {...?} args
     * @protected
     */
    init(...args) {
    }

    /**
     * @protected
     */
    initDom() {
        this.ripple_ = new MDCRipple(this.root_);
    }

    /**
     * @protected
     */
    destroy() {
        this.ripple_.destroy();
    }
}

/**
 * @enum {string}
 */
Button.Event = {
    CLICK: 'click'
};
