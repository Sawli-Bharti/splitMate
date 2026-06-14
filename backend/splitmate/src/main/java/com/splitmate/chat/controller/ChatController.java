package com.splitmate.chat.controller;

import com.splitmate.chat.dto.ChatMessageResponse;
import com.splitmate.chat.service.ChatService;
import com.splitmate.common.response.ApiResponse;
import com.splitmate.common.security.CustomUserDetails;
import com.splitmate.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/group/{groupId}")
    public ResponseEntity<ApiResponse<List<ChatMessageResponse>>> getGroupMessages(
            @PathVariable Long groupId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        List<ChatMessageResponse> messages = chatService.getGroupMessages(groupId, getCurrentUser(userDetails));

        return ResponseEntity.ok(ApiResponse.<List<ChatMessageResponse>>builder()
                .success(true)
                .message("Messages fetched successfully")
                .data(messages)
                .build());
    }

    private User getCurrentUser(CustomUserDetails userDetails) {
        return userDetails.getUser();
    }
}
