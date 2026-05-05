package com.ecotrack.controller;

import com.ecotrack.dto.PickupRequestDTO;
import com.ecotrack.dto.PickupResponseDTO;
import com.ecotrack.service.PickupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pickup")
@RequiredArgsConstructor
public class PickupController {

    private final PickupService pickupService;

    // POST /api/pickup/request — create a pickup request
    @PostMapping("/request")
    public ResponseEntity<PickupResponseDTO> createPickup(
            @Valid @RequestBody PickupRequestDTO dto) {
        PickupResponseDTO response = pickupService.createPickupRequest(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET /api/pickup/user — current user's pickups only
    @GetMapping("/user")
    public ResponseEntity<List<PickupResponseDTO>> getUserPickups() {
        return ResponseEntity.ok(pickupService.getUserPickups());
    }
}
