package com.ecotrack.dto;

import com.ecotrack.entity.BatchStatus;
import com.ecotrack.entity.WasteType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class WasteBatchResponseDTO {

    private Long id;
    private WasteType wasteType;
    private double quantity;
    private BatchStatus status;
    private Long recyclerId;
    private String recyclerName;
    private LocalDateTime createdAt;
}
