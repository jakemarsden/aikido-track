package com.jakemarsden.aikidotrack.controller.model

import com.jakemarsden.aikidotrack.domain.Member
import com.jakemarsden.aikidotrack.domain.MemberType
import groovy.transform.EqualsAndHashCode
import groovy.transform.PackageScope
import groovy.transform.ToString
import java.time.LocalDate

@EqualsAndHashCode
@ToString(includePackage = false, includeNames = true)
final class MemberModel {

    String id
    String firstName
    String lastName
    Type type
    LocalDate birthDate

    static MemberModel ofEntity(Member entity) {
        if (entity == null) {
            return null
        }
        new MemberModel(
                id: entity.id, firstName: entity.firstName, lastName: entity.lastName,
                type: Type.ofEntity(entity.type), birthDate: entity.birthDate)
    }

    @PackageScope
    MemberModel() {
    }

    enum Type {

        Adult,
        Junior

        static Type ofEntity(MemberType entity) {
            switch (entity) {
                case null:
                    return null
                case MemberType.Adult:
                    return Adult
                case MemberType.Junior:
                    return Junior
                default:
                    throw new IllegalArgumentException("Unsupported $MemberType.simpleName: $entity")
            }
        }

        static MemberType asEntity(Type model) {
            switch (model) {
                case null:
                    return null
                case Adult:
                    return MemberType.Adult
                case Junior:
                    return MemberType.Junior
                default:
                    throw new IllegalArgumentException("Unsupported $Type.simpleName: $model")
            }
        }
    }
}
