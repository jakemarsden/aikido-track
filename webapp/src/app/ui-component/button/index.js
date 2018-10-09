import {MDCRipple} from '@material/ripple';
import {Component} from '../base/index.js';

export class Button extends Component {

    /**
     * @param {...?} args
     * @protected
     */
    init(...args) {
        this.clickHandler_ = event => this.emit(Button.Event.CLICK);
    }

    /**
     * @protected
     */
    initDom() {
        this.ripple_ = new MDCRipple(this.root_);
        this.listen('click', this.clickHandler_);
    }

    /**
     * @protected
     */
    destroy() {
        this.unlisten('click', this.clickHandler_);
        this.ripple_.destroy();
    }
}

/**
 * @enum {string}
 */
Button.Event = {
    CLICK: 'Button:click'
};
