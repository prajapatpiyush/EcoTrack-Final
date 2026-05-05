package com.ecotrack.dto;

import com.ecotrack.entity.TransactionType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TransactionResponse {

    private Long id;
    private TransactionType type;
    private int points;
    private double money;
    private String description;
    private LocalDateTime createdAt;
}
