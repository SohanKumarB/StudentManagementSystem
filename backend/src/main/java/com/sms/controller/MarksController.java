package com.sms.controller;

import com.sms.dto.MarksDto;
import com.sms.entity.User;
import com.sms.repository.UserRepository;
import com.sms.service.MarksService;
import com.sms.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
public class MarksController {

    @Autowired
    private MarksService marksService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/admin/marks")
    public ResponseEntity<MarksDto> saveMarks(@RequestBody MarksDto dto) {
        String adminUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(marksService.saveOrUpdateMarks(dto, adminUsername));
    }

    @GetMapping("/admin/marks")
    public ResponseEntity<List<MarksDto>> getAllMarks() {
        return ResponseEntity.ok(marksService.getAllMarks());
    }

    @GetMapping("/admin/marks/student/{studentId}")
    public ResponseEntity<List<MarksDto>> getMarksByStudentIdAdmin(@PathVariable Long studentId) {
        return ResponseEntity.ok(marksService.getMarksByStudentId(studentId));
    }

    @GetMapping("/student/marks")
    public ResponseEntity<List<MarksDto>> getMyMarks() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        var studentDto = studentService.getStudentByUserId(user.getId());
        return ResponseEntity.ok(marksService.getMarksByStudentId(studentDto.getId()));
    }
}
