package com.jakemarsden.aikidotrack.controller

import com.jakemarsden.aikidotrack.controller.model.MemberModel
import com.jakemarsden.aikidotrack.domain.Member
import com.jakemarsden.aikidotrack.service.MemberService
import groovy.transform.PackageScope
import org.apache.commons.lang3.Validate
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

import static java.util.stream.Collectors.toList

@RestController
@RequestMapping('/api')
@PackageScope
class ApiController {

    private final MemberService memberService

    @PackageScope
    ApiController(MemberService memberService) {
        this.memberService = memberService
    }

    @GetMapping('/member/all')
    List<MemberModel> getMembers() {
        memberService.getAllMembers()
                .stream()
                .map { MemberModel.ofEntity it }
                .collect toList()
    }

    @PostMapping('/member')
    MemberModel postMember(@RequestBody MemberModel model) {
        Validate.notNull model
        Validate.notNull model.firstName
        Validate.notNull model.type
        def member = new Member(
                firstName: model.firstName, lastName: model.lastName, type: MemberModel.Type.asEntity(model.type),
                birthDate: model.birthDate)
        member = memberService.saveMember member
        MemberModel.ofEntity member
    }
}
