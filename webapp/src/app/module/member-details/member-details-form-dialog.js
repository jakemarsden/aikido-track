import {AikDataFormDialog} from '../../ui-component/data-form-dialog/aik-data-form-dialog.js';

/**
 * @package
 */
export class MemberDetailsFormDialog extends AikDataFormDialog {

    /**
     * @param {Member} member
     * @param {Event} event
     */
    openWith(member, event) {
        this.lastFocusedTarget = event.target;
        this.populateMember(member);
        this.show();
    }

    /**
     * @param {Member} member
     */
    populateMember(member) {
        const fields = this.form.fields;
        fields.get('id').value = member.id || null;
        fields.get('first-name').value = member.firstName || null;
        fields.get('last-name').value = member.lastName || null;
        fields.get('type').value = member.type || null;
        fields.get('birth-date').value = member.birthDate || null;
    }

    /**
     * @return {Member}
     */
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
