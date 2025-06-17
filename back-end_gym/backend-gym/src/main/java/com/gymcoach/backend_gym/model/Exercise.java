// src/main/java/com/gymcoach/backend_gym/model/Exercise.java
package com.gymcoach.backend_gym.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "exercise")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Exercise {

    public enum Difficulty {
        BEGINNER, INTERMEDIATE, ADVANCED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_exercise")
    private Integer id;

    @NotBlank @Size(min = 2, max = 100)
    @Column(nullable = false, length = 100)
    private String name;

    @Size(max = 500)
    @Column(length = 500)
    private String description;

    @URL @Column(name = "exercise_url", length = 255)
    private String exerciseUrl;

    @Size(max = 200) @Column(length = 200)
    private String equipment;

    @Size(max = 2000) @Column(length = 2000)
    private String instructions;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Difficulty difficulty;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_muscle_group", nullable = false)
    private MuscleGroup muscleGroup;

    @Size(max = 100) @Column(name = "muscle_subgroup", length = 100)
    private String muscleSubgroup;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_coach", nullable = false)
    private User coach;

    @CreationTimestamp @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
