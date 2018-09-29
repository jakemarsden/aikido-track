package com.jakemarsden.aikidotrack.controller.model

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import java.time.LocalDate
import org.apache.commons.lang3.Validate

@EqualsAndHashCode
@ToString(includePackage = false, includeNames = true)
final class MemberModel {

    final String id
    final String type
    final String firstName
    final String lastName
    final LocalDate birthDate

    @JsonCreator
    static MemberModel of(
            @JsonProperty('id') String id, @JsonProperty('type') String type,
            @JsonProperty('firstName') String firstName, @JsonProperty('lastName') String lastName,
            @JsonProperty('birthDate') LocalDate birthDate) {

        Validate.notBlank type
        Validate.notEmpty firstName
        new MemberModel(id, type, firstName, lastName, birthDate)
    }

    private MemberModel(String id, String type, String firstName, String lastName, LocalDate birthDate) {
        this.id = id
        this.type = type
        this.firstName = firstName
        this.lastName = lastName
        this.birthDate = birthDate
    }
}
