package com.jakemarsden.aikidotrack.controller.model

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonProperty
import com.jakemarsden.aikidotrack.model.SessionAttendanceModel
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import org.apache.commons.lang3.Validate

import static java.util.Collections.unmodifiableList

@EqualsAndHashCode
@ToString(includePackage = false, includeNames = true)
final class PostSessionAttendancesRequest implements AikRequest {

    final String sessionId
    final List<SessionAttendanceModel> attendances

    @JsonCreator
    static PostSessionAttendancesRequest of(
            @JsonProperty('sessionId') String sessionId,
            @JsonProperty('attendances') List<SessionAttendanceModel> attendances) {

        Validate.notBlank sessionId
        Validate.noNullElements attendances
        new PostSessionAttendancesRequest(sessionId, attendances)
    }

    private PostSessionAttendancesRequest(String sessionId, List<SessionAttendanceModel> attendances) {
        this.sessionId = sessionId
        this.attendances = unmodifiableList attendances
    }

    @JsonIgnore
    @Override
    RequestType getRequestType() {
        RequestType.Update
    }
}
