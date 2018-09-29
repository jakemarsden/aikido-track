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
final class GetSessionsResponse implements AikResponse {

    final List<SessionModel> sessions

    @JsonCreator
    static GetSessionsResponse of(@JsonProperty('sessions') List<SessionModel> sessions) {
        Validate.noNullElements sessions
        new GetSessionsResponse(sessions)
    }

    private GetSessionsResponse(List<SessionModel> sessions) {
        this.sessions = unmodifiableList sessions
    }

    @JsonIgnore
    RequestType getRequestType() {
        RequestType.Get
    }
}
