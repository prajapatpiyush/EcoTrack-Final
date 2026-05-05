package com.ecotrack.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class RecyclerDTO {

    private Long id;

    @NotBlank(message = "Recycler name is required")
    private String name;

    @Email(message = "Valid email required")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Waste types accepted is required (e.g. DRY,E_WASTE)")
    private String wasteTypesAccepted;

    private LocalDateTime createdAt;
}
