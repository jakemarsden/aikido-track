import {DataRow} from "../../ui-component/data-table/data-row.js";
import {firstCharToUpper} from "../../util/string-utils.js";

/**
 * @extends DataRow<Session>
 * @package
 */
export class SessionDataRow extends DataRow {

    /**
     * @return {!DataRow~Ctor<Session>}
     */
    static get ctor() {
        return (root, data) => new SessionDataRow(root, data);
    }

    /**
     * @protected
     */
    initDom() {
        super.initDom();
        this.render(SessionDataRow.RENDERERS);
    }
}

const SELECTOR_BASE = 'aik-session-data-table';

/**
 * @enum {string}
 * @private
 */
SessionDataRow.Selector = {
    ID: `.${SELECTOR_BASE}__id`,
    TYPE: `.${SELECTOR_BASE}__type`,
    DATE: `.${SELECTOR_BASE}__date`,
    TIME: `.${SELECTOR_BASE}__time`,
    DURATION: `.${SELECTOR_BASE}__duration`,
    ATTENDANCE_PRESENT_COUNT: `.${SELECTOR_BASE}__attendance-present-count`
};

/**
 * @constant {Object<string, DataRow~Renderer<Session>>}
 * @private
 */
SessionDataRow.RENDERERS = {
    [SessionDataRow.Selector.ID]: (elem, data) => elem.textContent = data.id,
    [SessionDataRow.Selector.TYPE]: (elem, data) => elem.textContent = firstCharToUpper(data.type),
    [SessionDataRow.Selector.DATE]: (elem, data) => elem.textContent = data.dateTime.toISODate(),
    [SessionDataRow.Selector.TIME]: (elem, data) =>
            elem.textContent = data.dateTime.toISOTime({ includeOffset: false, suppressSeconds: true }),
    [SessionDataRow.Selector.DURATION]: (elem, data) => elem.textContent = data.duration.as('minutes'),
    [SessionDataRow.Selector.ATTENDANCE_PRESENT_COUNT]: (elem, data) => elem.textContent = data.presentMemberCount
};
