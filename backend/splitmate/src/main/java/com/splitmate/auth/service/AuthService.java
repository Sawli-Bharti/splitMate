package com.splitmate.auth.service;

import com.splitmate.auth.dto.AuthResponse;
import com.splitmate.auth.dto.LoginRequest;
import com.splitmate.auth.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
