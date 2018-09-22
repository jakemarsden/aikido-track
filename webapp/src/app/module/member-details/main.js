import 'material-design-lite/material.js';
import {ENDPOINT_CREATE_OR_UPDATE_MEMBER, ENDPOINT_GET_MEMBERS} from '../../endpoint/member-endpoint.js'
import {AikDataFormDialog} from "../../ui-component/data-form-dialog/aik-data-form-dialog.js";
import {AikDataTable} from "../../ui-component/data-table/aik-data-table.js";
import {firstCharToUpper} from "../../util/string-utils.js";
import '../layout.js';
import './main.scss';

window.addEventListener('load', () => {
    /** @type {HTMLButtonElement} */
    const btnAddMember = document.querySelector('#aik-member-details-add-member');
    /** @type {MemberDetailsFormDialog} */
    const dlgMemberDetails = new MemberDetailsFormDialog(document.querySelector('#aik-member-details-dialog'));
    /** @type {MemberDetailsTable} */
    const tblMemberDetails = new MemberDetailsTable(document.querySelector('#aik-member-details-table'));

    btnAddMember.addEventListener('click', event => {
        const member = { id: null };
        dlgMemberDetails.openWith(member, event);
    });
    dlgMemberDetails.listen('MDCDialog:accept', event => {
        const member = dlgMemberDetails.parseMember();
        tblMemberDetails.clearRows();

        ENDPOINT_CREATE_OR_UPDATE_MEMBER.execute(member)
                // Fuck it, just repopulate the entire table...
                .then(member => repopulateMemberDetailsTable());
    });
    tblMemberDetails.listen('AikDataTable:rowClick', event => {
        const member = tblMemberDetails.getMemberFromRow(event.detail.targetRow);
        dlgMemberDetails.openWith(member, event);
    });

    repopulateMemberDetailsTable(tblMemberDetails);

    function repopulateMemberDetailsTable() {
        tblMemberDetails.clearRows();
        ENDPOINT_GET_MEMBERS.execute()
                .then(members => tblMemberDetails.appendMemberRows(members));
    }
});

class MemberDetailsFormDialog extends AikDataFormDialog {
    /**
     * @param {Member} member
     * @param {Event} event
     */
    openWith(member, event) {
        this.lastFocusedTarget = event.target;
        this.populateMember(member);
        this.show();
    }

    /** @param {Member} member */
    populateMember(member) {
        const fields = this.form.fields;
        fields.get('id').value = member.id || null;
        fields.get('first-name').value = member.firstName || null;
        fields.get('last-name').value = member.lastName || null;
        fields.get('type').value = member.type || null;
        fields.get('birth-date').value = member.birthDate || null;
    }

    /** @return {Member} */
    parseMember() {
        const fields = this.form.fields;
        return {
            id: fields.get('id').value || null,
            firstName: fields.get('first-name').value || null,
            lastName: fields.get('last-name').value || null,
            type: fields.get('type').value || null,
            birthDate: fields.get('birth-date').value || null
        };
    }
}

class MemberDetailsTable extends AikDataTable {
    /**
     * @param {(HTMLTableRowElement|number)} row
     * @return {Member}
     */
    getMemberFromRow(row) {
        if (typeof row === 'number') {
            row = this.root_.rows.item(row);
        }
        return row.member_;
    }

    /** @param {Array<Member>} members */
    appendMemberRows(members) {
        members.forEach(member => {
            const row = this.tbody_.insertRow(-1);
            this.renderMemberRow_(member, row);
        });
        this.sort();
    }

    /**
     * @param {Member} member
     * @param {HTMLTableRowElement} row
     * @private
     */
    renderMemberRow_(member, row) {
        row.member_ = member;
        [member.firstName, member.lastName, firstCharToUpper(member.type)]
                .forEach(data => {
                    const cell = row.insertCell();
                    cell.classList.add('mdl-data-table__cell--non-numeric');
                    cell.textContent = data;
                });
    }
}
