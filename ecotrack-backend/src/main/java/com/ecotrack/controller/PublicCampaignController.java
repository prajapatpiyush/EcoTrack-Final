package com.ecotrack.controller;

import com.ecotrack.dto.CampaignDTO;
import com.ecotrack.service.CampaignService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PublicCampaignController {

    private final CampaignService campaignService;

    // GET /api/public/campaigns — public, no auth
    @GetMapping("/api/public/campaigns")
    public ResponseEntity<List<CampaignDTO>> getCampaigns() {
        return ResponseEntity.ok(campaignService.getAllCampaigns());
    }

    // POST /api/admin/campaign — admin only
    @PostMapping("/api/admin/campaign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CampaignDTO> createCampaign(@Valid @RequestBody CampaignDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(campaignService.createCampaign(dto));
    }

    // DELETE /api/admin/campaign/{id} — admin only
    @DeleteMapping("/api/admin/campaign/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCampaign(@PathVariable Long id) {
        campaignService.deleteCampaign(id);
        return ResponseEntity.noContent().build();
    }
}
