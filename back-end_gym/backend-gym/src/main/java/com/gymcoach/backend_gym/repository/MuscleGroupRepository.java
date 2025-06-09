package com.gymcoach.backend_gym.repository;

import com.gymcoach.backend_gym.model.MuscleGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MuscleGroupRepository extends JpaRepository<MuscleGroup, Integer> {
} 