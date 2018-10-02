package com.jakemarsden.aikidotrack.controller.model

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty
import com.jakemarsden.aikidotrack.model.MemberModel
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import org.apache.commons.lang3.Validate

import static java.util.Collections.unmodifiableList

@EqualsAndHashCode
@ToString(includePackage = false, includeNames = true)
final class PostMembersResponse implements AikResponse {

    final RequestType requestType
    final List<MemberModel> members

    @JsonCreator
    static PostMembersResponse of(
            @JsonProperty('requestType') RequestType requestType, @JsonProperty('members') List<MemberModel> members) {

        switch (requestType) {
            case RequestType.Create:
            case RequestType.Update:
                break
            default:
                throw new IllegalArgumentException("Unsupported request type: $requestType")
        }
        Validate.noNullElements members
        new PostMembersResponse(requestType, members)
    }

    private PostMembersResponse(RequestType requestType, List<MemberModel> members) {
        this.requestType = requestType
        this.members = unmodifiableList members
    }
}
