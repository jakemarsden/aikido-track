package com.jakemarsden.aikidotrack.domain

import groovy.transform.ToString
import java.time.LocalDate
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Enumerated
import javax.persistence.OneToMany

@Entity
@ToString(includePackage = false, includeNames = true, includeSuperProperties = true)
final class Member extends Identifiable {

    @Enumerated
    @Column(nullable = false)
    MemberType type
    String firstName
    String lastName
    LocalDate birthDate

    @OneToMany(mappedBy = 'member')
    List<ContactDetail.Member> contactDetails

    @OneToMany(mappedBy = 'member')
    List<MemberContactPersonLink> contactPersonLinks
}
