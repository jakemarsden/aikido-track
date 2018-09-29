package com.jakemarsden.aikidotrack.repository

import com.jakemarsden.aikidotrack.domain.Session
import com.jakemarsden.aikidotrack.domain.SessionAttendance

interface SessionAttendanceRepository extends Repository<SessionAttendance> {

    List<SessionAttendance> findAllBySessionId(Long sessionId)

    List<SessionAttendance> findAllBySession(Session session)
}
