package com.jakemarsden.aikidotrack.controller.model

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import org.apache.commons.lang3.Validate

import static java.util.Collections.unmodifiableList

@EqualsAndHashCode
@ToString(includePackage = false, includeNames = true)
final class PostSessionsRequest implements AikRequest {

    final RequestType requestType
    final List<SessionModel> sessions

    @JsonCreator
    static PostSessionsRequest of(
            @JsonProperty('requestType') RequestType requestType,
            @JsonProperty('sessions') List<SessionModel> sessions) {

        switch (requestType) {
            case RequestType.Create:
            case RequestType.Update:
                break
            default:
                throw new IllegalArgumentException("Unsupported request type: $requestType")
        }
        Validate.noNullElements sessions
        new PostSessionsRequest(requestType, sessions)
    }

    private PostSessionsRequest(RequestType requestType, List<SessionModel> sessions) {
        this.requestType = requestType
        this.sessions = unmodifiableList sessions
    }
}
