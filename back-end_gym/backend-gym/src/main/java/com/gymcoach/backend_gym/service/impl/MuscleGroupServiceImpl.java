package com.gymcoach.backend_gym.service.impl;

import com.gymcoach.backend_gym.dto.MuscleGroupDTO;
import com.gymcoach.backend_gym.model.MuscleGroup;
import com.gymcoach.backend_gym.repository.MuscleGroupRepository;
import com.gymcoach.backend_gym.service.MuscleGroupService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MuscleGroupServiceImpl implements MuscleGroupService {
    private final MuscleGroupRepository muscleGroupRepository;

    public MuscleGroupServiceImpl(MuscleGroupRepository muscleGroupRepository) {
        this.muscleGroupRepository = muscleGroupRepository;
    }

    @Override
    public List<MuscleGroupDTO> getAllMuscleGroups() {
        return muscleGroupRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private MuscleGroupDTO toDTO(MuscleGroup muscleGroup) {
        return MuscleGroupDTO.builder()
                .id(muscleGroup.getId())
                .label(muscleGroup.getLabel())
                .description(muscleGroup.getDescription())
                .createdAt(muscleGroup.getCreatedAt())
                .updatedAt(muscleGroup.getUpdatedAt())
                .build();
    }
} 