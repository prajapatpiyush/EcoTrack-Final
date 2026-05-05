package com.ecotrack.service;

import com.ecotrack.dto.DashboardResponse;
import com.ecotrack.dto.TransactionResponse;
import com.ecotrack.dto.WasteSubmissionResponse;
import com.ecotrack.entity.User;
import com.ecotrack.entity.Wallet;
import com.ecotrack.repository.TransactionRepository;
import com.ecotrack.repository.UserRepository;
import com.ecotrack.repository.WalletRepository;
import com.ecotrack.repository.WasteSubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final WalletRepository walletRepository;
    private final WasteSubmissionRepository wasteSubmissionRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final WasteService wasteService;

    public DashboardResponse getDashboard() {
        User user = getAuthenticatedUser();

        // Wallet
        Wallet wallet = walletRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        // Waste stats
        double totalWasteKg = wasteSubmissionRepository.sumWeightByUser(user);
        int totalSubmissions = wasteSubmissionRepository.findByUserOrderByCreatedAtDesc(user).size();

        // Recent 5 submissions
        List<WasteSubmissionResponse> recentSubmissions =
                wasteSubmissionRepository.findTop5ByUserOrderByCreatedAtDesc(user)
                        .stream()
                        .map(wasteService::toResponse)
                        .collect(Collectors.toList());

        // Recent 5 transactions
        List<TransactionResponse> recentTransactions =
                transactionRepository.findTop5ByUserOrderByCreatedAtDesc(user)
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

        return DashboardResponse.builder()
                .totalPoints(wallet.getTotalPoints())
                .totalMoney(wallet.getTotalMoney())
                .totalWasteKg(totalWasteKg)
                .totalSubmissions(totalSubmissions)
                .recentSubmissions(recentSubmissions)
                .recentTransactions(recentTransactions)
                .build();
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
