package com.ecotrack.dto;

import com.ecotrack.entity.WasteType;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CompanyPickupRequestDTO {

    @NotNull(message = "Waste type is required")
    private WasteType wasteType;

    @Positive(message = "Weight must be greater than 0")
    private double weight;

    @NotNull(message = "Pickup date is required")
    @Future(message = "Pickup date must be in the future")
    private LocalDateTime pickupDate;
}
