package com.church.church_backend;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final ParishRepository parishRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       ParishRepository parishRepository,
                       JwtUtil jwtUtil,
                       BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.parishRepository = parishRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * A regular administrator must register against an existing parish name.
     * Parish names are matched case-insensitively after trimming whitespace.
     * Registration remains pending until the system administrator approves it.
     */
    @Transactional
    public AppUser registerAdminRequest(String username, String password, String parishName) {
        if (blank(username) || blank(password) || blank(parishName)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Username, password, and an existing parish name are required.");
        }
        if (password.length() < 8) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Password must contain at least 8 characters.");
        }

        String cleanUsername = username.trim();
        String cleanParishName = parishName.trim();

        if (userRepository.findByUsername(cleanUsername).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken.");
        }

        Parish parish = parishRepository.findFirstByNameIgnoreCase(cleanParishName)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "That parish does not exist. Select an existing parish or contact the System Administrator."));

        if (userRepository.existsByParishId(parish.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "This parish already has an administrator. Contact the System Administrator for assistance.");
        }

        AppUser admin = new AppUser(cleanUsername, passwordEncoder.encode(password), "ROLE_ADMIN", false);
        admin.setParishId(parish.getId());

        try {
            return userRepository.saveAndFlush(admin);
        } catch (DataIntegrityViolationException ex) {
            // Covers two simultaneous registration requests for the same parish.
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "This parish already has an administrator. Contact the System Administrator for assistance.");
        }
    }

    public LoginResponse login(String username, String password) {
        if (blank(username) || blank(password)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username and password are required.");
        }

        AppUser user = userRepository.findByUsername(username.trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                        "Invalid username or password."));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password.");
        }
        if (user.isSuspended()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Your account has been suspended. Contact the System Administrator.");
        }
        if (!user.isApproved()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Your account is awaiting approval from the System Administrator.");
        }

        Long parishId = user.getParishId();
        String parishName = null;

        if ("ROLE_ADMIN".equals(user.getRole())) {
            if (parishId == null) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "This administrator is not assigned to a parish. Contact the System Administrator.");
            }
            Parish parish = parishRepository.findById(parishId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN,
                            "The parish assigned to this account no longer exists. Contact the System Administrator."));
            parishName = parish.getName();
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return new LoginResponse(token, user.getUsername(), user.getRole(), parishId, parishName);
    }

    public AppUser getUserByUsername(String username) {
        return userRepository.findByUsername(username.trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                        "User not found or session is invalid."));
    }

    public Map<String, Object> getCurrentUserProfile(String username) {
        AppUser user = getUserByUsername(username);
        Map<String, Object> profile = new LinkedHashMap<>();
        profile.put("id", user.getId());
        profile.put("username", user.getUsername());
        profile.put("role", user.getRole());
        profile.put("approved", user.isApproved());
        profile.put("parishId", user.getParishId());

        if (user.getParishId() != null) {
            Parish parish = parishRepository.findById(user.getParishId()).orElse(null);
            if (parish != null) {
                Map<String, Object> parishMap = new LinkedHashMap<>();
                parishMap.put("id", parish.getId());
                parishMap.put("name", parish.getName());
                profile.put("parish", parishMap);
            }
        }

        return profile;
    }

    public List<Map<String, Object>> getPendingApprovals() {
        return userRepository.findByApprovedFalse().stream()
                .map(user -> {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("id", user.getId());
                    item.put("username", user.getUsername());
                    item.put("role", user.getRole());
                    item.put("approved", user.isApproved());
                    item.put("parishId", user.getParishId());
                    item.put("parishName", user.getParishId() == null ? null : parishRepository.findById(user.getParishId())
                            .map(Parish::getName)
                            .orElse(null));
                    return item;
                })
                .toList();
    }

    public AppUser approveAdmin(Long userId) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
        if ("ROLE_ADMIN".equals(user.getRole()) && user.getParishId() == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "This regular administrator has no parish assignment and cannot be approved.");
        }
        user.setApproved(true);
        return userRepository.save(user);
    }

    public List<Map<String, Object>> listAvailableParishes() {
        return parishRepository.findAll().stream()
                .filter(parish -> !userRepository.existsByParishId(parish.getId()))
                .map(parish -> {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("id", parish.getId());
                    item.put("name", parish.getName());
                    item.put("deaneryId", parish.getDeaneryId());
                    return item;
                })
                .toList();
    }

    private boolean blank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
