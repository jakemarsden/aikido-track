package com.jakemarsden.aikidotrack.domain

import groovy.transform.ToString
import javax.persistence.Column
import javax.persistence.Entity

@Entity
@ToString(includePackage = false, includeNames = true, includeSuperProperties = true)
final class MemberType extends Identifiable {

    @Column(nullable = false, unique = true)
    String name
}
