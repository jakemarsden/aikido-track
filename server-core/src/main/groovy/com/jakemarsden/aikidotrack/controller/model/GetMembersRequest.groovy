package com.jakemarsden.aikidotrack.controller.model

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonIgnore
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@EqualsAndHashCode
@ToString(includePackage = false, includeNames = true)
final class GetMembersRequest implements AikRequest {

    @JsonCreator
    static GetMembersRequest of() {
        new GetMembersRequest()
    }

    private GetMembersRequest() {
    }

    @JsonIgnore
    @Override
    RequestType getRequestType() {
        RequestType.Get
    }
}
