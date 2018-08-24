package com.jakemarsden.aikidotrack.domain

import groovy.transform.ToString
import javax.persistence.Entity
import javax.persistence.ManyToOne
import javax.persistence.Table
import javax.persistence.UniqueConstraint

@Entity
@Table(uniqueConstraints = [@UniqueConstraint(columnNames = ['member_id', 'contact_person_id'])])
@ToString(
        includePackage = false, includeNames = true, includeSuperProperties = true,
        excludes = ['member', 'contactPerson'])
final class MemberContactPersonLink extends Identifiable {

    @ManyToOne(optional = false)
    Member member

    @ManyToOne(optional = false)
    ContactPerson contactPerson

    String relationship
    boolean emergencyContact
}
