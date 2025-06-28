package com.gymcoach.backend_gym.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutExercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long exerciseId;

    @Column(nullable = false)
    private int repetitions;

    @Column(nullable = false)
    private int series;

    @Column(nullable = false)
    private int pause; // en secondes

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_id")
    private Workout workout;
} 