package com.jakemarsden.aikidotrack.controller.model

import com.jakemarsden.aikidotrack.domain.Member
import groovy.transform.EqualsAndHashCode
import groovy.transform.PackageScope
import groovy.transform.ToString

import static java.util.stream.Collectors.toList
import static org.apache.commons.lang3.StringUtils.lowerCase

@EqualsAndHashCode
@ToString(includePackage = false, includeNames = true)
final class SessionAttendanceModel {

    List<MemberModel> instructors
    List<MemberModel> presentMembers
    List<MemberModel> absentMembers

    static SessionAttendanceModel ofEntity(
            List<Member> instructorEntities, List<Member> presentMemberEntities, List<Member> absentMemberEntities) {

        final instructors = instructorEntities.stream()
                .map { mapMember it }
                .collect toList()
        final presentMembers = presentMemberEntities.stream()
                .map { mapMember it }
                .collect toList()
        final absentMembers = absentMemberEntities.stream()
                .map { mapMember it }
                .collect toList()
        new SessionAttendanceModel(
                instructors: instructors, presentMembers: presentMembers, absentMembers: absentMembers)
    }

    @PackageScope
    SessionAttendanceModel() {
    }

    private static MemberModel mapMember(Member entity) {
        MemberModel.of(
                entity.id as String, lowerCase(entity.type as String), entity.firstName, entity.lastName,
                entity.birthDate)
    }
}
