package com.jakemarsden.aikidotrack.domain

import groovy.transform.ToString
import javax.persistence.Entity
import javax.persistence.ManyToOne
import javax.persistence.Table
import javax.persistence.UniqueConstraint

@Entity
@Table(uniqueConstraints = [@UniqueConstraint(columnNames = ['session_id', 'member_id'])])
@ToString(includePackage = false, includeNames = true, includeSuperProperties = true)
final class SessionAttendance extends Identifiable {

    @ManyToOne(optional = false)
    Session session

    @ManyToOne(optional = false)
    Member member
}
