require(["dialog", "jquery", "datatables.net-dt"], (Dialog, $) => {
    "use strict";

    var selectedMember = undefined;

    $(onLoad);

    function onLoad() {
        $("button.toggle").click(function () {
            $(this).toggleClass("selected");
        });

        const elemMemberTable = $(".members");
        const dlgMemberDetails = Dialog.createWithForm("#dlg-member-details", {
            startEditable: false,
            onFormPopulate: (dlg, form) => populateMemberDetailsForm(selectedMember, form),
            onFormSubmit: (dlg, form) => onMemberDetailsFormSubmission(form)
        });

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
                { data: "type" }
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

    function populateMemberDetailsForm(member, form) {
        form.find("input[name=id]").val(member.id);
        form.find("input[name=firstName]").val(member.firstName);
        form.find("input[name=lastName]").val(member.lastName);
        form.find("input[name=birthDate]").val(member.birthDate);
    }

    function onMemberDetailsFormSubmission(form) {
        const member = {
            id: form.find("input[name=id]").val(),
            firstName: form.find("input[name=firstName]").val(),
            lastName: form.find("input[name=lastName]").val(),
            type: "Junior",
            birthDate: form.find("input[name=birthDate]").val()
        };
        console.debug("onMemberDetailsFormSubmission: member=" + JSON.stringify(member));
    }
});
