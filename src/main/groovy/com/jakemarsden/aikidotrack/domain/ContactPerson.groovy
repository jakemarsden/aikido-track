package com.jakemarsden.aikidotrack.domain

import groovy.transform.ToString
import javax.persistence.Entity
import javax.persistence.OneToMany

@Entity
@ToString(includePackage = false, includeNames = true, includeSuperProperties = true)
final class ContactPerson extends Identifiable {

    String firstName
    String lastName

    @OneToMany(mappedBy = 'contactPerson')
    List<ContactDetail.ContactPerson> contactDetails
}
