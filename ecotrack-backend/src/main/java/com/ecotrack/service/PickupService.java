package com.ecotrack.service;

import com.ecotrack.config.ResourceNotFoundException;
import com.ecotrack.dto.PickupRequestDTO;
import com.ecotrack.dto.PickupResponseDTO;
import com.ecotrack.dto.PickupStatusUpdateDTO;
import com.ecotrack.entity.PickupRequest;
import com.ecotrack.entity.PickupStatus;
import com.ecotrack.entity.User;
import com.ecotrack.repository.PickupRequestRepository;
import com.ecotrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PickupService {

    private final PickupRequestRepository pickupRequestRepository;
    private final UserRepository userRepository;

    // ─── Create Pickup Request ─────────────────────────────────────────────────
    @Transactional
    public PickupResponseDTO createPickupRequest(PickupRequestDTO dto) {
        // FIX: address length validation (5–255)
        String address = dto.getAddress().trim();
        if (address.length() < 5 || address.length() > 255) {
            throw new IllegalArgumentException("Address must be between 5 and 255 characters");
        }

        if (dto.getPickupDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Pickup date must be in the future");
        }

        User user = getAuthenticatedUser();

        PickupRequest pickup = PickupRequest.builder()
                .user(user)
                .address(address)
                .pickupDate(dto.getPickupDate())
                .status(PickupStatus.PENDING)
                .build();

        pickupRequestRepository.save(pickup);
        return toResponse(pickup);
    }

    // ─── Get Current User's Pickups (default: createdAt DESC) ─────────────────
    public List<PickupResponseDTO> getUserPickups() {
        User user = getAuthenticatedUser();
        return pickupRequestRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ─── Get All Pickups (Admin, paginated, sorted DESC) ──────────────────────
    public Page<PickupResponseDTO> getAllPickups(int page, int size) {
        // FIX: enforce default sort createdAt DESC
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.DESC, "createdAt"));
        return pickupRequestRepository.findAll(pageable)
                .map(this::toAdminResponse);
    }

    // ─── Update Pickup Status (Admin) ─────────────────────────────────────────
    @Transactional
    public PickupResponseDTO updatePickupStatus(Long id, PickupStatusUpdateDTO dto) {
        PickupRequest pickup = pickupRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Pickup request not found with id: " + id));

        // FIX: validate status transitions
        validateStatusTransition(pickup.getStatus(), dto.getStatus());

        // FIX: record who updated (updatedBy = admin email)
        String adminEmail = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        pickup.setStatus(dto.getStatus());
        pickup.setUpdatedBy(adminEmail);
        // @UpdateTimestamp handles updatedAt automatically

        pickupRequestRepository.save(pickup);
        return toAdminResponse(pickup);
    }

    // ─── Status Transition Validation ─────────────────────────────────────────
    // FIX: PENDING→ASSIGNED, ASSIGNED→COMPLETED, Any→CANCELLED, COMPLETED→block
    private void validateStatusTransition(PickupStatus current, PickupStatus next) {
        if (current == PickupStatus.COMPLETED) {
            throw new IllegalArgumentException(
                    "Cannot change status of a COMPLETED pickup");
        }
        if (next == PickupStatus.CANCELLED) return; // any → CANCELLED always allowed

        boolean valid = switch (current) {
            case PENDING   -> next == PickupStatus.ASSIGNED;
            case ASSIGNED  -> next == PickupStatus.COMPLETED;
            case CANCELLED -> false;
            default        -> false;
        };

        if (!valid) {
            throw new IllegalArgumentException(
                    "Invalid status transition: " + current + " → " + next);
        }
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────
    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Authenticated user not found"));
    }

    private PickupResponseDTO toResponse(PickupRequest p) {
        return PickupResponseDTO.builder()
                .id(p.getId())
                .address(p.getAddress())
                .pickupDate(p.getPickupDate())
                .status(p.getStatus())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }

    private PickupResponseDTO toAdminResponse(PickupRequest p) {
        return PickupResponseDTO.builder()
                .id(p.getId())
                .address(p.getAddress())
                .pickupDate(p.getPickupDate())
                .status(p.getStatus())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .updatedBy(p.getUpdatedBy())
                .userName(p.getUser().getName())
                .userEmail(p.getUser().getEmail())
                .build();
    }
}
