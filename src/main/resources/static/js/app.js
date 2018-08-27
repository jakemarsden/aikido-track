require(["dialog", "templates", "jquery"], (Dialog, Templates, $) => {
    "use strict";

    Templates.preload(["member-list-item"]);
    $(onLoad);

    function onLoad() {
        const elemMemberList = $("ul.members");
        const dlgMemberDetails = Dialog.create("#dlg-member-details", {
            onConfirm: dlg => onMemberDetailsFormSubmission(dlg.elem.find("form")),
            onClose: dlg => dlg.elem.find("form").trigger("reset")
        });

        // Who doesn't *love* nested callbacks?...
        withMembers(members => {
            Templates.withTemplate("member-list-item", tmpl => {
                members.forEach(member => {
                    const elemMemberItem = $(tmpl(member));
                    elemMemberItem.click(() => {
                        populateMemberDetailsForm(member, dlgMemberDetails.elem.find("form"));
                        dlgMemberDetails.open();
                    });
                    elemMemberList.append(elemMemberItem);
                });
            });
        });
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

    function withMembers(callback) {
        const opts = {
            url: "/api/member/all",
            method: "GET",
            contentType: "application/json;charset=UTF-8",
            dataType: "json"
        };
        $.ajax(opts)
                .done((data, textStatus, jqXhr) => callback(data))
                .fail((jqXhr, textStatus, errorThrown) => { throw errorThrown; });
    }
});
