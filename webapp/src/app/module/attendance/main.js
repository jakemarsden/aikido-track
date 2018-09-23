import {MDCList} from "@material/list";
import {DateTime} from 'luxon';
import {ENDPOINT_GET_MEMBERS} from "../../endpoint/member-endpoint.js";
import {AikDataForm} from "../../ui-component/data-form/aik-data-form.js";
import {firstCharToUpper, join} from "../../util/string-utils.js";
import '../layout.js';
import './main.scss';

window.addEventListener('load', () => {
    const now = DateTime.local();
    let nextRegisterItemId = 0;

    const frmDate = new AikDataForm(document.querySelector('#aik-attendance-date-form'));
    const lstRegisterElem = document.querySelector('#aik-attendance-register-list');
    const lstRegister = new MDCList(lstRegisterElem);
    /** @type HTMLTemplateElement */
    const tmplRegisterItem = document.querySelector('#aik-tmpl-attendance-register-list-item');

    // Initialise date input to today's date
    frmDate.fields.get('date').value = now.toISODate();
    repopulateAttendanceRegister();

    function repopulateAttendanceRegister() {
        while (lstRegisterElem.hasChildNodes()) {
            lstRegisterElem.removeChild(lstRegisterElem.lastChild);
        }
        ENDPOINT_GET_MEMBERS.execute()
                .then(members =>
                        members.sort(memberComparator)
                                .map(member => renderAttendanceItem(member))
                                .forEach(memberElem => lstRegisterElem.appendChild(memberElem)))
    }

    function renderAttendanceItem(member) {
        // Clone the template
        const frag = document.importNode(tmplRegisterItem.content, true);

        // Add <input/> and <label/> associations
        const baseId = 'aik-attendance-register-list-item';
        const uniqId = `${baseId}-${nextRegisterItemId++}`;
        frag.querySelector(`.${baseId}`).id = uniqId;
        frag.querySelector(`#${baseId}__sessions__input`).id = `${uniqId}__sessions__input`;
        frag.querySelector(`#${baseId}__hours__input`).id = `${uniqId}__hours__input`;
        frag.querySelector(`label[for=${baseId}__sessions__input]`).htmlFor = `${uniqId}__sessions__input`;
        frag.querySelector(`label[for=${baseId}__hours__input]`).htmlFor = `${uniqId}__hours__input`;

        // Populate content
        frag.querySelector(`.${baseId}__full-name`).textContent = join([member.firstName, member.lastName], ' ');
        frag.querySelector(`.${baseId}__type`).textContent = firstCharToUpper(member.type);
        new AikDataForm(frag.querySelector(`.${baseId}__form`));

        return frag;
    }

    /**
     * @param {Member} a
     * @param {Member} b
     * @return {number}
     */
    function memberComparator(a, b) {
        let result;
        if ((result = (a.lastName || '').localeCompare(b.lastName || '')) !== 0) {
            return result;
        }
        if ((result = (a.firstName || '').localeCompare(b.firstName || '')) !== 0) {
            return result;
        }
        if ((result = (a.type || '').localeCompare(b.type || '')) !== 0) {
            return result;
        }
        return 0;
    }
});
