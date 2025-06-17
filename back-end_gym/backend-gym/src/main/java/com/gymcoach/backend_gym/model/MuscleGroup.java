package com.gymcoach.backend_gym.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "muscle_group")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class MuscleGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_muscle_group")
    private Integer id;

    @NotBlank(message = "Le label est obligatoire")
    @Size(min = 2, max = 50, message = "Le label doit contenir entre 2 et 50 caractères")
    @Column(nullable = false, length = 50)
    private String label;

    @Size(max = 255, message = "La description ne doit pas dépasser 255 caractères")
    @Column(length = 255)
    private String description;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
