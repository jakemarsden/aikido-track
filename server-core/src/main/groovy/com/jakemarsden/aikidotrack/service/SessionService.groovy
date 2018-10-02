package com.jakemarsden.aikidotrack.service

import com.jakemarsden.aikidotrack.domain.Session
import com.jakemarsden.aikidotrack.domain.SessionType
import com.jakemarsden.aikidotrack.model.SessionModel
import com.jakemarsden.aikidotrack.repository.SessionRepository
import groovy.transform.PackageScope
import java.time.LocalDate
import org.apache.commons.lang3.Validate
import org.springframework.stereotype.Service

import static java.util.stream.Collectors.toList
import static org.apache.commons.lang3.StringUtils.lowerCase

@Service
class SessionService {

    private final SessionRepository sessionRepo

    @PackageScope
    SessionService(SessionRepository sessionRepo) {
        this.sessionRepo = sessionRepo
    }

    List<SessionModel> getAllSessions() {
        sessionRepo.findAll()
                .stream()
                .map { mapSession it }
                .collect toList()
    }

    List<SessionModel> getSessionsByDate(LocalDate date) {
        sessionRepo.findAllByDate(date)
                .stream()
                .map { mapSession it }
                .collect toList()
    }

    List<SessionModel> createSessions(List<SessionModel> sessions) {
        final entities = sessions.stream()
                .map { session ->
            final msg = "Unable to create session with ID '$session.id' as it already has an ID: $session"
            Validate.isTrue session.id == null, msg

            final entity = new Session()
            updateSessionEntity entity, session
            entity
        }
                .collect toList()

        final createdEntities = sessionRepo.saveAll entities
        createdEntities.stream()
                .map { mapSession it }
                .collect toList()
    }

    List<SessionModel> updateSessions(List<SessionModel> sessions) {
        // TODO: Bulk updates? Who has time to write that shit? It's not like the user's time is important anyway...
        final entities = sessions.stream()
                .map { session ->
            Validate.notNull session.id, "Invalid session ID: $session.id"
            Validate.isTrue session.id.isLong(), "Invalid session ID: $session.id"
            final entity = sessionRepo.findById(session.id as Long)
                    .orElseThrow {
                final msg = "Unable to update session with ID '$session.id' as it couldn't be " +
                        "found: $session"
                new IllegalArgumentException(msg)
            }
            updateSessionEntity entity, session
            entity
        }
                .collect toList()

        final updatedEntities = sessionRepo.saveAll entities
        updatedEntities.stream()
                .map { mapSession it }
                .collect toList()
    }

    private static SessionModel mapSession(Session entity) {
        SessionModel.of(
                entity.id as String, lowerCase(entity.type as String), entity.date, entity.time, entity.duration)
    }

    private static void updateSessionEntity(Session entity, SessionModel session) {
        entity.type = parseSessionType session.type
        entity.date = session.date
        entity.time = session.time
        entity.duration = session.duration
    }

    private static SessionType parseSessionType(String type) {
        Arrays.stream(SessionType.values())
                .filter { lowerCase(it as String) == type }
                .findAny()
                .orElseThrow { new IllegalArgumentException("Unsupported $SessionType.simpleName: $type") }
    }
}
