package com.jakemarsden.aikidotrack.domain

import groovy.transform.ToString
import java.time.LocalDate
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Enumerated

@Entity
@ToString(includePackage = false, includeNames = true, includeSuperProperties = true)
final class Member extends Identifiable {

    @Enumerated
    @Column(nullable = false)
    MemberType type

    @Column(nullable = false)
    String firstName
    String lastName
    LocalDate birthDate
}
