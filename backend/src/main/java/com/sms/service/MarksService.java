package com.sms.service;

import com.sms.dto.MarksDto;
import com.sms.entity.Marks;
import com.sms.repository.MarksRepository;
import com.sms.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MarksService {

    @Autowired
    private MarksRepository marksRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ActivityLogService activityLogService;

    public MarksDto saveOrUpdateMarks(MarksDto dto, String performedBy) {
        Marks marks = marksRepository.findByStudentIdAndCourseCode(dto.getStudentId(), dto.getCourseCode())
                .orElse(new Marks());

        marks.setStudentId(dto.getStudentId());
        marks.setCourseCode(dto.getCourseCode());
        marks.setCourseTitle(dto.getCourseTitle());
        marks.setInternalMarks(dto.getInternalMarks());
        marks.setAssignmentMarks(dto.getAssignmentMarks());
        marks.setLabMarks(dto.getLabMarks());
        marks.setFinalExamMarks(dto.getFinalExamMarks());
        
        marks.calculateTotalAndGrade();

        Marks saved = marksRepository.save(marks);
        activityLogService.logActivity(performedBy, "SAVE_MARKS", "Updated marks for student ID: " + dto.getStudentId() + " in " + dto.getCourseCode());
        return convertToDto(saved);
    }

    public List<MarksDto> getMarksByStudentId(Long studentId) {
        return marksRepository.findByStudentId(studentId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<MarksDto> getAllMarks() {
        return marksRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private MarksDto convertToDto(Marks marks) {
        MarksDto dto = new MarksDto();
        dto.setId(marks.getId());
        dto.setStudentId(marks.getStudentId());
        dto.setCourseCode(marks.getCourseCode());
        dto.setCourseTitle(marks.getCourseTitle());
        dto.setInternalMarks(marks.getInternalMarks());
        dto.setAssignmentMarks(marks.getAssignmentMarks());
        dto.setLabMarks(marks.getLabMarks());
        dto.setFinalExamMarks(marks.getFinalExamMarks());
        dto.setTotalMarks(marks.getTotalMarks());
        dto.setGrade(marks.getGrade());
        dto.setGpa(marks.getGpa());

        studentRepository.findById(marks.getStudentId()).ifPresent(s -> {
            dto.setStudentName(s.getName());
            dto.setUsnRollNumber(s.getUsnRollNumber());
        });
        return dto;
    }
}
