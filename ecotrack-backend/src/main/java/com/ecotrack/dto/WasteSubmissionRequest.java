package com.ecotrack.dto;

import com.ecotrack.entity.WasteType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class WasteSubmissionRequest {

    @NotNull(message = "Waste type is required")
    private WasteType wasteType;

    @Positive(message = "Weight must be greater than 0")
    private double weight;
}
