package com.ecotrack.service;

import com.ecotrack.config.ResourceNotFoundException;
import com.ecotrack.dto.BlogDTO;
import com.ecotrack.dto.BlogResponseDTO;
import com.ecotrack.entity.Blog;
import com.ecotrack.repository.BlogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogRepository blogRepository;

    private static final Pattern NON_LATIN   = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE  = Pattern.compile("[\\s]+");
    private static final Pattern MULTI_DASH  = Pattern.compile("-{2,}");

    // ─── Create ───────────────────────────────────────────────────────────────
    @Transactional
    public BlogResponseDTO createBlog(BlogDTO dto) {
        String slug = generateUniqueSlug(dto.getTitle());
        Blog blog = Blog.builder()
                .title(dto.getTitle().trim())
                .slug(slug)
                .content(dto.getContent().trim())
                .author(dto.getAuthor().trim())
                .category(dto.getCategory().trim().toUpperCase())
                .build();
        blogRepository.save(blog);
        return toDTO(blog);
    }

    // ─── Read: paginated list ─────────────────────────────────────────────────
    public Page<BlogResponseDTO> getAllBlogs(int page, int size, String category) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Blog> blogs = (category != null && !category.isBlank())
                ? blogRepository.findByCategory(category.toUpperCase(), pageable)
                : blogRepository.findAll(pageable);
        return blogs.map(this::toDTO);
    }

    // ─── Read: by slug ────────────────────────────────────────────────────────
    public BlogResponseDTO getBlogBySlug(String slug) {
        Blog blog = blogRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Blog not found with slug: " + slug));
        return toDTO(blog);
    }

    // ─── Update ───────────────────────────────────────────────────────────────
    @Transactional
    public BlogResponseDTO updateBlog(Long id, BlogDTO dto) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Blog not found with id: " + id));

        // Re-generate slug only if title changed
        if (!blog.getTitle().equalsIgnoreCase(dto.getTitle().trim())) {
            blog.setSlug(generateUniqueSlug(dto.getTitle()));
        }
        blog.setTitle(dto.getTitle().trim());
        blog.setContent(dto.getContent().trim());
        blog.setAuthor(dto.getAuthor().trim());
        blog.setCategory(dto.getCategory().trim().toUpperCase());
        blogRepository.save(blog);
        return toDTO(blog);
    }

    // ─── Delete ───────────────────────────────────────────────────────────────
    @Transactional
    public void deleteBlog(Long id) {
        if (!blogRepository.existsById(id)) {
            throw new ResourceNotFoundException("Blog not found with id: " + id);
        }
        blogRepository.deleteById(id);
    }

    // ─── Slug generation ──────────────────────────────────────────────────────
    private String generateUniqueSlug(String title) {
        String base = toSlug(title);
        String slug = base;
        int counter = 1;
        while (blogRepository.existsBySlug(slug)) {
            slug = base + "-" + counter++;
        }
        return slug;
    }

    private String toSlug(String input) {
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        String slug = NON_LATIN.matcher(
                WHITESPACE.matcher(normalized.toLowerCase(Locale.ENGLISH))
                        .replaceAll("-"))
                .replaceAll("");
        return MULTI_DASH.matcher(slug).replaceAll("-")
                .replaceAll("^-|-$", "");
    }

    // ─── Mapper ───────────────────────────────────────────────────────────────
    private BlogResponseDTO toDTO(Blog b) {
        return BlogResponseDTO.builder()
                .id(b.getId())
                .title(b.getTitle())
                .slug(b.getSlug())
                .content(b.getContent())
                .author(b.getAuthor())
                .category(b.getCategory())
                .createdAt(b.getCreatedAt())
                .updatedAt(b.getUpdatedAt())
                .build();
    }
}
