package com.jakemarsden.aikidotrack.domain

import groovy.transform.ToString
import java.time.Duration
import java.time.LocalDate
import java.time.LocalTime
import javax.persistence.Column
import javax.persistence.Embedded
import javax.persistence.Entity
import javax.persistence.Enumerated
import javax.persistence.Table
import javax.persistence.UniqueConstraint

@Entity
@Table(uniqueConstraints = [@UniqueConstraint(columnNames = ['type', 'date', 'time'])])
@ToString(includePackage = false, includeNames = true, includeSuperProperties = true)
final class Session extends Identifiable {

    @Column(nullable = false)
    @Enumerated
    SessionType type

    @Column(nullable = false)
    LocalDate date

    @Column(nullable = false)
    LocalTime time

    @Column(nullable = false)
    Duration duration

    /**
     * Columns which <i>could</i> be calculated on demand but have been included here for simplicity and/or read
     * performance at the cost of write performance
     */
    @Embedded
    SessionStats stats
}
