package com.gymcoach.backend_gym.controller;

import com.gymcoach.backend_gym.dto.ChangePasswordRequest;
import com.gymcoach.backend_gym.dto.RegisterSportifRequest;
import com.gymcoach.backend_gym.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register-sportif")
    public ResponseEntity<Void> registerSportif(
            @Valid @RequestBody RegisterSportifRequest request,
            Authentication auth) {
        userService.registerSportif(request, auth.getName());
        return ResponseEntity.status(201).build();
    }

    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication auth) {
        userService.changePassword(auth.getName(), request);
        return ResponseEntity.ok().build();
    }
} 