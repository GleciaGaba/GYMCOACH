package com.gymcoach.backend_gym.dto;

import lombok.Data;
import lombok.Builder;
import java.time.LocalDateTime;

@Data
@Builder
public class AthleteDTO {
    private Integer id;
    private String firstName;
    private String lastName;
    private String email;
    private String logoUrl;
    private LocalDateTime lastProgramExpiresAt;
    private boolean isActive;
} 