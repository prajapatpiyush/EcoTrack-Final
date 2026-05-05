package com.ecotrack.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DashboardResponse {

    // Wallet summary
    private int totalPoints;
    private double totalMoney;

    // Activity summary
    private double totalWasteKg;
    private int totalSubmissions;

    // Recent activity (last 5)
    private List<WasteSubmissionResponse> recentSubmissions;
    private List<TransactionResponse> recentTransactions;
}
