package com.gymcoach.backend_gym.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class CoachDTO {
    private Integer id;
    private String firstName;
    private String lastName;
    private String email;
    private String logoUrl;
    private String specialization;
    private String description;
    private Double rating;
    private Integer numberOfAthletes;
    // Champs CoachInfo
    private String bio;
    private String academicDiplome;
    private String certificat;
    private Integer experienceYears;
    private String customerNumber;
    private String linkedinUrl;
} 