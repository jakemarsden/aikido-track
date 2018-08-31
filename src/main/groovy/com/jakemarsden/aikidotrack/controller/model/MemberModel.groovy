package com.jakemarsden.aikidotrack.controller.model

import com.jakemarsden.aikidotrack.domain.Member
import com.jakemarsden.aikidotrack.domain.MemberType
import groovy.transform.EqualsAndHashCode
import groovy.transform.PackageScope
import groovy.transform.ToString
import java.time.LocalDate

import static org.apache.commons.lang3.StringUtils.lowerCase

@EqualsAndHashCode
@ToString(includePackage = false, includeNames = true)
final class MemberModel {

    String id
    String firstName
    String lastName
    String type
    LocalDate birthDate

    static MemberModel ofEntity(Member entity) {
        if (entity == null) {
            return null
        }
        new MemberModel(
                id: entity.id, firstName: entity.firstName, lastName: entity.lastName,
                type: lowerCase(entity.type as String), birthDate: entity.birthDate)
    }

    @PackageScope
    MemberModel() {
    }

    void asEntity(Member entity) {
        entity.firstName = firstName
        entity.lastName = lastName
        entity.type = typeAsEntity
        entity.birthDate = birthDate
    }

    private MemberType getTypeAsEntity() {
        switch (type) {
            case null:
                return null
            case "adult":
                return MemberType.Adult
            case "junior":
                return MemberType.Junior
            default:
                throw new IllegalArgumentException("Unsupported $MemberType.simpleName: $type")
        }
    }
}
