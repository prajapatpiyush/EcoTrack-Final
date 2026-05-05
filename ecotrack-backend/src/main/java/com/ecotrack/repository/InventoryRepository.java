package com.ecotrack.repository;

import com.ecotrack.entity.Inventory;
import com.ecotrack.entity.WasteType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByWasteType(WasteType wasteType);
}
