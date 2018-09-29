package com.jakemarsden.aikidotrack.service

import com.jakemarsden.aikidotrack.controller.model.MemberModel
import com.jakemarsden.aikidotrack.controller.model.SessionAttendanceModel
import com.jakemarsden.aikidotrack.domain.Member
import com.jakemarsden.aikidotrack.domain.SessionAttendance
import com.jakemarsden.aikidotrack.repository.MemberRepository
import com.jakemarsden.aikidotrack.repository.SessionAttendanceRepository
import com.jakemarsden.aikidotrack.repository.SessionRepository
import groovy.transform.PackageScope
import org.apache.commons.lang3.Validate
import org.springframework.stereotype.Service

import static java.util.stream.Collectors.toList
import static java.util.stream.Collectors.toSet
import static org.apache.commons.lang3.StringUtils.lowerCase

@Service
class SessionAttendanceService {

    private final MemberRepository memberRepo
    private final SessionRepository sessionRepo
    private final SessionAttendanceRepository attendanceRepo

    @PackageScope
    SessionAttendanceService(
            MemberRepository memberRepo, SessionRepository sessionRepo, SessionAttendanceRepository attendanceRepo) {

        this.memberRepo = memberRepo
        this.sessionRepo = sessionRepo
        this.attendanceRepo = attendanceRepo
    }

    List<SessionAttendanceModel> getAttendances(String sessionId) {
        Validate.notNull sessionId, "Invalid session ID: $sessionId"
        Validate.isTrue sessionId.isLong(), "Invalid session ID: $sessionId"

        final presentMemberEntities = attendanceRepo.findAllBySessionId(sessionId as Long)
                .stream()
                .map { it.member }
                .collect toList()
        final presentMemberIds = presentMemberEntities.stream()
                .map { it.id }
                .collect toSet()
        final absentMemberEntities = presentMemberIds.empty ?
                memberRepo.findAll() :
                memberRepo.findAllByIdNotIn(presentMemberIds)

        final List<SessionAttendanceModel> attendances = []
        presentMemberEntities.stream()
                .map { mapAttendance it, true }
                .forEach { attendances.add it }
        absentMemberEntities.stream()
                .map { mapAttendance it, false }
                .forEach { attendances.add it }
        attendances
    }

    void updateAttendances(String sessionId, List<SessionAttendanceModel> attendances) {
        final List<SessionAttendance> entitiesToCreate = []
        final List<SessionAttendance> entitiesToDelete = []

        Validate.isTrue sessionId?.isLong(), "Invalid session ID '$sessionId': $attendances"
        final session = sessionRepo.findById(sessionId as Long)
                .orElseThrow { new IllegalArgumentException("Session with ID '$sessionId' not found: $attendances") }

        final entities = attendanceRepo.findAllBySession(session)
        attendances.stream()
                .forEach { attendance ->
                    final entity = entities.stream()
                            .filter { it.member.id == attendance.member.id }
                            .findAny()
                    if (attendance.present && !entity.present) {
                        if (!attendance.member.id?.isLong()) {
                            throw new RuntimeException("Invalid member ID '$attendance.member.id': $attendances")
                        }
                        // TODO: Efficiency?? Never heard of it
                        final memberEntity = memberRepo.findById(attendance.member.id as Long)
                                .orElseThrow {
                                    final msg = "Member with ID '$attendance.member.id' not found: $attendances"
                                    new RuntimeException(msg)
                        }
                        entitiesToCreate.add new SessionAttendance(session: session, member: memberEntity)
                    }
                    if (!attendance.present && entity.present) {
                        entitiesToDelete.add entity.get()
                    }
                }

        attendanceRepo.deleteAll entitiesToDelete
        attendanceRepo.saveAll entitiesToCreate
    }

    private static SessionAttendanceModel mapAttendance(Member entity, boolean present) {
        SessionAttendanceModel.of(
                MemberModel.of(
                        entity.id as String, lowerCase(entity.type as String), entity.firstName, entity.lastName,
                        entity.birthDate),
                present)
    }
}
