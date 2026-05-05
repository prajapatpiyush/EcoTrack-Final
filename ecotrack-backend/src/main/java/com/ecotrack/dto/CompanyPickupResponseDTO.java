package com.ecotrack.dto;

import com.ecotrack.entity.PickupStatus;
import com.ecotrack.entity.WasteType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CompanyPickupResponseDTO {

    private Long id;
    private WasteType wasteType;
    private double weight;
    private LocalDateTime pickupDate;
    private PickupStatus status;
    private LocalDateTime createdAt;
}
