package com.ecotrack.service;

import com.ecotrack.config.ResourceNotFoundException;
import com.ecotrack.dto.WasteBatchDTO;
import com.ecotrack.dto.WasteBatchResponseDTO;
import com.ecotrack.entity.BatchStatus;
import com.ecotrack.entity.Recycler;
import com.ecotrack.entity.WasteBatch;
import com.ecotrack.repository.WasteBatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WasteBatchService {

    private final WasteBatchRepository wasteBatchRepository;
    private final InventoryService inventoryService;
    private final RecyclerService recyclerService;

    // ─── Create batch (admin) ─────────────────────────────────────────────────
    // Validates inventory availability and deducts from inventory
    @Transactional
    public WasteBatchResponseDTO createBatch(WasteBatchDTO dto) {
        // Deducts quantity from inventory — throws if insufficient
        inventoryService.deductFromInventory(dto.getWasteType(), dto.getQuantity());

        WasteBatch batch = WasteBatch.builder()
                .wasteType(dto.getWasteType())
                .quantity(dto.getQuantity())
                .status(BatchStatus.CREATED)
                .build();

        // Optionally assign recycler at creation time
        if (dto.getRecyclerId() != null) {
            Recycler recycler = recyclerService.getRecyclerEntityById(dto.getRecyclerId());
            batch.setRecycler(recycler);
            batch.setStatus(BatchStatus.ASSIGNED);
        }

        wasteBatchRepository.save(batch);
        return toDTO(batch);
    }

    // ─── Assign recycler to existing batch (admin) ────────────────────────────
    @Transactional
    public WasteBatchResponseDTO assignRecycler(Long batchId, Long recyclerId) {
        WasteBatch batch = wasteBatchRepository.findById(batchId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Batch not found with id: " + batchId));

        if (batch.getStatus() == BatchStatus.PROCESSED) {
            throw new IllegalArgumentException("Cannot reassign a PROCESSED batch");
        }

        Recycler recycler = recyclerService.getRecyclerEntityById(recyclerId);
        batch.setRecycler(recycler);
        batch.setStatus(BatchStatus.ASSIGNED);
        wasteBatchRepository.save(batch);
        return toDTO(batch);
    }

    // ─── Mark batch as PROCESSED (admin) ─────────────────────────────────────
    @Transactional
    public WasteBatchResponseDTO markProcessed(Long batchId) {
        WasteBatch batch = wasteBatchRepository.findById(batchId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Batch not found with id: " + batchId));

        if (batch.getStatus() != BatchStatus.ASSIGNED) {
            throw new IllegalArgumentException(
                    "Only ASSIGNED batches can be marked as PROCESSED");
        }
        batch.setStatus(BatchStatus.PROCESSED);
        wasteBatchRepository.save(batch);
        return toDTO(batch);
    }

    // ─── Get all batches ──────────────────────────────────────────────────────
    public List<WasteBatchResponseDTO> getAllBatches() {
        return wasteBatchRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ─── Helper ───────────────────────────────────────────────────────────────
    private WasteBatchResponseDTO toDTO(WasteBatch b) {
        return WasteBatchResponseDTO.builder()
                .id(b.getId())
                .wasteType(b.getWasteType())
                .quantity(b.getQuantity())
                .status(b.getStatus())
                .recyclerId(b.getRecycler() != null ? b.getRecycler().getId() : null)
                .recyclerName(b.getRecycler() != null ? b.getRecycler().getName() : null)
                .createdAt(b.getCreatedAt())
                .build();
    }
}
