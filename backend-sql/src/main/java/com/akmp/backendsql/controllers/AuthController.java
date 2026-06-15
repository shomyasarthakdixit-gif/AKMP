package com.akmp.backendsql.controllers;

import com.akmp.backendsql.models.Role;
import com.akmp.backendsql.models.User;
import com.akmp.backendsql.payload.request.LoginRequest;
import com.akmp.backendsql.payload.request.SignupRequest;
import com.akmp.backendsql.payload.response.JwtResponse;
import com.akmp.backendsql.payload.response.MessageResponse;
import com.akmp.backendsql.repository.UserRepository;
import com.akmp.backendsql.security.jwt.JwtUtils;
import com.akmp.backendsql.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Hidden;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    com.akmp.backendsql.repository.AuthorRepository authorRepository;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                userDetails.getAuthorities().iterator().next().getAuthority()));
    }

    @Autowired
    private com.akmp.backendsql.services.MongoSyncService mongoSyncService;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        // Plaintext password for Phase 2
        user.setPassword(signUpRequest.getPassword());
        
        // Parse role from request
        if (signUpRequest.getRole() != null) {
            switch (signUpRequest.getRole().toUpperCase()) {
                case "ADMIN":
                    user.setRole(Role.ROLE_ADMIN);
                    break;
                case "MEMBER":
                    user.setRole(Role.ROLE_MEMBER);
                    break;
                default:
                    user.setRole(Role.ROLE_USER);
            }
        } else {
            user.setRole(Role.ROLE_USER);
        }

        User savedUser = userRepository.save(user);
        mongoSyncService.syncUser(savedUser);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @Hidden
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            authorRepository.findByUserId(user.getId()).ifPresent(author -> authorRepository.delete(author));
            userRepository.delete(user);
            mongoSyncService.deleteUser(id);
            return ResponseEntity.ok(new MessageResponse("User deleted successfully!"));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Hidden
    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @Valid @RequestBody SignupRequest updateRequest) {
        return userRepository.findById(id).map(user -> {
            user.setUsername(updateRequest.getUsername());
            user.setEmail(updateRequest.getEmail());
            // Plaintext password for Phase 2
            user.setPassword(updateRequest.getPassword());
            User updatedUser = userRepository.save(user);
            mongoSyncService.syncUser(updatedUser);
            return ResponseEntity.ok(new MessageResponse("User updated successfully!"));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Hidden
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MEMBER') or hasRole('USER')")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Hidden
    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MEMBER')")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
