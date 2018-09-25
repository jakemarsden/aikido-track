package com.jakemarsden.aikidotrack.service

import com.jakemarsden.aikidotrack.domain.Member
import com.jakemarsden.aikidotrack.domain.Session
import com.jakemarsden.aikidotrack.repository.MemberRepository
import com.jakemarsden.aikidotrack.repository.SessionRepository
import groovy.transform.PackageScope
import java.time.LocalDate
import org.apache.commons.lang3.Validate
import org.springframework.stereotype.Service

import static java.util.stream.Collectors.toList
import static java.util.stream.Collectors.toSet

@Service
class SessionService {

    private final MemberRepository memberRepo
    private final SessionRepository sessionRepo

    @PackageScope
    SessionService(MemberRepository memberRepo, SessionRepository sessionRepo) {
        this.memberRepo = memberRepo
        this.sessionRepo = sessionRepo
    }

    Optional<Session> getSession(Long id) {
        Validate.notNull id
        sessionRepo.findById id
    }

    Session saveSession(Session session) {
        Validate.notNull session
        sessionRepo.save session
    }

    List<Session> getSessionsOn(LocalDate date) {
        Validate.notNull date
        sessionRepo.findAllByDate date
    }

    List<Member> getSessionInstructors(Session session) {
        Validate.notNull session
        session.attendance.stream()
                .filter { it.instructor }
                .map { it.member }
                .collect toList()
    }

    List<Member> getSessionPresentMembers(Session session) {
        Validate.notNull session
        session.attendance.stream()
                .filter { !it.instructor }
                .map { it.member }
                .collect toList()
    }

    List<Member> getSessionAbsentMembers(Session session) {
        Validate.notNull session
        final presentMemberIds = session.attendance.stream()
                .map { it.member.id }
                .collect toSet()
        memberRepo.findAllByIdNotIn presentMemberIds
    }
}
