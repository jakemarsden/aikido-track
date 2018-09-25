package com.jakemarsden.aikidotrack.repository

import com.jakemarsden.aikidotrack.domain.Session
import java.time.LocalDate

interface SessionRepository extends Repository<Session> {

    List<Session> findAllByDate(LocalDate date)
}
