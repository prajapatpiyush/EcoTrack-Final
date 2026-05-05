package com.ecotrack.controller;

import com.ecotrack.dto.TransactionResponse;
import com.ecotrack.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    // GET /api/transactions
    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getTransactions() {
        return ResponseEntity.ok(transactionService.getTransactionsForCurrentUser());
    }
}
