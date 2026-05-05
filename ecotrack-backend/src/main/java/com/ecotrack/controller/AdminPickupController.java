package com.ecotrack.controller;

import com.ecotrack.dto.PickupResponseDTO;
import com.ecotrack.dto.PickupStatusUpdateDTO;
import com.ecotrack.service.PickupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminPickupController {

    private final PickupService pickupService;

    // GET /api/admin/pickups?page=0&size=10
    // Admin only — returns all pickups paginated
    @GetMapping("/pickups")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<PickupResponseDTO>> getAllPickups(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(pickupService.getAllPickups(page, size));
    }

    // PUT /api/admin/pickup/{id}/status
    // Admin only — update pickup status
    @PutMapping("/pickup/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PickupResponseDTO> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody PickupStatusUpdateDTO dto) {
        return ResponseEntity.ok(pickupService.updatePickupStatus(id, dto));
    }
}
