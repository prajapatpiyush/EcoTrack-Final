package com.ecotrack.controller;

import com.ecotrack.dto.CompanyProfileDTO;
import com.ecotrack.service.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/company")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    // GET /api/company/profile — get own company profile
    @GetMapping("/profile")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<CompanyProfileDTO> getProfile() {
        return ResponseEntity.ok(companyService.getProfile());
    }

    // PUT /api/company/profile — update company profile
    @PutMapping("/profile")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<CompanyProfileDTO> updateProfile(
            @Valid @RequestBody CompanyProfileDTO dto) {
        return ResponseEntity.ok(companyService.updateProfile(dto));
    }
}
