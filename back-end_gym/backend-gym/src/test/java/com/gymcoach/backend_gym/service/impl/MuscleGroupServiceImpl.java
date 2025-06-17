package com.gymcoach.backend_gym.service.impl;

import com.gymcoach.backend_gym.dto.MuscleGroupDTO;
import com.gymcoach.backend_gym.model.MuscleGroup;
import com.gymcoach.backend_gym.repository.MuscleGroupRepository;
import com.gymcoach.backend_gym.service.MuscleGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MuscleGroupServiceImpl implements MuscleGroupService {

    private final MuscleGroupRepository muscleGroupRepository;

    /**
     * Récupère tous les groupes musculaires et les convertit en DTO.
     */
    @Override
    @Transactional(readOnly = true)
    public List<MuscleGroupDTO> getAllMuscleGroups() {
        List<MuscleGroup> entities = muscleGroupRepository.findAll();
        return entities.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Mapping entité → DTO.
     */
    private MuscleGroupDTO toDTO(MuscleGroup mg) {
        return MuscleGroupDTO.builder()
                .id(mg.getId())
                .label(mg.getLabel())
                .description(mg.getDescription())
                .build();
    }
}
