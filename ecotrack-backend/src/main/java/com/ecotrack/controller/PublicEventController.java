package com.ecotrack.controller;

import com.ecotrack.dto.EventDTO;
import com.ecotrack.dto.EventResponseDTO;
import com.ecotrack.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PublicEventController {

    private final EventService eventService;

    // GET /api/public/events — public, no auth required
    @GetMapping("/api/public/events")
    public ResponseEntity<List<EventResponseDTO>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    // POST /api/admin/event — admin only
    @PostMapping("/api/admin/event")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponseDTO> createEvent(@Valid @RequestBody EventDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(eventService.createEvent(dto));
    }

    // DELETE /api/admin/event/{id} — admin only
    @DeleteMapping("/api/admin/event/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    // POST /api/event/join/{eventId} — authenticated users
    @PostMapping("/api/event/join/{eventId}")
    public ResponseEntity<EventResponseDTO> joinEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(eventService.joinEvent(eventId));
    }

    // GET /api/user/events — authenticated user's joined events
    @GetMapping("/api/user/events")
    public ResponseEntity<List<EventResponseDTO>> getUserEvents() {
        return ResponseEntity.ok(eventService.getUserEvents());
    }
}
