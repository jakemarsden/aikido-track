import {firstCharToUpper} from "../../util/string-utils.js";
import {AikDataTable} from "../data-table/aik-data-table.js";
import AikMemberDataTableFoundation from "./foundation.js";

/** @extends AikDataTable<Member> */
export class AikMemberDataTable extends AikDataTable {
    static attachTo(root) {
        return new AikMemberDataTable(root);
    }

    /**
     * @param {Member} data
     * @param {DocumentFragment} frag
     * @protected
     */
    renderDataRow(data, frag) {
        super.renderDataRow(data, frag);
        const strings = AikMemberDataTableFoundation.strings;
        const values = {
            [strings.MEMBER_FIRST_NAME_SELECTOR]: data.firstName,
            [strings.MEMBER_LAST_NAME_SELECTOR]: data.lastName,
            [strings.MEMBER_TYPE_SELECTOR]: firstCharToUpper(data.type),
            [strings.MEMBER_BIRTH_DATE_SELECTOR]: data.birthDate
        };
        Object.entries(values).forEach(([selector, value]) =>
                frag.querySelectorAll(selector).forEach(elem => elem.textContent = value));
    }

    getDefaultFoundation() {
        const adapter = super.getDefaultFoundation().adapter_;
        return new AikMemberDataTableFoundation(adapter);
    }
}
