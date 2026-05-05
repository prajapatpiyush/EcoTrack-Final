package com.ecotrack.repository;

import com.ecotrack.entity.Recycler;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecyclerRepository extends JpaRepository<Recycler, Long> {
    boolean existsByEmail(String email);
}
