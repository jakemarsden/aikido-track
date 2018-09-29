package com.jakemarsden.aikidotrack.controller.model

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@EqualsAndHashCode
@ToString(includePackage = false, includeNames = true)
final class PostSessionAttendancesResponse implements AikRequest {

    final RequestType requestType

    @JsonCreator
    static PostSessionAttendancesResponse of(@JsonProperty('requestType') RequestType requestType) {

        switch (requestType) {
            case RequestType.Create:
            case RequestType.Update:
                break
            default:
                throw new IllegalArgumentException("Unsupported request type: $requestType")
        }
        new PostSessionAttendancesResponse(requestType)
    }

    private PostSessionAttendancesResponse(RequestType requestType) {
        this.requestType = requestType
    }
}
