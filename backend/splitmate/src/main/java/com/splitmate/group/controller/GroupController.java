package com.splitmate.group.controller;

import com.splitmate.common.response.ApiResponse;
import com.splitmate.common.security.CustomUserDetails;
import com.splitmate.group.dto.AddMemberRequest;
import com.splitmate.group.dto.CreateGroupRequest;
import com.splitmate.group.dto.GroupMemberResponse;
import com.splitmate.group.dto.GroupResponse;
import com.splitmate.group.dto.UpdateGroupRequest;
import com.splitmate.group.service.GroupService;
import com.splitmate.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

    @PostMapping
    public ResponseEntity<ApiResponse<GroupResponse>> createGroup(
            @Valid @RequestBody CreateGroupRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        GroupResponse groupResponse = groupService.createGroup(request, getCurrentUser(userDetails));

        return ResponseEntity.ok(ApiResponse.<GroupResponse>builder()
                .success(true)
                .message("Group created successfully")
                .data(groupResponse)
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<GroupResponse>>> getMyGroups(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        List<GroupResponse> groups = groupService.getMyGroups(getCurrentUser(userDetails));

        return ResponseEntity.ok(ApiResponse.<List<GroupResponse>>builder()
                .success(true)
                .message("Groups fetched successfully")
                .data(groups)
                .build());
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<ApiResponse<GroupResponse>> getGroupDetails(
            @PathVariable Long groupId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        GroupResponse groupResponse = groupService.getGroupDetails(groupId, getCurrentUser(userDetails));

        return ResponseEntity.ok(ApiResponse.<GroupResponse>builder()
                .success(true)
                .message("Group fetched successfully")
                .data(groupResponse)
                .build());
    }

    @PutMapping("/{groupId}")
    public ResponseEntity<ApiResponse<GroupResponse>> updateGroup(
            @PathVariable Long groupId,
            @Valid @RequestBody UpdateGroupRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        GroupResponse groupResponse = groupService.updateGroup(groupId, request, getCurrentUser(userDetails));

        return ResponseEntity.ok(ApiResponse.<GroupResponse>builder()
                .success(true)
                .message("Group updated successfully")
                .data(groupResponse)
                .build());
    }

    @DeleteMapping("/{groupId}")
    public ResponseEntity<ApiResponse<Void>> deleteGroup(
            @PathVariable Long groupId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        groupService.deleteGroup(groupId, getCurrentUser(userDetails));

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Group deleted successfully")
                .data(null)
                .build());
    }

    @PostMapping("/{groupId}/members")
    public ResponseEntity<ApiResponse<GroupMemberResponse>> addMember(
            @PathVariable Long groupId,
            @Valid @RequestBody AddMemberRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        GroupMemberResponse memberResponse = groupService.addMember(groupId, request, getCurrentUser(userDetails));

        return ResponseEntity.ok(ApiResponse.<GroupMemberResponse>builder()
                .success(true)
                .message("Member added successfully")
                .data(memberResponse)
                .build());
    }

    @DeleteMapping("/{groupId}/members/{userId}")
    public ResponseEntity<ApiResponse<Void>> removeMember(
            @PathVariable Long groupId,
            @PathVariable Long userId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        groupService.removeMember(groupId, userId, getCurrentUser(userDetails));

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Member removed successfully")
                .data(null)
                .build());
    }

    private User getCurrentUser(CustomUserDetails userDetails) {
        return userDetails.getUser();
    }
}
