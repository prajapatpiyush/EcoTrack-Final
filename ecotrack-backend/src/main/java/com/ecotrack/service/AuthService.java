package com.ecotrack.service;

import com.ecotrack.dto.AuthRequest;
import com.ecotrack.dto.AuthResponse;
import com.ecotrack.dto.RegisterRequest;
import com.ecotrack.entity.User;
import com.ecotrack.entity.Wallet;
import com.ecotrack.repository.UserRepository;
import com.ecotrack.repository.WalletRepository;
import com.ecotrack.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    // ── ADDED in Phase 2: wallet repository injected ──
    private final WalletRepository walletRepository;

    // ─── Register ────────────────────────────────────────────────────────────
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();
        userRepository.save(user);

        // ── ADDED in Phase 2: auto-create wallet with zero balance ──
        Wallet wallet = Wallet.builder()
                .user(user)
                .totalPoints(0)
                .totalMoney(0.0)
                .build();
        walletRepository.save(wallet);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .username(user.getName())
                .email(user.getEmail())
                .message("Registration successful")
                .build();
    }

    // ─── Login ────────────────────────────────────────────────────────────────
    public AuthResponse login(AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ── ADDED in Phase 2: safety net — create wallet if it doesn't exist ──
        if (!walletRepository.existsByUser(user)) {
            Wallet wallet = Wallet.builder()
                    .user(user)
                    .totalPoints(0)
                    .totalMoney(0.0)
                    .build();
            walletRepository.save(wallet);
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .username(user.getName())
                .email(user.getEmail())
                .message("Login successful")
                .build();
    }
}
