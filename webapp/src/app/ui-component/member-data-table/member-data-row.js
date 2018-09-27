import {firstCharToUpper, join} from "../../util/string-utils.js";
import {DataRow} from "../data-table/data-row.js";

/**
 * @extends {DataRow<Member>}
 */
export class MemberDataRow extends DataRow {
    /**
     * @return {!DataRow~Ctor<Member>}
     */
    static get ctor() {
        return (elem, data) => new MemberDataRow(elem, data);
    }

    /**
     * @param {!HTMLTableRowElement} elem
     * @param {Member} data
     */
    constructor(elem, data) {
        super(elem, data);

        const s = MemberDataRow.Selector;
        /**
         * @constant {Object<string, DataRow~Renderer<Member>>}
         * @private
         */
        this.renderers_ = {
            [s.ID]: (elem, data) => elem.textContent = data.id,
            [s.TYPE]: (elem, data) => elem.textContent = firstCharToUpper(data.type),
            [s.FIRST_NAME]: (elem, data) => elem.textContent = data.firstName,
            [s.LAST_NAME]: (elem, data) => elem.textContent = data.lastName,
            [s.FULL_NAME]: (elem, data) => elem.textContent = join([data.firstName, data.lastName], ' '),
            [s.BIRTH_DATE]: (elem, data) => elem.textContent = data.birthDate
        };
    }

    onAttach() {
        this.render(this.renderers_);
    }
}

const SELECTOR_BASE = 'aik-member-data-table';
/**
 * @constant
 * @enum {string}
 * @private
 */
MemberDataRow.Selector = {
    ID: `.${SELECTOR_BASE}__id`,
    TYPE: `.${SELECTOR_BASE}__type`,
    FIRST_NAME: `.${SELECTOR_BASE}__first-name`,
    LAST_NAME: `.${SELECTOR_BASE}__last-name`,
    FULL_NAME: `.${SELECTOR_BASE}__full-name`,
    BIRTH_DATE: `.${SELECTOR_BASE}__birth-date`
};
