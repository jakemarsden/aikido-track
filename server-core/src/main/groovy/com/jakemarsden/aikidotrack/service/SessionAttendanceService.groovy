package com.jakemarsden.aikidotrack.service

import com.jakemarsden.aikidotrack.domain.Member
import com.jakemarsden.aikidotrack.domain.Session
import com.jakemarsden.aikidotrack.domain.SessionAttendance
import com.jakemarsden.aikidotrack.model.MemberModel
import com.jakemarsden.aikidotrack.model.SessionAttendanceModel
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
        if (!sessionId?.isLong()) {
            throw new IllegalArgumentException("Invalid session ID '$sessionId': attendances=$attendances")
        }
        final session = sessionRepo.findById(sessionId as Long)
                .orElseThrow {
                    new IllegalArgumentException("Session with ID '$sessionId' not found: attendances=$attendances")
                }

        // TODO: Efficiency?? Never heard of it
        attendances.stream()
                .forEach { synchronizeAttendanceRecord session, it.member, it.present }

        session.stats.presentMemberCount = attendances.stream()
                .filter { it.present }
                .count()
        session.stats.absentMemberCount = attendances.stream()
                .filter { !it.present }
                .count()
        sessionRepo.save session
    }

    private void synchronizeAttendanceRecord(Session sessionEntity, MemberModel member, boolean present) {
        if (!member.id?.isLong()) {
            final msg = "Invalid member ID '$member.id' for member: " +
                    "sessionEntity=$sessionEntity, member=$member, present=$present"
            throw new IllegalArgumentException(msg)
        }

        final memberId = member.id as Long
        final attendanceEntity = attendanceRepo.findBySessionIdAndMemberId sessionEntity.id, memberId

        if (present && !attendanceEntity.present) {
            final memberEntity = memberRepo.findById(memberId)
                    .orElseThrow {
                        final msg = "Member with ID '$memberId' not found: " +
                                "sessionEntity=$sessionEntity, member=$member, present=$present"
                        new IllegalStateException(msg)
                    }
            attendanceRepo.save new SessionAttendance(session: sessionEntity, member: memberEntity)
        }
        if (!present && attendanceEntity.present) {
            attendanceRepo.delete attendanceEntity.get()
        }
    }

    private static SessionAttendanceModel mapAttendance(Member entity, boolean present) {
        SessionAttendanceModel.of(
                MemberModel.of(
                        entity.id as String, lowerCase(entity.type as String), entity.firstName, entity.lastName,
                        entity.birthDate),
                present)
    }
}
