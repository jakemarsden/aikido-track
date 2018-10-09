import {DataFormDialog} from '../../ui-component/data-form-dialog/index.js';

/**
 * @package
 */
export class MemberDetailsFormDialog extends DataFormDialog {

    /**
     * @param {Member} member
     */
    show(member) {
        this.populateMember(member);
        super.show();
    }

    /**
     * @param {Member} member
     * @private
     */
    populateMember(member) {
        const fields = this.fields;
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
        const fields = this.fields;
        return {
            id: fields.get('id').value || null,
            firstName: fields.get('first-name').value || null,
            lastName: fields.get('last-name').value || null,
            type: fields.get('type').value || null,
            birthDate: fields.get('birth-date').value || null
        };
    }
}
