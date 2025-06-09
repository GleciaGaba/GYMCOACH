package com.gymcoach.backend_gym.service;

import com.gymcoach.backend_gym.dto.CoachDTO;
import com.gymcoach.backend_gym.dto.AthleteDTO;
import com.gymcoach.backend_gym.model.User;
import com.gymcoach.backend_gym.model.Coach;
import com.gymcoach.backend_gym.repository.UserRepository;
import com.gymcoach.backend_gym.repository.ProgramRepository;
import com.gymcoach.backend_gym.repository.CoachRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CoachService {

    private final UserRepository userRepository;
    private final ProgramRepository programRepository;
    private final CoachRepository coachRepository;

    public CoachService(UserRepository userRepository, ProgramRepository programRepository, CoachRepository coachRepository) {
        this.userRepository = userRepository;
        this.programRepository = programRepository;
        this.coachRepository = coachRepository;
    }

    /**
     * Récupère la liste des coachs du sportif connecté
     */
    public List<CoachDTO> getMyCoaches() {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Récupère les coachs associés au sportif via la table de liaison
        List<Coach> coachLinks = coachRepository.findByAthleteId(currentUser.getId());
        return coachLinks.stream()
                .map(link -> link.getCoach())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Convertit une entité User en CoachDTO
     */
    private CoachDTO convertToDTO(User coach) {
        return CoachDTO.builder()
                .id(coach.getId())
                .firstName(coach.getFirstName())
                .lastName(coach.getLastName())
                .email(coach.getEmail())
                .logoUrl(coach.getLogoUrl())
                // Ces champs devront être ajoutés à l'entité User si nécessaire
                .specialization(null)
                .description(null)
                .rating(null)
                .numberOfAthletes(null)
                .build();
    }

    /**
     * Récupère la liste des sportifs du coach connecté
     */
    public List<AthleteDTO> getMyAthletes() {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Récupère les sportifs associés au coach via la table de liaison
        List<Coach> coachLinks = coachRepository.findByCoachId(currentUser.getId());
        List<User> athletes = coachLinks.stream().map(Coach::getAthlete).collect(Collectors.toList());

        return athletes.stream()
                .map(this::convertToAthleteDTO)
                .collect(Collectors.toList());
    }

    /**
     * Convertit une entité User en AthleteDTO
     */
    private AthleteDTO convertToAthleteDTO(User athlete) {
        return AthleteDTO.builder()
                .id(athlete.getId())
                .firstName(athlete.getFirstName())
                .lastName(athlete.getLastName())
                .email(athlete.getEmail())
                .logoUrl(athlete.getLogoUrl())
                .lastProgramExpiresAt(programRepository.findLastProgramExpiresAtByUserId(athlete.getId()))
                .isActive(Boolean.TRUE.equals(athlete.getIsActive()))
                .build();
    }
} 