package com.jakemarsden.aikidotrack.service

import com.jakemarsden.aikidotrack.domain.Member
import com.jakemarsden.aikidotrack.domain.MemberType
import com.jakemarsden.aikidotrack.model.MemberModel
import com.jakemarsden.aikidotrack.repository.MemberRepository
import groovy.transform.PackageScope
import org.apache.commons.lang3.Validate
import org.springframework.stereotype.Service

import static java.util.stream.Collectors.toList
import static org.apache.commons.lang3.StringUtils.lowerCase

@Service
class MemberService {

    private final MemberRepository memberRepo

    @PackageScope
    MemberService(MemberRepository memberRepo) {
        this.memberRepo = memberRepo
    }

    List<MemberModel> getAllMembers() {
        memberRepo.findAll()
                .stream()
                .map { mapMember it }
                .collect toList()
    }

    List<MemberModel> createMembers(List<MemberModel> members) {
        final entities = members.stream()
                .map { member ->
            final msg = "Unable to create member with ID '$member.id' as it already has an ID: $member"
            Validate.isTrue member.id == null, msg

            final entity = new Member()
            updateMemberEntity entity, member
            entity
        }
                .collect toList()

        final createdEntities = memberRepo.saveAll entities
        createdEntities.stream()
                .map { mapMember it }
                .collect toList()
    }

    List<MemberModel> updateMembers(List<MemberModel> members) {
        // TODO: Bulk updates? Who has time to write that shit? It's not like the user's time is important anyway...
        final entities = members.stream()
                .map { member ->
            Validate.notNull member.id, "Invalid member ID: $member.id"
            Validate.isTrue member.id.isLong(), "Invalid member ID: $member.id"
            final entity = memberRepo.findById(member.id as Long)
                    .orElseThrow {
                final msg = "Unable to update member with ID '$member.id' as it couldn't be found: " +
                        "$member"
                new IllegalArgumentException(msg)
            }
            updateMemberEntity entity, member
            entity
        }
                .collect toList()

        final updatedEntities = memberRepo.saveAll entities
        updatedEntities.stream()
                .map { mapMember it }
                .collect toList()
    }

    private static MemberModel mapMember(Member entity) {
        MemberModel.of(
                entity.id as String, lowerCase(entity.type as String), entity.firstName, entity.lastName,
                entity.birthDate)
    }

    private static void updateMemberEntity(Member entity, MemberModel member) {
        entity.type = parseMemberType member.type
        entity.firstName = member.firstName
        entity.lastName = member.lastName
        entity.birthDate = member.birthDate
    }

    private static MemberType parseMemberType(String type) {
        Arrays.stream(MemberType.values())
                .filter { lowerCase(it as String) == type }
                .findAny()
                .orElseThrow { new IllegalArgumentException("Unsupported $MemberType.simpleName: $type") }
    }
}
