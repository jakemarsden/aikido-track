import {firstCharToUpper, join} from "../../util/string-utils.js";
import {DataRow} from "./data-row.js";

/**
 * @extends {DataRow<Member>}
 */
export class MemberDataRow extends DataRow {

    /**
     * @return {!DataRow~Ctor<Member>}
     */
    static get ctor() {
        return (root, data) => new MemberDataRow(root, data);
    }

    /**
     * @protected
     */
    initDom() {
        super.initDom();
        this.render(MemberDataRow.RENDERERS);
    }
}

const SELECTOR_BASE = 'aik-member-data-table';

/**
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

/**
 * @constant {Object<string, DataRow~Renderer<Member>>}
 * @private
 */
MemberDataRow.RENDERERS = {
    [MemberDataRow.Selector.ID]: (elem, data) => elem.textContent = data.id,
    [MemberDataRow.Selector.TYPE]: (elem, data) => elem.textContent = firstCharToUpper(data.type),
    [MemberDataRow.Selector.FIRST_NAME]: (elem, data) => elem.textContent = data.firstName,
    [MemberDataRow.Selector.LAST_NAME]: (elem, data) => elem.textContent = data.lastName,
    [MemberDataRow.Selector.FULL_NAME]: (elem, data) => elem.textContent = join([data.firstName, data.lastName], ' '),
    [MemberDataRow.Selector.BIRTH_DATE]: (elem, data) => elem.textContent = data.birthDate
};
