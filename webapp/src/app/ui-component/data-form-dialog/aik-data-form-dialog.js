import {MDCDialog} from "@material/dialog/index.js";
import {AikDataForm} from "../data-form/aik-data-form.js";
import AikDataFormDialogFoundation from "./foundation.js";

/**
 * Example usage:
 * ```html
 * <!-- HTML -->
 * <aside id="my-form-dialog"
 *         class="mdc-dialog"
 *         role="alertdialog"
 *         aria-labelledby="my-form-dialog__title"
 *         aria-describedby="my-form-dialog__body">
 *
 *     <div class="mdc-dialog__surface">
 *     <header class="mdc-dialog__header">
 *         <h2 id="my-form-dialog__title" class="mdc-dialog__header__title">My form dialog</h2>
 *     </header>
 *
 *     <section id="my-form-dialog__body" class="mdc-dialog__body mdc-dialog__body--scrollable">
 *         <form id="my-form-dialog__form">
 *             <fieldset>
 *                 <div id="my-form-dialog__form__description" class="mdc-text-fiel mdc-text-field--outlined">
 *                     <input id="my-form-dialog__form__description__input"
 *                             class="mdc-text-field__input"
 *                             name="description"
 *                             type="text"
 *                             disabled/>
 *                     <label for="my-form-dialog__form__description__input" class="mdc-floating-label">ID</label>
 *                     <div class="mdc-notched-outline">
 *                         <svg>
 *                             <path class="mdc-notched-outline__path"/>
 *                         </svg>
 *                     </div>
 *                     <div class="mdc-notched-outline__idle"></div>
 *                 </div>
 *             </fieldset>
 *         </form>
 *     </section>
 *
 *     <!-- Note: Don't add class="mdc-dialog__footer__button--cancel" -->
 *     <footer class="mdc-dialog__footer">
 *         <button class="mdc-button mdc-button--unelevated mdc-dialog__footer__button"
 *                 form="my-form-dialog__form"
 *                 type="reset">
 *             Decline
 *         </button>
 *
 *         <!-- Note: Don't add class="mdc-dialog__footer__button--accept" -->
 *         <button class="mdc-button mdc-button--unelevated mdc-dialog__footer__button"
 *                 form="my-form-dialog__form"
 *                 type="submit">
 *             Accept
 *         </button>
 *     </footer>
 *     </div>
 *     <div class="mdc-dialog__backdrop"></div>
 * </aside>
 * ```
 *
 * ```javascript
 * // JavaScript
 * function onLoad() {
 *     new AikDataFormDialog(document.querySelector('#my-form-dialog'));
 * }
 * ```
 */
export class AikDataFormDialog extends MDCDialog {
    static attachTo(root) {
        return new AikDataFormDialog(root);
    }

    /** @return {AikDataForm} */
    get form() {
        return this.form_;
    }

    initialize() {
        super.initialize();
        /** @private */
        this.form_ = new AikDataForm(this.root_.querySelector(AikDataFormDialogFoundation.strings.FORM_SELECTOR));
    }

    destroy() {
        this.form_.destroy();
        super.destroy();
    }

    getDefaultFoundation() {
        const adapter = super.getDefaultFoundation().adapter_;
        adapter.resetForm = () => this.form_.reset();
        adapter.registerFormInteractionHandler = (event, handler) => this.form_.listen(event, handler);
        adapter.deregisterFormInteractionHandler = (event, handler) => this.form_.unlisten(event, handler);
        return new AikDataFormDialogFoundation(adapter);
    }
}
