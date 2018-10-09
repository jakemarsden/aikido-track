import {RequestType} from '../../endpoint/endpoint.js';
import {
    ENDPOINT_GET_MEMBERS,
    ENDPOINT_POST_MEMBERS,
    GetMembersRequest,
    PostMembersRequest
} from '../../endpoint/member-endpoint.js';
import {Button} from '../../ui-component/button/index.js';
import {MemberDataRow} from "../../ui-component/data-table/member-data-row.js";
import {DataForm} from "../../ui-component/data-form/index.js";
import {DataFormDialog} from "../../ui-component/data-form-dialog/index.js";
import {DataTable} from "../../ui-component/data-table/index.js";
import {Dialog} from '../../ui-component/dialog/index.js';
import {LayoutPage} from '../layout.js';
import './main.scss';
import {MemberDetailsFormDialog} from './member-details-form-dialog.js';

/**
 * @private
 */
class MemberDetailsPage extends LayoutPage {

    /**
     * @param {...?} args
     * @protected
     */
    init(...args) {
        super.init(...args);

        this.addMemberBtnHandler_ = event => this.handleAddMemberBtn_(event);
        this.memberDialogAcceptHandler_ = event => this.handleMemberDialogAccept_(event);
        this.memberTableRowClickHandler_ = event => this.handleMemberTableRowClick_(event);
    }

    /**
     * @protected
     */
    initDom() {
        super.initDom();

        const root = this.root_;

        this.memberTable_ = new DataTable(
                root.querySelector(MemberDetailsPage.Selector.MEMBER_TABLE),
                DataTable.templatedRowFactory(MemberDataRow.ctor, MemberDetailsPage.Selector.MEMBER_TABLE_ROW_TMPL));
        this.addMemberBtn_ = new Button(root.querySelector(MemberDetailsPage.Selector.ADD_MEMBER_BTN));
        this.memberDialog_ = new MemberDetailsFormDialog(
                new Dialog(root.querySelector(MemberDetailsPage.Selector.MEMBER_DIALOG)),
                new DataForm(root.querySelector(MemberDetailsPage.Selector.MEMBER_DIALOG_FORM)));

        this.memberTable_.listen(DataTable.Event.ROW_CLICK, this.memberTableRowClickHandler_);
        this.addMemberBtn_.listen(Button.Event.CLICK, this.addMemberBtnHandler_);
        this.memberDialog_.listen(DataFormDialog.Event.ACCEPT, this.memberDialogAcceptHandler_);

        this.repopulateMemberDetailsTable();
    }

    /**
     * @protected
     */
    destroy() {
        this.memberTable_.unlisten(DataTable.Event.ROW_CLICK, this.memberTableRowClickHandler_);
        this.addMemberBtn_.unlisten(Button.Event.CLICK, this.addMemberBtnHandler_);
        this.memberDialog_.unlisten(DataFormDialog.Event.ACCEPT, this.memberDialogAcceptHandler_);

        this.memberTable_.destroy();
        this.addMemberBtn_.destroy();
        this.memberDialog_.destroy();

        super.destroy();
    }

    repopulateMemberDetailsTable() {
        const req = new GetMembersRequest();
        ENDPOINT_GET_MEMBERS.execute(req)
                .then(resp => {
                    this.memberTable_.clearRows();
                    resp.members.forEach(member => this.memberTable_.appendRow(member));
                    this.memberTable_.sort();
                });
    }

    /**
     * @param {Event} event
     * @private
     */
    handleAddMemberBtn_(event) {
        const member = {
            id: null,
            type: null,
            firstName: null,
            lastName: null,
            birthDate: null
        };
        this.memberDialog_.show(member);
    }

    /**
     * @param {Event} event
     * @private
     */
    handleMemberDialogAccept_(event) {
        const member = this.memberDialog_.parseMember();
        const reqType = member.id == null ? RequestType.CREATE : RequestType.UPDATE;

        const req = new PostMembersRequest(reqType, [member]);
        ENDPOINT_POST_MEMBERS.execute(req)
                // Fuck it, just repopulate the entire table...
                .then(resp => this.repopulateMemberDetailsTable());
    }

    /**
     * @param {Event} event
     * @private
     */
    handleMemberTableRowClick_(event) {
        const member = event.detail.row.data;
        this.memberDialog_.show(member);
    }
}

const SELECTOR_BASE = 'aik-member-details';

/**
 * @enum {string}
 * @private
 */
MemberDetailsPage.Selector = {
    MEMBER_TABLE: `#${SELECTOR_BASE}-table`,
    MEMBER_TABLE_ROW_TMPL: '#aik-tmpl-member-details-table__row',
    ADD_MEMBER_BTN: `#${SELECTOR_BASE}-add-member`,
    MEMBER_DIALOG: `#${SELECTOR_BASE}-dialog`,
    MEMBER_DIALOG_FORM: `#${SELECTOR_BASE}-form`
};

new MemberDetailsPage(window);
