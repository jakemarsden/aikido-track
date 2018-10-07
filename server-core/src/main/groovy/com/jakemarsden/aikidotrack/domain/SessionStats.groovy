package com.jakemarsden.aikidotrack.domain

import groovy.transform.ToString
import javax.persistence.Column
import javax.persistence.Embeddable

/**
 * {@link Session} columns which <i>could</i> be calculated on demand but have been included here for simplicity and/or
 * read performance at the cost of write performance
 */
@Embeddable
@ToString(includePackage = false, includeNames = true, includeSuperProperties = true)
final class SessionStats {

    @Column(nullable = false)
    Long presentMemberCount
}
