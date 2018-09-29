package com.jakemarsden.aikidotrack.domain

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import javax.persistence.Embeddable
import javax.persistence.EmbeddedId
import javax.persistence.Entity
import javax.persistence.ManyToOne
import javax.persistence.MapsId

@Entity
@ToString(includePackage = false, includeNames = true, excludes = ['id'])
final class SessionAttendance {

    @EmbeddedId
    private CompositePk id = new CompositePk()

    @MapsId('sessionId')
    @ManyToOne(optional = false)
    Session session

    @MapsId('memberId')
    @ManyToOne(optional = false)
    Member member

    @Embeddable
    @EqualsAndHashCode
    @ToString(includePackage = false, includeNames = true, includeSuperProperties = true)
    private static final class CompositePk implements Serializable {

        private Long sessionId
        private Long memberId
    }
}
