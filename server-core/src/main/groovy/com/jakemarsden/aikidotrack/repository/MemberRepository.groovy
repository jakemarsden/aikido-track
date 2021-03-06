package com.jakemarsden.aikidotrack.repository

import com.jakemarsden.aikidotrack.domain.Member

interface MemberRepository extends Repository<Member> {

    List<Member> findAllByIdNotIn(Iterable<Long> ids)
}
