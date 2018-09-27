package com.jakemarsden.aikidotrack.controller.model


import com.jakemarsden.aikidotrack.domain.Session
import com.jakemarsden.aikidotrack.domain.SessionType
import groovy.transform.EqualsAndHashCode
import groovy.transform.PackageScope
import groovy.transform.ToString
import java.time.Duration
import java.time.LocalDate
import java.time.LocalTime

import static org.apache.commons.lang3.StringUtils.lowerCase

@EqualsAndHashCode
@ToString(includePackage = false, includeNames = true)
final class SessionModel {

    String id
    String type
    LocalDate date
    LocalTime time
    Duration duration

    static SessionModel ofEntity(Session entity) {
        if (entity == null) {
            return null
        }
        new SessionModel(
                id: entity.id, type: lowerCase(entity.type as String), date: entity.date, time: entity.time,
                duration: entity.duration)
    }

    @PackageScope
    SessionModel() {
    }

    void asEntity(Session entity) {
        entity.type = typeAsEntity
        entity.date = date
        entity.time = time
        entity.duration = duration
    }

    private SessionType getTypeAsEntity() {
        switch (type) {
            case null:
                return null
            case 'junior':
                return SessionType.Junior
            case 'beginner':
                return SessionType.Beginner
            case 'general':
                return SessionType.General
            case 'advanced':
                return SessionType.Advanced
            case 'iaido':
                return SessionType.Iaido
            case 'weapons':
                return SessionType.Weapons
            default:
                throw new IllegalArgumentException("Unsupported $SessionType.simpleName: $type")
        }
    }
}
