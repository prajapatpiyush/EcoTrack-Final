package com.ecotrack.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WalletResponse {

    private int totalPoints;
    private double totalMoney;
}
