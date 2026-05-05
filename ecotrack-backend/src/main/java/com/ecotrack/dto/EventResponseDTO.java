package com.ecotrack.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class EventResponseDTO {

    private Long id;
    private String title;
    private String description;
    private String location;
    private LocalDateTime date;
    private int maxParticipants;
    private int currentParticipants;
    private LocalDateTime createdAt;

    // Derived: true if the calling user has already joined
    private boolean joined;
    // Derived: true if event is full
    private boolean full;
}
