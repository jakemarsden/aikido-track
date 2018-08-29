require(["dialog", "jquery", "datatables.net-dt"], (Dialog, $) => {
    "use strict";

    var selectedMember = undefined;

    $(onLoad);

    function onLoad() {
        $("button.toggle").click(function () {
            $(this).toggleClass("selected");
        });

        const elemMemberTable = $("table.members");
        const dlgMemberDetails = Dialog.createWithForm("#dlg-member-details", {
            startEditable: false,
            onFormPopulate: (dlg, form) => populateMemberDetailsForm(selectedMember, dlg, form),
            onFormSubmit: (dlg, form) => onMemberDetailsFormSubmission(form)
        });
        const btnCreateMember = $("table.members thead button.add")
                .click(() => onMemberEditButtonClick({ id: null }));

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
                        if (type === undefined || type != "display") {
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
                            (type == "display") ? firstCharToUpperCase(data) : data
                }
            ],
            order: [[2, "asc"]]
        });
        memberTable.on("click", "button.edit", function () {
            const elem = $(this);
            const row = memberTable.api().row(elem.closest("tr"));
            const member = row.data();
            onMemberEditButtonClick(member);
        });

        function onMemberEditButtonClick(member) {
            selectedMember = member;
            dlgMemberDetails.open();
        }
    }

    function populateMemberDetailsForm(member, dlg, form) {
        if (member.id == null) {
            // Member doesn't exist yet (ie. we're creating a new member)
            dlg.iconElem.find("> *")
                    .removeClass("fa-user-edit")
                    .addClass("fa-user-plus");
            dlg.setFormEditMode(true);
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

    function onMemberDetailsFormSubmission(form) {
        const member = {
            id: form.find("input[name=id]").val(),
            firstName: form.find("input[name=firstName]").val(),
            lastName: form.find("input[name=lastName]").val(),
            type: form.find("select[name=type] option:checked").val(),
            birthDate: form.find("input[name=birthDate]").val()
        };
        console.debug("onMemberDetailsFormSubmission: member=" + JSON.stringify(member));
    }

    function firstCharToUpperCase(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});
