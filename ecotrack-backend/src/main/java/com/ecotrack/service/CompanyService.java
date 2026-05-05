package com.ecotrack.service;

import com.ecotrack.config.ResourceNotFoundException;
import com.ecotrack.config.UnauthorizedException;
import com.ecotrack.dto.CompanyPickupRequestDTO;
import com.ecotrack.dto.CompanyPickupResponseDTO;
import com.ecotrack.dto.CompanyProfileDTO;
import com.ecotrack.entity.*;
import com.ecotrack.repository.CompanyPickupRepository;
import com.ecotrack.repository.CompanyProfileRepository;
import com.ecotrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyProfileRepository companyProfileRepository;
    private final CompanyPickupRepository companyPickupRepository;
    private final UserRepository userRepository;
    private final InventoryService inventoryService;

    // ─── Get or create company profile ────────────────────────────────────────
    public CompanyProfileDTO getProfile() {
        User user = getAuthenticatedCompanyUser();
        CompanyProfile profile = companyProfileRepository.findByUser(user)
                .orElseGet(() -> {
                    // Auto-create a profile if none exists yet
                    CompanyProfile newProfile = CompanyProfile.builder()
                            .user(user)
                            .companyName(user.getName() + " Company")
                            .subscriptionType(SubscriptionType.BASIC)
                            .build();
                    return companyProfileRepository.save(newProfile);
                });
        return toProfileDTO(profile);
    }

    // ─── Update company profile ────────────────────────────────────────────────
    @Transactional
    public CompanyProfileDTO updateProfile(CompanyProfileDTO dto) {
        User user = getAuthenticatedCompanyUser();
        CompanyProfile profile = companyProfileRepository.findByUser(user)
                .orElseGet(() -> CompanyProfile.builder()
                        .user(user)
                        .build());

        profile.setCompanyName(dto.getCompanyName().trim());
        if (dto.getSubscriptionType() != null) {
            profile.setSubscriptionType(dto.getSubscriptionType());
        }
        companyProfileRepository.save(profile);
        return toProfileDTO(profile);
    }

    // ─── Schedule a bulk pickup ────────────────────────────────────────────────
    @Transactional
    public CompanyPickupResponseDTO schedulePickup(CompanyPickupRequestDTO dto) {
        // weight range validation
        if (dto.getWeight() <= 0 || dto.getWeight() >= 1000) {
            throw new IllegalArgumentException("Weight must be between 0 and 1000 kg");
        }
        if (dto.getPickupDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Pickup date must be in the future");
        }

        User user = getAuthenticatedCompanyUser();
        CompanyProfile profile = companyProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Company profile not found. Please update your profile first."));

        CompanyPickup pickup = CompanyPickup.builder()
                .company(profile)
                .wasteType(dto.getWasteType())
                .weight(dto.getWeight())
                .pickupDate(dto.getPickupDate())
                .status(PickupStatus.PENDING)
                .build();
        companyPickupRepository.save(pickup);

        // Update inventory when company pickup is recorded
        inventoryService.addToInventory(dto.getWasteType(), dto.getWeight());

        return toPickupDTO(pickup);
    }

    // ─── Get company's own pickups ─────────────────────────────────────────────
    public List<CompanyPickupResponseDTO> getMyPickups() {
        User user = getAuthenticatedCompanyUser();
        CompanyProfile profile = companyProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));
        return companyPickupRepository.findByCompanyOrderByCreatedAtDesc(profile)
                .stream()
                .map(this::toPickupDTO)
                .collect(Collectors.toList());
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────
    private User getAuthenticatedCompanyUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getRole() != Role.COMPANY) {
            throw new UnauthorizedException("Access restricted to COMPANY role");
        }
        return user;
    }

    private CompanyProfileDTO toProfileDTO(CompanyProfile p) {
        return CompanyProfileDTO.builder()
                .id(p.getId())
                .companyName(p.getCompanyName())
                .subscriptionType(p.getSubscriptionType())
                .userEmail(p.getUser().getEmail())
                .createdAt(p.getCreatedAt())
                .build();
    }

    private CompanyPickupResponseDTO toPickupDTO(CompanyPickup p) {
        return CompanyPickupResponseDTO.builder()
                .id(p.getId())
                .wasteType(p.getWasteType())
                .weight(p.getWeight())
                .pickupDate(p.getPickupDate())
                .status(p.getStatus())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
