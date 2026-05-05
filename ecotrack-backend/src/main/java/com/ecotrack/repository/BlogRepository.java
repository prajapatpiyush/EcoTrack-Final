package com.ecotrack.repository;

import com.ecotrack.entity.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    Optional<Blog> findBySlug(String slug);
    boolean existsBySlug(String slug);
    Page<Blog> findAll(Pageable pageable);
    Page<Blog> findByCategory(String category, Pageable pageable);
}
