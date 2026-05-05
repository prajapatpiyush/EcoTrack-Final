package com.ecotrack.repository;

import com.ecotrack.entity.User;
import com.ecotrack.entity.WasteSubmission;
import com.ecotrack.entity.WasteType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WasteSubmissionRepository extends JpaRepository<WasteSubmission, Long> {

    List<WasteSubmission> findByUserOrderByCreatedAtDesc(User user);

    List<WasteSubmission> findTop5ByUserOrderByCreatedAtDesc(User user);

    @Query("SELECT COALESCE(SUM(w.weight), 0) FROM WasteSubmission w WHERE w.user = :user")
    double sumWeightByUser(@Param("user") User user);

    // Phase 4: total weight across ALL submissions
    @Query("SELECT COALESCE(SUM(w.weight), 0) FROM WasteSubmission w")
    double sumAllWeight();

    // Phase 4: weight by waste type for dashboard breakdown
    @Query("SELECT COALESCE(SUM(w.weight), 0) FROM WasteSubmission w WHERE w.wasteType = :wasteType")
    double sumWeightByWasteType(@Param("wasteType") WasteType wasteType);
}
