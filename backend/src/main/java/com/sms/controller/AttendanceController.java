package com.sms.controller;

import com.sms.dto.AttendanceDto;
import com.sms.entity.User;
import com.sms.repository.UserRepository;
import com.sms.service.AttendanceService;
import com.sms.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/admin/attendance")
    public ResponseEntity<AttendanceDto> markAttendance(@RequestBody AttendanceDto dto) {
        String adminUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(attendanceService.markAttendance(dto, adminUsername));
    }

    @GetMapping("/admin/attendance/student/{studentId}")
    public ResponseEntity<List<AttendanceDto>> getStudentAttendanceByAdmin(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getStudentAttendance(studentId));
    }

    @GetMapping("/student/attendance")
    public ResponseEntity<Map<String, Object>> getMyAttendance() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        var studentDto = studentService.getStudentByUserId(user.getId());

        List<AttendanceDto> records = attendanceService.getStudentAttendance(studentDto.getId());
        Map<String, Object> summary = attendanceService.getStudentAttendanceSummary(studentDto.getId());

        Map<String, Object> result = new HashMap<>();
        result.put("records", records);
        result.put("summary", summary);

        return ResponseEntity.ok(result);
    }
}
