package com.sms;

import com.sms.entity.*;
import com.sms.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

@SpringBootApplication
public class StudentManagementSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudentManagementSystemApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(UserRepository userRepository,
                                      DepartmentRepository departmentRepository,
                                      CourseRepository courseRepository,
                                      StudentRepository studentRepository,
                                      MarksRepository marksRepository,
                                      AttendanceRepository attendanceRepository,
                                      TimetableRepository timetableRepository,
                                      PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed Admin User
            if (!userRepository.existsByUsername("admin")) {
                User admin = new User("admin", passwordEncoder.encode("admin123"), "admin@university.edu", Role.ROLE_ADMIN);
                userRepository.save(admin);
            }

            // Seed Departments
            if (departmentRepository.count() == 0) {
                departmentRepository.save(new Department("CSE", "Computer Science & Engineering", "Dr. Alan Turing", 120));
                departmentRepository.save(new Department("ECE", "Electronics & Communication", "Dr. Claude Shannon", 100));
                departmentRepository.save(new Department("MECH", "Mechanical Engineering", "Dr. Nikola Tesla", 80));
                departmentRepository.save(new Department("CIVIL", "Civil Engineering", "Dr. Isambard Brunel", 60));
            }

            // Seed Courses
            if (courseRepository.count() == 0) {
                courseRepository.save(new Course("CS501", "Database Management Systems", 4, "CSE", 5));
                courseRepository.save(new Course("CS502", "Web Development", 3, "CSE", 5));
                courseRepository.save(new Course("CS503", "Data Structures & Algorithms", 4, "CSE", 3));
                courseRepository.save(new Course("EC301", "Digital Signal Processing", 4, "ECE", 3));
            }

            // Seed Sample Student User & Profile
            if (!userRepository.existsByUsername("1CS21001")) {
                User studentUser = new User("1CS21001", passwordEncoder.encode("student123"), "alex.johnson@student.edu", Role.ROLE_STUDENT);
                User savedUser = userRepository.save(studentUser);

                Student student1 = new Student();
                student1.setUsnRollNumber("1CS21001");
                student1.setName("Alex Johnson");
                student1.setEmail("alex.johnson@student.edu");
                student1.setPhone("+1 555-0192");
                student1.setGender("Male");
                student1.setDateOfBirth(LocalDate.of(2002, 5, 14));
                student1.setAddress("742 Evergreen Terrace, Springfield");
                student1.setDepartment("CSE");
                student1.setSemester(5);
                student1.setSection("A");
                student1.setAssignedCourses("CS501, CS502");
                student1.setParentName("Robert Johnson");
                student1.setParentPhone("+1 555-0188");
                student1.setAdmissionDate(LocalDate.of(2021, 8, 1));
                student1.setUser(savedUser);
                Student savedStudent1 = studentRepository.save(student1);

                // Seed Sample Marks
                Marks m1 = new Marks();
                m1.setStudentId(savedStudent1.getId());
                m1.setCourseCode("CS501");
                m1.setCourseTitle("Database Management Systems");
                m1.setInternalMarks(18.5);
                m1.setAssignmentMarks(9.5);
                m1.setLabMarks(19.0);
                m1.setFinalExamMarks(45.0);
                m1.calculateTotalAndGrade();
                marksRepository.save(m1);

                Marks m2 = new Marks();
                m2.setStudentId(savedStudent1.getId());
                m2.setCourseCode("CS502");
                m2.setCourseTitle("Web Development");
                m2.setInternalMarks(17.0);
                m2.setAssignmentMarks(9.0);
                m2.setLabMarks(18.0);
                m2.setFinalExamMarks(42.0);
                m2.calculateTotalAndGrade();
                marksRepository.save(m2);

                // Seed Sample Attendance
                attendanceRepository.save(new Attendance(savedStudent1.getId(), "CS501", LocalDate.now().minusDays(3), "PRESENT", "Regular"));
                attendanceRepository.save(new Attendance(savedStudent1.getId(), "CS501", LocalDate.now().minusDays(2), "PRESENT", "Regular"));
                attendanceRepository.save(new Attendance(savedStudent1.getId(), "CS502", LocalDate.now().minusDays(1), "PRESENT", "Regular"));
                attendanceRepository.save(new Attendance(savedStudent1.getId(), "CS502", LocalDate.now(), "PRESENT", "Regular"));
            }

            // Seed Timetable
            if (timetableRepository.count() == 0) {
                Timetable t1 = new Timetable();
                t1.setDayOfWeek("Monday");
                t1.setTimeSlot("09:00 AM - 10:00 AM");
                t1.setCourseCode("CS501");
                t1.setCourseTitle("Database Management Systems");
                t1.setRoomNumber("Lab 3B");
                t1.setDepartment("CSE");
                t1.setSemester(5);
                t1.setSection("A");
                timetableRepository.save(t1);

                Timetable t2 = new Timetable();
                t2.setDayOfWeek("Monday");
                t2.setTimeSlot("10:15 AM - 11:15 AM");
                t2.setCourseCode("CS502");
                t2.setCourseTitle("Web Development");
                t2.setRoomNumber("Hall 102");
                t2.setDepartment("CSE");
                t2.setSemester(5);
                t2.setSection("A");
                timetableRepository.save(t2);
            }
        };
    }
}
