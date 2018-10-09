/**
 * @abstract
 */
export class Component {

    /**
     * @param {!HTMLElement} root
     * @param {...?} args Any additional arguments to pass to {@link #init}
     */
    constructor(root, ...args) {
        /**
         * @constant {!HTMLElement}
         * @protected
         */
        this.root_ = root;

        this.init(...args);
        this.initDom();
    }

    /**
     * @return {!HTMLElement}
     */
    get root() {
        return this.root_;
    }

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
    }

    /**
     * @protected
     */
    destroy() {
    }

    /**
     * Wrapper method to add an event listener to the component's root element. This is most useful when listening for
     * custom events. Based on {@link MDCComponent#listen}
     * @param {string} eventType
     * @param {!Function} handler
     */
    listen(eventType, handler) {
        this.root_.addEventListener(eventType, handler);
    }

    /**
     * Wrapper method to remove an event listener from the component's root element. This is most useful when
     * listening for custom events. Based on {@link MDCComponent#listen}
     * @param {string} eventType
     * @param {!Function} handler
     */
    unlisten(eventType, handler) {
        this.root_.removeEventListener(eventType, handler);
    }

    /**
     * Fires a cross-browser-compatible custom event from the component's root element, with the given data. Based on
     * {@link MDCComponent#emit}
     * @param {string} eventType
     * @param {Object=} eventData
     * @param {boolean=} shouldBubble
     */
    emit(eventType, eventData = {}, shouldBubble = false) {
        let event;
        if (typeof CustomEvent === 'function') {
            event = new CustomEvent(eventType, {
                detail: eventData,
                bubbles: shouldBubble
            });
        } else {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent(eventType, shouldBubble, false, eventData);
        }
        this.root_.dispatchEvent(event);
    }
}

/**
 * @abstract
 */
export class Page {

    /**
     * @param {!Window} window
     * @param {...?} args Any additional arguments to pass to {@link #init}
     */
    constructor(window, ...args) {
        /**
         * @constant {!Window}
         * @private
         */
        this.window_ = window;

        this.init(...args);
        window.addEventListener('load', event => this.initDom());
        window.addEventListener('unload', event => this.destroy());
    }

    /**
     * @return {!HTMLDocument}
     */
    get root() {
        return this.window_.document;
    }

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
    }

    /**
     * @protected
     */
    destroy() {
    }
}
