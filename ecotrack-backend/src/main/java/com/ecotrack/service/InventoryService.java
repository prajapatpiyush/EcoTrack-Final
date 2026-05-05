package com.ecotrack.service;

import com.ecotrack.entity.Inventory;
import com.ecotrack.entity.WasteType;
import com.ecotrack.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    // Called when citizen or company submits waste
    @Transactional
    public void addToInventory(WasteType wasteType, double quantity) {
        Inventory inventory = inventoryRepository.findByWasteType(wasteType)
                .orElseGet(() -> Inventory.builder()
                        .wasteType(wasteType)
                        .totalQuantity(0.0)
                        .build());
        inventory.setTotalQuantity(inventory.getTotalQuantity() + quantity);
        inventoryRepository.save(inventory);
    }

    // Called when a WasteBatch is created (deduct from inventory)
    @Transactional
    public void deductFromInventory(WasteType wasteType, double quantity) {
        Inventory inventory = inventoryRepository.findByWasteType(wasteType)
                .orElseThrow(() -> new IllegalStateException(
                        "No inventory found for waste type: " + wasteType));
        if (inventory.getTotalQuantity() < quantity) {
            throw new IllegalArgumentException(
                    "Insufficient inventory. Available: "
                            + inventory.getTotalQuantity() + " kg");
        }
        inventory.setTotalQuantity(inventory.getTotalQuantity() - quantity);
        inventoryRepository.save(inventory);
    }

    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }
}
