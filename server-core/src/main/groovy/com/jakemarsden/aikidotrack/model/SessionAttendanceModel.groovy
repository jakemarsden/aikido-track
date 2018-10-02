package com.jakemarsden.aikidotrack.model

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import org.apache.commons.lang3.Validate

@EqualsAndHashCode
@ToString(includePackage = false, includeNames = true)
final class SessionAttendanceModel {

    final MemberModel member
    final boolean present

    @JsonCreator
    static SessionAttendanceModel of(
            @JsonProperty('member') MemberModel member, @JsonProperty('present') Boolean present) {

        Validate.notNull member
        Validate.notNull present
        new SessionAttendanceModel(member, present.booleanValue())
    }

    private SessionAttendanceModel(MemberModel member, boolean present) {
        this.member = member
        this.present = present
    }
}
