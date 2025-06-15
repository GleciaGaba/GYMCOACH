package com.gymcoach.backend_gym.repository;

import com.gymcoach.backend_gym.model.CoachInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CoachInfoRepository extends JpaRepository<CoachInfo, Integer> {
    @Query("SELECT ci FROM CoachInfo ci WHERE ci.user.id = :userId")
    CoachInfo findByUserId(@Param("userId") Integer userId);
} 