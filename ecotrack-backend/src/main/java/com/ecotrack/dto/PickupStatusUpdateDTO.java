package com.ecotrack.dto;

import com.ecotrack.entity.PickupStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PickupStatusUpdateDTO {

    @NotNull(message = "Status is required")
    private PickupStatus status;
}
