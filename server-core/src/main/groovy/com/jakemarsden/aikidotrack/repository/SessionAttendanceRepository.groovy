package com.jakemarsden.aikidotrack.repository

import com.jakemarsden.aikidotrack.domain.SessionAttendance

interface SessionAttendanceRepository extends Repository<SessionAttendance> {

    Optional<SessionAttendance> findBySessionIdAndMemberId(Long sessionId, Long memberId)

    List<SessionAttendance> findAllBySessionId(Long sessionId)
}
