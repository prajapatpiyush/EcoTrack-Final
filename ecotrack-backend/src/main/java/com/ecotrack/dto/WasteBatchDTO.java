package com.ecotrack.dto;

import com.ecotrack.entity.WasteType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class WasteBatchDTO {

    @NotNull(message = "Waste type is required")
    private WasteType wasteType;

    @Positive(message = "Quantity must be greater than 0")
    private double quantity;

    // Optional: set recycler at creation or via separate assign call
    private Long recyclerId;
}
