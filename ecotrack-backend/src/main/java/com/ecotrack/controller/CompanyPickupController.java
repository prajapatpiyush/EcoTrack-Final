package com.ecotrack.controller;

import com.ecotrack.dto.CompanyPickupRequestDTO;
import com.ecotrack.dto.CompanyPickupResponseDTO;
import com.ecotrack.service.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/company")
@RequiredArgsConstructor
public class CompanyPickupController {

    private final CompanyService companyService;

    // POST /api/company/pickup — schedule a bulk pickup
    @PostMapping("/pickup")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<CompanyPickupResponseDTO> schedulePickup(
            @Valid @RequestBody CompanyPickupRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(companyService.schedulePickup(dto));
    }

    // GET /api/company/pickups — get own company pickups
    @GetMapping("/pickups")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<List<CompanyPickupResponseDTO>> getPickups() {
        return ResponseEntity.ok(companyService.getMyPickups());
    }
}
