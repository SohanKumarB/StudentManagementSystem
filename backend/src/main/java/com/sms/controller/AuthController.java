package com.sms.controller;

import com.sms.dto.ApiResponse;
import com.sms.dto.JwtResponse;
import com.sms.dto.LoginRequest;
import com.sms.dto.PasswordChangeDto;
import com.sms.entity.Student;
import com.sms.entity.User;
import com.sms.repository.StudentRepository;
import com.sms.repository.UserRepository;
import com.sms.security.JwtUtils;
import com.sms.security.UserDetailsImpl;
import com.sms.service.ActivityLogService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private ActivityLogService activityLogService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.getAuthorities().stream()
                .findFirst().get().getAuthority();

        Long studentId = null;
        if ("ROLE_STUDENT".equals(role)) {
            Optional<Student> studentOpt = studentRepository.findByUserId(userDetails.getId());
            if (studentOpt.isPresent()) {
                studentId = studentOpt.get().getId();
            }
        }

        activityLogService.logActivity(userDetails.getUsername(), "USER_LOGIN", "Successful login (" + role + ")");

        return ResponseEntity.ok(new JwtResponse(
                jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                role,
                studentId));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "No account found associated with email: " + email));
        }

        User user = userOpt.get();
        // Reset password to a standard temp password
        String tempPassword = "Temp" + (int)(Math.random() * 9000 + 1000);
        user.setPassword(passwordEncoder.encode(tempPassword));
        userRepository.save(user);

        activityLogService.logActivity(user.getUsername(), "FORGOT_PASSWORD", "Password reset initiated");

        return ResponseEntity.ok(new ApiResponse(true, "Password reset successful! Temporary password: " + tempPassword));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody PasswordChangeDto dto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Current password is incorrect"));
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);

        activityLogService.logActivity(username, "CHANGE_PASSWORD", "Password updated successfully");

        return ResponseEntity.ok(new ApiResponse(true, "Password changed successfully!"));
    }
}
