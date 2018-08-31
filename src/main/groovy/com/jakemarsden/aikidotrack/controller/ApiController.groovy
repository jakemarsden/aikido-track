package com.jakemarsden.aikidotrack.controller

import com.jakemarsden.aikidotrack.controller.model.MemberModel
import com.jakemarsden.aikidotrack.domain.Member
import com.jakemarsden.aikidotrack.service.MemberService
import groovy.transform.PackageScope
import org.apache.commons.lang3.Validate
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
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

    @GetMapping('/member')
    List<MemberModel> getMembers() {
        memberService.getAllMembers()
                .stream()
                .map { MemberModel.ofEntity it }
                .collect toList()
    }

    @GetMapping('/member/{id}')
    MemberModel getMemberById(@PathVariable String id) {
        Validate.notEmpty id
        Validate.isTrue id.isLong()
        memberService.getMember(id as Long)
                .map { MemberModel.ofEntity it }
                .orElseThrow { new NotFoundException("$Member.simpleName not found: $id") }
    }

    /**
     * Create a new member
     */
    @PostMapping('/member')
    MemberModel postMember(@RequestBody MemberModel model) {
        Validate.notNull model
        Validate.isTrue model.id == null
        Validate.notBlank model.firstName
        Validate.notBlank model.type
        def member = new Member()
        model.asEntity member
        member = memberService.saveMember member
        MemberModel.ofEntity member
    }

    /**
     * Update an existing member
     */
    @PostMapping('/member/{id}')
    MemberModel postMemberById(@PathVariable String id, @RequestBody MemberModel model) {
        Validate.notEmpty id
        Validate.isTrue id.isLong()
        Validate.notNull model
        Validate.isTrue id == model.id
        Validate.notBlank model.firstName
        Validate.notBlank model.type
        def member = memberService.getMember(id as Long)
                .orElseThrow { new NotFoundException("$Member.simpleName not found: $id") }
        model.asEntity member
        member = memberService.saveMember member
        MemberModel.ofEntity member
    }
}
