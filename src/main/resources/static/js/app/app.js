require(["app/dialog", "app/member", "jquery", "datatables.net-dt"], (Dialog, Member, $) => {
    "use strict";

    /** @type {Member} */
    let selectedMember;

    $(onLoad);

    function onLoad() {
        $("button.toggle").click(function () {
            $(this).toggleClass("selected");
        });

        const btnCreateMember = $("table.members thead button.add");
        const elemMemberTable = $("table.members");

        const dlgMemberDetails = new Dialog.FormDialog("#dlg-member-details", false);
        dlgMemberDetails.onFormPopulate = function (form) { populateMemberDetailsForm(selectedMember, this, form); };
        dlgMemberDetails.onFormSubmit = function (form) { onMemberDetailsFormSubmission(form); };
        dlgMemberDetails.init();

        const memberTable = elemMemberTable.dataTable({
            dom: "t",
            ajax: {
                url: "/api/member/all",
                method: "GET",
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                dataSrc: ""
            },
            columns: [
                {
                    className: "control",
                    orderable: false,
                    data: (row, type, set, meta) => null,
                    render: (data, type, row, meta) => {
                        if (type === undefined || type !== "display") {
                            return data;
                        }
                        const editBtn = $("<button/>")
                                .addClass("edit")
                                .append($("<span/>")
                                        .addClass("fas")
                                        .addClass("fa-user-edit"));
                        return editBtn.prop("outerHTML");
                    }
                },
                { data: "firstName" },
                { data: "lastName" },
                {
                    data: "type",
                    render: (data, type, row, meta) =>
                            (type === "display") ? firstCharToUpperCase(data) : data
                }
            ],
            order: [[2, "asc"]]
        });

        btnCreateMember.click(() => onMemberEditButtonClick(new Member()));
        memberTable.on("click", "button.edit", function () {
            const rowElem = $(this).closest("tr");
            const row = memberTable.api().row(rowElem);
            onMemberEditButtonClick(row.data());
        });

        /** @param {!Member} member */
        function onMemberEditButtonClick(member) {
            selectedMember = member;
            dlgMemberDetails.open();
        }
    }

    /**
     * @param {!Member} member
     * @param {!Dialog.FormDialog} dlg
     * @param {!jQuery} form
     */
    function populateMemberDetailsForm(member, dlg, form) {
        if (member.id == null) {
            // Member doesn't exist yet (ie. we're creating a new member)
            dlg.iconElem.find("> *")
                    .removeClass("fa-user-edit")
                    .addClass("fa-user-plus");
            dlg.formEditMode = true;
        } else {
            // Member already exists (ie. we're editing an existing member)
            dlg.iconElem.find("> *")
                    .removeClass("fa-user-plus")
                    .addClass("fa-user-edit");
        }
        form.find("input[name=id]").val(member.id);
        form.find("input[name=firstName]").val(member.firstName);
        form.find("input[name=lastName]").val(member.lastName);
        form.find("select[name=type] option[value=" + member.type + "]").prop("selected", true);
        form.find("input[name=birthDate]").val(member.birthDate);
    }

    /** @param {!jQuery} form */
    function onMemberDetailsFormSubmission(form) {
        const member = new Member();
        member.id = form.find("input[name=id]").val();
        member.firstName = form.find("input[name=firstName]").val();
        member.lastName = form.find("input[name=lastName]").val();
        member.type = form.find("select[name=type] option:checked").val();
        member.birthDate = form.find("input[name=birthDate]").val();

        window.console.debug("onMemberDetailsFormSubmission: member=" + JSON.stringify(member));
    }

    /**
     * @param {!string} str
     * @return {!string}
     */
    function firstCharToUpperCase(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});
