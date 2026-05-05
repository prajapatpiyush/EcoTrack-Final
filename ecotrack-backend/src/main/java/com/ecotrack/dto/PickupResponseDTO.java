package com.ecotrack.dto;

import com.ecotrack.entity.PickupStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PickupResponseDTO {

    private Long id;
    private String address;
    private LocalDateTime pickupDate;
    private PickupStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Phase 3 fix: audit
    private String updatedBy;

    // Admin view fields
    private String userName;
    private String userEmail;
}
