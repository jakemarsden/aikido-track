package com.jakemarsden.aikidotrack.controller

import com.jakemarsden.aikidotrack.controller.model.GetMembersResponse
import com.jakemarsden.aikidotrack.controller.model.GetSessionAttendancesRequest
import com.jakemarsden.aikidotrack.controller.model.GetSessionAttendancesResponse
import com.jakemarsden.aikidotrack.controller.model.GetSessionsRequest
import com.jakemarsden.aikidotrack.controller.model.GetSessionsResponse
import com.jakemarsden.aikidotrack.controller.model.PostMembersRequest
import com.jakemarsden.aikidotrack.controller.model.PostMembersResponse
import com.jakemarsden.aikidotrack.controller.model.PostSessionAttendancesRequest
import com.jakemarsden.aikidotrack.controller.model.PostSessionAttendancesResponse
import com.jakemarsden.aikidotrack.controller.model.PostSessionsRequest
import com.jakemarsden.aikidotrack.controller.model.PostSessionsResponse
import com.jakemarsden.aikidotrack.controller.model.RequestType
import com.jakemarsden.aikidotrack.service.MemberService
import com.jakemarsden.aikidotrack.service.SessionAttendanceService
import com.jakemarsden.aikidotrack.service.SessionService
import groovy.transform.PackageScope
import java.time.LocalDate
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
    private final SessionAttendanceService attendanceService

    @PackageScope
    ApiController(
            MemberService memberService, SessionService sessionService, SessionAttendanceService attendanceService) {

        this.memberService = memberService
        this.sessionService = sessionService
        this.attendanceService = attendanceService
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

    @GetMapping('/session/{sessionId}/attendance')
    GetSessionAttendancesResponse getSessionAttendances(@PathVariable String sessionId) {
        final req = GetSessionAttendancesRequest.of sessionId
        final attendances = attendanceService.getAttendances(req.sessionId)
        GetSessionAttendancesResponse.of attendances
    }

    @PostMapping('/session/attendance')
    PostSessionAttendancesResponse postSessionAttendances(@RequestBody PostSessionAttendancesRequest req) {
        switch (req.requestType) {
            case RequestType.Update:
                attendanceService.updateAttendances req.sessionId, req.attendances
                break
            default:
                throw new IllegalArgumentException("Unsupported $RequestType.simpleName: $req.requestType")
        }
        PostSessionAttendancesResponse.of req.requestType
    }
}
