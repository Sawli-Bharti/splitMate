package com.splitmate.chat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SendMessageRequest {

    @NotNull(message = "Group id is required")
    private Long groupId;

    @NotBlank(message = "Message is required")
    private String message;
}
