package com.ecotrack.controller;

import com.ecotrack.dto.WasteSubmissionRequest;
import com.ecotrack.dto.WasteSubmissionResponse;
import com.ecotrack.service.WasteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/waste")
@RequiredArgsConstructor
public class WasteController {

    private final WasteService wasteService;

    // POST /api/waste/submit
    @PostMapping("/submit")
    public ResponseEntity<WasteSubmissionResponse> submitWaste(
            @Valid @RequestBody WasteSubmissionRequest request
    ) {
        WasteSubmissionResponse response = wasteService.submitWaste(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET /api/waste/my-submissions
    @GetMapping("/my-submissions")
    public ResponseEntity<List<WasteSubmissionResponse>> getMySubmissions() {
        return ResponseEntity.ok(wasteService.getMySubmissions());
    }
}
