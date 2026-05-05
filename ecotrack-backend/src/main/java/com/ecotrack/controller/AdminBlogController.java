package com.ecotrack.controller;

import com.ecotrack.dto.BlogDTO;
import com.ecotrack.dto.BlogResponseDTO;
import com.ecotrack.service.BlogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/blog")
@RequiredArgsConstructor
public class AdminBlogController {

    private final BlogService blogService;

    // POST /api/admin/blog
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BlogResponseDTO> createBlog(@Valid @RequestBody BlogDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(blogService.createBlog(dto));
    }

    // PUT /api/admin/blog/{id}
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BlogResponseDTO> updateBlog(
            @PathVariable Long id,
            @Valid @RequestBody BlogDTO dto) {
        return ResponseEntity.ok(blogService.updateBlog(id, dto));
    }

    // DELETE /api/admin/blog/{id}
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id) {
        blogService.deleteBlog(id);
        return ResponseEntity.noContent().build();
    }
}
