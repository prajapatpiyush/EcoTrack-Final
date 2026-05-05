package com.ecotrack.repository;

import com.ecotrack.entity.User;
import com.ecotrack.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long> {

    Optional<Wallet> findByUser(User user);

    boolean existsByUser(User user);
}
