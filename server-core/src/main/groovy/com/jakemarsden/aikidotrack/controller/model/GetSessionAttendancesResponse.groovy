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
final class GetSessionAttendancesResponse implements AikResponse {

    final List<SessionAttendanceModel> attendances

    @JsonCreator
    static GetSessionAttendancesResponse of(@JsonProperty('attendances') List<SessionAttendanceModel> attendances) {
        Validate.noNullElements attendances
        new GetSessionAttendancesResponse(attendances)
    }

    private GetSessionAttendancesResponse(List<SessionAttendanceModel> attendances) {
        this.attendances = unmodifiableList attendances
    }

    @JsonIgnore
    RequestType getRequestType() {
        RequestType.Get
    }
}
