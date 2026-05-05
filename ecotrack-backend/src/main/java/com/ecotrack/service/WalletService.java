package com.ecotrack.service;

import com.ecotrack.dto.WalletResponse;
import com.ecotrack.entity.User;
import com.ecotrack.repository.UserRepository;
import com.ecotrack.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;
    private final UserRepository userRepository;

    public WalletResponse getWalletForCurrentUser() {
        User user = getAuthenticatedUser();
        return walletRepository.findByUser(user)
                .map(w -> WalletResponse.builder()
                        .totalPoints(w.getTotalPoints())
                        .totalMoney(w.getTotalMoney())
                        .build())
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
