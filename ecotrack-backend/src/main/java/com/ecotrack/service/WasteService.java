package com.ecotrack.service;

import com.ecotrack.dto.WasteSubmissionRequest;
import com.ecotrack.dto.WasteSubmissionResponse;
import com.ecotrack.entity.*;
import com.ecotrack.repository.TransactionRepository;
import com.ecotrack.repository.UserRepository;
import com.ecotrack.repository.WalletRepository;
import com.ecotrack.repository.WasteSubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WasteService {

    private final WasteSubmissionRepository wasteSubmissionRepository;
    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    // Phase 4: inventory integration
    private final InventoryService inventoryService;

    private static final double DRY_RATE     = 2.0;
    private static final double WET_RATE     = 1.0;
    private static final double E_WASTE_RATE = 5.0;

    @Transactional
    public WasteSubmissionResponse submitWaste(WasteSubmissionRequest request) {
        if (request.getWeight() <= 0 || request.getWeight() >= 1000) {
            throw new IllegalArgumentException("Weight must be between 0 and 1000 kg");
        }

        User user = getAuthenticatedUser();

        double rate        = getRateForWasteType(request.getWasteType());
        double rewardMoney = request.getWeight() * rate;
        int rewardPoints   = (int) Math.round(request.getWeight());

        WasteSubmission submission = WasteSubmission.builder()
                .user(user)
                .wasteType(request.getWasteType())
                .weight(request.getWeight())
                .rewardPoints(rewardPoints)
                .rewardMoney(rewardMoney)
                .build();
        wasteSubmissionRepository.save(submission);

        // Null-safe wallet
        Wallet wallet = walletRepository.findByUser(user)
                .orElseGet(() -> walletRepository.save(Wallet.builder()
                        .user(user).totalPoints(0).totalMoney(0.0).build()));

        wallet.setTotalPoints(wallet.getTotalPoints() + rewardPoints);
        wallet.setTotalMoney(wallet.getTotalMoney() + rewardMoney);
        walletRepository.save(wallet);

        transactionRepository.save(Transaction.builder()
                .user(user)
                .type(TransactionType.CREDIT)
                .points(rewardPoints)
                .money(rewardMoney)
                .description(String.format("Waste submitted: %.2f kg of %s",
                        request.getWeight(), request.getWasteType().name()))
                .build());

        // Phase 4: update inventory
        inventoryService.addToInventory(request.getWasteType(), request.getWeight());

        return toResponse(submission);
    }

    public List<WasteSubmissionResponse> getMySubmissions() {
        User user = getAuthenticatedUser();
        return wasteSubmissionRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private double getRateForWasteType(WasteType wasteType) {
        return switch (wasteType) {
            case DRY     -> DRY_RATE;
            case WET     -> WET_RATE;
            case E_WASTE -> E_WASTE_RATE;
        };
    }

    User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    public WasteSubmissionResponse toResponse(WasteSubmission s) {
        return WasteSubmissionResponse.builder()
                .id(s.getId())
                .wasteType(s.getWasteType())
                .weight(s.getWeight())
                .rewardPoints(s.getRewardPoints())
                .rewardMoney(s.getRewardMoney())
                .createdAt(s.getCreatedAt())
                .build();
    }
}
