package com.splitmate.group.dto;

import com.splitmate.group.entity.GroupRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupMemberResponse {

    private Long id;

    private Long userId;

    private String name;

    private String email;

    private GroupRole role;

    private LocalDateTime joinedAt;
}
