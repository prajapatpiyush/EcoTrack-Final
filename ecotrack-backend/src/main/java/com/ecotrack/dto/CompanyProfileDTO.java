package com.ecotrack.dto;

import com.ecotrack.entity.SubscriptionType;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CompanyProfileDTO {

    @NotBlank(message = "Company name is required")
    private String companyName;

    private SubscriptionType subscriptionType;

    // Response fields
    private Long id;
    private String userEmail;
    private LocalDateTime createdAt;
}
