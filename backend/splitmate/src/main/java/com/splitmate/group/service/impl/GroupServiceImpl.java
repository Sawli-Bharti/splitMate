package com.splitmate.group.service.impl;

import com.splitmate.group.dto.AddMemberRequest;
import com.splitmate.group.dto.CreateGroupRequest;
import com.splitmate.group.dto.GroupMemberResponse;
import com.splitmate.group.dto.GroupResponse;
import com.splitmate.group.dto.UpdateGroupRequest;
import com.splitmate.group.entity.Group;
import com.splitmate.group.entity.GroupMember;
import com.splitmate.group.entity.GroupRole;
import com.splitmate.group.repository.GroupMemberRepository;
import com.splitmate.group.repository.GroupRepository;
import com.splitmate.group.service.GroupService;
import com.splitmate.user.entity.User;
import com.splitmate.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupServiceImpl implements GroupService {

    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public GroupResponse createGroup(CreateGroupRequest request, User currentUser) {
        Group group = Group.builder()
                .name(request.getName())
                .description(request.getDescription())
                .createdBy(currentUser)
                .build();

        Group savedGroup = groupRepository.save(group);
        GroupMember adminMember = GroupMember.builder()
                .group(savedGroup)
                .user(currentUser)
                .role(GroupRole.ADMIN)
                .joinedAt(LocalDateTime.now())
                .build();
        groupMemberRepository.save(adminMember);

        return toGroupResponse(savedGroup);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GroupResponse> getMyGroups(User currentUser) {
        return groupMemberRepository.findByUser(currentUser).stream()
                .map(GroupMember::getGroup)
                .distinct()
                .sorted(Comparator.comparing(Group::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::toGroupResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public GroupResponse getGroupDetails(Long groupId, User currentUser) {
        Group group = getGroupOrThrow(groupId);
        requireMember(group, currentUser);
        return toGroupResponse(group);
    }

    @Override
    @Transactional
    public GroupResponse updateGroup(Long groupId, UpdateGroupRequest request, User currentUser) {
        Group group = getGroupOrThrow(groupId);
        requireAdmin(group, currentUser);

        if (StringUtils.hasText(request.getName())) {
            group.setName(request.getName());
        }
        group.setDescription(request.getDescription());

        return toGroupResponse(groupRepository.save(group));
    }

    @Override
    @Transactional
    public void deleteGroup(Long groupId, User currentUser) {
        Group group = getGroupOrThrow(groupId);
        requireAdmin(group, currentUser);
        groupRepository.delete(group);
    }

    @Override
    @Transactional
    public GroupMemberResponse addMember(Long groupId, AddMemberRequest request, User currentUser) {
        Group group = getGroupOrThrow(groupId);
        requireAdmin(group, currentUser);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (groupMemberRepository.existsByGroupAndUser(group, user)) {
            throw new RuntimeException("Already member");
        }

        GroupMember groupMember = GroupMember.builder()
                .group(group)
                .user(user)
                .role(GroupRole.MEMBER)
                .joinedAt(LocalDateTime.now())
                .build();

        return toMemberResponse(groupMemberRepository.save(groupMember));
    }

    @Override
    @Transactional
    public void removeMember(Long groupId, Long userId, User currentUser) {
        Group group = getGroupOrThrow(groupId);
        requireAdmin(group, currentUser);

        User userToRemove = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        GroupMember memberToRemove = groupMemberRepository.findByGroupAndUser(group, userToRemove)
                .orElseThrow(() -> new RuntimeException("Cannot remove non-member"));

        if (memberToRemove.getRole() == GroupRole.ADMIN && countAdmins(group) <= 1) {
            throw new RuntimeException("Last admin cannot be removed");
        }

        groupMemberRepository.deleteByGroupAndUser(group, userToRemove);
    }

    private Group getGroupOrThrow(Long groupId) {
        return groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
    }

    private GroupMember requireMember(Group group, User user) {
        return groupMemberRepository.findByGroupAndUser(group, user)
                .orElseThrow(() -> new RuntimeException("Access denied"));
    }

    private void requireAdmin(Group group, User user) {
        GroupMember groupMember = requireMember(group, user);

        if (groupMember.getRole() != GroupRole.ADMIN) {
            throw new RuntimeException("Access denied");
        }
    }

    private long countAdmins(Group group) {
        return groupMemberRepository.findByGroup(group).stream()
                .filter(member -> member.getRole() == GroupRole.ADMIN)
                .count();
    }

    private GroupResponse toGroupResponse(Group group) {
        List<GroupMemberResponse> members = groupMemberRepository.findByGroup(group).stream()
                .map(this::toMemberResponse)
                .toList();

        return GroupResponse.builder()
                .id(group.getId())
                .name(group.getName())
                .description(group.getDescription())
                .createdById(group.getCreatedBy().getId())
                .createdByName(group.getCreatedBy().getName())
                .createdAt(group.getCreatedAt())
                .updatedAt(group.getUpdatedAt())
                .members(members)
                .build();
    }

    private GroupMemberResponse toMemberResponse(GroupMember groupMember) {
        User user = groupMember.getUser();

        return GroupMemberResponse.builder()
                .id(groupMember.getId())
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(groupMember.getRole())
                .joinedAt(groupMember.getJoinedAt())
                .build();
    }
}
