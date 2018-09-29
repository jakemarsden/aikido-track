package com.jakemarsden.aikidotrack.controller.model

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonProperty
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import org.apache.commons.lang3.Validate

import static java.util.Collections.unmodifiableList

@EqualsAndHashCode
@ToString(includePackage = false, includeNames = true)
final class GetMembersResponse implements AikResponse {

    final List<MemberModel> members

    @JsonCreator
    static GetMembersResponse of(@JsonProperty('members') List<MemberModel> members) {
        Validate.noNullElements members
        new GetMembersResponse(members)
    }

    private GetMembersResponse(List<MemberModel> members) {
        this.members = unmodifiableList members
    }

    @JsonIgnore
    RequestType getRequestType() {
        RequestType.Get
    }
}
