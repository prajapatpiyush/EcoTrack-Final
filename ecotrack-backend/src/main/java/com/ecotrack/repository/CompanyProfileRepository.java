package com.ecotrack.repository;

import com.ecotrack.entity.CompanyProfile;
import com.ecotrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyProfileRepository extends JpaRepository<CompanyProfile, Long> {
    Optional<CompanyProfile> findByUser(User user);
    boolean existsByUser(User user);
}
