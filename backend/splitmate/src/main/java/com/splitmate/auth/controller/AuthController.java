package com.splitmate.auth.controller;

import com.splitmate.auth.dto.AuthResponse;
import com.splitmate.auth.dto.CurrentUserResponse;
import com.splitmate.auth.dto.LoginRequest;
import com.splitmate.auth.dto.RegisterRequest;
import com.splitmate.auth.service.AuthService;
import com.splitmate.common.response.ApiResponse;
import com.splitmate.common.security.CustomUserDetails;
import com.splitmate.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @GetMapping("/hello")
    public ResponseEntity<?> hello(){
        return ResponseEntity.ok("hello");
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse authResponse = authService.register(request);
        System.out.println("user hitting register controller");
        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("Registered successfully")
                .data(authResponse)
                .build());

//        System.out.println("REGISTER HIT");
//
//        return ResponseEntity.ok("working");
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.login(request);

        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("Logged in successfully")
                .data(authResponse)
                .build());
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<CurrentUserResponse>> me(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        CurrentUserResponse currentUser = new CurrentUserResponse(user.getId(), user.getName(), user.getEmail());

        return ResponseEntity.ok(ApiResponse.<CurrentUserResponse>builder()
                .success(true)
                .message("Current user fetched successfully")
                .data(currentUser)
                .build());
    }
}
