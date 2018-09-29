package com.jakemarsden.aikidotrack.controller.model

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import java.time.Duration
import java.time.LocalDate
import java.time.LocalTime
import org.apache.commons.lang3.Validate

@EqualsAndHashCode
@ToString(includePackage = false, includeNames = true)
final class SessionModel {

    final String id
    final String type
    final LocalDate date
    final LocalTime time
    final Duration duration

    @JsonCreator
    static SessionModel of(
            @JsonProperty('id') String id, @JsonProperty('type') String type, @JsonProperty('date') LocalDate date,
            @JsonProperty('time') LocalTime time, @JsonProperty('duration') Duration duration) {

        Validate.notBlank type
        Validate.notNull date
        Validate.notNull time
        Validate.notNull duration
        new SessionModel(id, type, date, time, duration)
    }

    private SessionModel(String id, String type, LocalDate date, LocalTime time, Duration duration) {
        this.id = id
        this.type = type
        this.date = date
        this.time = time
        this.duration = duration
    }
}
