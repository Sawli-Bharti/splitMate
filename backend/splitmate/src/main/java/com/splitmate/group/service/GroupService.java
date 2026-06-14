package com.splitmate.group.service;

import com.splitmate.group.dto.AddMemberRequest;
import com.splitmate.group.dto.CreateGroupRequest;
import com.splitmate.group.dto.GroupMemberResponse;
import com.splitmate.group.dto.GroupResponse;
import com.splitmate.group.dto.UpdateGroupRequest;
import com.splitmate.user.entity.User;

import java.util.List;

public interface GroupService {

    GroupResponse createGroup(CreateGroupRequest request, User currentUser);

    List<GroupResponse> getMyGroups(User currentUser);

    GroupResponse getGroupDetails(Long groupId, User currentUser);

    GroupResponse updateGroup(Long groupId, UpdateGroupRequest request, User currentUser);

    void deleteGroup(Long groupId, User currentUser);

    GroupMemberResponse addMember(Long groupId, AddMemberRequest request, User currentUser);

    void removeMember(Long groupId, Long userId, User currentUser);
}
