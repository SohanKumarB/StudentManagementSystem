package com.sms.controller;

import com.sms.dto.StudentDto;
import com.sms.entity.User;
import com.sms.repository.UserRepository;
import com.sms.service.FileStorageService;
import com.sms.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private UserRepository userRepository;

    // --- Admin Endpoints ---

    @GetMapping("/admin/students")
    public ResponseEntity<List<StudentDto>> getAllStudents(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Integer semester,
            @RequestParam(required = false) String section) {

        if (query != null || department != null || semester != null || section != null) {
            return ResponseEntity.ok(studentService.searchStudents(query, department, semester, section));
        }
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/admin/students/{id}")
    public ResponseEntity<StudentDto> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @PostMapping("/admin/students")
    public ResponseEntity<StudentDto> createStudent(@RequestBody StudentDto dto) {
        String adminUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(studentService.createStudent(dto, adminUsername));
    }

    @PutMapping("/admin/students/{id}")
    public ResponseEntity<StudentDto> updateStudent(@PathVariable Long id, @RequestBody StudentDto dto) {
        String adminUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(studentService.updateStudent(id, dto, adminUsername));
    }

    @DeleteMapping("/admin/students/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        String adminUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        studentService.deleteStudent(id, adminUsername);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/admin/students/{id}/photo")
    public ResponseEntity<StudentDto> uploadPhoto(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        String adminUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        String photoUrl = fileStorageService.storeFile(file);
        return ResponseEntity.ok(studentService.updatePhoto(id, photoUrl, adminUsername));
    }

    // --- Student Endpoints ---

    @GetMapping("/student/profile")
    public ResponseEntity<StudentDto> getMyProfile() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(studentService.getStudentByUserId(user.getId()));
    }

    @PutMapping("/student/profile")
    public ResponseEntity<StudentDto> updateMyProfile(@RequestBody StudentDto dto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        StudentDto existing = studentService.getStudentByUserId(user.getId());
        return ResponseEntity.ok(studentService.updateStudent(existing.getId(), dto, username));
    }
}
