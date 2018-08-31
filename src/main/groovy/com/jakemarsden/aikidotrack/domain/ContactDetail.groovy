package com.jakemarsden.aikidotrack.domain

import groovy.transform.ToString
import javax.persistence.Column
import javax.persistence.DiscriminatorColumn
import javax.persistence.DiscriminatorValue
import javax.persistence.Entity
import javax.persistence.Enumerated
import javax.persistence.Inheritance
import javax.persistence.ManyToOne

import static javax.persistence.DiscriminatorType.STRING
import static javax.persistence.InheritanceType.SINGLE_TABLE

/**
 * TODO: Clean up the inheritance strategy. Remove the "dtype" column if possible and instead see if Hibernate can
 * base it on whether a column is non-null (ie. if "member_id" != null, it must be a ContactDetail.Member and if
 * "contact_person_id" != null, it must be a ContactDetail.ContactPerson)
 */
@Entity
@Inheritance(strategy = SINGLE_TABLE)
@DiscriminatorColumn(discriminatorType = STRING, length = 20)
@ToString(includePackage = false, includeNames = true, includeSuperProperties = true)
abstract class ContactDetail extends Identifiable {

    @Enumerated
    @Column(nullable = false)
    ContactDetailType type

    @Column(nullable = false)
    String value
    String label

    @Entity
    @DiscriminatorValue('ContactPerson')
    @ToString(includePackage = false, includeNames = true, includeSuperProperties = true, excludes = ['contactPerson'])
    static final class ContactPerson extends ContactDetail {

        @ManyToOne(optional = false)
        com.jakemarsden.aikidotrack.domain.ContactPerson contactPerson
    }

    @Entity
    @DiscriminatorValue('Member')
    @ToString(includePackage = false, includeNames = true, includeSuperProperties = true, excludes = ['member'])
    static final class Member extends ContactDetail {

        @ManyToOne(optional = false)
        com.jakemarsden.aikidotrack.domain.Member member
    }
}
