package com.ecotrack.repository;

import com.ecotrack.entity.Transaction;
import com.ecotrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // All transactions for user, newest first
    List<Transaction> findByUserOrderByCreatedAtDesc(User user);

    // Recent N transactions for dashboard
    List<Transaction> findTop5ByUserOrderByCreatedAtDesc(User user);
}
