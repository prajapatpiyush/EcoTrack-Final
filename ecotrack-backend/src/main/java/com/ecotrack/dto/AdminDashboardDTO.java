package com.ecotrack.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class AdminDashboardDTO {

    private long totalUsers;
    private long totalCitizens;
    private long totalCompanies;
    private double totalWasteCollected;   // kg across all submissions
    private long totalPickups;            // citizen pickups
    private long pendingPickups;
    private double totalRevenue;          // simulated ₹ from processed batches
    private long totalRecyclers;
    private long totalBatches;

    // Waste breakdown by type (key = WasteType name, value = kg)
    private Map<String, Double> wasteByType;

    // Inventory snapshot (key = WasteType name, value = kg in stock)
    private Map<String, Double> inventoryByType;
}
