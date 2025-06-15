package com.gymcoach.backend_gym.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "exercise")
public class Exercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_exercise")
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "exercise_description")
    private String description;

    @Column(name = "exercise_url")
    private String exerciseUrl;

    @Column(name = "equipment")
    private String equipment;

    @Column(name = "instructions")
    private String instructions;

    @Column(name = "difficulty")
    private String difficulty;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_user", nullable = false)
    private User coach;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_muscle_group", nullable = false)
    private MuscleGroup muscleGroup;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 