require(["templates", "jquery"], (Templates, $) => {
    "use strict";

    Templates.preload(["member-list-item"]);
    $(onLoad);

    function onLoad() {
        const memberList = $("ul.members");
        withMembers(members => {
            Templates.withTemplate("member-list-item", tmpl => {
                members.forEach(member => {
                    memberList.append(tmpl(member));
                });
            });
        });
    }

    function withMembers(callback) {
        const opts = {
            url: "/api/member/all",
            method: "GET",
            dataType: "json",
            contentType: "application/json;charset=UTF-8"
        };
        $.ajax(opts)
                .done((data, textStatus, jqXhr) => callback(data))
                .fail((jqXhr, textStatus, errorThrown) => { throw errorThrown; });
    }
});
