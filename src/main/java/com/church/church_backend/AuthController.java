package com.church.church_backend;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            AppUser registered = authService.registerAdminRequest(
                    request.getUsername(), request.getPassword(), request.getParishName());

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "message", "Registration submitted. Your parish administrator account is pending System Administrator approval.",
                    "username", registered.getUsername(),
                    "parishId", registered.getParishId(),
                    "parishName", request.getParishName().trim(),
                    "approved", registered.isApproved()));
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(Map.of("message",
                    ex.getReason() == null ? "Registration could not be completed." : ex.getReason()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            return ResponseEntity.ok(authService.login(request.getUsername(), request.getPassword()));
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(Map.of("message",
                    ex.getReason() == null ? "Login could not be completed." : ex.getReason()));
        }
    }

    /** Used by the registration form to show only existing parishes without an admin. */
    @GetMapping("/parishes")
    public List<Map<String, Object>> availableParishes() {
        return authService.listAvailableParishes();
    }

    @GetMapping("/me")
    public ResponseEntity<?> currentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authentication required."));
        }

        return ResponseEntity.ok(authService.getCurrentUserProfile(authentication.getName()));
    }

    @GetMapping("/pending")
    public List<Map<String, Object>> viewPending() {
        return authService.getPendingApprovals();
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<?> approveUser(@PathVariable Long id) {
        try {
            AppUser approved = authService.approveAdmin(id);
            return ResponseEntity.ok(Map.of(
                    "message", "User account has been approved and activated.",
                    "id", approved.getId(),
                    "username", approved.getUsername(),
                    "parishId", approved.getParishId()));
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(Map.of("message",
                    ex.getReason() == null ? "Approval could not be completed." : ex.getReason()));
        }
    }
}
