package com.jakemarsden.aikidotrack.domain

import com.jakemarsden.aikidotrack.domain.Identifiable
import groovy.transform.ToString
import javax.persistence.Column
import javax.persistence.Entity

@Entity
@ToString(includePackage = false, includeNames = true, includeSuperProperties = true)
final class ContactDetailType extends Identifiable {

    @Column(nullable = false, unique = true)
    String name
}
