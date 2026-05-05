package com.ecotrack.service;

import com.ecotrack.config.ResourceNotFoundException;
import com.ecotrack.dto.EventDTO;
import com.ecotrack.dto.EventResponseDTO;
import com.ecotrack.entity.Event;
import com.ecotrack.entity.Participation;
import com.ecotrack.entity.User;
import com.ecotrack.repository.EventRepository;
import com.ecotrack.repository.ParticipationRepository;
import com.ecotrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final ParticipationRepository participationRepository;
    private final UserRepository userRepository;

    // ─── Create Event (Admin) ─────────────────────────────────────────────────
    @Transactional
    public EventResponseDTO createEvent(EventDTO dto) {
        Event event = Event.builder()
                .title(dto.getTitle().trim())
                .description(dto.getDescription().trim())
                .location(dto.getLocation().trim())
                .date(dto.getDate())
                .maxParticipants(dto.getMaxParticipants())
                .currentParticipants(0)
                .build();
        eventRepository.save(event);
        return toDTO(event, false);
    }

    // ─── Delete Event (Admin) ─────────────────────────────────────────────────
    @Transactional
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event not found with id: " + id);
        }
        eventRepository.deleteById(id);
    }

    // ─── Get All Events (Public) ──────────────────────────────────────────────
    public List<EventResponseDTO> getAllEvents() {
        // Try to identify current user for "joined" state; null if anonymous
        User currentUser = tryGetCurrentUser();
        return eventRepository.findAllByOrderByDateAsc()
                .stream()
                .map(e -> {
                    boolean joined = currentUser != null
                            && participationRepository.existsByUserAndEvent(currentUser, e);
                    return toDTO(e, joined);
                })
                .collect(Collectors.toList());
    }

    // ─── Join Event (Authenticated) ───────────────────────────────────────────
    @Transactional
    public EventResponseDTO joinEvent(Long eventId) {
        User user = getAuthenticatedUser();
        // FIX: use pessimistic lock so concurrent joins queue up safely
        Event event = eventRepository.findByIdWithLock(eventId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Event not found with id: " + eventId));

        // Duplicate join check
        if (participationRepository.existsByUserAndEvent(user, event)) {
            throw new IllegalArgumentException("You have already joined this event");
        }

        // Capacity check
        if (event.getCurrentParticipants() >= event.getMaxParticipants()) {
            throw new IllegalArgumentException(
                    "Event is full. Maximum participants: " + event.getMaxParticipants());
        }

        // Save participation + increment counter
        Participation participation = Participation.builder()
                .user(user)
                .event(event)
                .build();
        participationRepository.save(participation);

        event.setCurrentParticipants(event.getCurrentParticipants() + 1);
        eventRepository.save(event);

        return toDTO(event, true);
    }

    // ─── Get User's Joined Events ─────────────────────────────────────────────
    public List<EventResponseDTO> getUserEvents() {
        User user = getAuthenticatedUser();
        return participationRepository.findByUserOrderByJoinedAtDesc(user)
                .stream()
                .map(p -> toDTO(p.getEvent(), true))
                .collect(Collectors.toList());
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────
    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    /** Returns null if no authenticated user (public access) */
    private User tryGetCurrentUser() {
        try {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()
                    || "anonymousUser".equals(auth.getPrincipal())) {
                return null;
            }
            return userRepository.findByEmail(auth.getName()).orElse(null);
        } catch (Exception e) {
            return null;
        }
    }

    private EventResponseDTO toDTO(Event e, boolean joined) {
        return EventResponseDTO.builder()
                .id(e.getId())
                .title(e.getTitle())
                .description(e.getDescription())
                .location(e.getLocation())
                .date(e.getDate())
                .maxParticipants(e.getMaxParticipants())
                .currentParticipants(e.getCurrentParticipants())
                .createdAt(e.getCreatedAt())
                .joined(joined)
                .full(e.getCurrentParticipants() >= e.getMaxParticipants())
                .build();
    }
}
