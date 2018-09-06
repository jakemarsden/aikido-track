package com.jakemarsden.aikidotrack.domain

import groovy.transform.PackageScope
import groovy.transform.ToString
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.MappedSuperclass

import static javax.persistence.GenerationType.IDENTITY

@MappedSuperclass
@PackageScope
@ToString(includePackage = false, includeNames = true)
abstract class Identifiable {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    Long id

    @PackageScope
    Identifiable() {
    }
}
