package com.jakemarsden.aikidotrack.service

import com.jakemarsden.aikidotrack.domain.Member
import com.jakemarsden.aikidotrack.repository.MemberRepository
import groovy.transform.PackageScope
import org.apache.commons.lang3.Validate
import org.springframework.stereotype.Service

@Service
class MemberService {

    private final MemberRepository memberRepo

    @PackageScope
    MemberService(MemberRepository memberRepo) {
        this.memberRepo = memberRepo
    }

    List<Member> getAllMembers() {
        memberRepo.findAll()
    }

    Optional<Member> getMember(Long id) {
        memberRepo.findById id
    }

    Member saveMember(Member member) {
        Validate.notNull member
        memberRepo.save member
    }
}
