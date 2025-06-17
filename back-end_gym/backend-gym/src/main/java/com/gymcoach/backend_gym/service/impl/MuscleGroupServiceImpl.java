package com.gymcoach.backend_gym.service.impl;

import com.gymcoach.backend_gym.dto.MuscleGroupDTO;
import com.gymcoach.backend_gym.model.MuscleGroup;
import com.gymcoach.backend_gym.repository.MuscleGroupRepository;
import com.gymcoach.backend_gym.service.MuscleGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MuscleGroupServiceImpl implements MuscleGroupService {

    private final MuscleGroupRepository muscleGroupRepository;

    @Autowired
    public MuscleGroupServiceImpl(MuscleGroupRepository muscleGroupRepository) {
        this.muscleGroupRepository = muscleGroupRepository;
    }

    @Override
    public List<MuscleGroupDTO> getAllMuscleGroups() {
        List<MuscleGroup> muscleGroups = muscleGroupRepository.findAll();
        return muscleGroups.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private MuscleGroupDTO convertToDTO(MuscleGroup muscleGroup) {
        return new MuscleGroupDTO(
            muscleGroup.getId(),
            muscleGroup.getLabel(),
            muscleGroup.getDescription()
        );
    }
} 