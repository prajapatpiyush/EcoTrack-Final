package com.ecotrack.controller;

import com.ecotrack.dto.BlogResponseDTO;
import com.ecotrack.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicBlogController {

    private final BlogService blogService;

    // GET /api/public/blogs?page=0&size=10&category=SUSTAINABILITY
    @GetMapping("/blogs")
    public ResponseEntity<Page<BlogResponseDTO>> getBlogs(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false)    String category) {
        return ResponseEntity.ok(blogService.getAllBlogs(page, size, category));
    }

    // GET /api/public/blog/{slug}
    @GetMapping("/blog/{slug}")
    public ResponseEntity<BlogResponseDTO> getBlogBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(blogService.getBlogBySlug(slug));
    }
}
