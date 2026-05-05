package com.ecotrack.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "inventory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "waste_type", nullable = false, unique = true)
    private WasteType wasteType;

    @Column(name = "total_quantity", nullable = false)
    @Builder.Default
    private double totalQuantity = 0.0;
}
