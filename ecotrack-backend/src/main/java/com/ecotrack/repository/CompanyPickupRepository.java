package com.ecotrack.repository;

import com.ecotrack.entity.CompanyPickup;
import com.ecotrack.entity.CompanyProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompanyPickupRepository extends JpaRepository<CompanyPickup, Long> {
    List<CompanyPickup> findByCompanyOrderByCreatedAtDesc(CompanyProfile company);
}
