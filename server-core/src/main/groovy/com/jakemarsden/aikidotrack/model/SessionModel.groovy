package com.jakemarsden.aikidotrack.model

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
    final Long presentMemberCount
    final Long absentMemberCount

    @JsonCreator
    static SessionModel of(
            @JsonProperty('id') String id, @JsonProperty('type') String type, @JsonProperty('date') LocalDate date,
            @JsonProperty('time') LocalTime time, @JsonProperty('duration') Duration duration,
            @JsonProperty('presentMemberCount') Long presentMemberCount,
            @JsonProperty('absentMemberCount') Long absentMemberCount) {

        Validate.notBlank type
        Validate.notNull date
        Validate.notNull time
        Validate.notNull duration
        Validate.isTrue(presentMemberCount == null || presentMemberCount >= 0,
                "Illegal present member count: $presentMemberCount")
        Validate.isTrue(absentMemberCount == null || absentMemberCount >= 0,
                "Illegal absent member count: $absentMemberCount")
        new SessionModel(id, type, date, time, duration, presentMemberCount, absentMemberCount)
    }

    private SessionModel(
            String id, String type, LocalDate date, LocalTime time, Duration duration, Long presentMemberCount,
            Long absentMemberCount) {

        this.id = id
        this.type = type
        this.date = date
        this.time = time
        this.duration = duration
        this.presentMemberCount = presentMemberCount
        this.absentMemberCount = absentMemberCount
    }
}
