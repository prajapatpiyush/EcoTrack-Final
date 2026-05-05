package com.ecotrack.repository;

import com.ecotrack.entity.WasteBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WasteBatchRepository extends JpaRepository<WasteBatch, Long> {

    List<WasteBatch> findAllByOrderByCreatedAtDesc();

    // Total revenue: sum of quantity × rate for PROCESSED batches
    @Query("SELECT COALESCE(SUM(b.quantity), 0) FROM WasteBatch b WHERE b.status = 'PROCESSED'")
    double sumProcessedQuantity();
}
