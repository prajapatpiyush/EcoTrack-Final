package com.ecotrack.service;

import com.ecotrack.dto.AdminDashboardDTO;
import com.ecotrack.entity.Inventory;
import com.ecotrack.entity.Role;
import com.ecotrack.entity.WasteType;
import com.ecotrack.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final UserRepository             userRepository;
    private final WasteSubmissionRepository  wasteSubmissionRepository;
    private final PickupRequestRepository    pickupRequestRepository;
    private final WasteBatchRepository       wasteBatchRepository;
    private final RecyclerRepository         recyclerRepository;
    private final InventoryService           inventoryService;
    private final CompanyPickupRepository    companyPickupRepository;

    // Revenue simulation rate (₹ per kg of processed waste)
    private static final double REVENUE_RATE_PER_KG = 3.0;

    public AdminDashboardDTO getDashboard() {

        // ── User counts ────────────────────────────────────────────────────────
        long totalUsers     = userRepository.count();
        long totalCitizens  = userRepository.countByRole(Role.CITIZEN);
        long totalCompanies = userRepository.countByRole(Role.COMPANY);

        // ── Waste: sum weight across all citizen submissions ───────────────────
        double totalWasteCollected = wasteSubmissionRepository.sumAllWeight();

        // ── Pickups ────────────────────────────────────────────────────────────
        long totalPickups   = pickupRequestRepository.count();
        long pendingPickups = pickupRequestRepository.countByStatus(
                com.ecotrack.entity.PickupStatus.PENDING);

        // ── Revenue simulation: processedKg × REVENUE_RATE ────────────────────
        double processedKg  = wasteBatchRepository.sumProcessedQuantity();
        double totalRevenue = processedKg * REVENUE_RATE_PER_KG;

        // ── Recyclers & batches ────────────────────────────────────────────────
        long totalRecyclers = recyclerRepository.count();
        long totalBatches   = wasteBatchRepository.count();

        // ── Waste by type (citizen submissions) ───────────────────────────────
        Map<String, Double> wasteByType = new HashMap<>();
        for (WasteType type : WasteType.values()) {
            double kg = wasteSubmissionRepository.sumWeightByWasteType(type);
            wasteByType.put(type.name(), kg);
        }

        // ── Inventory snapshot ─────────────────────────────────────────────────
        Map<String, Double> inventoryByType = new HashMap<>();
        List<Inventory> inventory = inventoryService.getAllInventory();
        for (Inventory inv : inventory) {
            inventoryByType.put(inv.getWasteType().name(), inv.getTotalQuantity());
        }
        // Fill zeros for types not yet in inventory
        for (WasteType type : WasteType.values()) {
            inventoryByType.putIfAbsent(type.name(), 0.0);
        }

        return AdminDashboardDTO.builder()
                .totalUsers(totalUsers)
                .totalCitizens(totalCitizens)
                .totalCompanies(totalCompanies)
                .totalWasteCollected(totalWasteCollected)
                .totalPickups(totalPickups)
                .pendingPickups(pendingPickups)
                .totalRevenue(totalRevenue)
                .totalRecyclers(totalRecyclers)
                .totalBatches(totalBatches)
                .wasteByType(wasteByType)
                .inventoryByType(inventoryByType)
                .build();
    }
}
