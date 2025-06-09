package com.gymcoach.backend_gym.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "coach_info")
public class CoachInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_coach_info")
    private Integer id;

    @Column(name = "bio")
    private String bio;

    @Column(name = "academic_diplome")
    private String academicDiplome;

    @Column(name = "specialization")
    private String specialization;

    @Column(name = "certificat")
    private String certificat;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "customer_number")
    private String customerNumber;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_user")
    private User user;
} 