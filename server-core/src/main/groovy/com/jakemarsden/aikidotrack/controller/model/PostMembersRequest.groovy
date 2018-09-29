package com.jakemarsden.aikidotrack.controller.model

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import org.apache.commons.lang3.Validate

import static java.util.Collections.unmodifiableList

@EqualsAndHashCode
@ToString(includePackage = false, includeNames = true)
final class PostMembersRequest implements AikRequest {

    final RequestType requestType
    final List<MemberModel> members

    @JsonCreator
    static PostMembersRequest of(
            @JsonProperty('requestType') RequestType requestType, @JsonProperty('members') List<MemberModel> members) {

        switch (requestType) {
            case RequestType.Create:
            case RequestType.Update:
                break
            default:
                throw new IllegalArgumentException("Unsupported request type: $requestType")
        }
        Validate.noNullElements members
        new PostMembersRequest(requestType, members)
    }

    private PostMembersRequest(RequestType requestType, List<MemberModel> members) {
        this.requestType = requestType
        this.members = unmodifiableList members
    }
}
