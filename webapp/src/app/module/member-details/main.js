import {RequestType} from '../../endpoint/endpoint.js'
import {
    ENDPOINT_GET_MEMBERS,
    ENDPOINT_POST_MEMBERS,
    GetMembersRequest,
    PostMembersRequest
} from '../../endpoint/member-endpoint.js'
import {AikDataFormDialog} from "../../ui-component/data-form-dialog/aik-data-form-dialog.js";
import {DataTable} from "../../ui-component/data-table/data-table.js";
import {MemberDataRow} from "../../ui-component/member-data-table/member-data-row.js";
import '../layout.js';
import './main.scss';

window.addEventListener('load', () => {
    /** @type {HTMLButtonElement} */
    const btnAddMember = document.querySelector('#aik-member-details-add-member');
    const dlgMemberDetails = new MemberDetailsFormDialog(document.querySelector('#aik-member-details-dialog'));
    const tblMemberDetails = new DataTable(
            document.querySelector('#aik-member-details-table'),
            DataTable.templatedRowFactory(MemberDataRow.ctor, '#aik-tmpl-member-details-table__row'));

    btnAddMember.addEventListener('click', event => {
        const member = {
            id: null,
            type: null,
            firstName: null,
            lastName: null,
            birthDate: null
        };
        dlgMemberDetails.openWith(member, event);
    });
    dlgMemberDetails.listen('MDCDialog:accept', event => {
        const member = dlgMemberDetails.parseMember();
        const reqType = member.id == null ? RequestType.CREATE : RequestType.UPDATE;

        const req = new PostMembersRequest(reqType, [member]);
        ENDPOINT_POST_MEMBERS.execute(req)
                // Fuck it, just repopulate the entire table...
                .then(resp => repopulateMemberDetailsTable());
    });
    tblMemberDetails.listen(DataTable.Event.ROW_CLICK, event => {
        const member = event.detail.row.data;
        dlgMemberDetails.openWith(member, event);
    });

    repopulateMemberDetailsTable();

    function repopulateMemberDetailsTable() {
        const req = new GetMembersRequest();
        ENDPOINT_GET_MEMBERS.execute(req)
                .then(resp => {
                    tblMemberDetails.clearRows();
                    resp.members.forEach(member => tblMemberDetails.appendRow(member));
                    tblMemberDetails.sort();
                });
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
