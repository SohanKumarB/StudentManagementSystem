package com.sms.controller;

import com.sms.entity.Timetable;
import com.sms.entity.User;
import com.sms.repository.StudentRepository;
import com.sms.repository.TimetableRepository;
import com.sms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
public class TimetableController {

    @Autowired
    private TimetableRepository timetableRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @GetMapping("/admin/timetable")
    public ResponseEntity<List<Timetable>> getAllTimetable() {
        return ResponseEntity.ok(timetableRepository.findAll());
    }

    @PostMapping("/admin/timetable")
    public ResponseEntity<Timetable> createTimetableEntry(@RequestBody Timetable timetable) {
        return ResponseEntity.ok(timetableRepository.save(timetable));
    }

    @PutMapping("/admin/timetable/{id}")
    public ResponseEntity<Timetable> updateTimetableEntry(@PathVariable Long id, @RequestBody Timetable timetableDetails) {
        Timetable timetable = timetableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Timetable entry not found with id: " + id));
        timetable.setDayOfWeek(timetableDetails.getDayOfWeek());
        timetable.setTimeSlot(timetableDetails.getTimeSlot());
        timetable.setCourseCode(timetableDetails.getCourseCode());
        timetable.setCourseTitle(timetableDetails.getCourseTitle());
        timetable.setRoomNumber(timetableDetails.getRoomNumber());
        timetable.setDepartment(timetableDetails.getDepartment());
        timetable.setSemester(timetableDetails.getSemester());
        timetable.setSection(timetableDetails.getSection());
        return ResponseEntity.ok(timetableRepository.save(timetable));
    }

    @DeleteMapping("/admin/timetable/{id}")
    public ResponseEntity<Void> deleteTimetableEntry(@PathVariable Long id) {
        timetableRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/student/timetable")
    public ResponseEntity<List<Timetable>> getMyTimetable() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        var studentOpt = studentRepository.findByUserId(user.getId());
        if (studentOpt.isPresent()) {
            var s = studentOpt.get();
            List<Timetable> list = timetableRepository.findByDepartmentAndSemesterAndSection(
                    s.getDepartment(), s.getSemester(), s.getSection());
            if (list.isEmpty()) {
                list = timetableRepository.findAll(); // Fallback if general
            }
            return ResponseEntity.ok(list);
        }
        return ResponseEntity.ok(timetableRepository.findAll());
    }
}
