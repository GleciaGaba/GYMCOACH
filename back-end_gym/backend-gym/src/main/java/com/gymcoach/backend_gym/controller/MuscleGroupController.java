package com.gymcoach.backend_gym.controller;

import com.gymcoach.backend_gym.dto.MuscleGroupDTO;
import com.gymcoach.backend_gym.service.MuscleGroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/muscle-groups")
public class MuscleGroupController {
    private final MuscleGroupService muscleGroupService;

    public MuscleGroupController(MuscleGroupService muscleGroupService) {
        this.muscleGroupService = muscleGroupService;
    }

    @GetMapping
    public ResponseEntity<List<MuscleGroupDTO>> getAllMuscleGroups() {
        return ResponseEntity.ok(muscleGroupService.getAllMuscleGroups());
    }
} 