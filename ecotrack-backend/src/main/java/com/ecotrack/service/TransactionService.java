package com.ecotrack.service;

import com.ecotrack.dto.TransactionResponse;
import com.ecotrack.entity.User;
import com.ecotrack.repository.TransactionRepository;
import com.ecotrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public List<TransactionResponse> getTransactionsForCurrentUser() {
        User user = getAuthenticatedUser();
        return transactionRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(t -> TransactionResponse.builder()
                        .id(t.getId())
                        .type(t.getType())
                        .points(t.getPoints())
                        .money(t.getMoney())
                        .description(t.getDescription())
                        .createdAt(t.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
