import AikDataTableFoundation from "../data-table/foundation.js";
import {cssClasses, numbers, strings} from './constants.js';

export default class AikMemberDataTableFoundation extends AikDataTableFoundation {
    static get cssClasses() {
        return cssClasses;
    }

    static get strings() {
        return strings;
    }

    static get numbers() {
        return numbers;
    }

    static get defaultAdapter() {
        return {};
    }

    constructor(adapter) {
        super(Object.assign(AikMemberDataTableFoundation.defaultAdapter, adapter));
    }
}
