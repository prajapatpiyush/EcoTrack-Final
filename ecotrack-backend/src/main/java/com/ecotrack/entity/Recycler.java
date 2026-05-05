package com.ecotrack.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "recyclers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recycler {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    // Comma-separated: "DRY,E_WASTE"
    @Column(name = "waste_types_accepted", nullable = false)
    private String wasteTypesAccepted;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
