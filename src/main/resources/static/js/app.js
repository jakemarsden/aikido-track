require(["dialog", "templates", "jquery"], (Dialog, Templates, $) => {
    "use strict";

    var selectedMember = undefined;

    Templates.preload(["member-list-item"]);
    $(onLoad);

    function onLoad() {
        $("button.toggle").click(function () {
            $(this).toggleClass("selected");
        });

        const elemMemberList = $("ul.members");
        const dlgMemberDetails = Dialog.createWithForm("#dlg-member-details", {
            startEditable: false,
            onFormPopulate: (dlg, form) => populateMemberDetailsForm(selectedMember, form),
            onFormSubmit: (dlg, form) => onMemberDetailsFormSubmission(form)
        });

        // Who doesn't *love* nested callbacks?...
        withMembers(members => {
            Templates.withTemplate("member-list-item", tmpl => {
                members.forEach(member => {
                    const elemMemberItem = $(tmpl(member));
                    elemMemberItem.click(() => {
                        selectedMember = member;
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
