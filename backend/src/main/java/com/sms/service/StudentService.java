package com.sms.service;

import com.sms.dto.StudentDto;
import com.sms.entity.Role;
import com.sms.entity.Student;
import com.sms.entity.User;
import com.sms.exception.ResourceNotFoundException;
import com.sms.repository.StudentRepository;
import com.sms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ActivityLogService activityLogService;

    public List<StudentDto> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<StudentDto> searchStudents(String query, String department, Integer semester, String section) {
        return studentRepository.searchStudents(query, department, semester, section).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public StudentDto getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return convertToDto(student);
    }

    public StudentDto getStudentByUserId(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user id: " + userId));
        return convertToDto(student);
    }

    @Transactional
    public StudentDto createStudent(StudentDto dto, String performedBy) {
        Student student = new Student();
        copyDtoToEntity(dto, student);

        // Auto-create associated student User account if username/email provided
        if (dto.getUsnRollNumber() != null && !userRepository.existsByUsername(dto.getUsnRollNumber())) {
            String defaultPassword = dto.getUsnRollNumber() + "123";
            User user = new User(
                    dto.getUsnRollNumber(),
                    passwordEncoder.encode(defaultPassword),
                    dto.getEmail(),
                    Role.ROLE_STUDENT
            );
            User savedUser = userRepository.save(user);
            student.setUser(savedUser);
        }

        Student savedStudent = studentRepository.save(student);
        activityLogService.logActivity(performedBy, "CREATE_STUDENT", "Created student: " + savedStudent.getName() + " (" + savedStudent.getUsnRollNumber() + ")");
        return convertToDto(savedStudent);
    }

    @Transactional
    public StudentDto updateStudent(Long id, StudentDto dto, String performedBy) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        copyDtoToEntity(dto, student);
        if (dto.getPhotoUrl() != null) {
            student.setPhotoUrl(dto.getPhotoUrl());
        }

        Student updatedStudent = studentRepository.save(student);
        activityLogService.logActivity(performedBy, "UPDATE_STUDENT", "Updated student ID: " + id);
        return convertToDto(updatedStudent);
    }

    @Transactional
    public void deleteStudent(Long id, String performedBy) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        studentRepository.delete(student);
        if (student.getUser() != null) {
            userRepository.delete(student.getUser());
        }
        activityLogService.logActivity(performedBy, "DELETE_STUDENT", "Deleted student ID: " + id);
    }

    @Transactional
    public StudentDto updatePhoto(Long id, String photoUrl, String performedBy) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        student.setPhotoUrl(photoUrl);
        Student updated = studentRepository.save(student);
        activityLogService.logActivity(performedBy, "UPLOAD_PHOTO", "Uploaded photo for student: " + student.getUsnRollNumber());
        return convertToDto(updated);
    }

    private StudentDto convertToDto(Student student) {
        StudentDto dto = new StudentDto();
        dto.setId(student.getId());
        dto.setUsnRollNumber(student.getUsnRollNumber());
        dto.setName(student.getName());
        dto.setEmail(student.getEmail());
        dto.setPhone(student.getPhone());
        dto.setGender(student.getGender());
        dto.setDateOfBirth(student.getDateOfBirth());
        dto.setAddress(student.getAddress());
        dto.setDepartment(student.getDepartment());
        dto.setSemester(student.getSemester());
        dto.setSection(student.getSection());
        dto.setAssignedCourses(student.getAssignedCourses());
        dto.setParentName(student.getParentName());
        dto.setParentPhone(student.getParentPhone());
        dto.setAdmissionDate(student.getAdmissionDate());
        dto.setPhotoUrl(student.getPhotoUrl());
        if (student.getUser() != null) {
            dto.setUserId(student.getUser().getId());
        }
        return dto;
    }

    private void copyDtoToEntity(StudentDto dto, Student student) {
        student.setUsnRollNumber(dto.getUsnRollNumber());
        student.setName(dto.getName());
        student.setEmail(dto.getEmail());
        student.setPhone(dto.getPhone());
        student.setGender(dto.getGender());
        student.setDateOfBirth(dto.getDateOfBirth());
        student.setAddress(dto.getAddress());
        student.setDepartment(dto.getDepartment());
        student.setSemester(dto.getSemester());
        student.setSection(dto.getSection());
        student.setAssignedCourses(dto.getAssignedCourses());
        student.setParentName(dto.getParentName());
        student.setParentPhone(dto.getParentPhone());
        student.setAdmissionDate(dto.getAdmissionDate());
    }
}
