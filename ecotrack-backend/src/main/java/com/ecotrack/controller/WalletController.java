package com.ecotrack.controller;

import com.ecotrack.dto.WalletResponse;
import com.ecotrack.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    // GET /api/wallet
    @GetMapping
    public ResponseEntity<WalletResponse> getWallet() {
        return ResponseEntity.ok(walletService.getWalletForCurrentUser());
    }
}
