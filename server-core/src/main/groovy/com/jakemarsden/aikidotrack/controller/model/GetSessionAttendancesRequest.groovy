package com.jakemarsden.aikidotrack.controller.model

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonIgnore
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import org.apache.commons.lang3.Validate

@EqualsAndHashCode
@ToString(includePackage = false, includeNames = true)
final class GetSessionAttendancesRequest implements AikRequest {

    final String sessionId

    @JsonCreator
    static GetSessionAttendancesRequest of(String sessionId) {
        Validate.notBlank sessionId
        new GetSessionAttendancesRequest(sessionId)
    }

    private GetSessionAttendancesRequest(String sessionId) {
        this.sessionId = sessionId
    }

    @JsonIgnore
    @Override
    RequestType getRequestType() {
        RequestType.Get
    }
}
