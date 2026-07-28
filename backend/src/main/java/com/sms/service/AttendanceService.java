package com.sms.service;

import com.sms.dto.AttendanceDto;
import com.sms.entity.Attendance;
import com.sms.entity.Student;
import com.sms.repository.AttendanceRepository;
import com.sms.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ActivityLogService activityLogService;

    public AttendanceDto markAttendance(AttendanceDto dto, String performedBy) {
        Attendance attendance = new Attendance(
                dto.getStudentId(),
                dto.getCourseCode(),
                dto.getDate(),
                dto.getStatus(),
                dto.getRemarks()
        );
        Attendance saved = attendanceRepository.save(attendance);
        activityLogService.logActivity(performedBy, "MARK_ATTENDANCE", "Marked " + dto.getStatus() + " for student ID: " + dto.getStudentId());
        return convertToDto(saved);
    }

    public List<AttendanceDto> getStudentAttendance(Long studentId) {
        return attendanceRepository.findByStudentId(studentId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getStudentAttendanceSummary(Long studentId) {
        long total = attendanceRepository.countTotalByStudentId(studentId);
        long present = attendanceRepository.countPresentByStudentId(studentId);
        double percentage = total > 0 ? ((double) present / total) * 100.0 : 100.0;

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalClasses", total);
        summary.put("presentCount", present);
        summary.put("absentCount", total - present);
        summary.put("percentage", Math.round(percentage * 100.0) / 100.0);
        return summary;
    }

    private AttendanceDto convertToDto(Attendance attendance) {
        AttendanceDto dto = new AttendanceDto();
        dto.setId(attendance.getId());
        dto.setStudentId(attendance.getStudentId());
        dto.setCourseCode(attendance.getCourseCode());
        dto.setDate(attendance.getDate());
        dto.setStatus(attendance.getStatus());
        dto.setRemarks(attendance.getRemarks());

        studentRepository.findById(attendance.getStudentId()).ifPresent(s -> {
            dto.setStudentName(s.getName());
            dto.setUsnRollNumber(s.getUsnRollNumber());
        });
        return dto;
    }
}
