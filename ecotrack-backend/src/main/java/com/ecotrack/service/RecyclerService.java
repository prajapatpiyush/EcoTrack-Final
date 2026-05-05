package com.ecotrack.service;

import com.ecotrack.config.ResourceNotFoundException;
import com.ecotrack.dto.RecyclerDTO;
import com.ecotrack.entity.Recycler;
import com.ecotrack.repository.RecyclerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecyclerService {

    private final RecyclerRepository recyclerRepository;

    // ─── Create recycler ──────────────────────────────────────────────────────
    @Transactional
    public RecyclerDTO createRecycler(RecyclerDTO dto) {
        if (recyclerRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException(
                    "Recycler with email already exists: " + dto.getEmail());
        }
        Recycler recycler = Recycler.builder()
                .name(dto.getName().trim())
                .email(dto.getEmail().trim().toLowerCase())
                .wasteTypesAccepted(dto.getWasteTypesAccepted().trim().toUpperCase())
                .build();
        recyclerRepository.save(recycler);
        return toDTO(recycler);
    }

    // ─── Get all recyclers ────────────────────────────────────────────────────
    public List<RecyclerDTO> getAllRecyclers() {
        return recyclerRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ─── Get by ID (used by batch service) ───────────────────────────────────
    public Recycler getRecyclerEntityById(Long id) {
        return recyclerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Recycler not found with id: " + id));
    }

    // ─── Helper ───────────────────────────────────────────────────────────────
    private RecyclerDTO toDTO(Recycler r) {
        return RecyclerDTO.builder()
                .id(r.getId())
                .name(r.getName())
                .email(r.getEmail())
                .wasteTypesAccepted(r.getWasteTypesAccepted())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
