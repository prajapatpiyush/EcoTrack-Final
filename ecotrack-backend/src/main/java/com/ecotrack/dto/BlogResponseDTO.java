package com.ecotrack.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BlogResponseDTO {
    private Long id;
    private String title;
    private String slug;
    private String content;
    private String author;
    private String category;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
