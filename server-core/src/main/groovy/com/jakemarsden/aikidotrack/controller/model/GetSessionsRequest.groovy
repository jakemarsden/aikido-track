package com.jakemarsden.aikidotrack.controller.model

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonIgnore
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import java.time.LocalDate

@EqualsAndHashCode
@ToString(includePackage = false, includeNames = true)
final class GetSessionsRequest implements AikRequest {

    /**
     * {@literal null} if the results shouldn't be filtered by date
     */
    final LocalDate date

    @JsonCreator
    static GetSessionsRequest of() {
        new GetSessionsRequest(null)
    }

    static GetSessionsRequest filteredByDate(LocalDate date) {
        new GetSessionsRequest(date)
    }

    private GetSessionsRequest(LocalDate date) {
        this.date = date
    }

    @JsonIgnore
    @Override
    RequestType getRequestType() {
        RequestType.Get
    }
}
