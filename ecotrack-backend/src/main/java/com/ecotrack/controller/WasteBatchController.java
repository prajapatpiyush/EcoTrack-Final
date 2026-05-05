package com.ecotrack.controller;

import com.ecotrack.dto.WasteBatchDTO;
import com.ecotrack.dto.WasteBatchResponseDTO;
import com.ecotrack.service.WasteBatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/batches")
@RequiredArgsConstructor
public class WasteBatchController {

    private final WasteBatchService wasteBatchService;

    // POST /api/admin/batches — create a waste batch from inventory
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<WasteBatchResponseDTO> createBatch(
            @Valid @RequestBody WasteBatchDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(wasteBatchService.createBatch(dto));
    }

    // GET /api/admin/batches — list all batches
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<WasteBatchResponseDTO>> getAllBatches() {
        return ResponseEntity.ok(wasteBatchService.getAllBatches());
    }

    // PUT /api/admin/batches/{id}/assign — assign a recycler
    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<WasteBatchResponseDTO> assignRecycler(
            @PathVariable Long id,
            @RequestBody Map<String, Long> body) {
        Long recyclerId = body.get("recyclerId");
        if (recyclerId == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(wasteBatchService.assignRecycler(id, recyclerId));
    }

    // PUT /api/admin/batches/{id}/process — mark batch as PROCESSED
    @PutMapping("/{id}/process")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<WasteBatchResponseDTO> markProcessed(@PathVariable Long id) {
        return ResponseEntity.ok(wasteBatchService.markProcessed(id));
    }
}
