package com.gymcoach.backend_gym.repository;

import com.gymcoach.backend_gym.model.CoachInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoachInfoRepository extends JpaRepository<CoachInfo, Integer> {
    CoachInfo findByUserId(Integer userId);
} 