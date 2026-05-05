package com.ecotrack.controller;

import com.ecotrack.dto.RecyclerDTO;
import com.ecotrack.service.RecyclerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/recyclers")
@RequiredArgsConstructor
public class RecyclerController {

    private final RecyclerService recyclerService;

    // POST /api/admin/recyclers — add a new recycling partner
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RecyclerDTO> createRecycler(
            @Valid @RequestBody RecyclerDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(recyclerService.createRecycler(dto));
    }

    // GET /api/admin/recyclers — list all recyclers
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RecyclerDTO>> getAllRecyclers() {
        return ResponseEntity.ok(recyclerService.getAllRecyclers());
    }
}
