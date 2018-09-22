import MDCComponent from "@material/base/component.js";
import AikDataTableFoundation from "./foundation.js";

export class AikDataTable extends MDCComponent {
    static attachTo(root) {
        return new AikDataTable(root);
    }

    /**
     * @return {HTMLElement}
     * @protected
     */
    get tbody_() {
        return this.root_.querySelector(AikDataTableFoundation.strings.TABLE_BODY_SELECTOR);
    }

    /**
     * Remove all data rows while preserving everything in the <thead/>
     */
    clearRows() {
        const tbody = this.tbody_;
        while (tbody.hasChildNodes()) {
            tbody.removeChild(tbody.lastChild);
        }
    }

    getDefaultFoundation() {
        return new AikDataTableFoundation({
            notifyRowClick: row => this.emit(AikDataTableFoundation.strings.ROW_CLICK_EVENT, { targetRow: row }),
            registerRowInteractionHandler: (event, handler) => this.tbody_.addEventListener(event, handler),
            deregisterRowInteractionHandler: (event, handler) => this.tbody_.removeEventListener(event, handler)
        });
    }
}
