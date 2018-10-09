import {MDCTabBar} from '@material/tab-bar';
import {MDCTopAppBar} from '@material/top-app-bar';
import {Page} from '../ui-component/base/index.js';
import './app-icon-dark.png';
import './app-icon-light.png';

/**
 * @abstract
 */
export class LayoutPage extends Page {

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
        this.appBar_ = new MDCTopAppBar(this.root_.querySelector(LayoutPage.Selector.APP_BAR));
        this.tabBar_ = new MDCTabBar(this.root_.querySelector(LayoutPage.Selector.TAB_BAR));
    }

    /**
     * @protected
     */
    destroy() {
        this.appBar_.destroy();
        this.tabBar_.destroy();
    }
}

/**
 * @enum {string}
 * @private
 */
LayoutPage.Selector = {
    APP_BAR:'#aik-top-app-bar',
    TAB_BAR: '#aik-top-tab-bar'
};
