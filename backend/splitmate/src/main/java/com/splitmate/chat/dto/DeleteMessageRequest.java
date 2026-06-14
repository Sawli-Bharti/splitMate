package com.splitmate.chat.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DeleteMessageRequest {

    @NotNull(message = "Message id is required")
    private Long messageId;
}
