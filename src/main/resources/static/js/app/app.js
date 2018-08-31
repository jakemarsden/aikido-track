require(["app/dialog", "app/member", "jquery", "datatables.net-dt"], (Dialog, Member, $) => {
    "use strict";

    /** @type {Member} */
    let selectedMember;
    let memberTable;

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

        memberTable = elemMemberTable.dataTable({
            dom: "tr",
            ajax: {
                url: "/api/member",
                method: "GET",
                cache: false,
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
            order: [[2, "asc"]],
            processing: true
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
        member.id = cleanInputValue(form, "input[name=id]");
        member.firstName = cleanInputValue(form, "input[name=firstName]");
        member.lastName = cleanInputValue(form, "input[name=lastName]");
        member.type = cleanInputValue(form, "select[name=type] > option:checked");
        member.birthDate = cleanInputValue(form, "input[name=birthDate]");

        const update = member.id !== null;
        window.console.debug(
                "onMemberDetailsFormSubmission: update=" + update + ", member=" + member.toString());

        const opts = {
            url: update ? ("/api/member/" + member.id) : "/api/member",
            method: "POST",
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            data: member.toJson()
        };
        $.ajax(opts)
                .then(response => {
                    const memberResp = new Member();
                    Object.assign(memberResp, response);

                    window.console.debug(
                            "onMemberDetailsFormSubmission: update=" + update + ", response=" + memberResp.toString());

                    const tableApi = memberTable.api();
                    if (update) {
                        // TODO: What a fucking mess... find a better way to get hold of the row which was edited
                        let existingRow;
                        tableApi.rows().every(rowIdx => {
                            if (existingRow === undefined && tableApi.row(rowIdx).data().id === memberResp.id) {
                                existingRow = tableApi.row(rowIdx);
                            }
                        });
                        if (existingRow === undefined) {
                            throw new Error("Unable to find table row for member: " + memberResp.toString());
                        }
                        existingRow.data(memberResp);

                    } else {
                        tableApi.row.add(memberResp);
                    }
                    tableApi.draw();
                })
                .catch(reason => {
                    const msg = "Unable to " + (update ? "update" : "add") + member.toString() + ": " + reason;
                    throw new Error(msg);
                });
    }

    /**
     * @param {jQuery} $form
     * @param {string} selector
     * @return {(string|null)}
     */
    function cleanInputValue($form, selector) {
        const value = $form.find(selector).val();
        return stripToNull(value);
    }

    /**
     * @param {?string} str
     * @return {(string|null)} str
     */
    function stripToNull(str) {
        if (str == null) {
            return null;
        }
        str = str.trim();
        return str.length === 0 ? null : str;
    }

    /**
     * @param {!string} str
     * @return {!string}
     */
    function firstCharToUpperCase(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});
