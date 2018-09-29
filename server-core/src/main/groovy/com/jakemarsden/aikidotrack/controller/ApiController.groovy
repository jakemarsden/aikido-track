package com.jakemarsden.aikidotrack.controller

import com.jakemarsden.aikidotrack.controller.model.GetMembersResponse
import com.jakemarsden.aikidotrack.controller.model.GetSessionsRequest
import com.jakemarsden.aikidotrack.controller.model.GetSessionsResponse
import com.jakemarsden.aikidotrack.controller.model.PostMembersRequest
import com.jakemarsden.aikidotrack.controller.model.PostMembersResponse
import com.jakemarsden.aikidotrack.controller.model.PostSessionsRequest
import com.jakemarsden.aikidotrack.controller.model.PostSessionsResponse
import com.jakemarsden.aikidotrack.controller.model.RequestType
import com.jakemarsden.aikidotrack.controller.model.SessionAttendanceModel
import com.jakemarsden.aikidotrack.domain.Session
import com.jakemarsden.aikidotrack.service.MemberService
import com.jakemarsden.aikidotrack.service.SessionService
import groovy.transform.PackageScope
import java.time.LocalDate
import org.apache.commons.lang3.Validate
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

import static org.springframework.format.annotation.DateTimeFormat.ISO

@RestController
@RequestMapping('/api')
@PackageScope
class ApiController {

    private final MemberService memberService
    private final SessionService sessionService

    @PackageScope
    ApiController(MemberService memberService, SessionService sessionService) {
        this.memberService = memberService
        this.sessionService = sessionService
    }

    @GetMapping('/member')
    GetMembersResponse getMembers() {
        final members = memberService.getAllMembers()
        GetMembersResponse.of members
    }

    @PostMapping('/member')
    PostMembersResponse postMember(@RequestBody PostMembersRequest req) {
        final members
        switch (req.requestType) {
            case RequestType.Create:
                members = memberService.createMembers req.members
                break
            case RequestType.Update:
                members = memberService.updateMembers req.members
                break
            default:
                throw new IllegalArgumentException("Unsupported $RequestType.simpleName: $req.requestType")
        }
        PostMembersResponse.of req.requestType, members
    }

    @GetMapping('/session')
    GetSessionsResponse getSessions() {
        final sessions = sessionService.getAllSessions()
        GetSessionsResponse.of sessions
    }

    @GetMapping('/session/{date}')
    GetSessionsResponse getSessionsByDate(@PathVariable @DateTimeFormat(iso = ISO.DATE) LocalDate date) {
        final req = GetSessionsRequest.filteredByDate date
        final sessions = sessionService.getSessionsByDate req.date
        GetSessionsResponse.of sessions
    }

    @PostMapping('/session')
    PostSessionsResponse postSession(@RequestBody PostSessionsRequest req) {
        final sessions
        switch (req.requestType) {
            case RequestType.Create:
                sessions = sessionService.createSessions req.sessions
                break
            case RequestType.Update:
                sessions = sessionService.updateSessions req.sessions
                break
            default:
                throw new IllegalArgumentException("Unsupported $RequestType.simpleName: $req.requestType")
        }
        PostSessionsResponse.of req.requestType, sessions
    }

    @GetMapping('/session/{id}/attendance')
    SessionAttendanceModel getSessionAttendance(@PathVariable String id) {
        Validate.notEmpty id
        Validate.isTrue id.isLong()
        final session = sessionService.getSession(id as Long)
                .orElseThrow { new NotFoundException("$Session.simpleName not found: $id") }
        sessionAttendanceModel session
    }

    private SessionAttendanceModel sessionAttendanceModel(Session session) {
        final instructors = sessionService.getSessionInstructors session
        final presentMembers = sessionService.getSessionPresentMembers session
        final absentMembers = sessionService.getSessionAbsentMembers session
        SessionAttendanceModel.ofEntity(instructors, presentMembers, absentMembers)
    }
}
