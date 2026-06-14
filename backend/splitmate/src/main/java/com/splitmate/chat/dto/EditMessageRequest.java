package com.splitmate.chat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EditMessageRequest {

    @NotNull(message = "Message id is required")
    private Long messageId;

    @NotBlank(message = "Message is required")
    private String message;
}
