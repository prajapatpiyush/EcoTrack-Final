package com.ecotrack.repository;

import com.ecotrack.entity.PickupRequest;
import com.ecotrack.entity.PickupStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PickupRequestRepository extends JpaRepository<PickupRequest, Long> {

    List<PickupRequest> findByUserIdOrderByCreatedAtDesc(Long userId);

    Page<PickupRequest> findAll(Pageable pageable);

    // Phase 4: admin dashboard count
    long countByStatus(PickupStatus status);
}
