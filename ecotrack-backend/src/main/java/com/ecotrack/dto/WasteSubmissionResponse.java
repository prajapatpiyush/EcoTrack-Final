package com.ecotrack.dto;

import com.ecotrack.entity.WasteType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class WasteSubmissionResponse {

    private Long id;
    private WasteType wasteType;
    private double weight;
    private int rewardPoints;
    private double rewardMoney;
    private LocalDateTime createdAt;
}
