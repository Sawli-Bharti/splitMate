package com.splitmate.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponse {

    private Long id;

    private Long groupId;

    private Long senderId;

    private String senderName;

    private String message;

    private boolean isEdited;

    private boolean isDeleted;

    private LocalDateTime createdAt;
}
