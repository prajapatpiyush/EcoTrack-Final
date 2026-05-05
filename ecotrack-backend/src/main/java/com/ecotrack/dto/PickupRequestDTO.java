package com.ecotrack.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PickupRequestDTO {

    @NotBlank(message = "Address is required")
    private String address;

    @NotNull(message = "Pickup date is required")
    @Future(message = "Pickup date must be a future date")
    private LocalDateTime pickupDate;
}
